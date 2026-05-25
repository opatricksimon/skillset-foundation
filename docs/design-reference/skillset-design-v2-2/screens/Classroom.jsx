/* Classroom — active lesson view with curriculum + AI study companion. */

const Classroom = () => {
  const D = window.SkillsetData;
  const [playing, setPlaying] = useState(true);
  const [activeLesson, setActiveLesson] = useState({ m: 2, l: 2 });
  const [chat, setChat] = useState(D.aiChat);
  const [draft, setDraft] = useState('');

  const sendMsg = (txt) => {
    const t = (txt || draft).trim();
    if (!t) return;
    const next = [...chat, { from: 'usr', text: t }];
    setChat(next);
    setDraft('');
    // simulated bot reply
    setTimeout(() => {
      setChat((c) => [...c, { from: 'bot', text: 'Good question. Mariana touches on this around 09:12 — I can jump there, or summarize in two lines. What helps?' }]);
    }, 600);
  };

  return (
    <div>
      {/* Header strip */}
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 22, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0, flex: '1 1 380px' }}>
          <span className="eyebrow brand">Classroom · Module 2 · Lesson 2</span>
          <h1 className="display-h2" style={{ marginTop: 10, fontSize: 'clamp(26px, 3vw, 38px)' }}>{D.classroom.courseTitle}</h1>
          <div style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span>With <strong style={{ color: 'var(--color-ink)' }}>{D.classroom.instructor}</strong></span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>{D.classroom.progress}% complete</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button className="btn btn-ghost"><Icon name="bookmark" size={13} /> Bookmark</button>
          <button className="btn btn-ghost"><Icon name="download" size={13} /> Resources</button>
        </div>
      </div>

      <div className="cr-grid fade-in d1">
        {/* LEFT — curriculum */}
        <aside className="curriculum">
          <h4>Curriculum</h4>
          <div className="progress-row">
            <div className="bar"><div className="fill" style={{ width: D.classroom.progress + '%' }} /></div>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{D.classroom.progress}%</span>
          </div>

          {D.syllabus.map((m) => (
            <div className="mod" key={m.n}>
              <div className="mt">Module {m.n} · {m.title}</div>
              {m.lessons.map((l, i) => {
                const lessonNum = i + 1;
                const isActive = m.n === activeLesson.m && lessonNum === activeLesson.l;
                const isDone = (m.n < activeLesson.m) || (m.n === activeLesson.m && lessonNum < activeLesson.l);
                return (
                  <div
                    key={i}
                    className={'les ' + (isActive ? 'active ' : '') + (isDone ? 'done' : '')}
                    onClick={() => setActiveLesson({ m: m.n, l: lessonNum })}
                  >
                    <div className="ck">{isDone ? <Icon name="check" size={11} /> : isActive ? <Icon name="play" size={9} /> : null}</div>
                    <div className="nm">{l.name}</div>
                    <div className="dur">{l.dur}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </aside>

        {/* CENTER — player + notes */}
        <div className="classroom-main">
          <div className="player">
            <div className="vid" />
            <div className="top-meta">
              <span className="chip">Live · 12 watching</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>1080p · HDR</span>
            </div>
            <div className="lesson-title">
              <div className="et">{D.classroom.activeLessonEyebrow}</div>
              <h3>{D.classroom.activeLessonTitle}</h3>
            </div>
            <div className="center-play">
              <button className="btn-play" onClick={() => setPlaying(!playing)}>
                {playing ? (
                  <span className="pause-bars"><span /><span /></span>
                ) : (
                  <span className="triangle" />
                )}
              </button>
            </div>
            <div className="controls">
              <button onClick={() => setPlaying(!playing)} title={playing ? 'Pause' : 'Play'}>
                {playing ? <Icon name="pause" size={13} /> : <Icon name="play" size={13} />}
              </button>
              <button><Icon name="backward" size={13} /></button>
              <button><Icon name="forward" size={13} /></button>
              <div className="time">{D.classroom.duration.current}</div>
              <div className="scrub"><div className="fill" style={{ width: D.classroom.scrubPct + '%' }} /></div>
              <div className="time">{D.classroom.duration.total}</div>
              <button>1×</button>
            </div>
          </div>

          {/* lesson actions */}
          <div className="lesson-actions">
            <span className="label">Lesson tools</span>
            <button className="btn btn-ghost btn-sm"><Icon name="note" size={12} /> Take a note</button>
            <button className="btn btn-ghost btn-sm"><Icon name="bookmark" size={12} /> Bookmark moment</button>
            <button className="btn btn-ghost btn-sm"><Icon name="file" size={12} /> Transcript</button>
            <button className="btn btn-ghost btn-sm"><Icon name="flag" size={12} /> Report issue</button>
            <button className="btn btn-primary btn-sm">Mark complete <Icon name="check" size={12} /></button>
          </div>

          {/* notes */}
          <div className="notes-card">
            <div className="head">
              <h4>Your notes for this lesson</h4>
              <button className="btn btn-ghost btn-sm"><Icon name="plus" size={11} /> Add note</button>
            </div>
            <div className="body">
              {D.notes.map((n, i) => (
                <p key={i}>
                  <span className="timestamp">{n.ts}</span>
                  {n.body}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — AI Study Companion (NEW for v2) */}
        <aside className="ai-panel">
          <div className="ph">
            <div className="ai-mark">Ai</div>
            <div>
              <div className="pt">Study companion</div>
              <div className="ps">Trained on this lesson</div>
            </div>
            <span className="live" title="Online" />
          </div>

          <div className="chat">
            {chat.map((m, i) => (
              <div key={i} className={'msg ' + m.from}>
                <div className="bub">{m.text}</div>
              </div>
            ))}
          </div>

          <div className="suggest">
            {D.aiSuggest.map((s, i) => (
              <button key={i} onClick={() => sendMsg(s)}>{s}</button>
            ))}
          </div>

          <div className="composer">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMsg(); }}
              placeholder="Ask anything about this lesson…"
            />
            <button onClick={() => sendMsg()} title="Send"><Icon name="send" size={14} /></button>
          </div>
        </aside>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
};

window.Classroom = Classroom;
