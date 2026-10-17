import { motion } from 'motion/react';
import { T } from '../data.js';
import { CountUp, Icon, itemVariants, PageHead, Stagger } from '../ui.jsx';
import { useMotion } from '../motion';

const BARS = [96, 94, 97, 88, 82, 91, 95, 93, 79, 86, 92, 90];
const MIX = [
  ['Shift', '₹1.21 Cr', '42%', '#4285F4'],
  ['Talent', '₹0.74 Cr', '26%', '#34A853'],
  ['Payroll', '₹0.57 Cr', '20%', '#FBBC04'],
  ['Pro + Flex', '₹0.32 Cr', '12%', '#EA4335'],
];

export default function Dashboard({ s }) {
  const m = useMotion();
  const kpis = [
    ['Open requests', '128', '+14 since 9 am', 'liveops', 'var(--muted)'],
    ['Fill rate', s.range === 'Today' ? '91.4%' : '93.8%', '−2.1 pts vs target', 'liveops', 'var(--danger)'],
    ['No-shows', '7', '2.1% · 5 auto-replaced', 'liveops', 'var(--muted)'],
    ['Placements MTD', '342', '+18% vs Sep', 'reqs', 'var(--ok-text)'],
    ['Revenue MTD', '₹2.84 Cr', '+11% vs Sep', 'billing', 'var(--ok-text)'],
    ['Payroll headcount', '6,410', '3 below min wage', 'payroll', 'var(--danger)'],
    ['New sign-ups · 7d', '2,915', '38% via referrals', 'growth', 'var(--ok-text)'],
    ['On-time payouts', '98.6%', '12 failed today', 'payroll', 'var(--warn-text)'],
  ];

  const att = [];
  const bad = s.shifts.filter(x => x.sev === 'bad');
  if (bad.length)
    att.push({ icon: 'sensors', title: bad.length + ' shifts need action now', sub: bad.map(x => x.id + ' ' + x.status.replace('noshow', 'no-show')).join(' · '), cta: 'Live board', to: 'liveops', t: 'bad' });
  if (s.kyc.length)
    att.push({ icon: 'verified_user', title: s.kyc.length + ' verifications waiting', sub: 'Face mismatch, BGV vendor delay, duplicate profile, under-18', cta: 'Review', to: 'verification', t: 'warn' });
  if (s.wageBlock)
    att.push({ icon: 'gavel', title: 'Payroll blocked: minimum wage', sub: 'Prestige Group · 3 employees below state minimum', cta: 'Fix', to: 'payroll', t: 'bad' });
  att.push({ icon: 'credit_card_off', title: 'Toit Brewpub is over its credit limit', sub: '108% used · new bookings held', cta: 'Billing', to: 'billing', t: 'warn' });
  if (s.tix.some(x => x.id === 'GR-0091'))
    att.push({ icon: 'shield_person', title: 'Anonymous safety grievance', sub: 'Response due in 1 h 10 m', cta: 'Support', to: 'support', t: 'bad' });

  return (
    <div className="stack g24">
      <PageHead
        eyebrow="A1 · Dashboard"
        title="Good afternoon, Asha"
        lead={`${s.city} · ${s.range} · Autopilot filled 64% of shifts with no manual touch`}
      />

      <Stagger className="kpis">
        {kpis.map(([label, value, delta, to, dfg]) => (
          <motion.button
            key={label}
            type="button"
            className="kpi"
            variants={itemVariants}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => s.setScreen(to)}
          >
            <span className="small muted">{label}</span>
            <span className="v"><CountUp value={value} key={value} /></span>
            <span className="xs" style={{ fontWeight: 500, color: dfg }}>{delta}</span>
          </motion.button>
        ))}
      </Stagger>

      <div className="two-col">
        <div className="card">
          <div className="row between" style={{ alignItems: 'baseline' }}>
            <h2 className="h2">Fill rate by start hour</h2>
            <span className="xs muted">Target 95%</span>
          </div>
          <div className="chart">
            <div className="target" style={{ bottom: Math.round(((95 - 50) / 50) * 142) + 20 + 'px' }} />
            {BARS.map((v, i) => (
              <div className="bar-col" key={i}>
                <motion.div
                  className="bar"
                  title={v + '%'}
                  style={{ height: Math.round(((v - 50) / 50) * 142), background: v < 85 ? '#EA4335' : 'var(--brand)' }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ ...m.spatial('slow'), delay: 0.15 + m.stagger(i) }}
                />
                <span style={{ fontSize: 11 }} className="muted">{(6 + i * 1.5) | 0}</span>
              </div>
            ))}
          </div>
          <div className="row g16 xs muted" style={{ marginTop: 14 }}>
            <span className="row g6"><span className="legend-dot" style={{ background: 'var(--brand)' }} />At or near target</span>
            <span className="row g6"><span className="legend-dot" style={{ background: '#EA4335' }} />Below 85%</span>
          </div>
        </div>

        <div className="card stack g14">
          <h2 className="h2">Revenue mix · month to date</h2>
          <div className="mixbar">
            {MIX.map(([l, , w, c], i) => (
              <motion.div
                key={l}
                style={{ background: c, width: w, transformOrigin: 'left center' }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ ...m.spatial('slow'), delay: 0.2 + m.stagger(i) }}
              />
            ))}
          </div>
          {MIX.map(([l, v, w, c]) => (
            <div key={l} className="row g10" style={{ fontSize: 14 }}>
              <span className="legend-dot" style={{ background: c }} />
              <span style={{ flex: 1 }}>{l}</span>
              <span className="muted">{v} · {w}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="h2" style={{ marginBottom: 4 }}>Needs a person</h2>
        <p className="small muted" style={{ margin: '0 0 12px' }}>
          Exceptions Autopilot and the fraud rules escalated. Everything else is running.
        </p>
        <Stagger className="list">
          {att.map(a => (
            <motion.button
              key={a.title}
              type="button"
              variants={itemVariants}
              className="list-row click-row"
              style={{ padding: '14px 18px', flexWrap: 'nowrap' }}
              onClick={() => s.setScreen(a.to)}
            >
              <div className="icon-circle" style={{ background: T[a.t][0], color: T[a.t][1] }}><Icon name={a.icon} /></div>
              <div className="stack g4" style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{a.title}</span>
                <span className="small muted">{a.sub}</span>
              </div>
              <span className="small" style={{ color: 'var(--primary)', fontWeight: 500 }}>{a.cta}</span>
              <Icon name="chevron_right" className="muted" />
            </motion.button>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
