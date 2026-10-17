import { motion } from 'motion/react';
import { NFG, T } from '../data.js';
import { Act, CountUp, Fill, Icon, itemVariants, PageHead, Stagger, Tag } from '../ui.jsx';

/* ---------------- Billing ---------------- */
const AGEING = [['0–30 days', '₹41.2 L', '#F0F4F9'], ['31–60 days', '₹6.8 L', '#FEEFC3'], ['61–90 days', '₹2.1 L', '#F9DEDC'], ['90+ days', '₹0.4 L', '#F9DEDC']];
const CREDIT = [
  ['Toit Brewpub', '₹5,00,000', '₹5,42,300', 108, 'Over limit. New bookings held until payment or limit increase.'],
  ['Ambrosia Foods', '₹2,00,000', '₹1,96,000', 98, 'REQ-2299 waiting on advance payment.'],
  ['Flipkart FC', '₹60,00,000', '₹31,20,000', 52, ''],
];
const INVOICES = [
  ['INV-26-1043', 'Taj MG Road', '₹3,84,200', 'Overdue by 6 days · reminder 2 of 3 sent', 'bad', 'Send reminder'],
  ['INV-26-1051', 'Flipkart FC', '₹18,40,000', 'Partly paid: ₹12,00,000 received, ₹6,40,000 due 30 Oct', 'warn', ''],
  ['INV-26-1055', 'Third Wave Coffee', '₹62,400', 'e-invoice IRN failed: buyer GSTIN inactive on portal', 'bad', 'Retry IRN'],
  ['INV-26-1058', 'Decathlon', '₹1,12,000', 'On hold: 1 disputed timesheet line', 'warn', ''],
  ['CN-26-0112', 'Decathlon', '−₹1,800', 'Credit note: no-show on SH-4069', 'ok', ''],
  ['INV-26-1031', 'Toit Brewpub', '₹2,10,000', '64 days outstanding', 'bad', 'Escalate'],
];

export function Billing({ s }) {
  return (
    <div className="stack g24">
      <PageHead eyebrow="A10 · Billing and invoicing" title="Billing" />
      <Stagger className="four">
        {AGEING.map(([l, v, bg]) => (
          <motion.div key={l} variants={itemVariants} className="stack g4" style={{ background: bg, borderRadius: 16, padding: '16px 18px' }}>
            <span className="small muted">{l}</span>
            <span style={{ fontSize: 26 }}><CountUp value={v} /></span>
          </motion.div>
        ))}
      </Stagger>

      <div>
        <h2 className="h2" style={{ marginBottom: 12 }}>Credit limits</h2>
        <div className="auto-grid">
          {CREDIT.map(([client, limit, used, pct, note], i) => {
            const bar = pct >= 100 ? '#B3261E' : pct >= 90 ? '#F9AB00' : '#0B57D0';
            const fg = pct >= 100 ? '#B3261E' : pct >= 90 ? '#7A5900' : '#444746';
            return (
              <div key={client} className="card pad16 stack g10">
                <div className="row between">
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{client}</span>
                  <span className="small" style={{ color: fg, fontWeight: 600 }}><CountUp value={pct + '%'} /></span>
                </div>
                <div className="track lg"><Fill width={Math.min(pct, 100) + '%'} color={bar} delay={i * 0.1} /></div>
                <span className="small muted">{used} of {limit}</span>
                {note && <span className="small" style={{ color: fg }}>{note}</span>}
                {pct >= 95 && (
                  <Act
                    kind="t"
                    label="Request advance"
                    on={() => {
                      s.log('Requested advance payment', client);
                      s.say('Advance request sent to ' + client + ' with a UPI pay link.');
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="h2" style={{ marginBottom: 12 }}>Invoices and credit notes</h2>
        <Stagger className="list">
          {INVOICES.map(([no, client, amt, status, sv, act]) => (
            <motion.div key={no} variants={itemVariants} className="list-row">
              <span className="small muted" style={{ flex: '0 0 120px' }}>{no}</span>
              <span style={{ flex: '1 1 160px', fontSize: 14, fontWeight: 500 }}>{client}</span>
              <span style={{ flex: '0 0 120px', fontSize: 14, textAlign: 'right' }}>{amt}</span>
              <span className="small" style={{ flex: '2 1 240px', color: NFG[sv] }}>{status}</span>
              {act && (
                <Act
                  label={act}
                  on={() => {
                    s.log(act, no);
                    s.say(act === 'Retry IRN' ? 'IRN retry failed again. Client asked to reactivate GSTIN; invoice stays as draft.' : act + ' done for ' + no + '.');
                  }}
                />
              )}
            </motion.div>
          ))}
        </Stagger>
      </div>
    </div>
  );
}

/* ---------------- Payroll + payouts ---------------- */
export function Payroll({ s }) {
  const steps = [
    ['Inputs', 'Attendance + LOP uploaded', 'done'],
    ['Computed', 'PF, ESI, PT, TDS, LWF', s.wageBlock ? 'error' : 'done'],
    ['Approved', 'Client HR sign-off', s.wageBlock ? 'todo' : 'now'],
    ['Payout file', 'Bank + UPI', 'todo'],
    ['Filed', 'ECR, ESIC challan', 'todo'],
  ];
  const ready = s.pay.filter(p => p.status === 'Ready');
  const total = '₹' + ready.reduce((a, p) => a + parseInt(p.amt.replace(/[^\d]/g, ''), 10), 0).toLocaleString('en-IN');

  const payAct = p => {
    if (p.act === 'Send reminder') {
      s.patchPay(p.id, { note: 'Reminder sent by SMS and WhatsApp to update IFSC.', act: '' });
      s.log('Bank-details reminder sent', p.name);
      s.say('Reminder sent to ' + p.name + '.');
    } else if (p.act === 'Switch to UPI') {
      s.patchPay(p.id, { status: 'Ready', sev: 'ok', to: 'UPI suresh@okaxis', note: 'Switched to UPI after bank freeze', act: '' });
      s.log('Switched payout to UPI', p.name);
      s.say(p.name + ' will be paid by UPI in this batch.');
    } else if (p.act === 'Review') {
      s.setScreen('fraud');
    } else if (p.act === 'Approve ₹1,550') {
      s.patchPay(p.id, { amt: '₹1,550', status: 'Ready', sev: 'ok', note: 'Approved at the 50% cap. Worker notified.', act: '' });
      s.log('Approved EWA at cap ₹1,550', p.name);
      s.say('Earned wage access approved at ₹1,550.');
    }
  };

  const retryFailed = () => {
    if (!s.pay.some(p => p.status === 'Failed')) return s.say('No failed payouts.');
    s.patchPay('p3', { status: 'Ready', sev: 'ok', to: 'UPI suresh@okaxis', note: 'Switched to UPI after bank freeze', act: '' });
    s.log('Retried failed payouts via UPI', 'Batch 18 Oct');
    s.say('Suresh M. moved to UPI. Lakshmi D. has no UPI on file: reminder sent.');
  };

  return (
    <div className="stack g24">
      <PageHead eyebrow="A11 · A12 · Payroll and payouts" title="Payroll and worker payouts" />
      <div className="banner warn" style={{ fontSize: 14, padding: '14px 16px', borderRadius: 16 }}>
        <Icon name="account_balance" />
        <span>
          Payout float covers 2.1 days. ₹48.6 L of client collections are pending; daily wages go out before invoices are
          paid. Finance can draw on the working-capital line.
        </span>
      </div>

      <div className="card stack g16">
        <div>
          <h2 className="h2">October 2026 · Prestige Group (managed payroll)</h2>
          <span className="small muted">412 employees · Karnataka · PF, ESI, PT, TDS, LWF</span>
        </div>
        <div className="steps">
          {steps.map(([l, sub, st], i) => {
            const bg = st === 'done' ? '#0B57D0' : st === 'error' ? '#B3261E' : st === 'now' ? '#D3E3FD' : '#E9EEF6';
            const fg = st === 'done' || st === 'error' ? '#fff' : '#041E49';
            const icon = st === 'done' ? 'check' : st === 'error' ? 'priority_high' : st === 'now' ? 'more_horiz' : 'circle';
            return (
              <div className="step" key={l}>
                <div className="row g8">
                  <motion.div
                    className="step-dot"
                    animate={{ background: bg, color: fg, scale: st === 'error' ? [1, 1.15, 1] : 1 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Icon name={icon} />
                  </motion.div>
                  <div className="step-line" style={{ background: '#E1E3E1', overflow: 'hidden' }}>
                    <Fill width={st === 'done' ? '100%' : '0%'} color="#0B57D0" delay={i * 0.12} />
                  </div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{l}</span>
                <span className="muted" style={{ fontSize: 12.5 }}>{sub}</span>
              </div>
            );
          })}
        </div>
        {s.wageBlock && (
          <motion.div className="banner bad" exit={{ opacity: 0 }}>
            <Icon name="gavel" />
            <span style={{ flex: 1 }}>
              3 employees are below the state minimum wage for their skill category (semi-skilled, Zone I). Payroll can't be
              approved until their wage inputs are corrected.
            </span>
            <Act
              kind="d"
              label="Apply minimum"
              on={() => {
                s.setWageBlock(false);
                s.log('Raised 3 wages to state minimum', 'Prestige payroll');
                s.say('3 wage inputs corrected. Payroll ready for client approval.');
              }}
            />
          </motion.div>
        )}
      </div>

      <div>
        <div className="row between wrap g12" style={{ marginBottom: 12 }}>
          <h2 className="h2">Payout batch · today 18:00</h2>
          <div className="row g8">
            <Act size="md" label="Retry failed via UPI" on={retryFailed} />
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              className="btn md btn-filled"
              disabled={s.released}
              onClick={() => s.setModal({ kind: 'mfa', total, count: ready.length })}
            >
              <Icon name={s.released ? 'lock_open' : 'lock'} size={18} />
              {s.released ? 'Released' : 'Release ' + ready.length + ' payouts'}
            </motion.button>
          </div>
        </div>
        <Stagger className="list">
          {s.pay.map(p => (
            <motion.div key={p.id} layout variants={itemVariants} className="list-row">
              <div className="stack" style={{ flex: '1 1 180px' }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</span>
                <span className="xs muted">{p.kind} · {p.to}</span>
              </div>
              <span style={{ flex: '0 0 100px', fontSize: 14, textAlign: 'right' }}>{p.amt}</span>
              <motion.span key={p.status} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
                <Tag sev={p.sev} lg>{p.status}</Tag>
              </motion.span>
              <span className="small muted" style={{ flex: '2 1 240px' }}>{p.note}</span>
              {p.act && <Act label={p.act} on={() => payAct(p)} />}
            </motion.div>
          ))}
        </Stagger>
      </div>
    </div>
  );
}

/* ---------------- Growth ---------------- */
export function Growth({ s }) {
  const run = a => {
    const msg = {
      Approve: 'Commission approved. Paid with TDS on the monthly run.',
      Promote: 'Promoted to Captain. Certificate issued.',
      'Claw back': '₹2,700 clawed back. Ambassador suspended pending review.',
    }[a.act];
    s.patchAmb(a.id, { act: '', note: msg, sev: a.act === 'Claw back' ? 'bad' : 'ok' });
    s.log(a.act + ' ambassador', a.name);
    s.say(msg);
  };
  return (
    <div className="stack g20">
      <PageHead
        eyebrow="A13 · Growth and ambassadors"
        title="Student Ambassadors"
        lead="Rewards trigger only on quality events: a referred worker's first completed shift or a client's first paid invoice."
      />
      <div className="stack g8" style={{ padding: 16, borderRadius: 16, background: 'var(--surface-2)' }}>
        <div className="row between" style={{ fontSize: 14 }}>
          <span style={{ fontWeight: 500 }}>October reward budget</span><span>₹4,60,000 of ₹5,00,000</span>
        </div>
        <div className="track lg" style={{ background: '#fff' }}><Fill width="92%" color="#F9AB00" /></div>
        <span className="small" style={{ color: '#594300' }}>92% used. New approvals above the cap queue for November.</span>
      </div>
      <Stagger className="list">
        {s.ambs.map((a, i) => (
          <motion.div key={a.id} variants={itemVariants} className="list-row">
            <span className="muted" style={{ flex: '0 0 28px', fontSize: 16 }}>{i + 1}</span>
            <div className="stack" style={{ flex: '1 1 200px' }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{a.name}</span>
              <span className="xs muted">{a.college} · {a.tier}</span>
            </div>
            <span className="small" style={{ flex: '0 0 150px' }}>{a.stats}</span>
            <span style={{ flex: '0 0 100px', fontSize: 14, textAlign: 'right' }}>{a.due}</span>
            <span className="small" style={{ flex: '2 1 220px', color: NFG[a.sev] }}>{a.note}</span>
            {a.act && <Act kind={a.sev === 'bad' ? 'd' : undefined} label={a.act} on={() => run(a)} />}
          </motion.div>
        ))}
      </Stagger>
    </div>
  );
}

/* ---------------- Compliance ---------------- */
const LICENCES = [
  ['event_busy', 'Contract labour licence · Karnataka', 'Expires in 9 days. Renewal filed 2 Oct, acknowledgement pending.', 'warn'],
  ['block', 'Tamil Nadu · Hosur site (Flipkart)', 'No licence on file for this client site. Deployments to Hosur blocked.', 'bad'],
  ['description', 'BGV reports · 14 workers', 'Police verification older than 12 months. Re-verification reminders sent.', 'warn'],
  ['task_alt', 'PF ECR + ESIC challan · Sep', 'Filed on time for 6,410 employees.', 'ok'],
];

export function Compliance({ s }) {
  return (
    <div className="stack g24">
      <PageHead eyebrow="A15 · Compliance and audit" title="Compliance" />
      <Stagger className="auto-grid">
        {LICENCES.map(([icon, t, sub, sv]) => (
          <motion.div key={t} variants={itemVariants} whileHover={{ y: -3 }} className="stack g6" style={{ borderRadius: 16, padding: 16, background: T[sv][0], color: T[sv][1] }}>
            <Icon name={icon} />
            <span style={{ fontSize: 15, fontWeight: 500 }}>{t}</span>
            <span className="small" style={{ lineHeight: 1.45 }}>{sub}</span>
          </motion.div>
        ))}
      </Stagger>
      <div>
        <h2 className="h2" style={{ marginBottom: 4 }}>Audit log</h2>
        <p className="small muted" style={{ margin: '0 0 12px' }}>
          Every change to money, attendance and profiles, with user and time. Actions you take in this prototype appear here.
        </p>
        <div className="list" style={{ maxHeight: 420, overflowY: 'auto' }}>
          {s.audit.map((a, i) => (
            <motion.div
              key={a.t + a.action + a.entity + (s.audit.length - i)}
              layout
              initial={{ opacity: 0, backgroundColor: '#D3E3FD' }}
              animate={{ opacity: 1, backgroundColor: '#ffffff' }}
              transition={{ duration: 1.2 }}
              className="list-row small"
              style={{ padding: '10px 18px' }}
            >
              <span className="muted" style={{ flex: '0 0 52px' }}>{a.t}</span>
              <span style={{ flex: '0 0 220px' }}>{a.who}</span>
              <span style={{ flex: '1 1 240px' }}>{a.action}</span>
              <span className="muted" style={{ flex: '0 0 120px' }}>{a.entity}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
