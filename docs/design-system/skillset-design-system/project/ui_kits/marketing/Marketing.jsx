/* global React */
const { useState, useEffect, useRef } = React;

// ─── Header ─────────────────────────────────────────────
function Caret() {
  return (
    <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

function LearnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
    </svg>
  );
}
function TeachIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 22h8M12 18v4"/>
    </svg>
  );
}

function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setSigninOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "")} data-screen-label="Marketing · Site header">
      <div className="inner">
        <a href="index.html" className="site-logo" aria-label="Skillset home">
          <img src="../../assets/skillset-logo.png" alt="Skillset" style={{height:22, width:"auto"}}/>
        </a>
        <nav className="links" aria-label="Primary">
          <button><span>Programs</span><Caret/></button>
          <button><span>Faculty</span><Caret/></button>
          <a href="#pricing">Pricing</a>
          <a href="#browse">Browse a course</a>
          <a href="#help">Help</a>
        </nav>
        <div className="actions" ref={ref}>
          <div className="signin-wrapper">
            <button
              className={"btn-signin" + (signinOpen ? " open" : "")}
              onClick={() => setSigninOpen(o => !o)}
              aria-haspopup="menu" aria-expanded={signinOpen}>
              Sign in <Caret/>
            </button>
            {signinOpen && (
              <div className="signin-dropdown" role="menu">
                <a href="../platform/index.html?role=student">
                  <span className="ic"><LearnIcon/></span>
                  <span className="body">
                    Access my learning
                    <span className="sub">Continue your enrolled programs</span>
                  </span>
                </a>
                <a href="../platform/index.html?role=teacher">
                  <span className="ic"><TeachIcon/></span>
                  <span className="body">
                    Manage my teaching
                    <span className="sub">Open Teacher Studio</span>
                  </span>
                </a>
              </div>
            )}
          </div>
          <a className="btn-cta-hero" href="auth.html">Get started free</a>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ──────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero" data-screen-label="Marketing · Hero">
      <div className="gradient"/>
      <div className="radials"/>
      <div className="container">
        <span className="pill-hero">International professional learning</span>
        <h1>
          Skillset is being built.
          <span className="row2">Watch this space.</span>
        </h1>
        <p className="sub">
          Skillset is an international platform of professional courses and live programs.
          Independent experts publish full courses with structured learning, a course community,
          live sessions, and verifiable credentials &mdash; reviewed before they go live so every program holds up.
        </p>
        <div className="cta-row">
          <a className="btn btn-solid-light btn-lg" href="auth.html">Get started free</a>
          <a className="btn btn-outline-light btn-lg" href="auth.html?intent=teach">Become a teacher</a>
        </div>
        <div className="stats">
          <div className="stat"><div className="v">42</div><div className="l">Programs in review</div></div>
          <div className="stat"><div className="v">6</div><div className="l">Faculty regions</div></div>
          <div className="stat"><div className="v">100%</div><div className="l">Approved before publish</div></div>
        </div>
      </div>
      <div className="rule"/>
    </section>
  );
}

// ─── Course card ───────────────────────────────────────
function CourseCard({ course }) {
  return (
    <article className="course-card surface-card">
      <div className="image">
        <span className="accent-chip chip">{course.status}</span>
      </div>
      <div className="body">
        <div className="meta">
          <span className="cat">{course.category}</span>
          <span className="dur">{course.duration}</span>
        </div>
        <h3 className="title">{course.title}</h3>
        <p className="desc">{course.desc}</p>
        <div className="price">
          <span className="p">{course.price}</span>
          <span className="s">{course.priceNote}</span>
        </div>
        <div className="cta-row">
          <a className="btn btn-solid btn-md" href="#">View program</a>
          <a className="btn btn-outline btn-md" href="#">Save for later</a>
        </div>
      </div>
    </article>
  );
}

function CoursesSection() {
  const list = [
    { category:"Psychology",       duration:"1.5–3 years", title:"Clinical Psychology",   status:"Opening soon",
      desc:"A career-oriented program for learners pursuing structured clinical practice. Live cohorts open quarterly with reviewed faculty.",
      price:"$2,400 / cohort", priceNote:"Includes live sessions, community access, and the Skillset Verified credential."
    },
    { category:"Management",       duration:"12 weeks",    title:"Practical Leadership",  status:"Faculty review",
      desc:"For team leads stepping into broader management. Live workshops, mentor reviews, and a community of peers from 6 regions.",
      price:"$890 / program",   priceNote:"Includes weekly live sessions and a Skillset Verified credential."
    },
    { category:"Design",           duration:"10 weeks",    title:"Product Design Foundations", status:"Opening soon",
      desc:"For new product designers who want a serious, reviewed foundation. Includes critique sessions and a portfolio review.",
      price:"$650 / program",   priceNote:"Includes guided critique and a verifiable certificate."
    },
  ];
  return (
    <section id="courses" className="std" data-screen-label="Marketing · Courses">
      <div className="container">
        <div className="section-head">
          <div style={{maxWidth:"44rem"}}>
            <span className="eyebrow accent">Programs</span>
            <h2>Full courses, reviewed before publish.</h2>
          </div>
          <p>Every Skillset program is reviewed by our faculty team. Pricing is set by the teacher and visible on the program page.</p>
        </div>
        <div className="cards-grid">{list.map(c => <CourseCard key={c.title} course={c}/>)}</div>
      </div>
    </section>
  );
}

// ─── Instructor card ──────────────────────────────────
function InstructorCard({ p }) {
  return (
    <a className="instructor-card" href="#">
      <div className="image"></div>
      <div className="body">
        <div className="region">{p.region}</div>
        <div className="name">{p.name}</div>
        <div className="focus">{p.focus}</div>
        <p className="bio">{p.bio}</p>
      </div>
    </a>
  );
}

function InstructorsSection() {
  const list = [
    { region:"São Paulo, BR", name:"Anaís Costa",  focus:"Clinical Psychology",
      bio:"Twenty years of clinical practice translated into a structured, peer-reviewed program for working professionals." },
    { region:"London, UK",     name:"Henrik Vale",  focus:"Practical Leadership",
      bio:"Former operations director building the kind of management program he wishes he had at 27." },
    { region:"Lisbon, PT",     name:"Júlia Moreira",focus:"Product Design",
      bio:"Designer turned mentor running critique-heavy cohorts of new product designers." },
  ];
  return (
    <section id="instructors" className="std" style={{background:"linear-gradient(180deg,#fbfdff 0%, #f5f8fc 100%)"}}
             data-screen-label="Marketing · Instructors">
      <div className="container">
        <div className="section-head">
          <div style={{maxWidth:"40rem"}}>
            <span className="eyebrow accent">Faculty</span>
            <h2>Independent experts. Reviewed work.</h2>
          </div>
          <p>Teachers retain ownership of their program. Skillset reviews each course for clarity, outcomes, and integrity before it goes live.</p>
        </div>
        <div className="cards-grid">{list.map(p => <InstructorCard key={p.name} p={p}/>)}</div>
      </div>
    </section>
  );
}

// ─── Two paths band ───────────────────────────────────
function PathsBand() {
  return (
    <section id="about" className="std" data-screen-label="Marketing · Two paths">
      <div className="container" style={{display:"grid", gap:20, gridTemplateColumns:"1fr"}}>
        <div className="section-head">
          <div style={{maxWidth:"40rem"}}>
            <span className="eyebrow accent">Two ways in</span>
            <h2>Built for learners. Built for teachers.</h2>
          </div>
          <p>Skillset works as a learning platform and as a creator platform. Pick a path &mdash; or use both.</p>
        </div>
        <div style={{display:"grid", gap:16, gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
          <article className="plain-card" style={{padding:24}}>
            <div className="eyebrow brand">For learners</div>
            <h3 className="display" style={{fontSize:28, margin:"10px 0 0", color:"var(--color-primary)"}}>Pick a program. Show up.</h3>
            <p style={{color:"var(--color-ink-soft)", fontSize:14, lineHeight:1.7, margin:"12px 0"}}>
              Full courses with live sessions, structured modules, a course community, and a verifiable credential at the end.
            </p>
            <a className="btn btn-solid btn-md" href="auth.html">Browse programs</a>
          </article>
          <article className="plain-card" style={{padding:24}}>
            <div className="eyebrow accent">For teachers</div>
            <h3 className="display" style={{fontSize:28, margin:"10px 0 0", color:"var(--color-primary)"}}>Publish a program of your own.</h3>
            <p style={{color:"var(--color-ink-soft)", fontSize:14, lineHeight:1.7, margin:"12px 0"}}>
              Build a course in Teacher Studio. Skillset reviews each program for clarity and outcomes before it goes live.
            </p>
            <a className="btn btn-solid btn-md" href="auth.html?intent=teach">Apply to teach</a>
          </article>
        </div>
      </div>
    </section>
  );
}

// ─── Waitlist CTA ─────────────────────────────────────
function WaitlistBand() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="access" className="std" data-screen-label="Marketing · Waitlist">
      <div className="container">
        <div className="cta-band">
          <div className="grid">
            <div>
              <span className="eyebrow white">Early access</span>
              <h2>Join the waitlist.</h2>
              <p>We open new programs in small cohorts. Drop your email and we&rsquo;ll tell you when the next one opens.</p>
            </div>
            <form className="row" onSubmit={(e)=>{e.preventDefault(); setSubmitted(true);}}>
              <input
                type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{flex:"1 1 240px", padding:"12px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,.22)",
                        background:"rgba(255,255,255,.08)", color:"#fff", fontSize:14, outline:"none"}}
              />
              <button className="btn btn-solid-light btn-lg" type="submit">{submitted ? "On the list" : "Notify me"}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────
function SiteFooter() {
  return (
    <footer className="site-footer" data-screen-label="Marketing · Footer">
      <div className="container">
        <div className="panel">
          <div className="top">
            <div>
              <img src="../../assets/skillset-logo.png" alt="Skillset" style={{height:24, width:"auto"}}/>
              <p style={{fontSize:13, lineHeight:1.7, color:"var(--color-ink-soft)", margin:"14px 0 0", maxWidth:"22rem"}}>
                Independent experts publishing full courses, reviewed before publish. Live sessions, structured progress, verifiable credentials.
              </p>
            </div>
            <div className="cols">
              <div>
                <div className="col-title">Learn</div>
                <div className="col-links">
                  <a>Programs</a><a>Faculty</a><a>Community</a><a>Credentials</a>
                </div>
              </div>
              <div>
                <div className="col-title">Teach</div>
                <div className="col-links">
                  <a>Apply</a><a>Studio</a><a>Review process</a><a>Pricing</a>
                </div>
              </div>
              <div>
                <div className="col-title">Skillset</div>
                <div className="col-links">
                  <a>About</a><a>Trust</a><a>Careers</a><a>Press</a>
                </div>
              </div>
              <div>
                <div className="col-title">Support</div>
                <div className="col-links">
                  <a>Help</a><a>Status</a><a>Contact</a><a>Legal</a>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom">
            © 2026 Skillset. All programs are reviewed by our faculty team before they go live.
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Access dropdown (overlay) ────────────────────────
function AccessOverlay({ open, onClose }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{position:"fixed", inset:0, background:"rgba(15,39,68,.55)", zIndex:60, display:"grid", placeItems:"center", padding:20}}>
      <div onClick={e=>e.stopPropagation()}
           style={{width:"min(640px, 100%)", background:"#fff", borderRadius:18, border:"1px solid var(--color-line)",
                   boxShadow:"var(--shadow-strong)", padding:24}}>
        <div className="eyebrow accent">Get started</div>
        <h3 className="display" style={{fontSize:28, margin:"8px 0 0", color:"var(--color-primary)"}}>Pick your path.</h3>
        <p style={{fontSize:13, lineHeight:1.7, color:"var(--color-ink-soft)", margin:"10px 0 16px"}}>
          Skillset runs as a learning platform and as a creator platform. Choose one for now &mdash; you can do the other later.
        </p>
        <div className="paths">
          <div className="access-path">
            <div className="eyebrow brand">Learn</div>
            <h3>Browse programs</h3>
            <p>Reviewed full courses with live sessions, a course community, and a credential.</p>
            <div className="stack">
              <a className="btn btn-solid btn-md" href="#">Browse programs</a>
              <a className="btn btn-outline btn-sm" href="#">I have an invite code</a>
            </div>
          </div>
          <div className="access-path">
            <div className="eyebrow accent">Teach</div>
            <h3>Apply to teach</h3>
            <p>Open a Teacher Studio account and submit a program for review.</p>
            <div className="stack">
              <a className="btn btn-solid btn-md" href="#">Open Studio</a>
              <a className="btn btn-outline btn-sm" href="#">How review works</a>
            </div>
          </div>
        </div>
        <div style={{display:"flex", justifyContent:"flex-end", marginTop:16}}>
          <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  SiteHeader, Hero, CoursesSection, InstructorsSection, PathsBand, WaitlistBand, SiteFooter, AccessOverlay
});
