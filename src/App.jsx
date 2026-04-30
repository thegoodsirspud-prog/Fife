import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './App.css';
import { fifeShops, categories } from './data/fifeShops';

/* ── SVG Icons ── */
const Pin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const Phone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const ExtLink = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const Search = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

/* ── Category badge class ── */
const badgeClass = (cat) => {
  const c = (cat || '').toLowerCase();
  if (c.includes('farm')) return 'b-farm';
  if (c.includes('bak') || c.includes('café') || c.includes('cafe')) return 'b-bakery';
  if (c.includes('fish') || c.includes('seafood') || c.includes('monger')) return 'b-fish';
  if (c.includes('deli') || c.includes('restaurant')) return 'b-deli';
  if (c.includes('distill') || c.includes('gin') || c.includes('spirit')) return 'b-distillery';
  if (c.includes('brew') || c.includes('taproom')) return 'b-brewery';
  if (c.includes('market')) return 'b-market';
  if (c.includes('cheese') || c.includes('dairy')) return 'b-cheese';
  if (c.includes('chocolat') || c.includes('confect') || c.includes('fudge')) return 'b-chocolate';
  if (c.includes('hub')) return 'b-hub';
  return 'b-default';
};

/* ── Marker colours matching badges ── */
const markerColor = (cat) => {
  const c = (cat || '').toLowerCase();
  if (c.includes('farm')) return '#166534';
  if (c.includes('bak') || c.includes('café') || c.includes('cafe')) return '#c2410c';
  if (c.includes('fish') || c.includes('seafood') || c.includes('monger')) return '#1d4ed8';
  if (c.includes('deli') || c.includes('restaurant')) return '#be185d';
  if (c.includes('distill') || c.includes('gin') || c.includes('spirit')) return '#6d28d9';
  if (c.includes('brew') || c.includes('taproom')) return '#a16207';
  if (c.includes('market')) return '#0f766e';
  if (c.includes('cheese') || c.includes('dairy')) return '#b45309';
  if (c.includes('chocolat') || c.includes('confect') || c.includes('fudge')) return '#78350f';
  if (c.includes('hub')) return '#3730a3';
  return '#0ea573';
};

const makeIcon = (cat) => new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg"><defs><filter id="d" x="-20%" y="-10%" width="140%" height="130%"><feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-opacity="0.25"/></filter></defs><path d="M13 0C7.5 0 3 4.5 3 10c0 7 10 23 10 23s10-16 10-23C23 4.5 18.5 0 13 0z" fill="${markerColor(cat)}" filter="url(#d)"/><circle cx="13" cy="10" r="4" fill="white" opacity="0.9"/></svg>`)}`,
  iconSize: [26, 34],
  iconAnchor: [13, 34],
  popupAnchor: [0, -34]
});

const userIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="7" fill="#0ea573" opacity="0.2"/><circle cx="9" cy="9" r="4.5" fill="#0ea573"/><circle cx="9" cy="9" r="2" fill="white"/></svg>`)}`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

/* ── Map fly-to on card click ── */
function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 14, { duration: 0.8 });
  }, [coords, map]);
  return null;
}

/* ── APP ── */
function App() {
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [flyCoords, setFlyCoords] = useState(null);
  const [page, setPage] = useState('explore');

  // Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => setLoc({ lat: coords.latitude, lon: coords.longitude }),
        () => {}
      );
    }
  }, []);

  // Filtering
  const filtered = fifeShops.filter(shop => {
    if (cat !== 'All') {
      const sc = shop.category.toLowerCase();
      const target = cat.toLowerCase().split(' ')[0];
      if (!sc.includes(target)) return false;
    }
    if (q) {
      const search = q.toLowerCase();
      return shop.name.toLowerCase().includes(search) ||
             shop.town.toLowerCase().includes(search) ||
             shop.description.toLowerCase().includes(search) ||
             (shop.produce && shop.produce.some(p => p.toLowerCase().includes(search)));
    }
    return true;
  });

  const handleCardClick = useCallback((shop) => {
    setFlyCoords([shop.lat, shop.lon]);
  }, []);

  const uniqueCategories = [...new Set(fifeShops.map(s => s.category))];

  return (
    <div className="app">
      {/* Overlay */}
      <div className={`menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* Slide-out menu */}
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="menu-close" onClick={() => setMenuOpen(false)}>✕</button>
        <div className="menu-items">
          <button className={`menu-item ${page === 'explore' ? 'active' : ''}`}
            onClick={() => { setPage('explore'); setMenuOpen(false); }}>
            <span className="menu-item-icon">◉</span> Explore
          </button>
          <button className={`menu-item ${page === 'map' ? 'active' : ''}`}
            onClick={() => { setPage('map'); setMenuOpen(false); }}>
            <span className="menu-item-icon">◎</span> Full Map
          </button>
          <div className="menu-divider" />
          <button className="menu-item" onClick={() => { setCat('All'); setQ(''); setMenuOpen(false); }}>
            <span className="menu-item-icon">↻</span> Reset Filters
          </button>
        </div>
        <div style={{ marginTop: 'auto', padding: '1rem 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.5px' }}>
          Fife Food v2.0
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="hero-inner">
          <div className="nav">
            <div className="nav-brand">
              <span className="nav-brand-dot" />
              Fife Food
            </div>
            <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <h1 className="hero-headline">Discover Local</h1>
              <p className="hero-sub">
                Independent producers, artisan shops & farmers markets across the Kingdom of Fife
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="hero-stats-row">
                <div className="hero-stat">
                  <span className="hero-stat-num">{fifeShops.length}</span>
                  <span className="hero-stat-label">Producers</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-num">{uniqueCategories.length}</span>
                  <span className="hero-stat-label">Types</span>
                </div>
              </div>
              <button className={`hero-location ${loc ? 'active' : ''}`} onClick={() => {
                if (!loc && navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    ({ coords }) => setLoc({ lat: coords.latitude, lon: coords.longitude }),
                    () => alert('Location access denied')
                  );
                }
              }}>
                {loc ? <><span className="loc-dot" /> Near me</> : <><Pin /> Location</>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-inner">
          <div className="search-wrap">
            <Search />
            <input
              className="search-input"
              type="text"
              placeholder="Search producers, towns..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <div className="pills">
            <button className={`pill ${cat === 'All' ? 'active' : ''}`} onClick={() => setCat('All')}>All</button>
            {categories.map(c => (
              <button key={c} className={`pill ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <span className="count">{filtered.length}</span>
        </div>
      </div>

      {/* Content */}
      <main className="content">
        <div className="list-col">
          <div className="card-list">
            {filtered.length > 0 ? filtered.map(shop => (
              <div key={shop.id} className="card" onClick={() => handleCardClick(shop)}>
                <div className="card-top">
                  <h3>{shop.name}</h3>
                  <span className={`badge ${badgeClass(shop.category)}`}>{shop.category}</span>
                </div>
                <p className="card-town"><Pin />{shop.town}</p>
                <p className="card-desc">{shop.description}</p>
                <div className="card-links">
                  {shop.phone && (
                    <a href={`tel:${shop.phone}`} className="card-link" onClick={e => e.stopPropagation()}>
                      <Phone />{shop.phone}
                    </a>
                  )}
                  {shop.website && (
                    <a href={shop.website} target="_blank" rel="noopener noreferrer" className="card-link" onClick={e => e.stopPropagation()}>
                      <ExtLink />Website
                    </a>
                  )}
                </div>
                {shop.produce?.length > 0 && (
                  <div className="tags">
                    {shop.produce.map(p => <span key={p} className="tag">{p}</span>)}
                  </div>
                )}
              </div>
            )) : (
              <div className="no-results">No producers found.</div>
            )}
          </div>
        </div>

        <div className="map-col">
          <MapContainer
            center={[56.25, -3.0]}
            zoom={10}
            scrollWheelZoom={true}
            className="leaflet-map"
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            />
            <FlyTo coords={flyCoords} />

            {loc && (
              <Marker position={[loc.lat, loc.lon]} icon={userIcon}>
                <Popup><div className="popup"><h4>You</h4></div></Popup>
              </Marker>
            )}

            {filtered.map(shop => (
              <Marker key={shop.id} position={[shop.lat, shop.lon]} icon={makeIcon(shop.category)}>
                <Popup>
                  <div className="popup">
                    <h4>{shop.name}</h4>
                    <span className="popup-badge">{shop.category}</span>
                    <p className="popup-town">{shop.town}</p>
                    {shop.phone && <p className="popup-phone">{shop.phone}</p>}
                    {shop.website && <a href={shop.website} target="_blank" rel="noopener noreferrer">Visit →</a>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>

      <footer className="footer">
        Fife Food — Local producers across the Kingdom of Fife
      </footer>
    </div>
  );
}

export default App;
