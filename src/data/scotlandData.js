// Scotland Food — All 32 local authorities, expanded food producer categories

export const SCOTTISH_COUNCILS = [
  // Cities
  { id: 'aberdeen',        name: 'Aberdeen City',          region: 'North East' },
  { id: 'dundee',          name: 'Dundee City',            region: 'East' },
  { id: 'edinburgh',       name: 'City of Edinburgh',      region: 'East' },
  { id: 'glasgow',         name: 'Glasgow City',           region: 'West' },
  
  // Highland & Islands
  { id: 'highland',        name: 'Highland',               region: 'Highlands & Islands' },
  { id: 'argyll-bute',     name: 'Argyll and Bute',        region: 'Highlands & Islands' },
  { id: 'western-isles',   name: 'Na h-Eileanan Siar',     region: 'Highlands & Islands' },
  { id: 'orkney',          name: 'Orkney Islands',         region: 'Highlands & Islands' },
  { id: 'shetland',        name: 'Shetland Islands',       region: 'Highlands & Islands' },
  
  // North East
  { id: 'aberdeenshire',   name: 'Aberdeenshire',          region: 'North East' },
  { id: 'moray',           name: 'Moray',                  region: 'North East' },
  
  // East
  { id: 'angus',           name: 'Angus',                  region: 'East' },
  { id: 'fife',            name: 'Fife',                   region: 'East' },
  { id: 'perth-kinross',   name: 'Perth and Kinross',      region: 'East' },
  { id: 'clackmannanshire',name: 'Clackmannanshire',       region: 'East' },
  { id: 'stirling',        name: 'Stirling',               region: 'East' },
  { id: 'falkirk',         name: 'Falkirk',                region: 'East' },
  { id: 'west-lothian',    name: 'West Lothian',           region: 'East' },
  { id: 'midlothian',      name: 'Midlothian',             region: 'East' },
  { id: 'east-lothian',    name: 'East Lothian',           region: 'East' },
  
  // Borders
  { id: 'scottish-borders',name: 'Scottish Borders',       region: 'South' },
  
  // South West
  { id: 'dumfries-galloway', name: 'Dumfries and Galloway', region: 'South' },
  { id: 'south-ayrshire',  name: 'South Ayrshire',         region: 'West' },
  { id: 'east-ayrshire',   name: 'East Ayrshire',          region: 'West' },
  { id: 'north-ayrshire',  name: 'North Ayrshire',         region: 'West' },
  
  // West Central
  { id: 'south-lanarkshire', name: 'South Lanarkshire',    region: 'West' },
  { id: 'north-lanarkshire', name: 'North Lanarkshire',    region: 'West' },
  { id: 'east-dunbartonshire', name: 'East Dunbartonshire', region: 'West' },
  { id: 'west-dunbartonshire', name: 'West Dunbartonshire', region: 'West' },
  { id: 'renfrewshire',    name: 'Renfrewshire',           region: 'West' },
  { id: 'east-renfrewshire', name: 'East Renfrewshire',    region: 'West' },
  { id: 'inverclyde',      name: 'Inverclyde',             region: 'West' },
];

export const FOOD_CATEGORIES = [
  // Core categories (from Fife)
  { id: 'farm',          label: 'Farm Shops',       color: '#65a30d',  icon: '🌾' },
  { id: 'cafe',          label: 'Cafés',            color: '#e11d48',  icon: '☕' },
  { id: 'bakery',        label: 'Bakeries',         color: '#d97706',  icon: '🥖' },
  { id: 'seafood',       label: 'Seafood',          color: '#0284c7',  icon: '🐟' },
  { id: 'deli',          label: 'Delis',            color: '#dc2626',  icon: '🧀' },
  { id: 'distillery',    label: 'Distilleries',     color: '#a16207',  icon: '🥃' },
  { id: 'brewery',       label: 'Breweries',        color: '#ea580c',  icon: '🍺' },
  { id: 'market',        label: 'Markets',          color: '#16a34a',  icon: '🛒' },
  { id: 'butcher',       label: 'Butchers',         color: '#9f1239',  icon: '🥩' },
  
  // Expanded categories for Scotland
  { id: 'cheese',        label: 'Cheesemakers',     color: '#fbbf24',  icon: '🧀' },
  { id: 'chocolate',     label: 'Chocolatiers',     color: '#92400e',  icon: '🍫' },
  { id: 'dairy',         label: 'Dairy',            color: '#0891b2',  icon: '🥛' },
  { id: 'honey',         label: 'Honey & Preserves',color: '#f59e0b',  icon: '🍯' },
  { id: 'vineyard',      label: 'Vineyards',        color: '#7c3aed',  icon: '🍇' },
  { id: 'smokehouse',    label: 'Smokehouses',      color: '#334155',  icon: '🔥' },
  { id: 'fruit',         label: 'Fruit Farms',      color: '#dc2626',  icon: '🍓' },
  { id: 'veg',           label: 'Veg Growers',      color: '#22c55e',  icon: '🥬' },
  { id: 'eggs',          label: 'Egg Producers',    color: '#fde047',  icon: '🥚' },
  { id: 'mill',          label: 'Mills & Flour',    color: '#78716c',  icon: '🌾' },
  { id: 'ice-cream',     label: 'Ice Cream',        color: '#ec4899',  icon: '🍦' },
];

// Regional groups for easier navigation
export const REGIONS = [
  { id: 'highlands',  label: 'Highlands & Islands', councils: ['highland','argyll-bute','western-isles','orkney','shetland'] },
  { id: 'northeast',  label: 'North East',          councils: ['aberdeen','aberdeenshire','moray'] },
  { id: 'east',       label: 'East',                councils: ['dundee','angus','fife','perth-kinross','clackmannanshire','stirling','falkirk','edinburgh','west-lothian','midlothian','east-lothian'] },
  { id: 'south',      label: 'South',               councils: ['scottish-borders','dumfries-galloway'] },
  { id: 'west',       label: 'West',                councils: ['glasgow','south-ayrshire','east-ayrshire','north-ayrshire','south-lanarkshire','north-lanarkshire','east-dunbartonshire','west-dunbartonshire','renfrewshire','east-renfrewshire','inverclyde'] },
];
