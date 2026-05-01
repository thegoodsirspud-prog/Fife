#!/usr/bin/env node

/**
 * Scotland Food CSV Importer
 * 
 * Converts CSV files to JavaScript shop entries
 * Merges scraped data + manual curated data
 * Validates all fields
 * 
 * Usage:
 *   node scripts/import-csv.js scotland-producers-scraped.csv scotland-producers-manual.csv
 */

const fs = require('fs');
const path = require('path');

const VALID_CATEGORIES = [
  'farm', 'cafe', 'bakery', 'seafood', 'deli', 'butcher', 'distillery', 
  'brewery', 'market', 'cheese', 'chocolate', 'dairy', 'honey', 
  'vineyard', 'smokehouse', 'fruit', 'veg', 'eggs', 'mill', 'ice-cream'
];

const VALID_COUNCILS = [
  'aberdeen', 'aberdeenshire', 'angus', 'argyll-bute', 'clackmannanshire',
  'dumfries-galloway', 'dundee', 'east-ayrshire', 'east-dunbartonshire',
  'east-lothian', 'east-renfrewshire', 'edinburgh', 'falkirk', 'fife',
  'glasgow', 'highland', 'inverclyde', 'midlothian', 'moray',
  'north-ayrshire', 'north-lanarkshire', 'orkney', 'perth-kinross',
  'renfrewshire', 'scottish-borders', 'shetland', 'south-ayrshire',
  'south-lanarkshire', 'stirling', 'west-dunbartonshire', 'west-lothian',
  'western-isles'
];

function parseCSV(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  const headers = lines[0].split(',').map(h => h.trim());
  
  const shops = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length < headers.length) continue;
    
    const shop = {};
    headers.forEach((h, idx) => {
      shop[h] = values[idx] || '';
    });
    shops.push(shop);
  }
  
  return shops;
}

function validateShop(shop, source) {
  const errors = [];
  
  if (!shop.id || !/^[a-z0-9-]+$/.test(shop.id)) {
    errors.push(`Invalid id: ${shop.id}`);
  }
  
  if (!shop.name) errors.push('Missing name');
  
  if (!VALID_CATEGORIES.includes(shop.category)) {
    errors.push(`Invalid category: ${shop.category}`);
  }
  
  if (!VALID_COUNCILS.includes(shop.council)) {
    errors.push(`Invalid council: ${shop.council}`);
  }
  
  if (!shop.town) errors.push('Missing town');
  
  const lat = parseFloat(shop.latitude);
  const lon = parseFloat(shop.longitude);
  if (isNaN(lat) || lat < 54 || lat > 61) {
    errors.push(`Invalid latitude: ${shop.latitude}`);
  }
  if (isNaN(lon) || lon < -8 || lon > 0) {
    errors.push(`Invalid longitude: ${shop.longitude}`);
  }
  
  if (!shop.description) errors.push('Missing description');
  
  if (errors.length > 0) {
    console.error(`❌ ${source} - ${shop.name || shop.id}:`);
    errors.forEach(e => console.error(`   ${e}`));
    return false;
  }
  
  return true;
}

function shopToJS(shop) {
  const tags = shop.tags ? shop.tags.split(';').map(t => `'${t.trim()}'`).join(',') : '';
  const gr = shop.google_rating ? parseFloat(shop.google_rating) : null;
  const ta = shop.tripadvisor_rating ? parseFloat(shop.tripadvisor_rating) : null;
  
  let js = `  { id:'${shop.id}', name:'${shop.name}', `;
  js += `cat:'${shop.category}', council:'${shop.council}', town:'${shop.town}', `;
  js += `lat:${parseFloat(shop.latitude).toFixed(4)}, lon:${parseFloat(shop.longitude).toFixed(4)},\n`;
  js += `    desc:'${shop.description.replace(/'/g, "\\'")}',\n`;
  if (tags) js += `    tags:[${tags}],`;
  if (shop.website) js += ` web:'${shop.website}',`;
  if (shop.phone) js += ` tel:'${shop.phone}',`;
  if (gr) js += ` gr:${gr},`;
  if (ta) js += ` ta:${ta},`;
  js += ` },\n`;
  
  return js;
}

// Main
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node import-csv.js <scraped.csv> [manual.csv]');
  process.exit(1);
}

let allShops = [];
const seen = new Set();

// Import each CSV
args.forEach(filepath => {
  if (!fs.existsSync(filepath)) {
    console.warn(`⚠️  File not found: ${filepath}`);
    return;
  }
  
  console.log(`\n📂 Importing ${filepath}...`);
  const shops = parseCSV(filepath);
  let valid = 0;
  
  shops.forEach(shop => {
    if (seen.has(shop.id)) {
      console.warn(`⚠️  Duplicate ID skipped: ${shop.id}`);
      return;
    }
    
    if (validateShop(shop, path.basename(filepath))) {
      allShops.push(shop);
      seen.add(shop.id);
      valid++;
    }
  });
  
  console.log(`✅ ${valid}/${shops.length} entries validated`);
});

// Generate JS output
console.log(`\n✨ Generating JavaScript...\n`);

let output = '// Generated from CSV - DO NOT EDIT MANUALLY\n';
output += '// Edit the CSV files and re-run: node scripts/import-csv.js\n\n';
output += 'export const SCOTLAND_SHOPS = [\n';

allShops.forEach(shop => {
  output += shopToJS(shop);
});

output += '];\n';

// Write to file
const outPath = path.join(__dirname, '../src/data/scotlandShops.js');
fs.writeFileSync(outPath, output);

console.log(`✅ Generated ${outPath}`);
console.log(`📊 Total shops: ${allShops.length}`);

// Summary by council
const byCouncil = {};
allShops.forEach(s => {
  byCouncil[s.council] = (byCouncil[s.council] || 0) + 1;
});

console.log('\n📍 Breakdown by council:');
Object.entries(byCouncil)
  .sort((a, b) => b[1] - a[1])
  .forEach(([council, count]) => {
    console.log(`   ${council}: ${count}`);
  });

console.log('\n🎉 Done! Now update src/data/fifeShops.js to import from scotlandShops.js\n');
