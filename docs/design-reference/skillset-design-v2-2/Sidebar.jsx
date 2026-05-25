/* Sidebar — collapsible, with Communities; user profile lives in topbar now. */
const { useState } = React;

const Sidebar = ({ route, setRoute, open, setOpen, role, setRole, collapsed, toggleCollapsed }) => {
  // sections by role
  const sections = role === 'teacher' ? [
    {
      label: 'Teach',
      items: [
        { id: 'studio',  label: 'Studio',           ck: 'St' },
        { id: 'builder', label: 'Course Builder',   ck: 'Cb' },
        { id: 'media',   label: 'Media library',    ck: 'Md' },
        { id: 'cohorts', label: 'Live cohorts',     ck: 'Lc', count: 2 },
        { id: 'community', label: 'Communities',    ck: 'Cm' },
      ]
    },
    {
      label: 'Discover',
      items: [
        { id: 'discover', label: 'Marketplace', ck: 'Mp' },
        { id: 'course',   label: 'Course preview', ck: 'Cp' },
      ]
    },
    {
      label: 'Account',
      items: [
        { id: 'pricing',  label: 'Plans & fees',  ck: 'Pl' },
        { id: 'payouts',  label: 'Payouts & tax', ck: 'Pt' },
        { id: 'settings', label: 'Settings',      ck: 'Sg' },
      ]
    },
  ] : [
    {
      label: 'Discover',
      items: [
        { id: 'discover', label: 'Marketplace',    ck: 'Mp' },
        { id: 'course',   label: 'Course detail',  ck: 'Cd' },
        { id: 'paths',    label: 'Learning paths', ck: 'Lp', count: 4 },
      ]
    },
    {
      label: 'Learn',
      items: [
        { id: 'classroom',   label: 'Classroom',   ck: 'Cl' },
        { id: 'community',   label: 'Communities', ck: 'Cm', count: 3 },
        { id: 'credentials', label: 'Credentials', ck: 'Cr' },
      ]
    },
    {
      label: 'Account',
      items: [
        { id: 'pricing',  label: 'Plans & fees', ck: 'Pl' },
        { id: 'billing',  label: 'Billing',      ck: 'Bl' },
        { id: 'settings', label: 'Settings',     ck: 'Sg' },
      ]
    },
  ];

  return (
    <aside className={'sidebar ' + (open ? 'open' : '')}>
      <div className="sb-brand">
        <Logo kind="mark" height={26} />
        <span className="brand-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--color-primary)' }}>Skillset</span>
        <span className="beta">v2</span>
      </div>

      <button className="sb-collapse" onClick={toggleCollapsed} title={collapsed ? 'Expand' : 'Collapse'} aria-label="Toggle sidebar">
        <Icon name="chevL" size={12} />
      </button>

      {!collapsed && (
        <div className="sb-search">
          <span className="ico"><Icon name="search" size={15} /></span>
          <input placeholder="Search courses, faculty…" />
          <span className="kbd">⌘K</span>
        </div>
      )}

      {!collapsed && (
        <div className="role-switch" style={{ display: 'grid', gap: 6, padding: 8, border: '1px solid var(--color-line)', borderRadius: 10, background: 'var(--color-surface-soft)' }}>
          <div style={{ display: 'flex', gap: 4, padding: 2, background: '#fff', border: '1px solid var(--color-line)', borderRadius: 8 }}>
            {['learner', 'teacher'].map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setRoute(r === 'teacher' ? 'studio' : 'discover'); }}
                style={{
                  flex: 1, padding: '6px 8px',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                  border: 'none', cursor: 'pointer',
                  borderRadius: 6,
                  background: role === r ? 'var(--color-primary)' : 'transparent',
                  color: role === r ? '#fff' : 'var(--color-ink-soft)',
                  transition: 'all var(--duration-base) var(--ease-standard)',
                }}
              >
                {r === 'learner' ? 'Learner' : 'Creator'}
              </button>
            ))}
          </div>
        </div>
      )}

      {sections.map((sec) => (
        <div key={sec.label} className="sb-group">
          <div className="sb-section-label">{sec.label}</div>
          {sec.items.map((it) => (
            <button
              key={it.id}
              className={'sb-item ' + (route === it.id ? 'active' : '')}
              onClick={() => { setRoute(it.id); setOpen(false); }}
              title={collapsed ? it.label : ''}
            >
              <span className="ck">{it.ck}</span>
              <span>{it.label}</span>
              {it.count != null && <span className="count">{it.count}</span>}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
};

window.Sidebar = Sidebar;
