import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { FIFE_SHOPS, CATEGORIES, TOWNS } from './data/fifeShops.js';

/* ════════════════════════════════════════════════════════════════════════
   Fife Food — map-first discovery, MW4-quality polish.
   ════════════════════════════════════════════════════════════════════════ */

const STYLES = {
  dark:  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
};

const CAT_BY_ID = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

// GeoJSON for all shops, filtered later via map filter
const buildGeo = (shops) => ({
  type: 'FeatureCollection',
  features: shops.map(s => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [s.lon, s.lat] },
    properties: {
      id: s.id, name: s.name, cat: s.cat, town: s.town,
      color: CAT_BY_ID[s.cat]?.color || '#888',
    },
  })),
});

// Distance helper (km)
const distKm = (a, b) => {
  const R = 6371, toRad = x => x * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
  const x = Math.sin(dLat/2)**2 + Math.sin(dLon/2)**2 * Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat));
  return 2 * R * Math.asin(Math.sqrt(x));
};

/* ─── Icons ─── */
const I = {
  menu:   <svg viewBox="0 0 20 20" width="18" height="18"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  close:  <svg viewBox="0 0 20 20" width="18" height="18"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  search: <svg viewBox="0 0 20 20" width="16" height="16"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="m18 18-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  pin:    <svg viewBox="0 0 20 20" width="14" height="14"><path d="M10 2a6 6 0 0 0-6 6c0 5 6 10 6 10s6-5 6-10a6 6 0 0 0-6-6z" stroke="currentColor" strokeWidth="1.6" fill="none"/><circle cx="10" cy="8" r="2.2" fill="currentColor"/></svg>,
  phone:  <svg viewBox="0 0 20 20" width="14" height="14"><path d="M5 3h3l1.5 4-2 1a10 10 0 0 0 4.5 4.5l1-2 4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 3 5a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
  ext:    <svg viewBox="0 0 20 20" width="14" height="14"><path d="M11 3h6v6M17 3l-9 9M14 11v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>,
  locate: <svg viewBox="0 0 20 20" width="16" height="16"><circle cx="10" cy="10" r="3" fill="currentColor"/><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.5"/><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  list:   <svg viewBox="0 0 20 20" width="16" height="16"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  map:    <svg viewBox="0 0 20 20" width="16" height="16"><path d="M2 5l5-2 6 2 5-2v12l-5 2-6-2-5 2z M7 3v14M13 5v14" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
  filter: <svg viewBox="0 0 20 20" width="16" height="16"><path d="M3 5h14M5 10h10M8 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
};

/* ════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const cRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState('dark');

  const [activeCats, setActiveCats] = useState(() => new Set(CATEGORIES.map(c => c.id)));
  const [activeTown, setActiveTown] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('map'); // 'map' | 'list' (mobile)
  const [drawer, setDrawer] = useState(false);
  const [userPos, setUserPos] = useState(null);
  const [geoErr, setGeoErr] = useState(null);

  /* ── Filtered shops ───────────────────────────────────────────────── */
  const filteredShops = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FIFE_SHOPS
      .filter(s => activeCats.has(s.cat))
      .filter(s => activeTown === 'all' || s.town === activeTown)
      .filter(s => !q || (
        s.name.toLowerCase().includes(q) ||
        s.town.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        (s.tags || []).some(t => t.toLowerCase().includes(q))
      ))
      .map(s => ({ ...s, distance: userPos ? distKm(userPos, s) : null }))
      .sort((a, b) => a.distance != null && b.distance != null ? a.distance - b.distance : a.name.localeCompare(b.name));
  }, [activeCats, activeTown, query, userPos]);

  /* ── Build map layers ─────────────────────────────────────────────── */
  const buildLayers = useCallback((map, currentTheme) => {
    const labelColor = currentTheme === 'light' ? '#1e293b' : '#ffffff';
    const labelHalo  = currentTheme === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(10,15,25,0.85)';

    // Tear down
    ['shop-label','shop-hit','shop-selected','shop-dot','shop-halo'].forEach(id => { try { map.removeLayer(id); } catch {} });
    try { map.removeSource('shops'); } catch {}

    map.addSource('shops', { type:'geojson', data: buildGeo(FIFE_SHOPS) });

    map.addLayer({ id:'shop-halo', type:'circle', source:'shops', paint:{
      'circle-radius': ['interpolate',['linear'],['zoom'], 8, 8, 11, 14, 14, 22],
      'circle-color': ['get','color'],
      'circle-opacity': 0.18,
      'circle-blur': 0.6,
    }});

    map.addLayer({ id:'shop-dot', type:'circle', source:'shops', paint:{
      'circle-radius': ['interpolate',['linear'],['zoom'], 8, 5, 11, 7, 14, 10],
      'circle-color': ['get','color'],
      'circle-stroke-color': currentTheme === 'light' ? '#ffffff' : 'rgba(15,20,30,0.95)',
      'circle-stroke-width': 2.5,
    }});

    map.addLayer({ id:'shop-selected', type:'circle', source:'shops',
      filter: ['==', ['get','id'], ''], paint:{
      'circle-radius': ['interpolate',['linear'],['zoom'], 8, 11, 11, 14, 14, 18],
      'circle-color': 'transparent',
      'circle-stroke-color': currentTheme === 'light' ? '#0f172a' : '#ffffff',
      'circle-stroke-width': 2.5,
    }});

    map.addLayer({ id:'shop-hit', type:'circle', source:'shops', paint:{
      'circle-radius': 22, 'circle-color':'transparent', 'circle-opacity': 0,
    }});

    map.addLayer({ id:'shop-label', type:'symbol', source:'shops', minzoom: 10,
      layout: {
        'text-field': ['get','name'],
        'text-font': ['Open Sans Semibold','Arial Unicode MS Bold'],
        'text-size': ['interpolate',['linear'],['zoom'], 10, 10, 13, 12],
        'text-offset': [0, 1.4],
        'text-anchor': 'top',
        'text-allow-overlap': false,
        'text-optional': true,
      },
      paint: { 'text-color': labelColor, 'text-halo-color': labelHalo, 'text-halo-width': 1.4 },
    });

    map.on('click','shop-hit', e => {
      const f = e.features?.[0];
      if (!f) return;
      const s = FIFE_SHOPS.find(x => x.id === f.properties.id);
      if (s) {
        setSelected(s);
        map.easeTo({ center:[s.lon,s.lat], zoom: Math.max(12, map.getZoom()), duration: 600 });
      }
    });
    map.on('mouseenter','shop-hit', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave','shop-hit', () => { map.getCanvas().style.cursor = ''; });
  }, []);

  /* ── Apply filter to map ──────────────────────────────────────────── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const ids = new Set(filteredShops.map(s => s.id));
    try {
      map.setFilter('shop-dot',   ['in', ['get','id'], ['literal', [...ids]]]);
      map.setFilter('shop-halo',  ['in', ['get','id'], ['literal', [...ids]]]);
      map.setFilter('shop-label', ['in', ['get','id'], ['literal', [...ids]]]);
      map.setFilter('shop-hit',   ['in', ['get','id'], ['literal', [...ids]]]);
    } catch {}
  }, [filteredShops, ready]);

  /* ── Apply selection ──────────────────────────────────────────────── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    try { map.setFilter('shop-selected', ['==', ['get','id'], selected?.id || '']); } catch {}
  }, [selected, ready]);

  /* ── Init map ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!cRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: cRef.current,
      style: STYLES.dark,
      center: [-2.95, 56.25],
      zoom: 9.2,
      minZoom: 7,
      maxZoom: 16,
      attributionControl: { compact: true },
      pitchWithRotate: false,
      dragRotate: false,
    });
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      buildLayers(map, 'dark');
      setReady(true);
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [buildLayers]);

  /* ── Theme toggle ─────────────────────────────────────────────────── */
  const toggleTheme = useCallback(() => {
    const map = mapRef.current; if (!map) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    const center = map.getCenter(), zoom = map.getZoom();
    map.setStyle(STYLES[next]);
    const rebuild = () => { buildLayers(map, next); map.jumpTo({ center, zoom }); };
    map.once('idle', rebuild);
    setTimeout(() => { try { if (!map.getSource('shops')) rebuild(); } catch {} }, 1500);
    setTheme(next);
  }, [theme, buildLayers]);

  /* ── Geolocation ──────────────────────────────────────────────────── */
  const requestLoc = useCallback(() => {
    setGeoErr(null);
    if (!navigator.geolocation) { setGeoErr('Not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const p = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setUserPos(p);
        mapRef.current?.flyTo({ center:[p.lon, p.lat], zoom: Math.max(11, mapRef.current.getZoom()), duration: 900 });
      },
      () => { setGeoErr('Location denied'); setTimeout(() => setGeoErr(null), 3000); },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  /* ── User pos marker ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!ready || !mapRef.current || !userPos) return;
    if (userMarkerRef.current) userMarkerRef.current.remove();
    const el = document.createElement('div');
    el.className = 'user-pos';
    el.innerHTML = '<span class="user-pos-dot"></span><span class="user-pos-pulse"></span>';
    userMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([userPos.lon, userPos.lat]).addTo(mapRef.current);
    return () => userMarkerRef.current?.remove();
  }, [ready, userPos]);

  /* ── Helpers ──────────────────────────────────────────────────────── */
  const toggleCat = (id) => {
    setActiveCats(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n.size === 0 ? new Set([id]) : n;
    });
  };
  const allCatsOn = activeCats.size === CATEGORIES.length;
  const toggleAllCats = () => {
    setActiveCats(allCatsOn ? new Set([CATEGORIES[0].id]) : new Set(CATEGORIES.map(c => c.id)));
  };
  const resetFilters = () => {
    setActiveCats(new Set(CATEGORIES.map(c => c.id)));
    setActiveTown('all');
    setQuery('');
  };

  const focusShop = (s) => {
    setSelected(s);
    setView('map');
    setDrawer(false);
    mapRef.current?.flyTo({ center:[s.lon, s.lat], zoom: 13, duration: 800 });
  };

  return (
    <div className={`app theme-${theme}`}>
      {/* ─── Top Bar ───────────────────────────────────────────── */}
      <header className="topbar">
        <button className="topbar-btn" onClick={() => setDrawer(true)} aria-label="Menu">
          {I.menu}
        </button>
        <div className="topbar-brand">
          <div className="topbar-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 3 L4 9 V20 H20 V9 Z" fill="#fbbf24" stroke="#1a1410" strokeWidth="1.2" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="2.2" fill="#1a1410"/>
            </svg>
          </div>
          <div className="topbar-title">FIFE FOOD</div>
        </div>
        <button className={`topbar-btn ${userPos ? 'on' : ''}`} onClick={requestLoc} aria-label="Find me">
          {I.locate}
        </button>
      </header>

      {/* ─── Map (always mounted, full bleed) ────────────────── */}
      <div className={`map-wrap ${view === 'map' ? 'show' : ''}`}>
        <div ref={cRef} className="map-canvas"></div>

        {/* Map overlay: search */}
        <div className="map-search">
          <div className="map-search-box">
            <span className="map-search-icon">{I.search}</span>
            <input
              type="text" value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Search ${FIFE_SHOPS.length} producers, towns…`}
            />
            {query && <button className="map-search-clear" onClick={() => setQuery('')} aria-label="Clear">{I.close}</button>}
          </div>
          <div className="map-search-meta">
            <span className="meta-count">{filteredShops.length}</span>
            <span className="meta-label">{filteredShops.length === 1 ? 'place' : 'places'}</span>
            {activeTown !== 'all' && <span className="meta-pill">{activeTown}</span>}
          </div>
        </div>

        {/* Legend */}
        <div className="map-legend">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`legend-chip ${activeCats.has(c.id) ? 'on' : ''}`}
              onClick={() => toggleCat(c.id)}
              style={{ '--c': c.color }}
            >
              <span className="legend-dot"></span>
              <span className="legend-label">{c.label}</span>
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <button className="map-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark'
            ? <svg viewBox="0 0 20 20" width="16" height="16"><circle cx="10" cy="10" r="3.5" fill="currentColor"/>{[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={10+Math.cos(r)*5.5} y1={10+Math.sin(r)*5.5} x2={10+Math.cos(r)*7} y2={10+Math.sin(r)*7} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>})}</svg>
            : <svg viewBox="0 0 20 20" width="16" height="16"><path d="M10 3a7 7 0 1 0 0 14 5 5 0 0 1 0-14z" fill="currentColor"/></svg>}
        </button>

        {geoErr && <div className="map-toast">{geoErr}</div>}

        {/* Selected shop card */}
        {selected && (
          <div className="shop-popup" role="dialog">
            <div className="shop-popup-bar" style={{ background: CAT_BY_ID[selected.cat]?.color }}></div>
            <div className="shop-popup-head">
              <div>
                <div className="shop-popup-eyebrow" style={{ color: CAT_BY_ID[selected.cat]?.color }}>
                  {CAT_BY_ID[selected.cat]?.label} · {selected.town}
                </div>
                <div className="shop-popup-name">{selected.name}</div>
              </div>
              <button className="shop-popup-close" onClick={() => setSelected(null)} aria-label="Close">{I.close}</button>
            </div>
            <p className="shop-popup-desc">{selected.desc}</p>
            {selected.tags && (
              <div className="shop-popup-tags">
                {selected.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            )}
            <div className="shop-popup-actions">
              {selected.tel && (
                <a className="shop-popup-action" href={`tel:${selected.tel}`}>{I.phone}<span>{selected.tel}</span></a>
              )}
              {selected.web && (
                <a className="shop-popup-action" href={selected.web} target="_blank" rel="noopener noreferrer">{I.ext}<span>Visit website</span></a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── List (mobile) ──────────────────────────────────── */}
      <div className={`list-wrap ${view === 'list' ? 'show' : ''}`}>
        <div className="list-header">
          <h2>{filteredShops.length} {filteredShops.length === 1 ? 'producer' : 'producers'}</h2>
          {userPos && <span className="list-sub">Sorted by distance</span>}
        </div>
        <div className="list">
          {filteredShops.length === 0 ? (
            <div className="empty">
              <p>No producers match these filters.</p>
              <button className="empty-reset" onClick={resetFilters}>Reset</button>
            </div>
          ) : filteredShops.map(s => (
            <article key={s.id} className="row" onClick={() => focusShop(s)}>
              <span className="row-dot" style={{ background: CAT_BY_ID[s.cat]?.color }}></span>
              <div className="row-body">
                <div className="row-head">
                  <h3 className="row-name">{s.name}</h3>
                  {s.distance != null && <span className="row-dist">{s.distance.toFixed(1)} km</span>}
                </div>
                <div className="row-meta">
                  <span style={{ color: CAT_BY_ID[s.cat]?.color, fontWeight: 600 }}>{CAT_BY_ID[s.cat]?.label}</span>
                  <span className="row-sep">·</span>
                  <span>{s.town}</span>
                </div>
                <p className="row-desc">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ─── Mobile view switch (bottom tab bar) ────────────── */}
      <nav className="tab-bar">
        <button className={view === 'map' ? 'on' : ''} onClick={() => setView('map')}>{I.map}<span>Map</span></button>
        <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>{I.list}<span>List</span><em>{filteredShops.length}</em></button>
      </nav>

      {/* ─── Drawer Menu ─────────────────────────────────────── */}
      {drawer && <div className="drawer-overlay" onClick={() => setDrawer(false)}></div>}
      <aside className={`drawer ${drawer ? 'open' : ''}`}>
        <div className="drawer-head">
          <div className="drawer-title">Filters</div>
          <button className="drawer-close" onClick={() => setDrawer(false)} aria-label="Close">{I.close}</button>
        </div>

        <div className="drawer-section">
          <div className="drawer-section-head">
            <span className="drawer-section-title">Categories</span>
            <button className="drawer-link" onClick={toggleAllCats}>{allCatsOn ? 'Clear' : 'All'}</button>
          </div>
          <div className="drawer-cats">
            {CATEGORIES.map(c => {
              const count = FIFE_SHOPS.filter(s => s.cat === c.id).length;
              const on = activeCats.has(c.id);
              return (
                <button
                  key={c.id}
                  className={`drawer-cat ${on ? 'on' : ''}`}
                  onClick={() => toggleCat(c.id)}
                  style={{ '--c': c.color }}
                >
                  <span className="drawer-cat-dot"></span>
                  <span className="drawer-cat-label">{c.label}</span>
                  <span className="drawer-cat-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="drawer-section">
          <div className="drawer-section-head">
            <span className="drawer-section-title">Town</span>
            {activeTown !== 'all' && <button className="drawer-link" onClick={() => setActiveTown('all')}>Clear</button>}
          </div>
          <div className="drawer-towns">
            <button
              className={`drawer-town ${activeTown === 'all' ? 'on' : ''}`}
              onClick={() => setActiveTown('all')}
            >All Fife</button>
            {TOWNS.map(t => {
              const count = FIFE_SHOPS.filter(s => s.town === t).length;
              if (!count) return null;
              return (
                <button
                  key={t}
                  className={`drawer-town ${activeTown === t ? 'on' : ''}`}
                  onClick={() => setActiveTown(t)}
                >
                  {t} <em>{count}</em>
                </button>
              );
            })}
          </div>
        </div>

        <div className="drawer-section">
          <button className="drawer-action" onClick={resetFilters}>Reset all filters</button>
        </div>

        <div className="drawer-foot">
          <div className="drawer-foot-title">Fife Food</div>
          <div className="drawer-foot-sub">{FIFE_SHOPS.length} independent producers across the Kingdom of Fife. No chains, no supermarkets.</div>
        </div>
      </aside>
    </div>
  );
}
