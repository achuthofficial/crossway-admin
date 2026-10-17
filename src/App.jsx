import { AnimatePresence, motion } from 'motion/react';
import { NAV, ROLES } from './data.js';
import { useCommand } from './store.js';
import { Icon } from './ui.jsx';
import Modals from './components/Modals.jsx';
import EdgeDrawer, { EDGE_COUNT } from './components/EdgeDrawer.jsx';
import Dashboard from './screens/Dashboard.jsx';
import LiveOps from './screens/LiveOps.jsx';
import Requisitions from './screens/Requisitions.jsx';
import Candidates from './screens/Candidates.jsx';
import Verification from './screens/Verification.jsx';
import Attendance from './screens/Attendance.jsx';
import { Billing, Compliance, Growth, Payroll } from './screens/Finance.jsx';
import { Config, Fraud, Support } from './screens/Ops.jsx';

const SCREENS = {
  dashboard: Dashboard, liveops: LiveOps, reqs: Requisitions, candidates: Candidates, verification: Verification,
  attendance: Attendance, billing: Billing, payroll: Payroll, growth: Growth, fraud: Fraud, compliance: Compliance,
  support: Support, config: Config,
};

function Sidebar({ s }) {
  const badges = {
    liveops: s.shifts.filter(x => x.sev === 'bad').length,
    verification: s.kyc.length,
    attendance: s.ts.filter(x => x.sev === 'bad' || x.sev === 'warn').length,
    payroll: s.pay.filter(x => x.sev === 'bad').length,
    fraud: s.flags.length,
    support: s.tix.filter(x => x.sev === 'bad').length,
  };
  return (
    <>
      <AnimatePresence>
        {s.navOpen && <motion.div className="nav-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => s.setNavOpen(false)} />}
      </AnimatePresence>
      <aside className={'sidebar' + (s.navOpen ? ' open' : '')}>
        <div className="brand">
          <motion.div className="brand-mark" whileHover={{ rotate: -8, scale: 1.05 }}><Icon name="alt_route" size={22} /></motion.div>
          <div className="brand-text"><b>CrossWay</b><small>Command</small></div>
        </div>
        {NAV.map(([id, label, icon]) => {
          const active = id === s.screen;
          const ok = s.roleObj.s.includes(id);
          return (
            <button
              key={id}
              type="button"
              className={'nav-item' + (active ? ' active' : '') + (ok ? '' : ' locked')}
              onClick={() => s.setScreen(id)}
              aria-current={active ? 'page' : undefined}
            >
              {active && <motion.span layoutId="nav-pill" className="pill" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              <Icon name={icon} />
              <span className="label">{label}</span>
              {!ok && <Icon name="lock" size={16} />}
              {ok && !!badges[id] && (
                <motion.span key={badges[id]} className="badge" initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  {badges[id]}
                </motion.span>
              )}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <div className="me-card">
          <div className="me-row">
            <div className="avatar">AN</div>
            <div><span style={{ fontSize: 14, fontWeight: 500 }}>Asha Nair</span><small>MFA verified · Bengaluru</small></div>
          </div>
          <label className="field-label" htmlFor="role">Viewing as role</label>
          <select id="role" className="select" value={s.role} onChange={e => s.setRole(e.target.value)}>
            {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </div>
      </aside>
    </>
  );
}

function Topbar({ s }) {
  return (
    <header className="topbar">
      <button type="button" className="icon-btn menu-btn" aria-label="Open menu" onClick={() => s.setNavOpen(true)}><Icon name="menu" /></button>
      <div className="search">
        <Icon name="search" />
        <input
          value={s.q}
          aria-label="Search"
          onChange={e => { s.setQ(e.target.value); if (e.target.value) s.setScreen('candidates'); }}
          placeholder="Search candidates, clients, shifts, invoices"
        />
        <AnimatePresence>
          {s.q && (
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} type="button" className="icon-btn" style={{ width: 28, height: 28 }} aria-label="Clear" onClick={() => s.setQ('')}>
              <Icon name="close" size={18} />
            </motion.button>
          )}
        </AnimatePresence>
        <Icon name="auto_awesome" style={{ color: 'var(--primary)' }} />
      </div>
      <select className="select city-select" value={s.city} onChange={e => s.setCity(e.target.value)} aria-label="City">
        <option value="Bengaluru">Bengaluru · Live</option>
        <option value="Mysuru">Mysuru · Phase 3</option>
        <option value="Hyderabad">Hyderabad · Phase 3</option>
      </select>
      <div className="row g6">
        {['Today', '7 days', '30 days'].map(l => (
          <button key={l} type="button" className={'chip' + (s.range === l ? ' on' : '')} onClick={() => s.setRange(l)}>
            {s.range === l && <Icon name="check" />}{l}
          </button>
        ))}
      </div>
      <div className="spacer" />
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" className="btn btn-tonal" style={{ padding: '0 16px 0 12px' }} onClick={() => s.setEdgeOpen(true)}>
        <Icon name="rule" />Edge cases · {EDGE_COUNT}
      </motion.button>
    </header>
  );
}

const EmptyState = ({ icon, tone, title, body, actions }) => (
  <motion.div className="stack g12" style={{ maxWidth: 560, padding: '48px 0' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <motion.div
      className="icon-circle"
      style={{ width: 56, height: 56, borderRadius: 28, background: tone[0], color: tone[1] }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 16, delay: 0.1 }}
    >
      <Icon name={icon} size={28} />
    </motion.div>
    <h1 className="h1" style={{ marginTop: 8 }}>{title}</h1>
    <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{body}</p>
    <div className="row g8" style={{ marginTop: 8 }}>{actions}</div>
  </motion.div>
);

export default function App() {
  const s = useCommand();
  const cityDark = s.city !== 'Bengaluru';
  const allowed = s.roleObj.s.includes(s.screen);
  const label = (NAV.find(n => n[0] === s.screen) || [])[1];
  const Screen = SCREENS[s.screen];

  let body;
  if (cityDark)
    body = (
      <EmptyState
        key="city"
        icon="location_off"
        tone={['#E9EEF6', '#444746']}
        title={`${s.city} isn't live yet`}
        body={`Bengaluru is the launch city. New cities open after the MVP proves fill rate and repeat clients. Partner and franchise leads for ${s.city} are tracked in Growth.`}
        actions={<button type="button" className="btn btn-filled" onClick={() => s.setCity('Bengaluru')}>Switch to Bengaluru</button>}
      />
    );
  else if (!allowed)
    body = (
      <EmptyState
        key="denied"
        icon="lock"
        tone={['#F9DEDC', '#410E0B']}
        title={`You don't have access to ${label}`}
        body={`The ${s.roleObj.label} role can't open this module. Access requests go to the Super Admin and are written to the audit log.`}
        actions={
          <>
            <button type="button" className="btn btn-filled" onClick={() => { s.log('Requested access to ' + label, 'RBAC'); s.say('Request sent to Super Admin.'); }}>
              Request access
            </button>
            <button type="button" className="btn btn-outline" onClick={() => s.setScreen(s.roleObj.s[0])}>Back to dashboard</button>
          </>
        }
      />
    );
  else body = <Screen s={s} />;

  return (
    <div className="shell">
      <Sidebar s={s} />
      <main className="main">
        <Topbar s={s} />
        <section className="panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.screen + (cityDark ? '-city' : '') + (allowed ? '' : '-denied')}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {body}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <Modals s={s} />
      <EdgeDrawer s={s} />
      <AnimatePresence>
        {s.toast && (
          <motion.div
            key={s.toast.key}
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.1 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          >
            <Icon name="check_circle" />{s.toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
