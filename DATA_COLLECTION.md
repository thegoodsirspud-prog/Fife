# Scotland Food — Data Collection Guide

## 🎯 Hybrid Approach: Scrape + Curate

### Phase 1: Claude Code Scraping (Bulk Data)

1. **Open Claude Code** (separate tool/chat)

2. **Paste this prompt:**

```
I need you to scrape Google Places data for independent food producers in Scotland.

TARGET COUNCILS (pick 5-6 to start):
- Edinburgh (City of Edinburgh)
- Glasgow (Glasgow City)
- Highland (Inverness area)
- Perth and Kinross
- Aberdeenshire

FOR EACH COUNCIL, find 30-50 of these types:
- Farm shops & producers
- Independent cafés (NOT Starbucks/Costa)
- Artisan bakeries
- Fishmongers & seafood shops
- Delis & cheese shops
- Butchers
- Distilleries & craft breweries
- Farmers markets
- Chocolatiers & sweet makers
- Any other local food makers

IMPORTANT RULES:
- NO chain stores (no Tesco, Sainsbury's, etc.)
- Independent businesses ONLY
- Must sell local/Scottish produce where possible
- Verified addresses with coordinates

OUTPUT FORMAT:
CSV file with these columns:
id,name,category,council,town,latitude,longitude,description,tags,website,phone,google_rating,tripadvisor_rating

CATEGORY VALUES (use these exactly):
farm, cafe, bakery, seafood, deli, butcher, distillery, brewery, market, cheese, chocolate, dairy, honey, vineyard, smokehouse, fruit, veg, eggs, mill, ice-cream

COUNCIL IDs (use these exactly):
edinburgh, glasgow, highland, perth-kinross, aberdeenshire, fife

Generate the CSV and save it as "scotland-producers-scraped.csv"
```

3. **Download the CSV** when Claude Code finishes

---

### Phase 2: Manual Curation (Quality Flagships)

1. **Edit `scotland-producers-manual.csv`**
   - Add your hand-picked flagship producers
   - 10-20 per council is plenty
   - Focus on the BEST independents

2. **CSV Format:**
```csv
id,name,category,council,town,latitude,longitude,description,tags,website,phone,google_rating,tripadvisor_rating
valvona-crolla,Valvona & Crolla,deli,edinburgh,Edinburgh,55.9595,-3.1814,"Edinburgh's oldest deli since 1934","italian;deli;cafe",https://www.valvonacrolla.co.uk,01315566066,4.6,4.5
```

3. **Get Coordinates:**
   - Google Maps → Right-click location → "What's here?"
   - Copy lat,lon from popup

---

### Phase 3: Merge & Import

1. **Place both CSV files in project root:**
   - `scotland-producers-scraped.csv` (from Claude Code)
   - `scotland-producers-manual.csv` (your curated picks)

2. **Run the import script:**
```bash
node scripts/import-csv.js scotland-producers-scraped.csv scotland-producers-manual.csv
```

3. **Script will:**
   - Validate all entries
   - Remove duplicates (manual entries override scraped)
   - Generate `src/data/scotlandShops.js`
   - Show summary by council

4. **Update the import:**
   Edit `src/data/fifeShops.js` line 7 to:
```javascript
import { SCOTLAND_SHOPS } from './scotlandShops.js';
export { SCOTLAND_SHOPS }; // instead of manually defined array
```

5. **Build and deploy:**
```bash
npm run build
git add -A
git commit -m "Add Scotland data: X shops across Y councils"
git push origin main
```

---

## 📋 Data Quality Checklist

### Required Fields
- ✅ `id`: lowercase-with-hyphens (unique)
- ✅ `name`: Full business name
- ✅ `category`: One of 20 valid categories
- ✅ `council`: One of 32 valid council IDs
- ✅ `town`: Town/city name
- ✅ `latitude`: 54-61 range (Scotland)
- ✅ `longitude`: -8 to 0 range (Scotland)
- ✅ `description`: 1-2 sentences

### Optional But Recommended
- 🟡 `tags`: semicolon-separated (organic;vegan;gluten-free)
- 🟡 `website`: Full URL
- 🟡 `phone`: UK format (01234567890)
- 🟡 `google_rating`: 0-5 decimal
- 🟡 `tripadvisor_rating`: 0-5 decimal

---

## 🎯 Target Numbers

### Minimum Viable (Week 1)
- **5 councils:** Edinburgh, Glasgow, Highland, Perth, Aberdeenshire
- **200 total shops:** 40 per council
- **Mix:** 70% scraped + 30% curated

### Full Scotland (Month 1)
- **32 councils:** All of Scotland
- **800-1000 shops:** 25-50 per council
- **Mix:** 60% scraped + 40% curated

### Long-term
- **2000+ shops:** Community submissions
- **Photos:** Google Places API integration
- **Reviews:** Auto-sync ratings

---

## 🚨 Common Mistakes

❌ **Don't include:**
- Chain stores (Tesco, Sainsbury's, Costa, Starbucks)
- Generic restaurants (unless Scottish/local focus)
- Shops that closed (check Google)
- Duplicate entries

✅ **Do include:**
- Independent producers
- Farm shops
- Artisan makers
- Local specialties
- Family-run businesses

---

## 🛠️ Troubleshooting

**Import script errors?**
```bash
# Check Node.js is installed
node --version  # Should be v18+

# Make script executable
chmod +x scripts/import-csv.js

# Run with verbose errors
node scripts/import-csv.js scotland-producers-scraped.csv 2>&1
```

**Invalid coordinates?**
- Latitude must be 54-61 (Scotland range)
- Longitude must be -8 to 0 (Scotland range)
- Use Google Maps "What's here?" for accuracy

**Category not recognized?**
- Use exact category IDs from list above
- Common mistake: "restaurant" → use "cafe"
- Common mistake: "coffee" → use "cafe"

---

## 📞 Need Help?

Come back to this Sonnet 4 chat and say:
- "Import failed with error X"
- "How do I add photos to entries?"
- "Can you check my CSV for errors?"

Ready to ship! 🏴󠁧󠁢󠁳󠁣󠁴󠁿
