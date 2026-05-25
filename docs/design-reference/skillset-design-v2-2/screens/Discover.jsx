/* Discover — marketplace homepage. Modernized hero, learning paths, courses, faculty. */

const Discover = ({ setRoute }) => {
  const D = window.SkillsetData;
  const [cat, setCat] = useState('all');

  return (
    <div>
      {/* Hero */}
      <section className="hero fade-in">
        <div className="bg" />
        <div className="bg-grid" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.84)' }}>Skillset · Premium learning marketplace</span>
          <h1>
            Learn from the best.
            <span className="row2">Become the best.</span>
          </h1>
          <p className="sub">
            A premium home for expert-led courses, professional cohorts, and the kind of communities that turn a year of effort into a credential.
          </p>
          <div className="cta-row">
            <button className="btn btn-accent btn-lg" onClick={() => setRoute('course')}>
              Explore courses <Icon name="arrowR" size={14} />
            </button>
            <button className="btn btn-on-dark btn-lg" onClick={() => setRoute('studio')}>
              Start teaching
            </button>
          </div>
          <div className="meta-row">
            <div className="stat"><div className="v">248</div><div className="l">Courses</div></div>
            <div className="stat"><div className="v">62</div><div className="l">Faculty</div></div>
            <div className="stat"><div className="v">38k</div><div className="l">Learners</div></div>
            <div className="stat"><div className="v">4.86</div><div className="l">Avg rating</div></div>
          </div>
        </div>

        <div className="live-card">
          <div className="top">
            <span className="live-dot" />
            <span className="live-lbl">Live cohort · Starts Aug 4</span>
          </div>
          <div className="ttl">Calm leadership for engineering directors</div>
          <div className="meta">8 weeks · 320 enrolled</div>
          <div className="who">
            <div className="av">AO</div>
            <div>
              <div className="nm">Ada Okonkwo</div>
              <div className="role">Director, Vercel</div>
            </div>
          </div>
        </div>

        <div className="rule" />
      </section>

      {/* Category rail */}
      <div className="rail fade-in d1">
        {D.categories.map((c) => (
          <button
            key={c.id}
            className={'cat ' + (cat === c.id ? 'active' : '')}
            onClick={() => setCat(c.id)}
          >
            {c.label} <span className="count">{c.count}</span>
          </button>
        ))}
      </div>

      {/* Learning Paths — NEW for v2 */}
      <div className="sec-head fade-in d2">
        <div>
          <span className="eyebrow">Curated paths · new in v2</span>
          <h2>Programs designed for one specific destination.</h2>
        </div>
        <div className="right">
          <button className="btn btn-ghost">See all paths <Icon name="arrowR" size={13} /></button>
        </div>
      </div>

      <div className="paths-grid fade-in d2">
        {D.paths.map((p) => (
          <div key={p.id} className="path" onClick={() => setRoute('course')}>
            <div className={'swatch ' + p.tone} />
            <div className="top">
              <div className={'glyph ' + (p.tone === 'navy' ? '' : p.tone)}>{p.glyph}</div>
              <span className="chip-mute">{p.modules} modules</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="modules">
              <span><strong>{p.hours}h</strong> &nbsp;total</span>
              <span className="sep">·</span>
              <span><strong>{p.completers}</strong> &nbsp;completers</span>
              <span className="sep">·</span>
              <span>Self-paced + 2 live sessions</span>
            </div>
          </div>
        ))}
      </div>

      {/* Featured courses */}
      <div className="sec-head fade-in d3">
        <div>
          <span className="eyebrow brand">Featured this month</span>
          <h2>Courses that change how you ship.</h2>
        </div>
        <div className="right">
          <button className="btn btn-ghost"><Icon name="grid" size={13} /> Grid</button>
          <button className="btn btn-ghost">All courses <Icon name="arrowR" size={13} /></button>
        </div>
      </div>

      <div className="courses-grid fade-in d3">
        {D.courses.slice(0, 6).map((c) => (
          <article key={c.id} className="cc" onClick={() => setRoute('course')}>
            <div className="img" style={{ background: c.bg }}>
              <div className="chip">{c.cat}</div>
              <div className="price-tag">${c.price}</div>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 80% 70%, ${c.accent}, transparent 50%)` }} />
              <div className="meta-bot">
                <span>{c.cohort}</span>
                <span>{c.duration}</span>
              </div>
            </div>
            <div className="body">
              <div className="cat">{c.cat}</div>
              <h3>{c.title}</h3>
              <div className="by">By <strong>{c.instructor}</strong> · {c.instructorRole}</div>
              <div className="foot">
                <span className="rating"><span className="stars">★</span> {c.rating} <span style={{ color: 'var(--color-ink-soft)', fontWeight: 500 }}>({c.reviews})</span></span>
                <span>{c.lessons} lessons</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Faculty */}
      <div className="sec-head fade-in d4">
        <div>
          <span className="eyebrow">Faculty</span>
          <h2>People who&rsquo;ve shipped what they teach.</h2>
        </div>
        <div className="right">
          <button className="btn btn-ghost">Meet the faculty <Icon name="arrowR" size={13} /></button>
        </div>
      </div>

      <div className="faculty fade-in d4">
        {D.faculty.map((f) => (
          <div key={f.id} className="fac">
            <div className="av">
              <div className="init">{f.init}</div>
            </div>
            <div className="region">{f.region}</div>
            <h4>{f.name}</h4>
            <div className="role">{f.role}</div>
            <div className="stats">
              <span><strong>{f.students}</strong> students</span>
              <span><strong>{f.courses}</strong> courses</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA band */}
      <section style={{
        marginTop: 64,
        padding: 40,
        borderRadius: 22,
        background: 'linear-gradient(135deg, #07172a 0%, #102944 60%, #1a365d 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-strong)',
      }}>
        <div style={{ position: 'absolute', right: -80, top: -80, width: 320, height: 320, borderRadius: 999, background: 'radial-gradient(circle, rgba(178,34,52,0.40), transparent 65%)' }} />
        <div style={{ position: 'relative', maxWidth: 640 }}>
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.86)' }}>For creators</span>
          <h2 className="display-h2" style={{ color: '#fff', marginTop: 12 }}>Build a course your audience actually finishes.</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.82)', marginTop: 16, maxWidth: 540 }}>
            Skillset review controls marketplace visibility so the platform doesn&rsquo;t turn into a noisy upload directory. Apply, build, and we&rsquo;ll promote what we believe in.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-accent btn-lg" onClick={() => setRoute('builder')}>Open the course builder</button>
            <button className="btn btn-on-dark btn-lg">Read the creator handbook</button>
          </div>
        </div>
      </section>

      <div style={{ height: 32 }} />
    </div>
  );
};

window.Discover = Discover;
