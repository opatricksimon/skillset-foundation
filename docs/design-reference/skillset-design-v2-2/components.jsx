/* Shared components — icons, logo, primitives. Loaded as window globals for use across other JSX files. */

const Icon = ({ name, size = 16, stroke = 1.7, color = 'currentColor', className }) => {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth: stroke,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    className,
  };
  const P = {
    // navigation
    search:    <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
    bell:      <svg {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></svg>,
    settings:  <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.86-.34 1.7 1.7 0 0 0-1.03 1.55V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.86.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.86 1.7 1.7 0 0 0-1.55-1.03H3a2 2 0 1 1 0-4h.08a1.7 1.7 0 0 0 1.55-1.11 1.7 1.7 0 0 0-.34-1.86l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.86.34h.06a1.7 1.7 0 0 0 1.03-1.55V3a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 1.03 1.55 1.7 1.7 0 0 0 1.86-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.86V9a1.7 1.7 0 0 0 1.55 1.03H21a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1.55 1.03Z" /></svg>,
    menu:      <svg {...props}><path d="M4 6h16M4 12h16M4 18h16" /></svg>,
    chevR:     <svg {...props}><path d="m9 6 6 6-6 6" /></svg>,
    chevL:     <svg {...props}><path d="m15 6-6 6 6 6" /></svg>,
    chevD:     <svg {...props}><path d="m6 9 6 6 6-6" /></svg>,
    arrowR:    <svg {...props}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>,
    plus:      <svg {...props}><path d="M12 5v14M5 12h14" /></svg>,
    // status / progress
    check:     <svg {...props}><path d="M20 6 9 17l-5-5" /></svg>,
    play:      <svg {...props}><path d="M8 5v14l11-7z" fill="currentColor" stroke="none" /></svg>,
    pause:     <svg {...props}><path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" stroke="none" /></svg>,
    backward:  <svg {...props}><path d="M11 5 4 12l7 7M22 5l-7 7 7 7" /></svg>,
    forward:   <svg {...props}><path d="M13 5l7 7-7 7M2 5l7 7-7 7" /></svg>,
    // content types
    video:     <svg {...props}><rect x="3" y="5" width="14" height="14" rx="2" /><path d="m17 10 4-2v8l-4-2z" fill="currentColor" stroke="none" /></svg>,
    book:      <svg {...props}><path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2z" /><path d="M4 18a2 2 0 0 0 2 2h12" /></svg>,
    quiz:      <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M9 9a3 3 0 0 1 6 0c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>,
    file:      <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>,
    // misc
    star:      <svg {...props} fill="currentColor" stroke="none"><path d="m12 2 3 7 7 .6-5.3 4.6 1.6 6.8L12 17.3 5.7 21l1.6-6.8L2 9.6 9 9z" /></svg>,
    sparkle:   <svg {...props}><path d="M12 3v6m0 6v6M3 12h6m6 0h6M5 5l4 4m6 6 4 4M5 19l4-4m6-6 4-4" /></svg>,
    bookmark:  <svg {...props}><path d="M5 3h14v18l-7-5-7 5z" /></svg>,
    heart:     <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    clock:     <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
    users:     <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    award:     <svg {...props}><circle cx="12" cy="8" r="6" /><path d="m8.21 13.89-1.21 8.11L12 19l5 3-1.21-8.11" /></svg>,
    calendar:  <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
    grid:      <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
    layers:    <svg {...props}><path d="m12 2 10 6-10 6L2 8z" /><path d="m2 14 10 6 10-6" /></svg>,
    bolt:      <svg {...props}><path d="M13 2 3 14h7l-1 8 10-12h-7z" fill="currentColor" stroke="none" /></svg>,
    trash:     <svg {...props}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" /></svg>,
    grip:      <svg {...props} stroke="none" fill="currentColor"><circle cx="9" cy="6" r="1.4" /><circle cx="9" cy="12" r="1.4" /><circle cx="9" cy="18" r="1.4" /><circle cx="15" cy="6" r="1.4" /><circle cx="15" cy="12" r="1.4" /><circle cx="15" cy="18" r="1.4" /></svg>,
    pencil:    <svg {...props}><path d="m12 20 9-9-3-3-9 9zM18 8l3 3M3 21l5-1" /></svg>,
    download:  <svg {...props}><path d="M12 3v12m-4-4 4 4 4-4M4 19h16" /></svg>,
    eye:       <svg {...props}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>,
    send:      <svg {...props}><path d="m22 2-11 11M22 2l-7 20-4-9-9-4z" /></svg>,
    note:      <svg {...props}><path d="M4 4h16v12l-6 6H4z" /><path d="M14 22v-6h6" /></svg>,
    flag:      <svg {...props}><path d="M4 22V4a4 4 0 0 1 6.2-3.3l2.4 1.5a3 3 0 0 0 1.6.4L20 2v12l-4.6.4a4 4 0 0 1-2.2-.5l-2.4-1.4A3 3 0 0 0 9 12.1L4 13" /></svg>,
    globe:     <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>,
    trendUp:   <svg {...props}><path d="m3 17 6-6 4 4 8-8" /><path d="M14 7h7v7" /></svg>,
    trendDown: <svg {...props}><path d="m3 7 6 6 4-4 8 8" /><path d="M14 17h7v-7" /></svg>,
  };
  return P[name] || null;
};

// Brand mark — uses uploaded assets
const Logo = ({ kind = 'full', height }) => {
  if (kind === 'mark') return <img src="assets/skillset-mark.png" alt="Skillset" style={{ height: height || 28 }} />;
  return <img src="assets/skillset-logo-dark.png" alt="Skillset" style={{ height: height || 24, filter: 'invert(1)' }} />;
};

// Sparkline SVG — for KPI cards
const Sparkline = ({ values, color = '#1a365d', fillOpacity = 0.10, width = 140, height = 40 }) => {
  if (!values || values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const pts = values.map((v, i) => [i * step, height - ((v - min) / range) * (height - 4) - 2]);
  const linePath = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#spark-${color.replace('#','')})`} />
      <path d={linePath} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

Object.assign(window, { Icon, Logo, Sparkline });
