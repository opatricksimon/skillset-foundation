/* Course Builder — drag-and-drop curriculum editor */

const Builder = ({ setRoute }) => {
  const D = window.SkillsetData;
  const [draft, setDraft] = useState(D.builderDraft);
  const [step, setStep] = useState('curriculum');
  const [dragMod, setDragMod] = useState(null);

  // simple module reorder by index swap (up/down arrows)
  const moveModule = (idx, dir) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= draft.modules.length) return;
    const ms = [...draft.modules];
    [ms[idx], ms[ni]] = [ms[ni], ms[idx]];
    ms.forEach((m, i) => m.n = i + 1);
    setDraft({ ...draft, modules: ms });
  };

  const addModule = () => {
    const newId = 'bm' + Date.now();
    setDraft({ ...draft, modules: [...draft.modules, { id: newId, n: draft.modules.length + 1, title: 'Untitled module', lessons: [] }] });
  };

  const renameModule = (id, val) => {
    setDraft({ ...draft, modules: draft.modules.map((m) => m.id === id ? { ...m, title: val } : m) });
  };

  const deleteLesson = (modId, lesId) => {
    setDraft({
      ...draft,
      modules: draft.modules.map((m) => m.id === modId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lesId) } : m),
    });
  };

  const addLesson = (modId) => {
    const newId = 'bl' + Date.now();
    setDraft({
      ...draft,
      modules: draft.modules.map((m) => m.id === modId ? { ...m, lessons: [...m.lessons, { id: newId, name: 'New lesson', dur: '0:00', type: 'v' }] } : m),
    });
  };

  // HTML5 drag-and-drop for module reorder
  const onDragStart = (idx) => setDragMod(idx);
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (idx) => {
    if (dragMod === null || dragMod === idx) return setDragMod(null);
    const ms = [...draft.modules];
    const [picked] = ms.splice(dragMod, 1);
    ms.splice(idx, 0, picked);
    ms.forEach((m, i) => m.n = i + 1);
    setDraft({ ...draft, modules: ms });
    setDragMod(null);
  };

  const totalLessons = draft.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const done = draft.checks.filter((c) => c.done).length;

  return (
    <div>
      {/* Header */}
      <div className="builder-h fade-in">
        <div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className="chip-mute">{draft.cat}</span>
            <span className="chip-role" style={{ color: 'var(--color-accent)' }}>{draft.status}</span>
            <span style={{ fontSize: 11, color: 'var(--color-ink-soft)' }}>· Autosaved 2s ago</span>
          </div>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            style={{
              marginTop: 14,
              border: '1px solid transparent',
              background: 'transparent',
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              lineHeight: 1.05,
              letterSpacing: '-0.005em',
              color: 'var(--color-primary)',
              padding: '4px 12px',
              borderRadius: 10,
              width: '100%',
              outline: 'none',
              transition: 'all var(--duration-base) var(--ease-standard)',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-line)'; e.target.style.background = '#fff'; }}
            onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'transparent'; }}
          />
          <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 12, color: 'var(--color-ink-soft)' }}>
            <span><strong style={{ color: 'var(--color-primary)' }}>{draft.modules.length}</strong> modules</span>
            <span><strong style={{ color: 'var(--color-primary)' }}>{totalLessons}</strong> lessons</span>
            <span>~4h 18m total</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"><Icon name="eye" size={13} /> Preview</button>
          <button className="btn btn-primary">Submit for review <Icon name="arrowR" size={13} /></button>
        </div>
      </div>

      <div className="builder-grid fade-in d1">
        {/* MAIN */}
        <div className="builder-main">
          <div className="b-step-bar">
            {[
              { id: 'details',    label: 'Details',     n: '01', done: true },
              { id: 'curriculum', label: 'Curriculum',  n: '02', done: false },
              { id: 'pricing',    label: 'Pricing',     n: '03', done: false },
              { id: 'review',     label: 'Submit',      n: '04', done: false },
            ].map((s) => (
              <button
                key={s.id}
                className={'b-step ' + (step === s.id ? 'active ' : '') + (s.done ? 'done' : '')}
                onClick={() => setStep(s.id)}
              >
                <span className="num">{s.done ? <Icon name="check" size={11} /> : s.n}</span>
                {s.label}
              </button>
            ))}
          </div>

          {step !== 'curriculum' && (
            <div style={{ padding: '40px 8px', textAlign: 'center', color: 'var(--color-ink-soft)' }}>
              <Icon name="layers" size={28} />
              <div style={{ marginTop: 14, fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-primary)' }}>
                {step === 'details' && 'Course details'}
                {step === 'pricing' && 'Pricing & packaging'}
                {step === 'review' && 'Submit for Skillset review'}
              </div>
              <div style={{ marginTop: 8, fontSize: 13 }}>
                Step preview · This is a mock. Click <strong>Curriculum</strong> to see the editor.
              </div>
            </div>
          )}

          {step === 'curriculum' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                <div>
                  <span className="eyebrow brand" style={{ fontSize: 10 }}>Step 02 of 04</span>
                  <h3 className="display-h3" style={{ marginTop: 8, fontSize: 24 }}>Build your curriculum</h3>
                  <div style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginTop: 6 }}>Drag modules to reorder · click any title to rename · ⌘+Enter to add a lesson.</div>
                </div>
              </div>

              {draft.modules.map((m, mi) => (
                <div
                  key={m.id}
                  className={'b-mod ' + (dragMod === mi ? 'dragging' : '')}
                  draggable
                  onDragStart={() => onDragStart(mi)}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(mi)}
                  onDragEnd={() => setDragMod(null)}
                >
                  <div className="b-mod-h">
                    <span className="drag"><Icon name="grip" size={14} /></span>
                    <span className="num">{m.n.toString().padStart(2, '0')}</span>
                    <input className="ttl" value={m.title} onChange={(e) => renameModule(m.id, e.target.value)} />
                    <div className="stats">
                      <span><strong>{m.lessons.length}</strong> lessons</span>
                    </div>
                    <button className="ico-act" title="Move up" onClick={() => moveModule(mi, -1)}><Icon name="chevL" size={13} /></button>
                    <button className="ico-act" title="Move down" onClick={() => moveModule(mi, 1)}><Icon name="chevR" size={13} /></button>
                    <button className="ico-act" title="Settings"><Icon name="settings" size={13} /></button>
                  </div>

                  <div className="lessons">
                    {m.lessons.map((l) => (
                      <div key={l.id} className="b-les">
                        <span className="grip"><Icon name="grip" size={12} /></span>
                        <span className={'type ' + l.type}>
                          {l.type === 'v' && <Icon name="play" size={10} />}
                          {l.type === 'q' && <Icon name="quiz" size={10} />}
                          {l.type === 't' && <Icon name="book" size={10} />}
                        </span>
                        <input
                          className="nm"
                          value={l.name}
                          onChange={(e) => {
                            setDraft({
                              ...draft,
                              modules: draft.modules.map((mm) => mm.id === m.id ? { ...mm, lessons: mm.lessons.map((ll) => ll.id === l.id ? { ...ll, name: e.target.value } : ll) } : mm),
                            });
                          }}
                          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--color-ink)', padding: '4px 0', width: '100%' }}
                        />
                        <span className="dur">{l.dur}</span>
                        <button className="del" onClick={() => deleteLesson(m.id, l.id)} title="Delete lesson"><Icon name="trash" size={13} /></button>
                      </div>
                    ))}
                    <button className="add-lesson" onClick={() => addLesson(m.id)}>
                      <Icon name="plus" size={12} /> Add lesson
                    </button>
                  </div>
                </div>
              ))}

              <button className="add-mod" onClick={addModule}>
                <Icon name="plus" size={14} /> Add module
              </button>
            </>
          )}
        </div>

        {/* SIDE */}
        <aside className="builder-side">
          <div className="review">
            <div style={{ position: 'relative' }}>
              <div className="l">Readiness for review</div>
              <div className="v">{Math.round((done / draft.checks.length) * 100)}%</div>
              <p>Skillset review controls marketplace visibility — so the platform doesn&rsquo;t turn into a noisy upload directory.</p>
              <div className="checks">
                {draft.checks.map((c, i) => (
                  <div key={i} className={'check ' + (c.done ? '' : 'todo')}>
                    <span className="mark">{c.done ? <Icon name="check" size={11} /> : null}</span>
                    {c.label}
                  </div>
                ))}
              </div>
              <div className="actions">
                <button className="btn btn-accent">Submit for review <Icon name="arrowR" size={13} /></button>
                <button className="btn btn-on-dark">Save as draft</button>
              </div>
            </div>
          </div>

          <div className="preview">
            <h4>Marketplace preview</h4>
            <div className="thumb-mock">
              <div className="chip">{draft.cat}</div>
              <div className="ttl">{draft.title}</div>
            </div>
            <div style={{ marginTop: 16, fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.65 }}>
              How your course card will appear in Discover. <strong style={{ color: 'var(--color-ink)' }}>Hero artwork</strong> uploads at 1920×1440, 4:3.
            </div>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 14 }}>
              <Icon name="pencil" size={11} /> Replace artwork
            </button>
          </div>
        </aside>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
};

window.Builder = Builder;
