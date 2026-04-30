import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { fifeShops, categories } from './data/fifeShops';

/* ─── Inline SVG icons (sized via CSS) ─── */
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
const IconSearch = (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></>} />;
const IconPin = (p) => <Icon {...p} d={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>} />;
const IconList = (p) => <Icon {...p} d={<><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1.5"/><circle cx="3.5" cy="12" r="1.5"/><circle cx="3.5" cy="18" r="1.5"/></>} />;
const IconMap = (p) => <Icon {...p} d={<><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v16M15 6v16"/></>} />;
const IconClose = (p) => <Icon {...p} d={<><path d="M18 6 6 18M6 6l12 12"/></>} />;
const IconPhone = (p) => <Icon {...p} d={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>} />;
const IconExt = (p) => <Icon {...p} d={<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></>} />;
const IconLocate = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></>} />;
const IconStar = (p) => <Icon {...p} d={<path d="M12 2 15 9l7 .5-5.5 4.5L18 22l-6-4-6 4 1.5-8L2 9.5 9 9z"/>} />;

/* ─── Category styling ─── */
const catStyle = (cat) => {
  const c = (cat || '').toLowerCase();
  if (c.includes('farm')) return { color: '#3f6212', bg: '#ecfccb', label: 'Farm' };
  if (c.includes('bak') || c.includes('café') || c.includes('cafe')) return { color: '#9a3412', bg: '#ffedd5', label: 'Bakery' };
  if (c.includes('fish') || c.includes('seafood')) return { color: '#1e40af', bg: '#dbeafe', label: 'Seafood' };
  if (c.includes('deli')) return { color: '#9f1239', bg: '#ffe4e6', label: 'Deli' };
  if (c.includes('distill') || c.includes('gin')) return { color: '#713f12', bg: '#fef3c7', label: 'Distillery' };
  if (c.includes('brew') || c.includes('taproom')) return { color: '#92400e', bg: '#fef3c7', label: 'Brewery' };
  if (c.includes('market')) return { color: '#365314', bg: '#d9f99d', label: 'Market' };
  if (c.includes('cheese') || c.includes('dairy')) return { color: '#854d0e', bg: '#fef9c3', label: 'Cheese' };
  if (c.includes('chocolat') || c.includes('confect') || c.includes('fudge')) return { color: '#6b21a8', bg: '#f3e8ff', label: 'Sweets' };
  if (c.includes('hub')) return { color: '#0f766e', bg: '#ccfbf1', label: 'Food Hub' };
  return { color: '#404040', bg: '#f5f5f5', label: cat };
};

/* ─── Custom Leaflet markers (SVG, no broken images) ─── */
const makeMarker = (cat, active = false) => {
  const { color } = catStyle(cat);
  const size = active ? 44 : 36;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 36 36">
      <defs>
        <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/>
        </filter>
      </defs>
      <circle cx="18" cy="18" r="14" fill="${color}" filter="url(#s)" stroke="white" stroke-width="3"/>
      <circle cx="18" cy="18" r="5" fill="white"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: 'fife-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const userMarker = () => L.divIcon({
  html: `<div class="user-dot"><div class="user-dot-inner"></div></div>`,
  className: 'user-marker',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

/* ─── Distance helper ─── */
const distanceKm = (a, b) => {
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
};

/* ─── Map controller for fly-to ─── */
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 13, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
};

/* ─── Town of the day (deterministic) ─── */
const towns = ['St Andrews', 'Anstruther', 'Crail', 'Pittenweem', 'Elie', 'Cupar', 'Kirkcaldy', 'Dunfermline', 'Newburgh', 'Tayport'];
const todaysTown = () => {
  const d = new Date();
  const day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  return towns[day % towns.length];
};

/* ─── Main App ─── */
export default function App() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [userLoc, setUserLoc] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [view, setView] = useState('list'); // mobile: 'list' | 'map'
  const [showFilters, setShowFilters] = useState(false);
  const town = useMemo(todaysTown, []);

  /* Geolocation */
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setUserLoc(loc);
        setMapCenter([loc.lat, loc.lon]);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  /* Categories present in data */
  const cats = useMemo(() => {
    const s = new Set(fifeShops.map((x) => x.category));
    return ['All', ...Array.from(s)];
  }, []);

  /* Filtered shops with distance */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fifeShops
      .filter((s) => activeCat === 'All' || s.category === activeCat)
      .filter((s) => {
        if (!q) return true;
        return (
          s.name.toLowerCase().includes(q) ||
          (s.town || '').toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q) ||
          (s.produce || []).some((p) => p.toLowerCase().includes(q))
        );
      })
      .map((s) => ({
        ...s,
        distance: userLoc ? distanceKm(userLoc, { lat: s.lat, lon: s.lon }) : null,
      }))
      .sort((a, b) => {
        if (a.distance != null && b.distance != null) return a.distance - b.distance;
        return a.name.localeCompare(b.name);
      });
  }, [query, activeCat, userLoc]);

  /* Featured shop in town of the day */
  const featured = useMemo(() => {
    return fifeShops.find((s) => (s.town || '').toLowerCase() === town.toLowerCase()) || fifeShops[0];
  }, [town]);

  const handleShopClick = (shop) => {
    setSelectedShop(shop);
    setMapCenter([shop.lat, shop.lon]);
    setView('map');
  };

  return (
    <div className="app">
      {/* ─── HEADER ─── */}
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-mark">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M16 4 4 12v16h24V12L16 4Z" fill="#fef3c7" stroke="#92400e" strokeWidth="1.5"/>
                <path d="M11 22h10M11 18h10M16 4v8" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="16" cy="14" r="2" fill="#92400e"/>
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-title">Fife Food</div>
              <div className="brand-sub">Local, honest, nearby</div>
            </div>
          </div>
          <button className="locate-btn" onClick={requestLocation} aria-label="Find shops near me">
            <IconLocate size={18} />
            <span>{userLoc ? 'Located' : 'Near me'}</span>
          </button>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
        </div>
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <IconStar size={14} /> Town of the day · <strong>{town}</strong>
          </div>
          <h1 className="hero-title">
            The Kingdom's <em>finest</em> larder,<br/>mapped.
          </h1>
          <p className="hero-lede">
            Discover {fifeShops.length} independent producers, bakers, fishmongers, distillers and farm shops across Fife — no chains, no supermarkets, just the real thing.
          </p>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">{fifeShops.length}</div><div className="stat-lbl">Producers</div></div>
            <div className="stat-divider"></div>
            <div className="stat"><div className="stat-num">{cats.length - 1}</div><div className="stat-lbl">Categories</div></div>
            <div className="stat-divider"></div>
            <div className="stat"><div className="stat-num">100%</div><div className="stat-lbl">Independent</div></div>
          </div>
        </div>
      </section>

      {/* ─── SEARCH BAR ─── */}
      <div className="search-bar">
        <div className="search-bar-inner">
          <div className="search-input">
            <IconSearch size={18} />
            <input
              type="text"
              placeholder="Search producers, towns, produce…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear">
                <IconClose size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="chips">
          {cats.map((c) => (
            <button
              key={c}
              className={`chip ${activeCat === c ? 'chip-active' : ''}`}
              onClick={() => setActiveCat(c)}
            >
              {c === 'All' ? 'All' : catStyle(c).label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── MOBILE TAB SWITCHER ─── */}
      <div className="view-switch">
        <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
          <IconList size={16} /> List <span className="count">{filtered.length}</span>
        </button>
        <button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}>
          <IconMap size={16} /> Map
        </button>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <main className="main">
        {/* LIST */}
        <section className={`list-pane ${view === 'list' ? 'visible' : ''}`}>
          <div className="list-header">
            <h2 className="list-title">
              {filtered.length} {filtered.length === 1 ? 'producer' : 'producers'}
              {activeCat !== 'All' && <span className="list-title-sub"> · {catStyle(activeCat).label}</span>}
            </h2>
            {userLoc && <span className="list-sub">Sorted by distance</span>}
          </div>

          {/* Featured card */}
          {featured && activeCat === 'All' && !query && (
            <article className="featured" onClick={() => handleShopClick(featured)}>
              <div className="featured-tag">
                <IconStar size={12} /> Featured · {town}
              </div>
              <h3 className="featured-name">{featured.name}</h3>
              <p className="featured-desc">{featured.description}</p>
              <div className="featured-meta">
                <span className="featured-cat" style={{ background: catStyle(featured.category).bg, color: catStyle(featured.category).color }}>
                  {catStyle(featured.category).label}
                </span>
                <span className="featured-town"><IconPin size={12} /> {featured.town}</span>
              </div>
            </article>
          )}

          <div className="list">
            {filtered.length === 0 ? (
              <div className="empty">
                <p>No producers match your search.</p>
                <button className="empty-btn" onClick={() => { setQuery(''); setActiveCat('All'); }}>
                  Reset filters
                </button>
              </div>
            ) : (
              filtered.map((shop) => {
                const style = catStyle(shop.category);
                return (
                  <article
                    key={shop.id}
                    className={`card ${selectedShop?.id === shop.id ? 'card-active' : ''}`}
                    onClick={() => handleShopClick(shop)}
                  >
                    <div className="card-head">
                      <div className="card-cat" style={{ background: style.bg, color: style.color }}>
                        {style.label}
                      </div>
                      {shop.distance != null && (
                        <div className="card-distance">{shop.distance.toFixed(1)} km</div>
                      )}
                    </div>
                    <h3 className="card-name">{shop.name}</h3>
                    <div className="card-town"><IconPin size={12} /> {shop.town}</div>
                    <p className="card-desc">{shop.description}</p>
                    {(shop.produce || []).length > 0 && (
                      <div className="tags">
                        {(shop.produce || []).slice(0, 4).map((p) => (
                          <span key={p} className="tag">{p}</span>
                        ))}
                      </div>
                    )}
                    <div className="card-actions">
                      {shop.phone && (
                        <a href={`tel:${shop.phone}`} className="card-link" onClick={(e) => e.stopPropagation()}>
                          <IconPhone size={14} /> {shop.phone}
                        </a>
                      )}
                      {shop.website && (
                        <a href={shop.website} target="_blank" rel="noopener noreferrer" className="card-link" onClick={(e) => e.stopPropagation()}>
                          <IconExt size={14} /> Website
                        </a>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <footer className="foot">
            <p>Made with care in Fife · Data from local listings & directories</p>
          </footer>
        </section>

        {/* MAP */}
        <section className={`map-pane ${view === 'map' ? 'visible' : ''}`}>
          <MapContainer
            center={[56.25, -2.95]}
            zoom={10}
            scrollWheelZoom
            className="leaflet-root"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
              subdomains="abcd"
              maxZoom={19}
            />
            <MapController center={mapCenter} zoom={selectedShop ? 14 : 11} />
            {userLoc && (
              <Marker position={[userLoc.lat, userLoc.lon]} icon={userMarker()}>
                <Popup><strong>You are here</strong></Popup>
              </Marker>
            )}
            {filtered.map((shop) => (
              <Marker
                key={shop.id}
                position={[shop.lat, shop.lon]}
                icon={makeMarker(shop.category, selectedShop?.id === shop.id)}
                eventHandlers={{ click: () => setSelectedShop(shop) }}
              >
                <Popup>
                  <div className="popup">
                    <div className="popup-cat" style={{ background: catStyle(shop.category).bg, color: catStyle(shop.category).color }}>
                      {catStyle(shop.category).label}
                    </div>
                    <h4>{shop.name}</h4>
                    <p className="popup-town"><IconPin size={11} /> {shop.town}</p>
                    <p className="popup-desc">{shop.description}</p>
                    {shop.website && (
                      <a href={shop.website} target="_blank" rel="noopener noreferrer" className="popup-link">
                        Visit website <IconExt size={11} />
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </main>
    </div>
  );
}
