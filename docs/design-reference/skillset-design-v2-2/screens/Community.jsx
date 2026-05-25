/* Community — slack-like rooms per course, with plan-gating */

const Community = ({ setRoute }) => {
  const [room, setRoom] = useState('design-systems');
  const [draft, setDraft] = useState('');

  const rooms = [
    {
      group: 'Courses you\u2019re in',
      items: [
        { id: 'design-systems',   nm: 'design-systems',   count: 1240, locked: false, hot: true },
        { id: 'pricing-packaging', nm: 'pricing-packaging', count: 412,  locked: false },
        { id: 'editing-craft',     nm: 'editing-craft',     count: 198,  locked: false },
      ]
    },
    {
      group: 'Open communities',
      items: [
        { id: 'general',     nm: 'general',     count: 5820, locked: false },
        { id: 'show-tell',   nm: 'show-and-tell', count: 1820, locked: false },
        { id: 'jobs',        nm: 'jobs',        count: 612,  locked: false },
        { id: 'feedback',    nm: 'feedback',    count: 320,  locked: false },
      ]
    },
    {
      group: 'Cohort rooms · Plus+',
      items: [
        { id: 'cohort-aug',  nm: 'cohort-aug-leadership', count: 320, locked: false },
        { id: 'creators-circle', nm: 'creators-circle', count: 218, locked: true },
        { id: 'pro-mastermind', nm: 'pro-mastermind', count: 84,  locked: true },
      ]
    },
  ];

  const posts = {
    'design-systems': [
      {
        av: 'M', tone: 'navy', nm: 'Mariana Costa', when: 'pinned · 2 weeks ago', pinned: true,
        body: '📌 Welcome. This room is for the people taking Design Systems at scale. Drop your work-in-progress, your questions, and the systems you\u2019re reverse-engineering. I\u2019m here Tuesdays + Thursdays 14–16 BRT.',
        reacts: { like: 142, fire: 38, eyes: 12 }
      },
      {
        av: 'S', tone: 'red', nm: 'Sara K.', when: '12 min ago',
        body: 'Question on module 3 — when you rebuilt Linear\u2019s primitives, did you ever split <code>Button</code> into <code>Button</code> + <code>IconButton</code>, or keep them as one with a variant prop? Curious about the API trade-offs.',
        reacts: { like: 18, eyes: 6 }
      },
      {
        av: 'I', tone: 'green', nm: 'Idris O.', when: '34 min ago',
        body: 'Wins from this week: rewrote our entire color palette using the <code>raw → semantic</code> pattern from module 2. Engineers stopped asking what <code>--color-blue-700</code> meant within a day. Massive.',
        reacts: { like: 64, fire: 22 }
      },
      {
        av: 'L', tone: 'warm', nm: 'Lena F.', when: '1 hour ago',
        body: 'Office hours on Thursday — could we cover <strong>color modes that aren\u2019t dark mode</strong>? Specifically brand-on-brand and high-contrast surfaces.',
        reacts: { like: 28, eyes: 14 }
      },
    ],
  };

  const currentPosts = posts[room] || posts['design-systems'];
  const currentRoom = rooms.flatMap(r => r.items).find(r => r.id === room);

  return (
    <div>
      <div className="fade-in" style={{ marginBottom: 24 }}>
        <span className="eyebrow brand">Communities</span>
        <h1 className="display-h2" style={{ marginTop: 10 }}>Conversations, with the people who shipped what you\u2019re learning.</h1>
        <p className="lede" style={{ marginTop: 12, fontSize: 14 }}>
          Per-course rooms, weekly office hours, and the kind of working directory you can actually use.
        </p>
      </div>

      <div className="com-grid fade-in d1">
        {/* LEFT — rooms */}
        <aside>
          <div className="com-rooms">
            {rooms.map((g, gi) => (
              <div key={gi}>
                <div className="group-label">{g.group}</div>
                {g.items.map((r) => (
                  <button
                    key={r.id}
                    className={'com-room ' + (room === r.id ? 'active ' : '') + (r.locked ? 'locked' : '')}
                    onClick={() => !r.locked && setRoom(r.id)}
                  >
                    <span className="hash">#</span>
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.nm}</span>
                    {r.locked
                      ? <span className="lock">🔒</span>
                      : <span className="count">{r.count > 999 ? (r.count/1000).toFixed(1) + 'k' : r.count}</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="com-upgrade">
            <div className="l">Unlock Cohort rooms</div>
            <h4>Pro mastermind &amp; private cohorts</h4>
            <p>Upgrade to Plus or Pro to join private cohort rooms with the instructor every Tuesday and Thursday.</p>
            <button className="btn btn-accent btn-sm" onClick={() => setRoute('pricing')}>See plans <Icon name="arrowR" size={11} /></button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="com-main">
          <div className="head">
            <div>
              <h3>#{currentRoom?.nm}</h3>
              <div className="sub">For the {currentRoom?.count?.toLocaleString()} people in this room.</div>
            </div>
            <div className="meta">
              <span className="who">
                <span className="pip">M</span>
                <span className="pip" style={{ background: 'linear-gradient(135deg, #b22234, #6e0e1c)' }}>S</span>
                <span className="pip" style={{ background: 'linear-gradient(135deg, #1f8a5b, #115d3c)' }}>I</span>
                <span className="pip" style={{ background: 'linear-gradient(135deg, #c07b0a, #6f4806)' }}>L</span>
              </span>
              <span style={{ fontWeight: 600 }}>{currentRoom?.count?.toLocaleString()} members</span>
            </div>
          </div>

          {currentPosts.map((p, i) => (
            <div key={i} className="post">
              <div className="top">
                <div className={'av ' + (p.tone || '')}>{p.av}</div>
                <div className="who-info">
                  <div className="nm">{p.nm}</div>
                  <div className="when">{p.when}</div>
                </div>
                {p.pinned && <div className="pin">Pinned</div>}
              </div>
              <div className="body" dangerouslySetInnerHTML={{ __html: p.body }} />
              <div className="react">
                {p.reacts.like != null && (
                  <button className={i === 0 ? 'liked' : ''}>
                    <Icon name="heart" size={11} /> <span className="count">{p.reacts.like}</span>
                  </button>
                )}
                {p.reacts.fire != null && (
                  <button>🔥 <span className="count">{p.reacts.fire}</span></button>
                )}
                {p.reacts.eyes != null && (
                  <button>👀 <span className="count">{p.reacts.eyes}</span></button>
                )}
                <button><Icon name="note" size={11} /> Reply</button>
              </div>
            </div>
          ))}

          <div className="composer-row">
            <input
              placeholder={`Post in #${currentRoom?.nm}…`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setDraft(''); }}
            />
            <button className="btn btn-primary btn-sm" onClick={() => setDraft('')}>
              <Icon name="send" size={13} /> Send
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
};

window.Community = Community;
