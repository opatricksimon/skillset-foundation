/* global React */
const { useState } = React;

const ROLE_NAV = {
  student: [
    { section: "Learn", items: [
      { id: "classroom",  label: "Classroom",   ck: "C", count: 3 },
      { id: "community",  label: "Community",   ck: "Co" },
      { id: "credentials",label: "Credentials", ck: "Cr" },
    ]},
    { section: "Account", items: [
      { id: "billing",    label: "Billing",     ck: "B" },
      { id: "settings",   label: "Settings",    ck: "S" },
    ]},
  ],
  teacher: [
    { section: "Studio", items: [
      { id: "overview",   label: "Overview",     ck: "O" },
      { id: "courses",    label: "Courses",      ck: "C", count: 4 },
      { id: "lessons",    label: "Lessons",      ck: "L" },
      { id: "review",     label: "In review",    ck: "R", count: 2 },
    ]},
    { section: "Audience", items: [
      { id: "learners",   label: "Learners",     ck: "Le" },
      { id: "earnings",   label: "Earnings",     ck: "Ea" },
    ]},
  ],
  ops: [
    { section: "Trust", items: [
      { id: "queue",      label: "Review queue", ck: "R", count: 12 },
      { id: "flags",      label: "Flagged",      ck: "F", count: 3 },
      { id: "decisions",  label: "Decisions",    ck: "D" },
    ]},
    { section: "Directory", items: [
      { id: "teachers",   label: "Teachers",     ck: "T" },
      { id: "learners",   label: "Learners",     ck: "Le" },
    ]},
  ],
};

const ROLE_LABEL = { student: "Learner", teacher: "Educator", ops: "Trust ops" };

function Brand() {
  return (
    <div className="brand-card">
      <div>
        <div className="title">Skillset</div>
        <div className="sub">International learning network</div>
      </div>
      <span className="beta-chip">beta</span>
    </div>
  );
}

function RoleSwitch({ role, onChange }) {
  return (
    <div className="role-switch">
      <div className="lbl">Workspace</div>
      <div className="pills" role="tablist">
        {[["student","Learn"],["teacher","Teach"],["ops","Ops"]].map(([id, label]) => (
          <button key={id} className={`pill ${role===id ? "active":""}`} onClick={() => onChange(id)}>{label}</button>
        ))}
      </div>
    </div>
  );
}

function Sidebar({ role, onRole, active, onNav }) {
  return (
    <aside className="sidebar" data-screen-label="Platform · Sidebar">
      <Brand />
      <RoleSwitch role={role} onChange={onRole} />
      {ROLE_NAV[role].map(g => (
        <div key={g.section} className="nav-group">
          <div className="nav-section">{g.section}</div>
          {g.items.map(it => (
            <button key={it.id}
              className={`nav-item ${active === it.id ? "active":""}`}
              onClick={() => onNav(it.id)}>
              <span className="ck">{it.ck}</span>
              <span>{it.label}</span>
              {it.count != null && <span className="count">{it.count}</span>}
            </button>
          ))}
        </div>
      ))}
      <div className="sidebar-foot">
        <div className="avatar">JS</div>
        <div>
          <div className="nm">Jamie Salgado</div>
          <span className="role">{ROLE_LABEL[role]}</span>
        </div>
      </div>
    </aside>
  );
}

function SearchIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--color-ink-soft)"}}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  );
}

function Topbar({ role, page }) {
  return (
    <header className="topbar" data-screen-label="Platform · Topbar">
      <div className="crumbs">
        <span>Skillset</span><span className="sep">/</span>
        <span>{ROLE_LABEL[role]}</span><span className="sep">/</span>
        <span className="cur">{page}</span>
      </div>
      <div className="search">
        <SearchIcon/>
        <input placeholder="Search skill, course, or person"/>
      </div>
      <div className="actions">
        <button className="icon-btn" aria-label="Notifications"><BellIcon/><span className="dot"/></button>
        <button className="btn btn-solid btn-sm">New course</button>
      </div>
    </header>
  );
}

// ─── Student page ───────────────────────────────────────
function StudentPage() {
  const courses = [
    { cat: "Psychology",  t: "Clinical Psychology · Module 3", pct: 62 },
    { cat: "Management",  t: "Practical Leadership · Week 5",  pct: 41 },
    { cat: "Design",      t: "Product Design · Week 2",        pct: 18 },
  ];
  return (
    <div className="page" data-screen-label="Platform · Student dashboard">
      <div className="page-head">
        <div>
          <span className="eyebrow accent" style={{fontSize:12, fontWeight:700, letterSpacing:".22em", textTransform:"uppercase", color:"var(--color-accent)"}}>My learning</span>
          <h1>Welcome back, Jamie.</h1>
          <p>Three programs in progress. Two live sessions this week. One credential awaiting submission.</p>
        </div>
        <div className="actions">
          <button className="btn btn-outline btn-md">My schedule</button>
          <button className="btn btn-solid btn-md">Browse programs</button>
        </div>
      </div>

      <div className="grid-3" style={{marginBottom:18}}>
        <div className="stat-tile"><div className="l">Courses in progress</div><div className="v">3</div><div className="d">Approved cohorts</div></div>
        <div className="stat-tile"><div className="l">Live sessions this week</div><div className="v">2</div><div className="d up">Both confirmed</div></div>
        <div className="stat-tile"><div className="l">Credentials issued</div><div className="v">5</div><div className="d">Verifiable on profile</div></div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="sub">In progress</div>
              <div className="ttl">Pick up where you left off</div>
            </div>
            <button className="btn btn-outline btn-sm">View all</button>
          </div>
          <div className="panel-body">
            {courses.map(c => (
              <div className="course-row" key={c.t}>
                <div className="thumb"/>
                <div style={{flex:1, minWidth:0}}>
                  <div className="cat">{c.cat}</div>
                  <div className="t">{c.t}</div>
                </div>
                <div className="progress">
                  <div className="bar"><i style={{width:`${c.pct}%`}}/></div>
                  <div className="pct">{c.pct}% complete</div>
                </div>
                <button className="btn btn-solid btn-sm">Continue</button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="sub">This week</div>
              <div className="ttl">Live sessions</div>
            </div>
          </div>
          <div className="panel-body">
            <div style={{padding:"10px 0", borderBottom:"1px dashed var(--color-line)"}}>
              <div className="cat" style={{fontSize:10, fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", color:"var(--color-accent)"}}>Thu · 18:00 GMT</div>
              <div style={{fontWeight:700, marginTop:4}}>Clinical Psychology · Case review</div>
              <div style={{fontSize:12, color:"var(--color-ink-soft)", marginTop:4}}>With Anaís Costa · cohort B</div>
            </div>
            <div style={{padding:"10px 0"}}>
              <div className="cat" style={{fontSize:10, fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", color:"var(--color-accent)"}}>Sat · 15:00 GMT</div>
              <div style={{fontWeight:700, marginTop:4}}>Practical Leadership · Workshop 5</div>
              <div style={{fontSize:12, color:"var(--color-ink-soft)", marginTop:4}}>With Henrik Vale · cohort A</div>
            </div>

            <div className="note">
              <div className="lbl">Skillset review note</div>
              <div className="body">Your case-review write-up is open for feedback. Add notes before Thursday&rsquo;s session and your facilitator will reply.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Teacher page ───────────────────────────────────────
function TeacherPage() {
  const courses = [
    { t: "Practical Leadership",   audience: "Working leads", status: "review",    statusLabel: "In review",   updated: "2 hrs ago" },
    { t: "Clinical Psychology",    audience: "Cohort B",      status: "published", statusLabel: "Published",   updated: "Yesterday" },
    { t: "Design Critique Method", audience: "Mid-career",    status: "changes",   statusLabel: "Changes",     updated: "Tue" },
    { t: "Negotiation Lab",        audience: "Founders",      status: "draft",     statusLabel: "Draft",       updated: "Mon" },
  ];
  return (
    <div className="page" data-screen-label="Platform · Teacher studio">
      <div className="page-head">
        <div>
          <span style={{fontSize:12, fontWeight:700, letterSpacing:".22em", textTransform:"uppercase", color:"var(--color-accent)"}}>Teacher studio</span>
          <h1>Your courses, in one room.</h1>
          <p>Four programs in your studio. Two are in review by Skillset. One needs changes before publish.</p>
        </div>
        <div className="actions">
          <button className="btn btn-outline btn-md">Review checklist</button>
          <button className="btn btn-solid btn-md">+ New course</button>
        </div>
      </div>

      <div className="grid-3" style={{marginBottom:18}}>
        <div className="stat-tile"><div className="l">Approved courses</div><div className="v">1</div><div className="d">Visible on Skillset</div></div>
        <div className="stat-tile"><div className="l">In review</div><div className="v">2</div><div className="d up">First decision in &lt; 48h</div></div>
        <div className="stat-tile"><div className="l">Cohort earnings · MTD</div><div className="v">$12.4k</div><div className="d up">+18% vs last month</div></div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="sub">My studio</div>
              <div className="ttl">Courses</div>
            </div>
            <button className="btn btn-outline btn-sm">Filter</button>
          </div>
          <div className="panel-body">
            <div className="pipe-row" style={{fontSize:10, fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", color:"var(--color-ink-soft)", paddingBottom:8}}>
              <span>Title</span><span>Audience</span><span>Status</span><span>Updated</span><span></span>
            </div>
            {courses.map(c => (
              <div className="pipe-row" key={c.t}>
                <div className="t">{c.t}</div>
                <div className="meta">{c.audience}</div>
                <div><span className={`status-chip ${c.status}`}>{c.statusLabel}</span></div>
                <div className="meta">{c.updated}</div>
                <div><button className="btn btn-outline btn-sm">Open</button></div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="sub">Review</div>
              <div className="ttl">From Skillset</div>
            </div>
          </div>
          <div className="panel-body">
            <div className="note" style={{marginTop:0}}>
              <div className="lbl">Design Critique Method · Changes requested</div>
              <div className="body">Lessons 3 and 4 share an outcome. Combine, or write a distinct outcome for each. Re-submit when ready.</div>
            </div>
            <div className="note">
              <div className="lbl">Practical Leadership · In review</div>
              <div className="body">Your program is in Skillset&rsquo;s queue. We aim for a first decision in 48 hours.</div>
            </div>
            <div style={{marginTop:14, display:"flex", gap:8}}>
              <button className="btn btn-solid btn-md">Open course builder</button>
              <button className="btn btn-outline btn-md">Review checklist</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Ops page ───────────────────────────────────────────
function OpsPage() {
  const queue = [
    { t: "Practical Leadership Development", by: "Henrik Vale",   s: "Submitted 2h",  status: "review",    statusLabel: "In review",  flag: false },
    { t: "Negotiation Lab",                  by: "Priya N.",      s: "Submitted 6h",  status: "review",    statusLabel: "In review",  flag: false },
    { t: "Clinical Psychology",              by: "Anaís Costa",   s: "Re-submitted",  status: "review",    statusLabel: "Re-review",  flag: false },
    { t: "Investing for Newcomers",          by: "Tomás L.",      s: "Flagged",       status: "flagged",   statusLabel: "Flagged",    flag: true },
    { t: "Product Design Foundations",       by: "Júlia Moreira", s: "Approved",      status: "approved",  statusLabel: "Approved",   flag: false },
  ];
  return (
    <div className="page" data-screen-label="Platform · Trust ops">
      <div className="page-head">
        <div>
          <span style={{fontSize:12, fontWeight:700, letterSpacing:".22em", textTransform:"uppercase", color:"var(--color-accent)"}}>Trust operations</span>
          <h1>Review queue.</h1>
          <p>Twelve programs awaiting decision. Three are flagged for re-review. Skillset publishes nothing without a yes.</p>
        </div>
        <div className="actions">
          <button className="btn btn-outline btn-md">Decision log</button>
          <button className="btn btn-solid btn-md">Take next</button>
        </div>
      </div>

      <div className="grid-3" style={{marginBottom:18}}>
        <div className="stat-tile"><div className="l">In queue</div><div className="v">12</div><div className="d">Median wait · 14 h</div></div>
        <div className="stat-tile"><div className="l">Flagged</div><div className="v" style={{color:"var(--color-accent)"}}>3</div><div className="d dn">Needs senior review</div></div>
        <div className="stat-tile"><div className="l">Decisions · this week</div><div className="v">38</div><div className="d up">+6 vs last week</div></div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <div className="sub">Queue</div>
            <div className="ttl">Programs awaiting decision</div>
          </div>
          <div style={{display:"flex", gap:8}}>
            <button className="btn btn-outline btn-sm">All teachers</button>
            <button className="btn btn-outline btn-sm">Newest first</button>
          </div>
        </div>
        <div className="panel-body">
          <div className="queue-row" style={{fontSize:10, fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", color:"var(--color-ink-soft)", paddingTop:0}}>
            <span>Program</span><span>Status</span><span>Submitted by</span><span></span>
          </div>
          {queue.map(q => (
            <div className="queue-row" key={q.t}>
              <div>
                <div className="t">{q.t}</div>
                <div className="s">{q.s}</div>
              </div>
              <div><span className={`status-chip ${q.status}`}>{q.statusLabel}</span></div>
              <div className="by">{q.by}</div>
              <div style={{display:"flex", gap:6, justifyContent:"flex-end"}}>
                {q.flag
                  ? <button className="btn btn-danger btn-sm">Review</button>
                  : <button className="btn btn-solid btn-sm">Open</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, StudentPage, TeacherPage, OpsPage, ROLE_NAV });
