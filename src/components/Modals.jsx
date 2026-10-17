import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BACKUPS } from '../data.js';
import { Icon } from '../ui.jsx';
import { useMotion } from '../motion';

// M3 "fade" pattern for dialogs: scrim fades (effects spring), the dialog scales up from 92%.
function Dialog({ size = '', onClose, children }) {
  const mo = useMotion();
  const pop = {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1, transition: mo.spatial() },
    exit: { opacity: 0, scale: 0.96, transition: mo.effects('fast') },
  };
  return (
    <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={mo.effects()} onClick={onClose}>
      <motion.div className={'dialog ' + size} role="dialog" aria-modal="true" {...pop} onClick={e => e.stopPropagation()}>
        {children}
      </motion.div>
    </motion.div>
  );
}

const Footer = ({ onClose, onOk, okLabel, disabled, danger }) => (
  <div className="row g8" style={{ justifyContent: 'flex-end' }}>
    <button type="button" className="btn btn-text" onClick={onClose}>Cancel</button>
    <motion.button whileTap={{ scale: 0.96 }} type="button" className={'btn ' + (danger ? 'btn-danger' : 'btn-filled')} disabled={disabled} onClick={onOk}>
      {okLabel}
    </motion.button>
  </div>
);

function Assign({ s, m, close }) {
  const mo = useMotion();
  const [pick, setPick] = useState(null);
  const shift = s.shifts.find(x => x.id === m.id) || {};
  const ok = () => {
    const b = BACKUPS.find(x => x.id === pick);
    s.patchShift(shift.id, { status: 'confirmed', worker: b.name, note: 'Assigned manually · ETA ' + (b.dist === '2.1 km' ? '14' : '25') + ' min · client notified.', sev: 'ok' });
    s.log('Assigned ' + b.name, shift.id);
    s.say(b.name + ' assigned to ' + shift.id + '. Worker and client notified.');
    close();
  };
  return (
    <Dialog onClose={close}>
      <div>
        <h2>Assign a worker</h2>
        <p className="lead">{shift.id} · {shift.role} · {shift.client} · {shift.time}. Radius widened to 8 km.</p>
      </div>
      <div className="stack g6">
        {BACKUPS.map((b, i) => {
          const dis = b.st !== 'ok';
          const on = pick === b.id;
          return (
            <motion.button
              key={b.id}
              type="button"
              className={'radio-opt' + (on ? ' on' : '')}
              disabled={dis}
              onClick={() => setPick(b.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: dis ? 0.5 : 1, y: 0 }}
              transition={{ ...mo.spatial(), delay: mo.stagger(i) }}
            >
              <Icon name={on ? 'radio_button_checked' : 'radio_button_unchecked'} />
              <div className="stack" style={{ flex: 1, gap: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{b.name}</span>
                <span className="small muted">{b.dist} · reliability {b.rel} · match {b.match}</span>
                {b.why && <span style={{ fontSize: 12.5, color: dis ? 'var(--danger)' : 'var(--muted)' }}>{b.why}</span>}
              </div>
            </motion.button>
          );
        })}
      </div>
      <Footer onClose={close} onOk={ok} okLabel="Assign and notify" disabled={!pick} />
    </Dialog>
  );
}

const REASONS = {
  reject: ['Face does not match ID', 'Document altered or forged', 'Duplicate profile', 'Below minimum age (18)', 'Failed background check'],
  reupload: ['Photo blurred or cropped', 'Document expired', 'Name mismatch across documents', 'Bank details invalid'],
  approve: ['Face confirmed on live video call', 'ID photo outdated; second photo ID checked', 'Age verified; schedule activation on 18th birthday', 'Vendor delay; provisional approval for non-sensitive roles'],
};

function Decide({ s, m, close }) {
  const [reason, setReason] = useState('');
  const { type, kyc } = m;
  const title = { approve: 'Approve with override', reject: 'Reject verification', reupload: 'Ask to re-upload' }[type];
  const body = {
    approve: `A failed check is on ${kyc.name}'s file. Record why it's safe to approve.`,
    reject: `${kyc.name} is told the reason in their language and can appeal to a person.`,
    reupload: `${kyc.name} gets a push and WhatsApp with what to fix.`,
  }[type];
  const ok = () => {
    s.log({ approve: 'Approved with override', reject: 'Rejected', reupload: 'Requested re-upload' }[type] + ': ' + reason, kyc.id);
    s.removeKyc(kyc.id);
    s.say({ approve: 'Approved with override. Logged.', reject: 'Rejected. Candidate notified with appeal link.', reupload: 'Re-upload requested.' }[type]);
    m.onDone?.();
    close();
  };
  return (
    <Dialog size="md" onClose={close}>
      <h2>{title}</h2>
      <p className="lead" style={{ margin: 0 }}>{body}</p>
      <div className="stack g6">
        <label className="field-label" htmlFor="reason">Reason (required, saved to audit log)</label>
        <select id="reason" className="select" style={{ height: 48, fontSize: 15 }} value={reason} onChange={e => setReason(e.target.value)}>
          <option value="">Choose a reason</option>
          {REASONS[type].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <Footer onClose={close} onOk={ok} okLabel="Confirm" disabled={!reason} danger={type === 'reject'} />
    </Dialog>
  );
}

const RESOLVE = [
  ['worker', 'Pay worker 6.0 h and bill client 6.0 h. App evidence stands.'],
  ['client', 'Pay and bill 4.0 h. Client confirms early release with the worker.'],
  ['split', 'Pay worker 6.0 h, bill client 4.0 h. CrossWay absorbs 2.0 h.'],
];

function Dispute({ s, close }) {
  const [sel, setSel] = useState(null);
  const ok = () => {
    const h = { worker: '6.0 h paid · 6.0 h billed', client: '4.0 h paid · 4.0 h billed', split: '6.0 h paid · 4.0 h billed' }[sel];
    s.patchTs('t5', { hours: h, flag: 'Resolved: ' + h, sev: 'ok', status: 'Resolved', kind: null });
    s.patchPay('p6', { status: 'Ready', sev: 'ok', note: 'Dispute resolved: ' + h });
    s.log('Resolved hours dispute (' + sel + ')', 'Kiran B.');
    s.say('Resolved. Worker, client and invoice updated.');
    close();
  };
  return (
    <Dialog onClose={close}>
      <div>
        <h2>Resolve hours dispute</h2>
        <p className="lead">Kiran B. · Third Wave Coffee · 17 Oct. Client says 4.0 h, app shows 6.0 h.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div className="small" style={{ padding: 12, borderRadius: 12, background: 'var(--surface-2)', lineHeight: 1.5 }}>
          <b style={{ fontWeight: 500 }}>App evidence</b><br />Check-in 16:02 selfie 97% · GPS inside site until 22:04 · check-out selfie 95%
        </div>
        <div className="small" style={{ padding: 12, borderRadius: 12, background: 'var(--surface-2)', lineHeight: 1.5 }}>
          <b style={{ fontWeight: 500 }}>Client note</b><br />"Sent home at 20:00, store quiet." No early-release logged in app.
        </div>
      </div>
      <div className="stack g6">
        {RESOLVE.map(([id, l]) => (
          <button key={id} type="button" className={'radio-opt' + (sel === id ? ' on' : '')} onClick={() => setSel(id)}>
            <Icon name={sel === id ? 'radio_button_checked' : 'radio_button_unchecked'} />
            <span style={{ fontSize: 14 }}>{l}</span>
          </button>
        ))}
      </div>
      <Footer onClose={close} onOk={ok} okLabel="Resolve and notify both" disabled={!sel} />
    </Dialog>
  );
}

const MFA_CODE = '246810';

function Mfa({ s, m, close }) {
  const mo = useMotion();
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');
  const [tries, setTries] = useState(0);
  const locked = tries >= 3;
  const submit = () => {
    if (otp === MFA_CODE) {
      s.setReleased(true);
      s.setPay(list => list.map(p => (p.status === 'Ready' ? { ...p, status: 'Paid', note: 'Paid ' + s.now() + ' · UTR sent by SMS' } : p)));
      s.log('Released payout batch (MFA)', 'Batch 18 Oct');
      s.say('Batch released. Workers get an SMS with the UTR.');
      close();
    } else {
      const t = tries + 1;
      setTries(t);
      setErr(`Wrong code. ${3 - t} attempt${3 - t === 1 ? '' : 's'} left.`);
      if (t >= 3) s.log('MFA lockout on payout release', 'Asha N.');
    }
  };
  return (
    <Dialog size="sm" onClose={close}>
      <motion.span initial={{ rotate: -20, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={mo.spatial('fast')}>
        <Icon name="verified_user" size={28} style={{ color: 'var(--primary)' }} />
      </motion.span>
      <h2>Confirm it's you</h2>
      <p className="lead" style={{ margin: 0 }}>
        Releasing {m.total} to {m.count} workers needs a second factor. Enter the 6-digit code from your authenticator.
        (Prototype code: {MFA_CODE})
      </p>
      <motion.input
        key={tries}
        className={'otp' + (err || locked ? ' err' : '')}
        value={otp}
        maxLength={6}
        inputMode="numeric"
        disabled={locked}
        placeholder="••••••"
        autoFocus
        onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setErr(''); }}
        onKeyDown={e => e.key === 'Enter' && !locked && submit()}
        animate={tries ? { x: [0, -10, 10, -6, 6, 0] } : {}}
        transition={{ duration: 0.32, ease: 'easeOut' }} /* error shake: keyframes need a short tween, not a spring */
      />
      {(err || locked) && (
        <span className="small" style={{ color: 'var(--danger)' }}>
          {locked ? 'Too many wrong codes. Locked for 15 minutes and Super Admin notified.' : err}
        </span>
      )}
      <Footer onClose={close} onOk={submit} okLabel="Verify and release" disabled={locked} />
    </Dialog>
  );
}

export default function Modals({ s }) {
  const m = s.modal;
  const close = () => s.setModal(null);
  const C = m && { assign: Assign, decide: Decide, dispute: Dispute, mfa: Mfa }[m.kind];
  return <AnimatePresence>{C && <C key={m.kind} s={s} m={m} close={close} />}</AnimatePresence>;
}
