/* Payouts — bank accounts, balance, withdraw modal, statements */

const Payouts = () => {
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState('3840.00');
  const [destBank, setDestBank] = useState('chase');

  const statements = [
    { date: 'May 16 2026', desc: 'Weekly payout · May 9–15',  amount: 4280.42, status: 'paid',    method: 'Chase •• 4118' },
    { date: 'May 09 2026', desc: 'Weekly payout · May 2–8',   amount: 3960.10, status: 'paid',    method: 'Chase •• 4118' },
    { date: 'May 02 2026', desc: 'Weekly payout · Apr 25–May 1', amount: 5120.88, status: 'paid', method: 'Chase •• 4118' },
    { date: 'Apr 25 2026', desc: 'Early withdrawal · Same-day wire', amount: 1850.00, status: 'paid', method: 'Wise •• 9024' },
    { date: 'Apr 18 2026', desc: 'Weekly payout · Apr 11–17', amount: 3210.55, status: 'paid',    method: 'Chase •• 4118' },
    { date: 'Apr 11 2026', desc: 'Weekly payout · Apr 4–10',  amount: 2840.10, status: 'paid',    method: 'Chase •• 4118' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <span className="eyebrow">Payouts &amp; tax</span>
          <h1 className="display-h2" style={{ marginTop: 10 }}>Your earnings, your bank.</h1>
          <p className="lede" style={{ marginTop: 12, fontSize: 14 }}>
            Skillset wires every Friday. You can also pull money any day with same-day or instant transfer.
          </p>
        </div>
        <button className="btn btn-ghost"><Icon name="download" size={13} /> Download 1099</button>
      </div>

      <div className="payout-grid fade-in d1">
        {/* Balance card */}
        <div className="payout-balance">
          <div className="l">Available to withdraw</div>
          <div className="v">$3,840.00</div>
          <div className="sub">Next scheduled wire · Friday, May 30</div>

          <div className="progress-row">
            <div className="row"><span>Pending settlement (T+2)</span><strong>$1,420.10</strong></div>
            <div className="row"><span>In transit</span><strong>$0.00</strong></div>
            <div className="row"><span>Reserves (refund window)</span><strong>$280.00</strong></div>
          </div>

          <div className="actions">
            <button className="btn btn-accent btn-lg" onClick={() => setModal(true)}>
              <Icon name="download" size={13} /> Withdraw now
            </button>
            <button className="btn btn-on-dark btn-lg">Schedule a transfer</button>
          </div>
        </div>

        {/* Bank accounts */}
        <div>
          <div className="bank-card">
            <div className="head">
              <h3>Bank accounts</h3>
              <span style={{ fontSize: 11, color: 'var(--color-ink-soft)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>2 connected</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--color-ink-soft)', marginTop: 8 }}>
              Money lands here on payout day. We never store your full account number — only the routing + last 4.
            </p>

            <div className="bank-row primary">
              <div className="logo chase">CHASE</div>
              <div className="info">
                <div className="nm">Chase Business <span className="tag">Primary</span></div>
                <div className="mask">•• •• 4118 · ACH wire · USD</div>
              </div>
              <div className="acts">
                <button title="Edit"><Icon name="pencil" size={12} /></button>
                <button title="More"><Icon name="settings" size={12} /></button>
              </div>
            </div>

            <div className="bank-row">
              <div className="logo wise">WISE</div>
              <div className="info">
                <div className="nm">Wise multi-currency</div>
                <div className="mask">•• •• 9024 · Instant · USD / EUR / BRL</div>
              </div>
              <div className="acts">
                <button title="Make primary"><Icon name="check" size={12} /></button>
                <button title="More"><Icon name="settings" size={12} /></button>
              </div>
            </div>

            <button className="add-bank">
              <Icon name="plus" size={13} /> Connect a bank
            </button>
          </div>
        </div>
      </div>

      {/* Statements */}
      <div className="sec-head fade-in d2" style={{ marginTop: 48 }}>
        <div>
          <span className="eyebrow brand">Statements</span>
          <h2>Recent payouts.</h2>
        </div>
        <div className="right">
          <button className="btn btn-ghost btn-sm">Export CSV</button>
          <button className="btn btn-ghost btn-sm">All statements <Icon name="arrowR" size={11} /></button>
        </div>
      </div>

      <div className="statements fade-in d2">
        <div className="row head">
          <div>Date</div>
          <div>Description</div>
          <div>Method</div>
          <div style={{ textAlign: 'right' }}>Amount</div>
          <div></div>
        </div>
        {statements.map((s, i) => (
          <div key={i} className="row">
            <div className="date">{s.date}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{s.desc}</div>
              <div style={{ marginTop: 4 }}>
                <span className={'status ' + (s.status === 'pending' ? 'pending' : '')}>
                  <Icon name={s.status === 'paid' ? 'check' : 'clock'} size={9} />
                  {s.status}
                </span>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-ink-soft)', fontFamily: 'var(--font-num)', fontVariantNumeric: 'tabular-nums' }}>{s.method}</div>
            <div className="amount" style={{ textAlign: 'right' }}>+${s.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--color-ink-muted)', cursor: 'pointer', padding: 6 }} title="Download receipt">
              <Icon name="download" size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Tax band */}
      <div className="fade-in d3" style={{
        marginTop: 32, padding: 24, borderRadius: 16,
        background: '#fff', border: '1px solid var(--color-line)',
        display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-surface-soft)', color: 'var(--color-primary)', display: 'grid', placeItems: 'center' }}>
          <Icon name="file" size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, color: 'var(--color-primary)' }}>Your tax forms for 2026</div>
          <div style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginTop: 4 }}>
            1099-K filed automatically. Skillset reports earnings above $600 to the IRS. Forms ready by Jan 31.
          </div>
        </div>
        <button className="btn btn-ghost">View tax center <Icon name="arrowR" size={13} /></button>
      </div>

      {/* Withdraw modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <h3>Withdraw funds</h3>
              <button onClick={() => setModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-ink-muted)', cursor: 'pointer', padding: 4 }}>
                <Icon name="plus" size={20} className="" />
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginTop: 8 }}>
              Same-day wire to your connected bank. $0.50 flat fee for instant transfers, free for next-business-day.
            </p>

            <div className="field">
              <label>Amount (USD)</label>
              <input value={'$' + amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} />
            </div>

            <div className="field">
              <label>Send to</label>
              <select value={destBank} onChange={(e) => setDestBank(e.target.value)}>
                <option value="chase">Chase Business · •• 4118 · ACH wire</option>
                <option value="wise">Wise multi-currency · •• 9024 · Instant</option>
              </select>
            </div>

            <div className="field">
              <label>Speed</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button style={{ padding: 12, fontSize: 12, fontWeight: 700, border: '1px solid var(--color-primary)', background: 'var(--color-primary)', color: '#fff', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Instant · 30s
                </button>
                <button style={{ padding: 12, fontSize: 12, fontWeight: 700, border: '1px solid var(--color-line)', background: '#fff', color: 'var(--color-primary)', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Standard · T+1
                </button>
              </div>
            </div>

            <div className="summary">
              <div className="line"><span>Amount</span><strong>${amount}</strong></div>
              <div className="line"><span>Instant fee</span><strong>$0.50</strong></div>
              <div className="line total"><span>You'll receive</span><strong>${(parseFloat(amount || 0) - 0.50).toFixed(2)}</strong></div>
            </div>

            <div className="modal-acts">
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setModal(false)}>
                Confirm withdraw <Icon name="arrowR" size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: 32 }} />
    </div>
  );
};

window.Payouts = Payouts;
