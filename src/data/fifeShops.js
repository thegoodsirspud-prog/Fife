// Fife Food Shops Directory - Researched Local Producers & Shops
// No supermarkets or chains - only authentic local Fife producers

export const fifeShops = [
  // FARMS & FARM SHOPS
  {
    id: 'ardross-fs',
    name: 'Ardross Farm Shop',
    category: 'Farm Shop',
    town: 'Elie',
    lat: 56.1606,
    lon: -2.8094,
    description: 'Award-winning farm shop with home-grown vegetables, pasture-for-life certified beef, seasonal produce, home-made meals, pies, and preserves. Pizza evenings.',
    produce: ['beef', 'vegetables', 'deli', 'pies'],
    website: 'https://www.ardrossfarmshop.co.uk',
    phone: '01333 330668'
  },
  {
    id: 'east-neuk-market',
    name: 'East Neuk Market Garden',
    category: 'Cooperative Farm',
    town: 'East Neuk',
    lat: 56.1400,
    lon: -2.7000,
    description: 'Organic cooperative farm growing fresh vegetables supplied to local restaurants and shops. Seasonal produce.',
    produce: ['vegetables', 'organic'],
    website: 'https://eastneukmarketgarden.ooooby.org/'
  },
  {
    id: 'blacketyside-fs',
    name: 'Blacketyside Farm Shop & Cafe',
    category: 'Farm Shop & Cafe',
    town: 'Leven',
    lat: 56.1956,
    lon: -2.7333,
    description: 'Family-run farm shop and cafe with indoor and outdoor seating. Local, seasonal produce and farm meats.',
    produce: ['vegetables', 'meat', 'cafe'],
    phone: '01333 423203'
  },

  // BAKERIES
  {
    id: 'baern-bakery',
    name: 'Baern Café & Bakery',
    category: 'Bakery & Cafe',
    town: 'St Monans',
    lat: 56.2050,
    lon: -2.7583,
    description: 'Sustainable artisanal bakes and dishes using Scotland the Bread flour and East Neuk Market Garden vegetables. Thu-Sun 10am-4pm.',
    produce: ['bread', 'cafe', 'pastries'],
    website: 'https://baernbakery.com',
    phone: '01333 730380'
  },
  {
    id: 'stephens-bakery',
    category: 'Bakery',
    name: "Stephen's Bakery",
    town: 'Dunfermline',
    lat: 56.0647,
    lon: -3.4321,
    description: 'Traditional Scottish bakery renowned for steak bridies, mince pies, sausage rolls, and doner kebab pies. Quick takeaway.',
    produce: ['bread', 'pies', 'pastries'],
    phone: '01383 723456'
  },
  {
    id: 'baynes-bakers',
    name: "Bayne's The Family Bakers",
    category: 'Bakery',
    town: 'Kirkcaldy',
    lat: 56.1108,
    lon: -3.1689,
    description: "Award-winning family bakery with multiple branches across Fife. Best morning rolls in Scotland. Steak pies and scones.",
    produce: ['bread', 'pies', 'scones'],
    phone: '01592 260885'
  },
  {
    id: 'gh-barnett',
    name: 'G.H. Barnett & Son Bakery',
    category: 'Bakery',
    town: 'Glenrothes',
    lat: 56.1942,
    lon: -3.2667,
    description: 'Family bakery with multiple locations across Fife. Traditional Scottish baking, supplying local businesses.',
    produce: ['bread', 'pies']
  },

  // CHEESE & DAIRY
  {
    id: 'st-andrews-cheese',
    name: 'St. Andrews Farmhouse Cheese Company',
    category: 'Dairy & Cheese',
    town: 'Pittenweem',
    lat: 56.2129,
    lon: -2.7467,
    description: 'Award-winning cheese made from their own herd of Friesian-Holstein cows. Family farm since 1930s.',
    produce: ['cheese', 'dairy'],
    website: 'https://www.standrewscheese.co.uk',
    phone: '01333 312580'
  },

  // FISH & SEAFOOD
  {
    id: 'reilly-shellfish',
    name: 'Reilly Shellfish',
    category: 'Fish & Seafood',
    town: 'Crail',
    lat: 56.2533,
    lon: -2.6167,
    description: "Fresh King Prawns grown in Scotland using no harmful chemicals. Never frozen. Wholesale fish merchant.",
    produce: ['fish', 'shellfish', 'prawns'],
    phone: '01333 450329'
  },
  {
    id: 'c-sinclair-fish',
    name: 'C Sinclair Fish',
    category: 'Fishmonger',
    town: 'Kirkcaldy',
    lat: 56.1108,
    lon: -3.1689,
    description: 'Independent fishmonger on High Street. Fresh local fish.',
    produce: ['fish']
  },
  {
    id: 'crusoe-lower-largo',
    name: 'The Crusoe Hotel - Fresh Seafood',
    category: 'Restaurant & Fish',
    town: 'Lower Largo',
    lat: 56.1750,
    lon: -2.9442,
    description: 'Fresh seafood just 20 steps from pier. Whisky and gin bar Juan Fernandez. Restaurant with rooms.',
    produce: ['fish', 'seafood', 'restaurant'],
    website: 'https://www.crusoehotel.com',
    phone: '01333 320759'
  },

  // DELIS & SPECIALTY FOOD
  {
    id: 'rocca-deli',
    name: 'Rocca Italian Deli',
    category: 'Deli',
    town: 'St Andrews',
    lat: 56.3396,
    lon: -2.7936,
    description: 'Licensed general grocers and delicatessen in seaside St Andrews. Italian and local specialist foods.',
    produce: ['deli', 'speciality'],
    phone: '01334 472269'
  },
  {
    id: 'mitchells-deli',
    name: "Mitchell's Restaurant & Deli",
    category: 'Deli & Restaurant',
    town: 'Crail',
    lat: 56.2533,
    lon: -2.6167,
    description: 'Specialising in delicious Scottish produce. Deli and restaurant.',
    produce: ['deli', 'scottish']
  },

  // CHOCOLATE & CONFECTIONERY
  {
    id: 'pittenweem-choc',
    name: 'Pittenweem Chocolate Co',
    category: 'Chocolate Maker',
    town: 'Pittenweem',
    lat: 56.2129,
    lon: -2.7467,
    description: 'Hot chocolates and beautifully packaged handcrafted chocolates. UK and international distribution.',
    produce: ['chocolate', 'confectionery'],
    website: 'https://pittenweemchocolate.com'
  },
  {
    id: 'wee-fudge',
    name: 'The Wee Fudge Company',
    category: 'Confectionery',
    town: 'Fife',
    lat: 56.1500,
    lon: -3.0000,
    description: 'Award-winning artisan producer of luxury handcrafted fudge made to order.',
    produce: ['fudge', 'confectionery']
  },

  // DISTILLERIES & BREWERIES
  {
    id: 'lindores-distillery',
    name: 'Lindores Abbey Distillery',
    category: 'Distillery',
    town: 'Newburgh',
    lat: 56.2833,
    lon: -3.1333,
    description: "The spiritual home of Scotch Whisky since 1494. Single malt whisky distillery with visitor centre, tours (10am, 12:30pm, 2:30pm), and cafe. Mar-Oct daily 10am-4pm, Nov-Feb Wed-Sun.",
    produce: ['whisky'],
    website: 'https://lindoresabbeydistillery.com',
    phone: '01337 840640'
  },
  {
    id: 'kingsbarns-distillery',
    name: 'Kingsbarns Distillery & Darnley\'s Gin',
    category: 'Distillery & Gin',
    town: 'Kingsbarns',
    lat: 56.2708,
    lon: -2.7008,
    description: 'Award-winning single malt whisky and Darnley\'s London Dry Gin. Tours, gin school, cafe with local food. 6 miles from St Andrews.',
    produce: ['whisky', 'gin', 'cafe'],
    website: 'https://www.kingsbarns.com',
    phone: '01334 840765'
  },
  {
    id: 'darnleys-gin',
    name: "Darnley's Gin Distillery & School",
    category: 'Gin Distillery',
    town: 'Kingsbarns',
    lat: 56.2708,
    lon: -2.7008,
    description: 'Award-winning gin distillery in cottage overlooking North Sea. Gin school (2.5 hours), tours, tastings, cafe.',
    produce: ['gin', 'cafe'],
    website: 'https://www.darnleysgin.com',
    phone: '01334 840765'
  },
  {
    id: 'eden-mill',
    name: 'Eden Mill Distillery & Brewery',
    category: 'Distillery & Brewery',
    town: 'Guardbridge',
    lat: 56.3200,
    lon: -2.9600,
    description: "Scotland's first brewery-distillery. Gin, whisky, and beer with botanicals grown on site. New visitor centre opening 2024.",
    produce: ['whisky', 'gin', 'beer'],
    website: 'https://www.edenmill.com',
    phone: '01334 844999'
  },
  {
    id: 'futtle-brewery',
    name: 'Futtle Organic Brewery & Taproom',
    category: 'Brewery & Taproom',
    town: 'St Monans',
    lat: 56.2050,
    lon: -2.7583,
    description: 'Organic brewery, taproom, bottle shop, and music venue. Located at Bowhouse complex. Open every weekend.',
    produce: ['beer', 'taproom'],
    website: 'https://futtlebrewery.com',
    phone: '01333 730352'
  },
  {
    id: 'tayport-distillery',
    name: 'Tayport Distillery',
    category: 'Craft Distillery',
    town: 'Tayport',
    lat: 56.4417,
    lon: -2.8667,
    description: "Scotland's first Eau De Vie producer. Small-batch craft spirits using local fruit, berries, and grains. Gin, vodka, liqueurs. Tours Apr-Oct.",
    produce: ['gin', 'vodka', 'liqueurs'],
    website: 'https://tayportdistillery.com',
    phone: '01382 552246'
  },
  {
    id: 'lundin-distilling',
    name: 'Lundin Distilling',
    category: 'Craft Gin',
    town: 'Lower Largo',
    lat: 56.1750,
    lon: -2.9442,
    description: 'Award-winning craft gin made with gorse blossom and Scottish raspberries. No tours but widely stocked in local pubs.',
    produce: ['gin'],
    website: 'https://lundindistilling.com'
  },

  // HUB VENUES
  {
    id: 'bowhouse',
    name: 'Bowhouse Food & Drink Hub',
    category: 'Market & Food Hub',
    town: 'St Monans',
    lat: 56.2050,
    lon: -2.7583,
    description: "Central food and drink hub with organic butchery, Scotland the Bread flour mill, Futtle brewery, Baern cafe, and monthly markets. Second weekend of each month.",
    produce: ['farmers market', 'butchery', 'artisan', 'cafe'],
    website: 'https://www.bowhousefife.com',
    phone: '01333 730352'
  },

  // HERBAL & ARTISAN
  {
    id: 'little-herb-farm',
    name: 'The Little Herb Farm',
    category: 'Artisan Producer',
    town: 'Fife',
    lat: 56.1500,
    lon: -3.0000,
    description: 'Small-batch, hand-produced dips, hummus, fruit vinegars, and whisky sauces.',
    produce: ['sauces', 'artisan'],
    phone: '01334 657222'
  },

  // FARMERS MARKETS
  {
    id: 'cupar-farmers-market',
    name: 'Cupar Farmers Market',
    category: 'Farmers Market',
    town: 'Cupar',
    lat: 56.3167,
    lon: -3.0000,
    description: 'Monthly friendly market at Glen Gates. Up to 20 local producers with beef, lamb, pork, vegetables, home-baking, wild boar, water buffalo, and Hilary\'s famous meringues.',
    produce: ['farmers market', 'meat', 'vegetables'],
    phone: '01334 654321'
  },
  {
    id: 'kirkcaldy-farmers-market',
    name: 'Kirkcaldy Farmers Market',
    category: 'Farmers Market',
    town: 'Kirkcaldy',
    lat: 56.1108,
    lon: -3.1689,
    description: 'Market with fresh smoked smokies, fish (Iain Spink), chicken, pork, beef, lamb, and more. Regular loyal customers.',
    produce: ['farmers market', 'fish', 'meat'],
    phone: '01592 412345'
  },
  {
    id: 'st-andrews-market',
    name: 'St Andrews South Street Market',
    category: 'Farmers Market',
    town: 'St Andrews',
    lat: 56.3396,
    lon: -2.7936,
    description: 'Monthly market with independent producers and creatives. Fresh local food and crafts.',
    produce: ['farmers market']
  }
];

// Towns in Fife for town-of-the-day feature
export const fifeTowns = [
  'St Andrews',
  'Kirkcaldy',
  'Dunfermline',
  'Glenrothes',
  'Crail',
  'Anstruther',
  'Pittenweem',
  'Elie',
  'Leven',
  'Cupar',
  'Tayport',
  'Newburgh',
  'Kingsbarns',
  'St Monans',
  'Dysart',
  'Methil',
  'Inverkeithing',
  'Lochgelly'
];

// Categories for filtering
export const categories = [
  'Farm Shop',
  'Bakery',
  'Fish & Seafood',
  'Deli',
  'Distillery & Gin',
  'Brewery & Taproom',
  'Farmers Market',
  'Cheese & Dairy',
  'Chocolate Maker',
  'Market & Food Hub'
];
