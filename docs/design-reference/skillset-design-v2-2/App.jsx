/* App root — routing between screens, mounts sidebar/topbar, owns Tweaks state */

const { useEffect: useEffectApp } = React;

// Stub screen for surfaces we don't fully build out
const StubScreen = ({ title, sub, ic, setRoute }) => (
  <div className="fade-in">
    <div style={{ maxWidth: 720, marginTop: 24 }}>
      <span className="eyebrow brand">Preview</span>
      <h1 className="display-h2" style={{ marginTop: 12 }}>{title}</h1>
      <p className="lede" style={{ marginTop: 14 }}>{sub}</p>
    </div>

    <div style={{ marginTop: 32, padding: 64, textAlign: 'center', background: '#fff', border: '1px solid var(--color-line)', borderRadius: 18, boxShadow: 'var(--shadow-soft)' }}>
      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: 'linear-gradient(135deg, #1a365d, #2c5282)',
        margin: '0 auto', display: 'grid', placeItems: 'center',
        color: '#fff',
        boxShadow: 'var(--shadow-strong)',
      }}>
        <Icon name={ic} size={36} />
      </div>
      <div style={{ marginTop: 24, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, color: 'var(--color-primary)' }}>
        Coming in v2.1
      </div>
      <p style={{ marginTop: 10, fontSize: 14, color: 'var(--color-ink-soft)', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
        We focused this prototype on the core flows. This surface is wired into the nav so you can see how it fits — implementation lands next sprint.
      </p>
      <div style={{ marginTop: 24, display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => setRoute('discover')}>Back to Discover</button>
        <button className="btn btn-ghost">Read the spec</button>
      </div>
    </div>
  </div>
);

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density":     "comfortable",
  "showAi":      true,
  "headlineFont":"Cormorant Garamond",
  "accent":      "#b22234",
  "showLive":    true,
  "sidebarCollapsed": false
}/*EDITMODE-END*/;

const App = () => {
  const [route, setRoute] = useState('discover');
  const [role, setRole] = useState('learner');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const collapsed = tweaks.sidebarCollapsed;

  // apply density + accent to body
  useEffectApp(() => {
    document.body.dataset.density = tweaks.density;
    document.documentElement.style.setProperty('--color-accent', tweaks.accent);
    const hoverMap = { '#b22234': '#9e1f2f', '#1a365d': '#0f2744', '#1f8a5b': '#16704a', '#c07b0a': '#9d6708' };
    document.documentElement.style.setProperty('--color-accent-hover', hoverMap[tweaks.accent] || tweaks.accent);
    document.documentElement.style.setProperty('--font-display', `"${tweaks.headlineFont}", "Cormorant Garamond", Georgia, serif`);
    if (tweaks.headlineFont === 'Fraunces') ensureFont('Fraunces:wght@500;600;700');
    if (tweaks.headlineFont === 'Playfair Display') ensureFont('Playfair+Display:wght@500;600;700');
  }, [tweaks]);

  // dismiss sidebar on route change (mobile)
  useEffectApp(() => { setSidebarOpen(false); }, [route]);

  const renderRoute = () => {
    switch (route) {
      case 'discover':    return <Discover setRoute={setRoute} />;
      case 'course':      return <CourseDetail setRoute={setRoute} />;
      case 'classroom':   return <Classroom />;
      case 'studio':      return <Studio setRoute={setRoute} />;
      case 'builder':     return <Builder setRoute={setRoute} />;
      case 'paths':       return <Paths setRoute={setRoute} />;
      case 'community':   return <Community setRoute={setRoute} />;
      case 'credentials': return <Credentials />;
      case 'pricing':     return <Pricing setRoute={setRoute} />;
      case 'payouts':     return <Payouts />;
      case 'settings':    return <Settings setRoute={setRoute} />;
      case 'media':       return <StubScreen title="Media library" sub="Every asset, organized. Re-use across courses, swap from this library on the fly." ic="grid" setRoute={setRoute} />;
      case 'cohorts':     return <StubScreen title="Live cohorts" sub="Schedule and run synchronous cohorts. Two of yours are in flight — calendar coming next sprint." ic="calendar" setRoute={setRoute} />;
      case 'billing':     return <Payouts />; // share with payouts for now (learner side billing builds on top)
      default:            return <Discover setRoute={setRoute} />;
    }
  };

  return (
    <>
      <div className={'app ' + (collapsed ? 'collapsed' : '')}>
        <Sidebar
          route={route}
          setRoute={setRoute}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          role={role}
          setRole={setRole}
          collapsed={collapsed}
          toggleCollapsed={() => setTweak('sidebarCollapsed', !collapsed)}
        />
        <main className="main">
          <Topbar
            route={route}
            role={role}
            setOpen={setSidebarOpen}
            onTweaks={() => window.postMessage({ type: '__activate_edit_mode' }, '*')}
            setRoute={setRoute}
            setRole={setRole}
            plan="Plus"
          />
          <div className="content">{renderRoute()}</div>
        </main>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakRadio
            label="Density"
            value={tweaks.density}
            onChange={(v) => setTweak('density', v)}
            options={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact',     label: 'Compact' },
            ]}
          />
          <TweakToggle
            label="Collapse sidebar"
            value={tweaks.sidebarCollapsed}
            onChange={(v) => setTweak('sidebarCollapsed', v)}
          />
        </TweakSection>

        <TweakSection label="Brand">
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            onChange={(v) => setTweak('accent', v)}
            options={['#b22234', '#1a365d', '#1f8a5b', '#c07b0a']}
          />
          <TweakSelect
            label="Display font"
            value={tweaks.headlineFont}
            onChange={(v) => setTweak('headlineFont', v)}
            options={[
              { value: 'Cormorant Garamond', label: 'Cormorant Garamond (default)' },
              { value: 'Fraunces',           label: 'Fraunces' },
              { value: 'Playfair Display',   label: 'Playfair Display' },
              { value: 'Manrope',            label: 'Manrope (sans-only)' },
            ]}
          />
        </TweakSection>

        <TweakSection label="Features">
          <TweakToggle
            label="AI Study Companion (Classroom)"
            value={tweaks.showAi}
            onChange={(v) => setTweak('showAi', v)}
          />
          <TweakToggle
            label="Live cohort card on hero"
            value={tweaks.showLive}
            onChange={(v) => setTweak('showLive', v)}
          />
        </TweakSection>

        <TweakSection label="Jump to screen">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              { id: 'discover',    label: 'Discover' },
              { id: 'course',      label: 'Course' },
              { id: 'paths',       label: 'Paths' },
              { id: 'classroom',   label: 'Classroom' },
              { id: 'community',   label: 'Community' },
              { id: 'credentials', label: 'Credentials' },
              { id: 'studio',      label: 'Studio' },
              { id: 'builder',     label: 'Builder' },
              { id: 'pricing',     label: 'Pricing' },
              { id: 'payouts',     label: 'Payouts' },
              { id: 'settings',    label: 'Settings' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setRoute(s.id)}
                style={{
                  padding: '8px 10px',
                  fontSize: 12, fontWeight: 600,
                  background: route === s.id ? 'var(--color-primary)' : '#fff',
                  color: route === s.id ? '#fff' : 'var(--color-primary)',
                  border: '1px solid var(--color-line)',
                  borderRadius: 8, cursor: 'pointer',
                  transition: 'all 180ms',
                  fontFamily: 'inherit',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

// dynamic font loader for tweak switching
const ensureFont = (spec) => {
  const id = 'font-' + spec.replace(/[^a-z0-9]/gi, '-');
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id; link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
  document.head.appendChild(link);
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
