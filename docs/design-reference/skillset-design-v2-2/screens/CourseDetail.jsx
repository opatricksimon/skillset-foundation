/* Course Detail — Design Systems at scale */

const CourseDetail = ({ setRoute }) => {
  const D = window.SkillsetData;
  const [tab, setTab] = useState('curriculum');
  const [openMod, setOpenMod] = useState(2);

  return (
    <div>
      {/* Title strip */}
      <div className="fade-in" style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
        <span className="chip-mute">Design</span>
        <span className="chip-mute">Self-paced</span>
        <span style={{ color: 'var(--color-ink-soft)', fontSize: 13 }}>· Last updated April 2026</span>
      </div>

      <h1 className="display-h1 fade-in" style={{ fontSize: 'clamp(38px, 5vw, 60px)' }}>Design Systems at scale</h1>
      <p className="lede fade-in d1" style={{ marginTop: 16 }}>
        Build a system that teams can actually ship against. Tokens, primitives, governance, and the rituals that keep adoption high in year two and three.
      </p>

      <div className="cd-grid fade-in d2" style={{ marginTop: 32 }}>
        {/* MAIN */}
        <div>
          {/* Hero video */}
          <div className="cd-hero">
            <div className="bg" />
            <div className="accent" />
            <div className="chip-row">
              <div className="chip">Course trailer</div>
              <div className="chip" style={{ color: 'var(--color-primary)' }}>2:14</div>
            </div>
            <div className="play">
              <button className="play-btn"><span className="triangle" /></button>
            </div>
            <div className="meta">
              <div className="preview">Sample · Module 1 · Lesson 1</div>
              <div className="title">Why systems fail before they ship</div>
            </div>
          </div>

          {/* Meta strip */}
          <div className="cd-meta">
            <div className="item"><div className="l">Rating</div><div className="v"><span className="stars">★</span>4.9 (412)</div></div>
            <div className="item"><div className="l">Duration</div><div className="v">6h 24m</div></div>
            <div className="item"><div className="l">Lessons</div><div className="v">38 total</div></div>
            <div className="item"><div className="l">Level</div><div className="v">Intermediate</div></div>
            <div className="item"><div className="l">Language</div><div className="v">English · PT-BR captions</div></div>
            <div className="item"><div className="l">Certificate</div><div className="v">Yes · Verified</div></div>
          </div>

          {/* Tabs */}
          <div className="cd-tabs">
            {['curriculum', 'about', 'instructor', 'reviews'].map((t) => (
              <button key={t} className={'cd-tab ' + (tab === t ? 'active' : '')} onClick={() => setTab(t)}>
                {t === 'curriculum' && 'Curriculum'}
                {t === 'about' && 'About'}
                {t === 'instructor' && 'Instructor'}
                {t === 'reviews' && 'Reviews (412)'}
              </button>
            ))}
          </div>

          {tab === 'curriculum' && (
            <div style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 13, color: 'var(--color-ink-soft)' }}>
                  <strong style={{ color: 'var(--color-primary)' }}>5 modules · 38 lessons · 6h 24m</strong>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setOpenMod(openMod === 'all' ? null : 'all')}>
                  {openMod === 'all' ? 'Collapse all' : 'Expand all'}
                </button>
              </div>
              {D.syllabus.map((m) => {
                const isOpen = openMod === 'all' || openMod === m.n;
                return (
                  <div key={m.n} className={'module ' + (isOpen ? 'open' : '')}>
                    <button className="module-head" onClick={() => setOpenMod(isOpen ? null : m.n)}>
                      <div className="num">{m.n.toString().padStart(2, '0')}</div>
                      <div className="ttl">{m.title}</div>
                      <div className="meta">{m.meta}</div>
                      <div className="caret"><Icon name="chevR" size={16} /></div>
                    </button>
                    <div className="lessons">
                      {m.lessons.map((l, i) => (
                        <div key={i} className="lesson">
                          <div className="ic">
                            <Icon name={l.type === 'quiz' ? 'quiz' : l.type === 'reading' ? 'book' : 'play'} size={12} />
                          </div>
                          <div className="nm">{l.name}</div>
                          {l.preview && <div className="preview-mark">Preview</div>}
                          <div className="dur">{l.dur}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'about' && (
            <div style={{ marginTop: 22, fontSize: 15, lineHeight: 1.8, color: 'var(--color-ink)' }}>
              <p>This course is what I wish someone had handed me three years ago — before I rebuilt the Linear design system twice. It&rsquo;s the entire arc, from the very first conversation with engineering about why this is worth doing, through the unglamorous middle (governance), and into the part that nobody writes about: keeping adoption alive in year two.</p>
              <h3 className="display-h3" style={{ marginTop: 32 }}>What you&rsquo;ll walk away with</h3>
              <ul style={{ marginTop: 16, paddingLeft: 18, color: 'var(--color-ink-soft)', lineHeight: 1.9 }}>
                <li>A two-tier token architecture (raw → semantic) you can ship to your team next week.</li>
                <li>The contribution model that turned Linear&rsquo;s system into something engineers wanted to add to.</li>
                <li>A version-bumping playbook that won&rsquo;t break consuming teams.</li>
                <li>Templates for office hours, RFCs, and the &ldquo;why are we doing this&rdquo; doc for execs.</li>
              </ul>
              <h3 className="display-h3" style={{ marginTop: 32 }}>This is for you if</h3>
              <ul style={{ marginTop: 16, paddingLeft: 18, color: 'var(--color-ink-soft)', lineHeight: 1.9 }}>
                <li>You&rsquo;re the first design-systems hire and the brief is &ldquo;figure it out.&rdquo;</li>
                <li>Your existing system has 200+ components and nobody uses half of them.</li>
                <li>You&rsquo;re an engineer being asked to maintain a system you didn&rsquo;t build.</li>
              </ul>
            </div>
          )}

          {tab === 'instructor' && (
            <div className="instr-card" style={{ marginTop: 22 }}>
              <div className="av">M</div>
              <div>
                <h4>Mariana Costa</h4>
                <div className="role">Design Lead · Linear</div>
                <p>
                  Mariana led the rebuild of Linear&rsquo;s design system from a handful of components into the foundation 280 engineers ship against. Before Linear she worked on internal tools at Stripe, and ran her own studio in São Paulo for six years. She&rsquo;s the one you call when adoption is the actual problem.
                </p>
                <div style={{ display: 'flex', gap: 24, marginTop: 16, fontSize: 12, color: 'var(--color-ink-soft)' }}>
                  <span><strong style={{ color: 'var(--color-ink)' }}>4,820</strong> students</span>
                  <span><strong style={{ color: 'var(--color-ink)' }}>4.92</strong> avg rating</span>
                  <span><strong style={{ color: 'var(--color-ink)' }}>3</strong> courses on Skillset</span>
                </div>
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div style={{ marginTop: 22, display: 'grid', gap: 14 }}>
              {[
                { name: 'Sara K.', role: 'Senior Designer · Notion', stars: 5, text: 'I&rsquo;ve taken three design systems courses. This is the one that talks about the boring middle parts — governance, version bumps, getting engineers to care. That&rsquo;s where I actually needed help.' },
                { name: 'Idris O.', role: 'Staff Engineer · Vercel', stars: 5, text: 'The two-tier token model finally clicked. We rewrote our tokens.css on the flight home.' },
                { name: 'Lena F.', role: 'Design Lead · independent', stars: 4, text: 'Excellent material. Would have liked another module on color modes specifically — but Mariana&rsquo;s slack is unbelievably responsive.' },
              ].map((r, i) => (
                <div key={i} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-ink)' }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-ink-soft)', marginTop: 2 }}>{r.role}</div>
                    </div>
                    <div style={{ color: 'var(--color-warning)', fontSize: 14, letterSpacing: 2 }}>{'★'.repeat(r.stars)}</div>
                  </div>
                  <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.7, color: 'var(--color-ink-soft)' }} dangerouslySetInnerHTML={{ __html: r.text }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SIDE — enrollment */}
        <aside>
          <div className="enroll">
            <div className="eyebrow brand" style={{ fontSize: 10 }}>Self-paced course</div>
            <div className="price" style={{ marginTop: 8 }}>
              $249<small>USD</small>
              <span className="strike">$320</span>
            </div>
            <div className="save-chip"><Icon name="bolt" size={11} /> Save $71 · until July 1</div>

            <div className="actions">
              <button className="btn btn-primary btn-lg" onClick={() => setRoute('classroom')}>
                Enroll now <Icon name="arrowR" size={14} />
              </button>
              <button className="btn btn-ghost"><Icon name="play" size={12} /> Preview lesson 1</button>
            </div>

            <div className="incl">
              <div className="row"><span className="ic"><Icon name="video" size={12} /></span> 38 video lessons · 6h 24m</div>
              <div className="row"><span className="ic"><Icon name="file" size={12} /></span> 12 downloadable templates</div>
              <div className="row"><span className="ic"><Icon name="users" size={12} /></span> Private Slack with cohort</div>
              <div className="row"><span className="ic"><Icon name="award" size={12} /></span> Verified certificate of completion</div>
              <div className="row"><span className="ic"><Icon name="clock" size={12} /></span> Lifetime access</div>
            </div>

            <div className="fine">
              <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>14-day money-back</span> — no questions.
            </div>
          </div>

          {/* Instructor mini */}
          <div className="card" style={{ marginTop: 20, padding: 20 }}>
            <div className="eyebrow brand" style={{ fontSize: 10 }}>Your instructor</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #2c5282, #1a365d)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24 }}>M</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, color: 'var(--color-primary)' }}>Mariana Costa</div>
                <div style={{ fontSize: 12, color: 'var(--color-ink-soft)', marginTop: 2 }}>Design Lead · Linear</div>
              </div>
            </div>
            <button className="btn btn-ghost" style={{ width: '100%', marginTop: 14 }}>View profile <Icon name="arrowR" size={13} /></button>
          </div>
        </aside>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
};

window.CourseDetail = CourseDetail;
