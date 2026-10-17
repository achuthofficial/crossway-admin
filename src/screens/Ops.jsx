import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ROLES } from '../data.js';
import { Act, Icon, itemVariants, PageHead, Stagger, Tag } from '../ui.jsx';
import { IconMorph, useMotion } from '../motion';

/* ---------------- Fraud ---------------- */
export function Fraud({ s }) {
  const m = useMotion();
  const [decided, setDecided] = useState({}); // id -> 'hold' | 'clear' while the icon morph plays
  // The flag icon morphs into the decision (gavel or check) inline, then the card leaves.
  const decide = (f, hold) => {
    setDecided(d => ({ ...d, [f.id]: hold ? 'hold' : 'clear' }));
    setTimeout(() => {
      s.removeFlag(f.id);
      s.log(f.type + (hold ? ': hold confirmed by reviewer' : ': cleared by reviewer'), f.entity);
      s.say(hold ? 'Hold confirmed. Worker told why and how to appeal.' : 'Flag cleared. Payout released.');
    }, m.reduced ? 0 : 420);
  };
  return (
    <div className="stack g20">
      <PageHead eyebrow="A20 · Fraud and quality" title="Flags for review" lead="Rules flag; people decide. A payout hold is always a human decision." />
      {!s.flags.length && (
        <motion.div className="banner ok" style={{ padding: 32, fontSize: 16, borderRadius: 16 }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <Icon name="verified" />No open flags.
        </motion.div>
      )}
      <motion.div className="fill-grid" layout>
        <AnimatePresence>
          {s.flags.map(f => (
            <motion.div
              key={f.id}
              layout
              className="card pad16 stack g10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: m.effects('fast') }}
            >
              <div className="row g10">
                <div
                  className="icon-circle"
                  style={decided[f.id] === 'clear' ? { background: 'var(--ok-bg)', color: 'var(--ok-fg)' } : { background: 'var(--bad-bg)', color: 'var(--bad-fg)' }}
                >
                  <IconMorph icon={decided[f.id] === 'hold' ? 'gavel' : decided[f.id] === 'clear' ? 'check' : f.icon} />
                </div>
                <div className="stack"><span style={{ fontSize: 15, fontWeight: 500 }}>{f.type}</span><span className="xs muted">{f.src}</span></div>
              </div>
              <span style={{ fontSize: 14 }}>{f.entity}</span>
              <span className="small muted" style={{ lineHeight: 1.45 }}>{f.evidence}</span>
              <div className="row wrap g6">
                <Act kind="d" disabled={!!decided[f.id]} label={f.type === 'Referral ring' ? 'Hold rewards' : 'Hold payout'} on={() => decide(f, true)} />
                <Act disabled={!!decided[f.id]} label="Clear flag" on={() => decide(f, false)} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ---------------- Support ---------------- */
export function Support({ s }) {
  const open = t => {
    if (t.act === 'Assign officer') {
      s.patchTix(t.id, { act: 'Open', status: 'Assigned', sev: 'warn', sla: 'Officer Meera assigned · call-back in 30 min', sfg: 'var(--warn-text)' });
      s.log('Assigned Grievance Officer', t.id);
      s.say('Grievance Officer assigned. Reporter identity stays hidden.');
    } else s.say('Opened ' + t.id + '.');
  };
  return (
    <div className="stack g20">
      <PageHead eyebrow="A16 · Support desk" title="Tickets and grievances" />
      <Stagger className="list">
        {s.tix.map(t => (
          <motion.div key={t.id} variants={itemVariants} className="list-row" style={{ padding: '14px 18px' }}>
            <Icon name={t.icon} style={{ color: t.ic }} />
            <div className="stack" style={{ flex: '2 1 280px', gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{t.subject}</span>
              <span className="muted" style={{ fontSize: 12.5 }}>{t.id} · {t.from}</span>
            </div>
            <span className="small" style={{ flex: '1 1 160px', color: t.sfg, fontWeight: 500 }}>{t.sla}</span>
            <Tag sev={t.sev} lg>{t.status}</Tag>
            <Act label={t.act} on={() => open(t)} />
          </motion.div>
        ))}
      </Stagger>
    </div>
  );
}

/* ---------------- Config ---------------- */
const PC = ['Live ops', 'Candidates', 'Verify', 'Billing', 'Payroll', 'Payouts', 'Config'];
const PM = { super: '1111111', city: '1111110', ops: '1100000', recruiter: '0110000', finance: '0001110', support: '0100000' };
const MIN = 620;
const BILL = 850;

export function Config({ s }) {
  const [ratePay, setRatePay] = useState('560');
  const rp = parseInt(ratePay, 10);
  const bad = !(rp >= MIN) || rp >= BILL;
  const msg = isNaN(rp)
    ? 'Enter a number.'
    : rp < MIN
      ? `₹${rp} is below the state minimum of ₹${MIN} for this category. Can't save.`
      : rp >= BILL
        ? "Worker pay can't equal or exceed the client bill rate."
        : `Above the state minimum of ₹${MIN}.`;
  const margin = isNaN(rp) ? '—' : Math.round(((BILL - rp) / BILL) * 100) + '%';

  return (
    <div className="stack g24" style={{ maxWidth: 960 }}>
      <PageHead eyebrow="A21 · Configuration" title="Rate cards" lead="Worker pay is checked against the state minimum-wage table maintained by Compliance." />
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, alignItems: 'end' }}>
        <div className="stack g6"><label className="field-label">Role · state</label><div className="readonly">Housekeeping · Karnataka</div></div>
        <div className="stack g6">
          <label className="field-label" htmlFor="rate" style={{ color: bad ? 'var(--danger)' : undefined }}>Worker pay per 8-h day (₹)</label>
          <motion.input
            id="rate"
            className={'input' + (bad ? ' bad' : '')}
            value={ratePay}
            inputMode="numeric"
            onChange={e => setRatePay(e.target.value.replace(/\D/g, ''))}
            animate={bad ? { x: [0, -4, 4, -2, 0] } : { x: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          />
        </div>
        <div className="stack g6"><label className="field-label">Client bill rate (₹)</label><div className="readonly">{BILL} · margin {margin}</div></div>
        <div className="row g8 small" style={{ gridColumn: '1/-1', color: bad ? 'var(--danger)' : 'var(--ok-text)' }}>
          <Icon name={bad ? 'error' : 'check_circle'} size={18} />{msg}
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            className="btn btn-filled"
            disabled={bad}
            onClick={() => {
              s.log('Updated rate card: Housekeeping KA ₹' + rp, 'Config');
              s.say('Rate card saved. Applies to new bookings only.');
            }}
          >
            Save rate card
          </motion.button>
        </div>
      </div>

      <div>
        <h2 className="h2" style={{ marginBottom: 12 }}>Roles and permissions</h2>
        <div className="table-wrap">
          <table className="tbl" style={{ fontSize: 13, minWidth: 720 }}>
            <thead><tr><th>Role</th>{PC.map(c => <th key={c} style={{ padding: '12px 8px' }}>{c}</th>)}</tr></thead>
            <tbody>
              {ROLES.map(r => (
                <tr key={r.id} style={r.id === s.role ? { background: 'var(--primary-softer)' } : undefined}>
                  <td style={{ fontWeight: 500 }}>{r.label}</td>
                  {PM[r.id].split('').map((c, i) => (
                    <td key={i} style={{ padding: '10px 8px' }}>
                      <Icon name={c === '1' ? 'check' : 'remove'} size={18} style={{ color: c === '1' ? 'var(--ok-text)' : 'var(--line)' }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
