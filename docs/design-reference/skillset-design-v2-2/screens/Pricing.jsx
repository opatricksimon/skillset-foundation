/* Pricing — Start / Plus / Pro / Elite + Business (talk to sales) */

const Pricing = ({ setRoute }) => {
  const [billing, setBilling] = useState('monthly'); // monthly | annual
  const [selected, setSelected] = useState('plus');

  const plans = [
    {
      id: 'start',
      name: 'Start',
      tagline: 'Begin teaching · zero risk',
      monthly: 0, annual: 0,
      fee: '8% + $0.30',
      feeNote: 'per successful transaction',
      cta: 'Continue on Start',
      features: [
        'Publish unlimited free courses',
        'Up to 3 paid courses',
        'Skillset review (required for paid)',
        'Basic creator analytics',
        'Community access (read-only)',
        'Standard payouts · weekly wire',
      ],
      excluded: ['Custom domain', 'Cohort scheduling', 'Priority review'],
    },
    {
      id: 'plus',
      name: 'Plus',
      tagline: 'Most creators start here',
      monthly: 20, annual: 16,
      fee: '5% + $0.30',
      feeNote: 'per successful transaction',
      cta: 'Upgrade to Plus',
      popular: true,
      features: [
        'Unlimited paid courses',
        'Cohort scheduling (2 active)',
        'Full creator analytics + cohort retention',
        'Community: full read/write',
        'Custom landing pages',
        'Priority review queue · 48h SLA',
      ],
      excluded: ['White-label certificates'],
    },
    {
      id: 'pro',
      name: 'Pro',
      tagline: 'For serious educators',
      monthly: 100, annual: 80,
      fee: '3% + $0.20',
      feeNote: 'per successful transaction',
      cta: 'Upgrade to Pro',
      features: [
        'Everything in Plus, plus:',
        'Unlimited cohorts · live sessions',
        'White-label certificates',
        'Affiliate program · 30% revshare',
        'Custom domain · skillset-hosted',
        'Dedicated success manager',
      ],
      excluded: ['Team seats', 'API access'],
    },
    {
      id: 'elite',
      name: 'Elite',
      tagline: 'Studios & published authors',
      monthly: 200, annual: 160,
      fee: '1.5% + $0.10',
      feeNote: 'per successful transaction',
      cta: 'Upgrade to Elite',
      features: [
        'Everything in Pro, plus:',
        'Up to 5 team seats',
        'White-label everything (no Skillset branding on emails / certificates)',
        'API & Zapier access',
        'Programmatic enrollment',
        'Quarterly business review',
      ],
      excluded: [],
    },
  ];

  const fmt = (n) => n === 0 ? 'Free' : '$' + n;

  return (
    <div>
      {/* Header */}
      <div className="fade-in" style={{ textAlign: 'center', maxWidth: 720, margin: '8px auto 32px' }}>
        <span className="eyebrow">Plans &amp; fees</span>
        <h1 className="display-h1" style={{ marginTop: 14, fontSize: 'clamp(36px, 4.5vw, 56px)' }}>
          A plan that scales with your audience.
        </h1>
        <p className="lede" style={{ marginTop: 16, marginInline: 'auto' }}>
          Start free. As your courses earn, platform fees come down — never to zero, but always less than the value Skillset adds.
        </p>

        {/* monthly / annual toggle */}
        <div style={{ display: 'inline-flex', marginTop: 28, padding: 4, background: '#fff', border: '1px solid var(--color-line)', borderRadius: 10, boxShadow: 'var(--shadow-soft)', position: 'relative' }}>
          {['monthly', 'annual'].map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                padding: '8px 18px',
                fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                background: billing === b ? 'var(--color-primary)' : 'transparent',
                color: billing === b ? '#fff' : 'var(--color-ink-soft)',
                border: 'none', borderRadius: 8,
                cursor: 'pointer',
                transition: 'all var(--duration-base) var(--ease-standard)',
              }}
            >
              {b === 'monthly' ? 'Monthly' : 'Annual'}
              {b === 'annual' && (
                <span style={{ marginLeft: 8, fontSize: 9, padding: '2px 6px', borderRadius: 5, background: billing === 'annual' ? 'rgba(255,255,255,0.16)' : 'var(--color-success-soft)', color: billing === 'annual' ? '#fff' : 'var(--color-success)' }}>
                  −20%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plans grid */}
      <div className="pricing-grid fade-in d1">
        {plans.map((p) => {
          const price = billing === 'annual' ? p.annual : p.monthly;
          const isSel = selected === p.id;
          return (
            <div
              key={p.id}
              className={'plan-card ' + (p.popular ? 'popular ' : '') + (isSel ? 'selected' : '')}
              onClick={() => setSelected(p.id)}
            >
              {p.popular && <div className="badge">Most popular</div>}
              <div className="name">{p.name}</div>
              <div className="tagline">{p.tagline}</div>

              <div className="price-row">
                <div className="amount">
                  {fmt(price)}
                  {price > 0 && <span className="per">/ mo</span>}
                </div>
                {billing === 'annual' && price > 0 && <div className="annual-note">billed annually</div>}
              </div>

              <div className="fee-row">
                <div className="fee-l">Platform fee</div>
                <div className="fee-v">{p.fee}</div>
                <div className="fee-sub">{p.feeNote}</div>
              </div>

              <button className={'btn ' + (p.popular ? 'btn-primary' : 'btn-ghost')} style={{ width: '100%', marginTop: 18 }}>
                {p.cta}
                {p.popular && <Icon name="arrowR" size={13} />}
              </button>

              <div className="features">
                {p.features.map((f, i) => (
                  <div key={i} className="f-row">
                    <span className="check"><Icon name="check" size={11} /></span>
                    <span>{f}</span>
                  </div>
                ))}
                {p.excluded.map((f, i) => (
                  <div key={'x' + i} className="f-row x">
                    <span className="check x">×</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Business / Talk to sales */}
      <div className="biz-band fade-in d2">
        <div>
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.86)' }}>Business · custom</span>
          <h2 className="display-h2" style={{ color: '#fff', marginTop: 12 }}>
            For organizations and academies running multiple programs.
          </h2>
          <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.78)', maxWidth: 540 }}>
            Custom pricing, custom contracts, dedicated infrastructure. Platform fees are negotiable — but never zero. We work with a small number of partners we can give real attention to.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
            <button className="btn btn-accent btn-lg">Talk to a sales rep <Icon name="arrowR" size={14} /></button>
            <button className="btn btn-on-dark btn-lg">Read the Business brief</button>
          </div>
        </div>
        <div className="biz-stats">
          <div className="biz-stat">
            <div className="v">25+</div>
            <div className="l">Academies on Business</div>
          </div>
          <div className="biz-stat">
            <div className="v">$2.4M</div>
            <div className="l">Avg annual GMV</div>
          </div>
          <div className="biz-stat">
            <div className="v">24h</div>
            <div className="l">Response SLA</div>
          </div>
        </div>
      </div>

      {/* Fees explainer */}
      <div className="sec-head fade-in d3" style={{ marginTop: 56 }}>
        <div>
          <span className="eyebrow brand">How fees work</span>
          <h2>Transparent by default. Always.</h2>
        </div>
      </div>

      <div className="fade-in d3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {[
          { ic: 'bolt',    title: 'Fees only on success', body: 'Skillset only charges the platform fee when a learner successfully completes a transaction. Refunds reverse the fee, including the $0.30.' },
          { ic: 'trendUp', title: 'Fees drop as you grow', body: 'Every plan reduces the percentage AND the per-transaction floor. We never bring fees to zero — that\u2019s how we keep the platform sustainable for everyone.' },
          { ic: 'globe',   title: 'One currency, one statement', body: 'You sell in USD globally. Skillset handles VAT, sales tax, and a single monthly statement. Wires are weekly.' },
        ].map((c, i) => (
          <div key={i} className="card" style={{ padding: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-surface-soft)', color: 'var(--color-primary)', display: 'grid', placeItems: 'center' }}>
              <Icon name={c.ic} size={18} />
            </div>
            <div className="display-h3" style={{ marginTop: 16, fontSize: 22 }}>{c.title}</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-ink-soft)', marginTop: 12 }}>{c.body}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="sec-head fade-in d4" style={{ marginTop: 56 }}>
        <div>
          <span className="eyebrow">FAQ</span>
          <h2>Common questions.</h2>
        </div>
      </div>

      <div className="fade-in d4" style={{ display: 'grid', gap: 10 }}>
        {[
          { q: 'Can I change plans at any time?', a: 'Yes — upgrade instantly, downgrade at the end of your billing cycle. We prorate annual plans.' },
          { q: 'What happens to my courses if I downgrade?', a: 'Courses stay published. If you exceed your new plan\u2019s paid-course limit, additional courses become unlisted until you upgrade again — students who already enrolled keep access.' },
          { q: 'Does the fee apply to subscriptions and bundles?', a: 'Yes. The fee applies to every successful transaction Skillset processes, regardless of pricing model.' },
          { q: 'Do you offer student-pays-fees mode?', a: 'On Pro and Elite, yes — you can pass the platform fee to the learner at checkout. Plus and Start cannot pass fees on; they\u2019re always paid from the seller\u2019s share.' },
        ].map((f, i) => (
          <FAQItem key={i} q={f.q} a={f.a} />
        ))}
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
};

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={'faq-item ' + (open ? 'open' : '')}>
      <button className="faq-q" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <Icon name="chevD" size={14} />
      </button>
      {open && <div className="faq-a">{a}</div>}
    </div>
  );
};

window.Pricing = Pricing;
