/* Topbar — breadcrumbs, status pill, notifications, user menu */
const { useEffect, useRef } = React;

const Topbar = ({ route, role, setOpen, onTweaks, setRoute, setRole, plan }) => {
  const titles = {
    discover:    { section: 'Discover',  page: 'Marketplace' },
    course:      { section: 'Discover',  page: 'Design Systems at scale' },
    paths:       { section: 'Discover',  page: 'Learning paths' },
    classroom:   { section: 'Learn',     page: 'Classroom' },
    community:   { section: 'Learn',     page: 'Communities' },
    credentials: { section: 'Learn',     page: 'Credentials' },
    studio:      { section: 'Teach',     page: 'Studio' },
    builder:     { section: 'Teach',     page: 'Course Builder' },
    media:       { section: 'Teach',     page: 'Media library' },
    cohorts:     { section: 'Teach',     page: 'Live cohorts' },
    pricing:     { section: 'Account',   page: 'Plans & fees' },
    billing:     { section: 'Account',   page: 'Billing' },
    payouts:     { section: 'Account',   page: 'Payouts & tax' },
    settings:    { section: 'Account',   page: 'Settings' },
  };
  const t = titles[route] || { section: 'Skillset', page: '' };

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const user = role === 'teacher'
    ? { name: 'Mariana Costa', email: 'mariana@costa.studio', initials: 'MC', role: 'Educator' }
    : { name: 'Alex Romano',   email: 'alex@romano.co',       initials: 'AR', role: 'Learner' };

  return (
    <header className="topbar">
      <button className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu"><Icon name="menu" size={18} /></button>

      <div className="crumbs">
        <span>{t.section}</span>
        <Icon name="chevR" size={12} />
        <span className="cur">{t.page}</span>
      </div>

      <div className="spread" />

      <button className="pill" title="System status">
        <span className="dot" />
        <span style={{ '@media (max-width: 720px)': { display: 'none' } }}>All systems normal</span>
      </button>

      <button className="ico-btn" onClick={onTweaks} title="Tweaks">
        <Icon name="settings" size={16} />
      </button>

      <button className="ico-btn" title="Notifications">
        <Icon name="bell" size={16} />
        <span className="badge" />
      </button>

      <div className="user-menu" ref={menuRef}>
        <button className="user-trigger" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="avatar">{user.initials}</div>
          <div className="who">
            <div className="nm">{user.name}</div>
            <div className="rl">{user.role}</div>
          </div>
          <Icon className="chev" name="chevD" size={12} />
        </button>

        {menuOpen && (
          <div className="user-dropdown">
            <div className="head">
              <div className="av">{user.initials}</div>
              <div>
                <div className="nm">{user.name}</div>
                <div className="em">{user.email}</div>
              </div>
            </div>

            <button onClick={() => { setRoute('pricing'); setMenuOpen(false); }}>
              <span className="ic"><Icon name="award" size={13} /></span>
              Plan
              <span className="plan-chip">{plan || 'Start'}</span>
            </button>
            <button onClick={() => { setRoute('settings'); setMenuOpen(false); }}>
              <span className="ic"><Icon name="settings" size={13} /></span>
              Settings
            </button>
            <button onClick={() => { setRoute(role === 'teacher' ? 'payouts' : 'billing'); setMenuOpen(false); }}>
              <span className="ic"><Icon name="file" size={13} /></span>
              {role === 'teacher' ? 'Payouts & tax' : 'Billing'}
            </button>
            <button onClick={() => { setRoute('credentials'); setMenuOpen(false); }}>
              <span className="ic"><Icon name="bookmark" size={13} /></span>
              My credentials
            </button>

            <div className="sep" />

            <button onClick={() => { setRole(role === 'teacher' ? 'learner' : 'teacher'); setRoute(role === 'teacher' ? 'discover' : 'studio'); setMenuOpen(false); }}>
              <span className="ic"><Icon name="users" size={13} /></span>
              Switch to {role === 'teacher' ? 'Learner' : 'Creator'} view
            </button>

            <div className="sep" />

            <button className="danger">
              <span className="ic" style={{ background: 'rgba(178,34,52,0.08)', color: 'var(--color-accent)' }}><Icon name="arrowR" size={13} /></span>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

window.Topbar = Topbar;
