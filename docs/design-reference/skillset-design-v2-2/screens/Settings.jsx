/* Settings — multi-tab settings page */

const Settings = ({ setRoute }) => {
  const [tab, setTab] = useState('profile');
  const [prefs, setPrefs] = useState({
    productEmails: true,
    cohortEmails: true,
    marketingEmails: false,
    productPush: true,
    digestPush: false,
    twoFA: true,
    publicProfile: true,
    aiSummaries: true,
    darkMode: false,
    captions: 'en',
    timezone: 'America/Sao_Paulo',
    locale: 'pt-BR',
  });

  const flip = (k) => setPrefs({ ...prefs, [k]: !prefs[k] });

  const tabs = [
    { id: 'profile',  label: 'Profile' },
    { id: 'account',  label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'learning', label: 'Learning' },
    { id: 'privacy',  label: 'Privacy' },
    { id: 'danger',   label: 'Danger zone' },
  ];

  return (
    <div>
      <div className="fade-in" style={{ marginBottom: 28 }}>
        <span className="eyebrow">Settings</span>
        <h1 className="display-h2" style={{ marginTop: 10 }}>Your Skillset preferences.</h1>
      </div>

      <div className="settings-grid fade-in d1">
        <div className="settings-tabs">
          {tabs.map((t) => (
            <button key={t.id} className={'settings-tab ' + (tab === t.id ? 'active' : '')} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div>
          {tab === 'profile' && (
            <>
              <div className="settings-section">
                <h3>Profile</h3>
                <div className="sub">How you appear across Skillset.</div>

                <div style={{ display: 'flex', gap: 18, marginTop: 22, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ width: 80, height: 80, borderRadius: 999, background: 'linear-gradient(135deg, #2c5282, #1a365d)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, boxShadow: 'var(--shadow-avatar)' }}>M</div>
                  <div>
                    <button className="btn btn-ghost btn-sm"><Icon name="download" size={11} /> Upload new</button>
                    <button className="btn btn-ghost btn-sm" style={{ marginLeft: 6, color: 'var(--color-accent)' }}>Remove</button>
                    <div style={{ fontSize: 11, color: 'var(--color-ink-soft)', marginTop: 8 }}>JPG, PNG or WebP · max 4 MB</div>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="info">
                    <div className="name">Display name</div>
                    <div className="desc">Shown on courses, certificates, and your public profile.</div>
                  </div>
                  <input className="s-input" defaultValue="Mariana Costa" />
                </div>
                <div className="setting-row">
                  <div className="info">
                    <div className="name">Headline</div>
                    <div className="desc">One line on your public profile · 60 chars.</div>
                  </div>
                  <input className="s-input" defaultValue="Design Lead, Linear" />
                </div>
                <div className="setting-row">
                  <div className="info">
                    <div className="name">Public profile</div>
                    <div className="desc">Allow non-students to see your courses + bio at skillset.com/m/mariana.</div>
                  </div>
                  <button className={'s-toggle ' + (prefs.publicProfile ? 'on' : '')} onClick={() => flip('publicProfile')} aria-label="Toggle public profile" />
                </div>
              </div>
            </>
          )}

          {tab === 'account' && (
            <>
              <div className="settings-section">
                <h3>Account</h3>
                <div className="sub">Email, language, timezone.</div>
                <div className="setting-row">
                  <div className="info">
                    <div className="name">Email</div>
                    <div className="desc">Used for sign-in and account-critical notifications.</div>
                  </div>
                  <input className="s-input" defaultValue="mariana@costa.studio" />
                </div>
                <div className="setting-row">
                  <div className="info">
                    <div className="name">Language</div>
                    <div className="desc">UI language. Course content stays in its original language.</div>
                  </div>
                  <select className="s-input" value={prefs.locale} onChange={(e) => setPrefs({ ...prefs, locale: e.target.value })}>
                    <option value="en-US">English (US)</option>
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="es-ES">Español</option>
                    <option value="fr-FR">Français</option>
                  </select>
                </div>
                <div className="setting-row">
                  <div className="info">
                    <div className="name">Timezone</div>
                    <div className="desc">Used for cohort schedules and statements.</div>
                  </div>
                  <select className="s-input" value={prefs.timezone} onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}>
                    <option value="America/Sao_Paulo">America/São Paulo (UTC−3)</option>
                    <option value="America/New_York">America/New York (UTC−5)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Plan</h3>
                <div className="sub">You're currently on <strong style={{ color: 'var(--color-primary)' }}>Plus</strong>. Next billing on Jun 12.</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => setRoute('pricing')}>See all plans <Icon name="arrowR" size={13} /></button>
                  <button className="btn btn-ghost">Switch to annual (save 20%)</button>
                </div>
              </div>
            </>
          )}

          {tab === 'notifications' && (
            <div className="settings-section">
              <h3>Notifications</h3>
              <div className="sub">What we send you and where.</div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Product emails</div>
                  <div className="desc">New courses from instructors you follow, weekly summaries.</div>
                </div>
                <button className={'s-toggle ' + (prefs.productEmails ? 'on' : '')} onClick={() => flip('productEmails')} aria-label="Toggle" />
              </div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Cohort emails</div>
                  <div className="desc">Reminders 24 hours and 1 hour before live sessions you're enrolled in.</div>
                </div>
                <button className={'s-toggle ' + (prefs.cohortEmails ? 'on' : '')} onClick={() => flip('cohortEmails')} aria-label="Toggle" />
              </div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Marketing emails</div>
                  <div className="desc">Promotions, sales, and announcements from Skillset.</div>
                </div>
                <button className={'s-toggle ' + (prefs.marketingEmails ? 'on' : '')} onClick={() => flip('marketingEmails')} aria-label="Toggle" />
              </div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Push: Product activity</div>
                  <div className="desc">Replies to your community posts, instructor messages.</div>
                </div>
                <button className={'s-toggle ' + (prefs.productPush ? 'on' : '')} onClick={() => flip('productPush')} aria-label="Toggle" />
              </div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Push: Daily learning digest</div>
                  <div className="desc">A 6 PM nudge with your unfinished lesson of the day.</div>
                </div>
                <button className={'s-toggle ' + (prefs.digestPush ? 'on' : '')} onClick={() => flip('digestPush')} aria-label="Toggle" />
              </div>
            </div>
          )}

          {tab === 'security' && (
            <>
              <div className="settings-section">
                <h3>Security</h3>
                <div className="sub">Sign-in, devices, and account protection.</div>
                <div className="setting-row">
                  <div className="info">
                    <div className="name">Two-factor authentication</div>
                    <div className="desc">Recommended. Required on Plus and above.</div>
                  </div>
                  <button className={'s-toggle ' + (prefs.twoFA ? 'on' : '')} onClick={() => flip('twoFA')} aria-label="Toggle" />
                </div>
                <div className="setting-row">
                  <div className="info">
                    <div className="name">Password</div>
                    <div className="desc">Last changed 4 months ago.</div>
                  </div>
                  <button className="btn btn-ghost btn-sm">Change password</button>
                </div>
                <div className="setting-row">
                  <div className="info">
                    <div className="name">Active sessions</div>
                    <div className="desc">3 devices · Macbook Pro · iPhone 17 · Studio iPad.</div>
                  </div>
                  <button className="btn btn-ghost btn-sm">Manage</button>
                </div>
              </div>
              <div className="settings-section">
                <h3>Connected accounts</h3>
                <div className="sub">Sign in faster with your Google or Apple account.</div>
                <div className="setting-row">
                  <div className="info">
                    <div className="name">Google</div>
                    <div className="desc">mariana@costa.studio · connected May 2024</div>
                  </div>
                  <button className="btn btn-ghost btn-sm">Disconnect</button>
                </div>
                <div className="setting-row">
                  <div className="info">
                    <div className="name">Apple</div>
                    <div className="desc">Not connected.</div>
                  </div>
                  <button className="btn btn-ghost btn-sm">Connect</button>
                </div>
              </div>
            </>
          )}

          {tab === 'learning' && (
            <div className="settings-section">
              <h3>Learning preferences</h3>
              <div className="sub">How videos and lessons behave.</div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">AI summaries</div>
                  <div className="desc">Auto-generate a 3-bullet recap at the end of each lesson.</div>
                </div>
                <button className={'s-toggle ' + (prefs.aiSummaries ? 'on' : '')} onClick={() => flip('aiSummaries')} aria-label="Toggle" />
              </div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Captions</div>
                  <div className="desc">Auto-show captions when available.</div>
                </div>
                <select className="s-input" value={prefs.captions} onChange={(e) => setPrefs({ ...prefs, captions: e.target.value })}>
                  <option value="off">Off</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Default playback speed</div>
                  <div className="desc">1× is the default. Lessons remember per-course overrides.</div>
                </div>
                <select className="s-input" defaultValue="1.25">
                  <option>0.75×</option><option>1×</option><option>1.25×</option><option>1.5×</option><option>2×</option>
                </select>
              </div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Dark mode</div>
                  <div className="desc">Use the system theme. Currently <strong>light</strong>.</div>
                </div>
                <button className={'s-toggle ' + (prefs.darkMode ? 'on' : '')} onClick={() => flip('darkMode')} aria-label="Toggle" />
              </div>
            </div>
          )}

          {tab === 'privacy' && (
            <div className="settings-section">
              <h3>Privacy</h3>
              <div className="sub">Control how Skillset uses your activity.</div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Personalized recommendations</div>
                  <div className="desc">Course suggestions on Discover based on what you've enrolled in.</div>
                </div>
                <button className="s-toggle on" aria-label="Toggle" />
              </div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Show on instructor leaderboards</div>
                  <div className="desc">Top completers per course (anonymous handle only).</div>
                </div>
                <button className="s-toggle" aria-label="Toggle" />
              </div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Export your data</div>
                  <div className="desc">Download notes, certificates, and account history as JSON.</div>
                </div>
                <button className="btn btn-ghost btn-sm"><Icon name="download" size={11} /> Request export</button>
              </div>
            </div>
          )}

          {tab === 'danger' && (
            <div className="settings-section" style={{ borderColor: 'rgba(178,34,52,0.30)' }}>
              <h3 style={{ color: 'var(--color-accent)' }}>Danger zone</h3>
              <div className="sub">These actions are permanent.</div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Pause account</div>
                  <div className="desc">Hide your courses from the marketplace temporarily. Existing students keep access.</div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-accent)', borderColor: 'rgba(178,34,52,0.30)' }}>Pause</button>
              </div>
              <div className="setting-row">
                <div className="info">
                  <div className="name">Delete account</div>
                  <div className="desc">All data is removed in 30 days. Courses become unavailable to students who haven't completed them.</div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-accent)', borderColor: 'rgba(178,34,52,0.30)' }}>Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
};

window.Settings = Settings;
