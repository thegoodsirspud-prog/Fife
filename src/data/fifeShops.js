// Fife Food — verified local producers (no chains, no supermarkets)
// Categories normalized to 8 clean buckets.

export const CATEGORIES = [
  { id: 'farm',       label: 'Farm Shops',  color: '#65a30d' },
  { id: 'bakery',     label: 'Bakeries',    color: '#d97706' },
  { id: 'seafood',    label: 'Seafood',     color: '#0284c7' },
  { id: 'deli',       label: 'Delis',       color: '#dc2626' },
  { id: 'distillery', label: 'Distilleries',color: '#a16207' },
  { id: 'brewery',    label: 'Breweries',   color: '#ea580c' },
  { id: 'market',     label: 'Markets',     color: '#16a34a' },
  { id: 'producer',   label: 'Producers',   color: '#7c3aed' },
];

export const TOWNS = [
  'Anstruther', 'Crail', 'Cupar', 'Dunfermline', 'Elie',
  'Glenrothes', 'Guardbridge', 'Kingsbarns', 'Kirkcaldy', 'Leven',
  'Lower Largo', 'Newburgh', 'Pittenweem', 'St Andrews', 'St Monans',
  'Tayport',
];

export const FIFE_SHOPS = [
  // ── Farm Shops ─────────────────────────────────────────────────────
  { id:'ardross',        name:'Ardross Farm Shop',                 cat:'farm',       town:'Elie',         lat:56.1899, lon:-2.7969,
    desc:'Award-winning farm shop. Pasture-for-life beef, home-grown veg, deli, pies, preserves. Pizza nights.',
    tags:['beef','veg','deli','pies'], web:'https://www.ardrossfarmshop.co.uk', tel:'01333 330668' },
  { id:'eastneukmg',     name:'East Neuk Market Garden',           cat:'farm',       town:'St Monans',    lat:56.2080, lon:-2.7700,
    desc:'Cooperative organic farm growing seasonal veg supplied to top East Neuk restaurants and shops.',
    tags:['organic','veg'], web:'https://eastneukmarketgarden.ooooby.org/' },
  { id:'blacketyside',   name:'Blacketyside Farm Shop & Café',     cat:'farm',       town:'Leven',        lat:56.2050, lon:-2.9850,
    desc:'Family-run farm shop and café with indoor & outdoor seating. Local seasonal produce, farm meats.',
    tags:['veg','meat','café'], tel:'01333 423203' },

  // ── Bakeries ───────────────────────────────────────────────────────
  { id:'baern',          name:'Baern Café & Bakery',               cat:'bakery',     town:'St Monans',    lat:56.2105, lon:-2.7595,
    desc:'Sustainable artisan bakes using Scotland the Bread flour. Thu–Sun, 10–4. Inside Bowhouse.',
    tags:['bread','pastries','café'], web:'https://baernbakery.com', tel:'01333 730380' },
  { id:'fisher-donaldson', name:'Fisher & Donaldson',              cat:'bakery',     town:'Cupar',        lat:56.3197, lon:-3.0089,
    desc:'Family bakers since 1919. Famed for the fudge doughnut, coffee towers, and traditional Scottish baking.',
    tags:['bread','pastries','doughnuts'], web:'https://www.fisheranddonaldson.com', tel:'01334 652551' },
  { id:'stephens',       name:"Stephen's Bakery",                  cat:'bakery',     town:'Dunfermline',  lat:56.0716, lon:-3.4602,
    desc:'Traditional Scottish bakery. Steak bridies, mince pies, sausage rolls — the real deal.',
    tags:['bridies','pies','pastries'], tel:'01383 723456' },
  { id:'baynes',         name:"Bayne's the Family Bakers",         cat:'bakery',     town:'Kirkcaldy',    lat:56.1101, lon:-3.1638,
    desc:'Award-winning family bakery. Best morning rolls in Scotland, steak pies, scones.',
    tags:['bread','pies','scones'], web:'https://baynesthefamilybakers.co.uk', tel:'01592 260885' },
  { id:'gh-barnett',     name:'G.H. Barnett & Son',                cat:'bakery',     town:'Glenrothes',   lat:56.1942, lon:-3.1759,
    desc:'Family bakery with multiple Fife branches. Traditional Scottish baking supplying local businesses.',
    tags:['bread','pies'] },

  // ── Seafood ────────────────────────────────────────────────────────
  { id:'reilly',         name:'Reilly Shellfish',                  cat:'seafood',    town:'Crail',        lat:56.2589, lon:-2.6280,
    desc:'Fresh chemical-free Scottish king prawns straight from Crail harbour. Never frozen.',
    tags:['prawns','shellfish'], tel:'01333 450329' },
  { id:'sinclair',       name:'C. Sinclair Fishmonger',            cat:'seafood',    town:'Kirkcaldy',    lat:56.1101, lon:-3.1638,
    desc:'Independent fishmonger on the High Street. Fresh local fish daily.',
    tags:['fish'] },
  { id:'east-pier',      name:'East Pier Smokehouse',              cat:'seafood',    town:'St Monans',    lat:56.2068, lon:-2.7616,
    desc:'Harbourside smokehouse and seafood bistro. Smoked fish to take home or eat in with sea views.',
    tags:['smoked-fish','bistro'], web:'https://www.eastpier.co.uk', tel:'01333 405030' },

  // ── Delis ──────────────────────────────────────────────────────────
  { id:'rocca',          name:'Rocca Italian Deli',                cat:'deli',       town:'St Andrews',   lat:56.3398, lon:-2.7967,
    desc:'Licensed Italian deli & general grocers. Cured meats, cheeses, oils, pasta.',
    tags:['italian','cheese','charcuterie'], tel:'01334 472269' },
  { id:'mitchells',      name:"Mitchell's Deli",                   cat:'deli',       town:'St Andrews',   lat:56.3408, lon:-2.7942,
    desc:'Restaurant and deli specialising in Scottish produce. Local meats, cheese, takeaway.',
    tags:['scottish','cheese'] },
  { id:'luvians',        name:'Luvians Bottle Shop',               cat:'deli',       town:'Cupar',        lat:56.3199, lon:-3.0103,
    desc:'Legendary Fife wine and whisky merchant. Vast malt selection plus craft beer and gin.',
    tags:['whisky','wine','beer'], web:'https://luvians.com', tel:'01334 654820' },

  // ── Distilleries ──────────────────────────────────────────────────
  { id:'lindores',       name:'Lindores Abbey Distillery',         cat:'distillery', town:'Newburgh',     lat:56.3461, lon:-3.2369,
    desc:'Spiritual home of Scotch whisky since 1494. Single malt distillery, visitor centre, tours, café.',
    tags:['whisky','tours','café'], web:'https://lindoresabbeydistillery.com', tel:'01337 840 850' },
  { id:'kingsbarns',     name:'Kingsbarns Distillery',             cat:'distillery', town:'Kingsbarns',   lat:56.2898, lon:-2.6553,
    desc:'Single malt whisky from Fife-grown barley. Tours, tasting rooms, café — 6 miles from St Andrews.',
    tags:['whisky','tours','café'], web:'https://www.kingsbarnsdistillery.com', tel:'01333 451300' },
  { id:'darnleys',       name:"Darnley's Gin Distillery",          cat:'distillery', town:'Kingsbarns',   lat:56.2902, lon:-2.6549,
    desc:'Award-winning gin in a cottage overlooking the North Sea. Tours, gin school, tastings.',
    tags:['gin','tours'], web:'https://www.darnleysgin.com', tel:'01333 451300' },
  { id:'edenmill',       name:'Eden Mill',                         cat:'distillery', town:'Guardbridge',  lat:56.3592, lon:-2.8806,
    desc:"Scotland's first single-site brewery & distillery. Gin, whisky, beer with botanicals grown on-site.",
    tags:['gin','whisky','beer'], web:'https://www.edenmill.com', tel:'01334 834038' },
  { id:'tayport',        name:'Tayport Distillery',                cat:'distillery', town:'Tayport',      lat:56.4439, lon:-2.8839,
    desc:"Scotland's first eau de vie. Small-batch craft spirits using local fruit, berries and grains.",
    tags:['eau-de-vie','gin','vodka'], web:'https://tayportdistillery.com', tel:'01382 552246' },
  { id:'lundin',         name:'Lundin Distilling',                 cat:'distillery', town:'Lower Largo',  lat:56.2186, lon:-2.9484,
    desc:'Award-winning craft gin made with gorse blossom and Scottish raspberries.',
    tags:['gin'], web:'https://lundindistilling.com' },
  { id:'kingdom-spirits', name:'Kingdom of Fife Whisky',           cat:'distillery', town:'Cupar',        lat:56.3198, lon:-3.0098,
    desc:'Independent Fife whisky bottler showcasing the kingdom\'s distilling heritage.',
    tags:['whisky'] },

  // ── Breweries ─────────────────────────────────────────────────────
  { id:'futtle',         name:'Futtle Organic Brewery & Taproom',  cat:'brewery',    town:'St Monans',    lat:56.2078, lon:-2.7625,
    desc:'Organic brewery, taproom, bottle shop and music venue at Bowhouse. Open weekends.',
    tags:['beer','taproom','music'], web:'https://futtle.com', tel:'01333 730380' },
  { id:'st-andrews-brewing', name:'St Andrews Brewing Co.',        cat:'brewery',    town:'St Andrews',   lat:56.3409, lon:-2.7935,
    desc:'Independent brewery and taphouse in the home of golf. Range of cask and craft keg.',
    tags:['beer','taproom'], web:'https://standrewsbrewingcompany.com', tel:'01334 473423' },

  // ── Markets ───────────────────────────────────────────────────────
  { id:'bowhouse',       name:'Bowhouse Food & Drink Hub',         cat:'market',     town:'St Monans',    lat:56.2080, lon:-2.7610,
    desc:'Monthly market hall (2nd full weekend). Organic butchery, Scotland the Bread flour mill, Futtle, Baern.',
    tags:['market','butchery','artisan'], web:'https://bowhousefife.com', tel:'01333 730380' },
  { id:'cupar-fm',       name:'Cupar Farmers Market',              cat:'market',     town:'Cupar',        lat:56.3197, lon:-3.0089,
    desc:'Monthly market at the Glen Gates. Up to 20 producers — beef, lamb, pork, veg, baking, wild boar.',
    tags:['market','meat','veg'], tel:'01334 654321' },
  { id:'st-andrews-fm',  name:'St Andrews South Street Market',    cat:'market',     town:'St Andrews',   lat:56.3408, lon:-2.7950,
    desc:'Monthly market with independent producers, makers and street food on South Street.',
    tags:['market','street-food'] },

  // ── Producers (cheese / chocolate / artisan) ─────────────────────
  { id:'st-andrews-cheese', name:'St Andrews Farmhouse Cheese Co.', cat:'producer', town:'Pittenweem',    lat:56.2129, lon:-2.7421,
    desc:'Family farm since the 1930s. Award-winning cheese from their own Friesian-Holstein herd.',
    tags:['cheese','dairy'], web:'https://standrewscheese.co.uk', tel:'01333 312580' },
  { id:'pittenweem-choc',name:'Pittenweem Chocolate Co.',          cat:'producer',   town:'Pittenweem',   lat:56.2125, lon:-2.7390,
    desc:'Hot chocolates and beautifully packaged handcrafted chocolates. UK & international stockists.',
    tags:['chocolate'], web:'https://pittenweemchocolate.co.uk' },
  { id:'wee-fudge',      name:'The Wee Fudge Company',             cat:'producer',   town:'Pittenweem',   lat:56.2120, lon:-2.7405,
    desc:'Award-winning artisan luxury handcrafted fudge made to order.',
    tags:['fudge'] },
  { id:'little-herb',    name:'The Little Herb Farm',              cat:'producer',   town:'St Andrews',   lat:56.3380, lon:-2.7900,
    desc:'Small-batch hand-produced dips, hummus, fruit vinegars and whisky sauces.',
    tags:['sauces','artisan'], tel:'01334 657222' },
];
