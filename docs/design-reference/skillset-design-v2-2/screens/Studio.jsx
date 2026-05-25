/* Teacher Studio — creator dashboard with revenue chart, top courses, payouts. */

const Studio = ({ setRoute }) => {
  const D = window.SkillsetData;
  const [range, setRange] = useState('12m');

  // Build chart points
  const series = D.revenue.values;
  const months = D.revenue.months;
  const chartW = 640;
  const chartH = 220;
  const padL = 44, padR = 12, padT = 14, padB = 28;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;
  const min = 0;
  const max = Math.ceil(Math.max(...series) / 10000) * 10000;
  const stepX = innerW / (series.length - 1);
  const pts = series.map((v, i) => [padL + i * stepX, padT + innerH - (v / max) * innerH]);
  const linePath = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const areaPath = `${linePath} L${pts[pts.length-1][0]},${padT + innerH} L${pts[0][0]},${padT + innerH} Z`;
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((p) => padT + innerH - p * innerH);
  const labels = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round((max * p) / 1000) + 'k');

  return (
    <div>
      {/* Header */}
      <div className="studio-h fade-in">
        <div>
          <span className="eyebrow">Teacher Studio</span>
          <h1 className="display-h2" style={{ marginTop: 10 }}>Welcome back, Mariana.</h1>
          <p className="lede" style={{ marginTop: 12, fontSize: 15 }}>
            Three new students enrolled overnight. Your <strong style={{ color: 'var(--color-ink)' }}>Module 3 review</strong> is due Thursday.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"><Icon name="eye" size={13} /> Public profile</button>
          <button className="btn btn-primary" onClick={() => setRoute('builder')}>
            <Icon name="plus" size={13} /> New course
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="kpis fade-in d1">
        {D.kpis.map((k, i) => (
          <div key={i} className="kpi">
            <div className="l">{k.label}</div>
            <div className="v">{k.value}</div>
            <div className={'delta ' + (k.up ? 'up' : 'down')}>
              <Icon name={k.up ? 'trendUp' : 'trendDown'} size={12} />
              {k.delta} <span style={{ color: 'var(--color-ink-soft)', fontWeight: 500, marginLeft: 4 }}>vs prev period</span>
            </div>
            <div className="spark">
              <Sparkline
                values={k.spark}
                color={k.up ? '#1a365d' : '#b22234'}
                width={150}
                height={50}
                fillOpacity={0.16}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Top courses */}
      <div className="studio-grid fade-in d2">
        <div className="chart-card">
          <div className="h">
            <div>
              <h3>Revenue</h3>
              <div className="sub">Last 12 months · all courses</div>
            </div>
            <div className="tabs">
              {['30d', '3m', '12m', 'All'].map((r) => (
                <button key={r} className={range === r ? 'active' : ''} onClick={() => setRange(r)}>{r}</button>
              ))}
            </div>
          </div>

          <div className="canvas">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="revArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1a365d" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#1a365d" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* grid */}
              {gridLines.map((y, i) => (
                <line key={i} x1={padL} x2={chartW - padR} y1={y} y2={y} stroke="rgba(26,54,93,0.10)" strokeDasharray={i === gridLines.length - 1 ? '0' : '3 4'} />
              ))}
              {/* y labels */}
              {labels.map((lbl, i) => (
                <text key={i} x={padL - 8} y={gridLines[i] + 3} textAnchor="end" fontSize="10" fill="#7a8fae" fontFamily="Manrope" fontWeight="600">${lbl}</text>
              ))}
              {/* x labels */}
              {months.map((m, i) => (
                <text key={i} x={padL + i * stepX} y={chartH - 8} textAnchor="middle" fontSize="10" fill="#7a8fae" fontFamily="Manrope" fontWeight="600">{m}</text>
              ))}
              {/* area */}
              <path d={areaPath} fill="url(#revArea)" />
              {/* line */}
              <path d={linePath} stroke="#1a365d" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {/* points */}
              {pts.map((p, i) => (
                <g key={i}>
                  {i === pts.length - 1 && (
                    <>
                      <circle cx={p[0]} cy={p[1]} r="10" fill="rgba(178,34,52,0.18)" />
                      <circle cx={p[0]} cy={p[1]} r="5" fill="#b22234" />
                      <circle cx={p[0]} cy={p[1]} r="2" fill="#fff" />
                    </>
                  )}
                  {i !== pts.length - 1 && i % 2 === 0 && (
                    <circle cx={p[0]} cy={p[1]} r="2.5" fill="#1a365d" />
                  )}
                </g>
              ))}
              {/* callout for last point */}
              <g>
                <rect x={pts[pts.length-1][0] - 38} y={pts[pts.length-1][1] - 36} rx="6" width="76" height="24" fill="#0f2744" />
                <text x={pts[pts.length-1][0]} y={pts[pts.length-1][1] - 19} textAnchor="middle" fontSize="11" fontFamily="Manrope" fontWeight="700" fill="#fff">$48,210</text>
              </g>
            </svg>
          </div>
        </div>

        <div>
          {/* Payouts */}
          <div className="payouts">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="l">Next payout</div>
              <div className="v">$3,840</div>
              <div className="next">Wires Friday · ending in •• 4118</div>
              <div className="acts">
                <button className="btn btn-accent btn-sm">Withdraw early</button>
                <button className="btn btn-on-dark btn-sm">View statements</button>
              </div>
            </div>
          </div>

          {/* Top courses */}
          <div className="top-courses" style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Top courses</h3>
              <button className="btn btn-ghost btn-sm">All courses</button>
            </div>
            {D.studioCourses.map((c) => (
              <div key={c.id} className="item">
                <div className={'thumb ' + (c.tone === 'navy' ? '' : c.tone)}>{c.code}</div>
                <div className="info">
                  <h4>{c.title}</h4>
                  <div className="m">{c.students.toLocaleString()} students enrolled</div>
                </div>
                <div className="val">
                  <div className="a">{c.revenue}</div>
                  <div className="d">{c.delta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="sec-head fade-in d3" style={{ marginTop: 48 }}>
        <div>
          <span className="eyebrow brand">Activity</span>
          <h2>What needs your attention today.</h2>
        </div>
      </div>

      <div className="fade-in d3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { kind: 'review', title: 'Module 3 review due Thursday', sub: 'Skillset ops has flagged 2 lessons for re-shoot. Your turnaround: 4 days.', ic: 'flag', tone: 'red' },
          { kind: 'q', title: '12 student questions pending', sub: 'Average response time on Skillset is 18 hours. You\u2019re at 22h this week.', ic: 'users', tone: 'navy' },
          { kind: 'launch', title: 'Color theory · ready for review', sub: '6 of 6 modules recorded. One push from approval.', ic: 'sparkle', tone: 'green' },
        ].map((a, i) => (
          <div key={i} className="card card-hover" style={{ padding: 22, display: 'grid', gap: 12, cursor: 'pointer' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: a.tone === 'red' ? 'rgba(178,34,52,0.10)' : a.tone === 'green' ? 'rgba(31,138,91,0.10)' : 'var(--color-surface-strong)',
              color: a.tone === 'red' ? 'var(--color-accent)' : a.tone === 'green' ? 'var(--color-success)' : 'var(--color-primary)',
              display: 'grid', placeItems: 'center',
            }}>
              <Icon name={a.ic} size={18} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, lineHeight: 1.15, color: 'var(--color-primary)' }}>{a.title}</div>
            <div style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--color-ink-soft)' }}>{a.sub}</div>
            <div style={{ marginTop: 4 }}>
              <button className="btn btn-ghost btn-sm">Open <Icon name="arrowR" size={11} /></button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
};

window.Studio = Studio;
