# Scotland Food — Batch Scraping Strategy

## 🎯 Strategy: 4 Batches = All 32 Councils

**Why batches?**
- Prevents Claude Code timeout on massive scrape
- Easier to review/fix errors per batch
- Can deploy incrementally (ship progress as you go)
- Better data quality (focused scraping per region)

**Current Status:**
✅ Batch 0 (DONE): Fife + Edinburgh + Glasgow = 133 shops

---

## 📋 BATCH 1: CENTRAL BELT EAST (8 councils) — ~150 shops

**Target councils:**
- Stirling
- Falkirk
- Clackmannanshire
- West Lothian
- Midlothian
- East Lothian
- Dundee City
- Angus

**Estimated shops:** 20-25 per council = 150-200 total

### Claude Code Prompt for Batch 1:

```
I need you to scrape Google Places for independent food producers in the Central Belt East of Scotland.

TARGET COUNCILS (8 councils):
1. Stirling (Stirling, Bridge of Allan, Dunblane, Callander)
2. Falkirk (Falkirk, Grangemouth, Bo'ness)
3. Clackmannanshire (Alloa, Tillicoultry, Dollar)
4. West Lothian (Livingston, Bathgate, Linlithgow)
5. Midlothian (Dalkeith, Bonnyrigg, Penicuik)
6. East Lothian (Haddington, North Berwick, Dunbar, Musselburgh)
7. Dundee City (Dundee)
8. Angus (Arbroath, Montrose, Forfar, Brechin)

FOR EACH COUNCIL, find 20-25 independent food businesses:

CATEGORIES TO FIND:
✅ Farm shops & producers
✅ Independent cafés (NOT chains)
✅ Artisan bakeries
✅ Fishmongers & seafood
✅ Butchers
✅ Delis & cheese shops
✅ Distilleries & breweries
✅ Farmers markets
✅ Chocolatiers, ice cream makers
✅ Any other local food producers

STRICT RULES:
❌ NO chain stores (Tesco, Costa, Greggs, etc.)
❌ Independent businesses ONLY
❌ Must have physical location (no online-only)
✅ Verify coordinates are in Scotland

OUTPUT FORMAT:
CSV file with these exact columns:
id,name,category,council,town,latitude,longitude,description,tags,website,phone,google_rating,tripadvisor_rating

CATEGORY VALUES (use exactly):
farm, cafe, bakery, seafood, deli, butcher, distillery, brewery, market, cheese, chocolate, dairy, honey, vineyard, smokehouse, fruit, veg, eggs, mill, ice-cream

COUNCIL IDs (use exactly):
stirling, falkirk, clackmannanshire, west-lothian, midlothian, east-lothian, dundee, angus

FIELD REQUIREMENTS:
- id: lowercase-with-hyphens (e.g., "bridge-of-allan-brewery")
- latitude: 55.5 to 57.0 range (Central Belt)
- longitude: -5.0 to -2.5 range
- description: 1-2 sentences about what makes them special
- tags: semicolon-separated (e.g., "organic;farm-shop;local")
- google_rating: Include if available (0-5 decimal)

IMPORTANT: Focus on quality over quantity. Better to have 15 great independents per council than 30 mediocre ones.

Save as: scotland-batch1-central-east.csv
```

---

## 📋 BATCH 2: HIGHLANDS & ISLANDS (9 councils) — ~120 shops

**Target councils:**
- Highland (Inverness, Fort William, Skye, etc.)
- Argyll and Bute (Oban, Campbeltown, Islay, Mull)
- Moray (Elgin, Forres, Lossiemouth)
- Orkney Islands
- Shetland Islands
- Na h-Eileanan Siar (Western Isles/Outer Hebrides)
- Perth and Kinross (Perth, Pitlochry, Crieff)
- Aberdeenshire (Banchory, Stonehaven, Peterhead, Fraserburgh)
- Aberdeen City

**Estimated shops:** 10-15 per council (rural areas) = 100-150 total

### Claude Code Prompt for Batch 2:

```
I need you to scrape Google Places for independent food producers in the Scottish Highlands & Islands.

TARGET COUNCILS (9 councils):
1. Highland (Inverness, Fort William, Thurso, Portree/Skye, Ullapool)
2. Argyll and Bute (Oban, Campbeltown, Rothesay, Lochgilphead)
3. Moray (Elgin, Forres, Buckie, Lossiemouth)
4. Orkney Islands (Kirkwall, Stromness)
5. Shetland Islands (Lerwick)
6. Na h-Eileanan Siar / Western Isles (Stornoway, Tarbert, Lochmaddy)
7. Perth and Kinross (Perth, Pitlochry, Crieff, Aberfeldy, Blairgowrie)
8. Aberdeenshire (Banchory, Stonehaven, Peterhead, Fraserburgh, Inverurie)
9. Aberdeen City (Aberdeen)

FOR EACH COUNCIL, find 10-20 independent food businesses:
(Note: Rural/island areas may have fewer - that's OK, focus on quality)

CATEGORIES TO FIND:
✅ Farm shops, seafood processors, smokehouses
✅ Distilleries (whisky, gin) & breweries
✅ Independent cafés & bakeries
✅ Butchers, delis, cheese makers
✅ Farmers markets
✅ Local honey, jams, preserves
✅ Island specialties (Harris Gin, Orkney cheese, etc.)

STRICT RULES:
❌ NO chains
❌ Independent only
✅ Include island specialties (very important for this region)
✅ Prioritize artisan/craft producers

OUTPUT FORMAT:
CSV file: id,name,category,council,town,latitude,longitude,description,tags,website,phone,google_rating,tripadvisor_rating

CATEGORY VALUES (exact):
farm, cafe, bakery, seafood, deli, butcher, distillery, brewery, market, cheese, chocolate, dairy, honey, vineyard, smokehouse, fruit, veg, eggs, mill, ice-cream

COUNCIL IDs (exact):
highland, argyll-bute, moray, orkney, shetland, western-isles, perth-kinross, aberdeenshire, aberdeen

COORDINATE RANGES:
- Highland: lat 56.5-58.8, lon -7.0 to -3.0
- Orkney: lat 58.8-59.4, lon -3.5 to -2.3
- Shetland: lat 59.8-60.9, lon -1.8 to -0.7
- Western Isles: lat 56.8-58.5, lon -7.8 to -6.1

Save as: scotland-batch2-highlands-islands.csv
```

---

## 📋 BATCH 3: SOUTH & BORDERS (2 councils) — ~60 shops

**Target councils:**
- Scottish Borders (Galashiels, Hawick, Kelso, Melrose, Peebles)
- Dumfries and Galloway (Dumfries, Stranraer, Castle Douglas, Annan)

**Estimated shops:** 25-30 per council = 50-60 total

### Claude Code Prompt for Batch 3:

```
I need you to scrape Google Places for independent food producers in Southern Scotland & Borders.

TARGET COUNCILS (2 councils):
1. Scottish Borders (Galashiels, Hawick, Kelso, Melrose, Peebles, Jedburgh, Eyemouth, Duns)
2. Dumfries and Galloway (Dumfries, Stranraer, Castle Douglas, Annan, Kirkcudbright, Wigtown, Moffat)

FOR EACH COUNCIL, find 25-30 independent food businesses:

CATEGORIES TO FIND:
✅ Farm shops (these regions are EXCELLENT for farms)
✅ Smokehouses (Southern Scotland specialty)
✅ Cheese makers (lots here!)
✅ Independent cafés & bakeries
✅ Butchers, delis
✅ Distilleries & breweries
✅ Farmers markets
✅ Honey, preserves, artisan foods

FOCUS AREAS:
- Borders: Known for smoked salmon, beef, sheep farming
- Galloway: Dairy, cheese, smokehouse tradition
- Look for: Cream o' Galloway, Isle of Whithorn Smokehouse-style places

STRICT RULES:
❌ NO chains
✅ Independent only
✅ Prioritize farm-to-table producers

OUTPUT FORMAT:
CSV file: id,name,category,council,town,latitude,longitude,description,tags,website,phone,google_rating,tripadvisor_rating

CATEGORY VALUES (exact):
farm, cafe, bakery, seafood, deli, butcher, distillery, brewery, market, cheese, chocolate, dairy, honey, vineyard, smokehouse, fruit, veg, eggs, mill, ice-cream

COUNCIL IDs (exact):
scottish-borders, dumfries-galloway

COORDINATE RANGES:
- Scottish Borders: lat 55.2-55.8, lon -3.5 to -2.0
- Dumfries & Galloway: lat 54.6-55.4, lon -5.2 to -2.5

Save as: scotland-batch3-south-borders.csv
```

---

## 📋 BATCH 4: WEST CENTRAL (10 councils) — ~150 shops

**Target councils:**
- North Ayrshire (Ardrossan, Irvine, Largs)
- East Ayrshire (Kilmarnock, Cumnock)
- South Ayrshire (Ayr, Prestwick, Girvan)
- North Lanarkshire (Motherwell, Coatbridge, Airdrie, Cumbernauld)
- South Lanarkshire (Hamilton, East Kilbride, Lanark)
- Renfrewshire (Paisley, Renfrew)
- East Renfrewshire (Newton Mearns, Barrhead)
- West Dunbartonshire (Dumbarton, Clydebank)
- East Dunbartonshire (Bearsden, Kirkintilloch, Milngavie)
- Inverclyde (Greenock, Gourock, Port Glasgow)

**Estimated shops:** 12-18 per council = 120-180 total

### Claude Code Prompt for Batch 4:

```
I need you to scrape Google Places for independent food producers in West Central Scotland.

TARGET COUNCILS (10 councils):
1. North Ayrshire (Ardrossan, Irvine, Largs, Saltcoats, Arran)
2. East Ayrshire (Kilmarnock, Cumnock, Stewarton)
3. South Ayrshire (Ayr, Prestwick, Girvan, Maybole, Troon)
4. North Lanarkshire (Motherwell, Coatbridge, Airdrie, Cumbernauld, Bellshill)
5. South Lanarkshire (Hamilton, East Kilbride, Lanark, Blantyre)
6. Renfrewshire (Paisley, Renfrew, Johnstone)
7. East Renfrewshire (Newton Mearns, Barrhead, Clarkston)
8. West Dunbartonshire (Dumbarton, Clydebank)
9. East Dunbartonshire (Bearsden, Kirkintilloch, Milngavie, Bishopbriggs)
10. Inverclyde (Greenock, Gourock, Port Glasgow)

FOR EACH COUNCIL, find 12-18 independent food businesses:

CATEGORIES TO FIND:
✅ Farm shops & producers
✅ Independent cafés & bakeries
✅ Butchers, fishmongers
✅ Delis & cheese shops
✅ Breweries & distilleries (Ayrshire is big for this)
✅ Farmers markets
✅ Ice cream makers (Ayrshire dairy country!)

FOCUS AREAS:
- Ayrshire: Dairy farms, ice cream, coastal seafood
- Arran: Island specialties (Arran Aromatics, cheese, distillery)
- Lanarkshire: Market towns, farm shops
- Look for hidden gems in commuter towns

STRICT RULES:
❌ NO chains
✅ Independent only
✅ Coastal areas: prioritize seafood

OUTPUT FORMAT:
CSV file: id,name,category,council,town,latitude,longitude,description,tags,website,phone,google_rating,tripadvisor_rating

CATEGORY VALUES (exact):
farm, cafe, bakery, seafood, deli, butcher, distillery, brewery, market, cheese, chocolate, dairy, honey, vineyard, smokehouse, fruit, veg, eggs, mill, ice-cream

COUNCIL IDs (exact):
north-ayrshire, east-ayrshire, south-ayrshire, north-lanarkshire, south-lanarkshire, renfrewshire, east-renfrewshire, west-dunbartonshire, east-dunbartonshire, inverclyde

COORDINATE RANGES:
- Ayrshire: lat 55.2-55.9, lon -5.2 to -4.2
- Lanarkshire: lat 55.5-56.0, lon -4.2 to -3.6
- Dunbartonshire: lat 55.8-56.1, lon -4.8 to -4.2

Save as: scotland-batch4-west-central.csv
```

---

## 🔄 WORKFLOW: Running All Batches

### **OPTION A: Sequential (Safe & Steady)**
1. Open Claude Code
2. Run Batch 1 → Download CSV
3. Come back here, import, deploy
4. Run Batch 2 → Download CSV
5. Import, deploy
6. Repeat for Batch 3 & 4

**Timeline:** ~2 hours total (10 min per batch × 4)
**Result:** Ship 4 incremental updates, see progress live

### **OPTION B: Parallel (Fast & Furious)**
1. Open 4 Claude Code chats
2. Run all 4 batches simultaneously
3. Download all 4 CSVs when done
4. Import all at once: `node scripts/import-csv.js batch*.csv`
5. One big deploy with ~600 shops

**Timeline:** ~15 minutes total
**Result:** Go from 133 → 600+ shops in one shot

---

## 📊 EXPECTED RESULTS

**After All 4 Batches:**
- Batch 0 (done): 133 shops (Fife + Edinburgh + Glasgow)
- Batch 1: +150 shops (Central Belt East)
- Batch 2: +120 shops (Highlands & Islands)
- Batch 3: +60 shops (South & Borders)
- Batch 4: +150 shops (West Central)

**TOTAL: ~600 shops across all 32 councils** 🏴󠁧󠁢󠁳󠁣󠁴󠁿

---

## 🎯 YOUR NEXT MOVE

**Tell me which approach:**

🅰️ **Sequential** — "Run Batch 1 first" (safest, see results immediately)

🅱️ **Parallel** — "Run all 4 batches now" (fastest, ship 600 shops today)

🅲️ **Custom** — "Start with Batch 2 (Highlands)" or pick specific batches

I'll guide you through whichever you choose! Ready? 🚀
