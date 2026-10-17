import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Act, Icon, ini, itemVariants, PageHead, Tag } from '../ui.jsx';

const IC = {
  ok: ['check_circle', '#146C2E'],
  warn: ['error', '#B06000'],
  fail: ['cancel', '#B3261E'],
  na: ['remove_circle_outline', '#747775'],
};

export default function Verification({ s }) {
  const [sel, setSel] = useState('KYC-881');
  const k = s.kyc.find(x => x.id === sel) || s.kyc[0];
  const hasFail = k && k.checks.some(c => c[0] === 'fail');

  const next = () => (s.kyc.find(x => x.id !== k.id) || {}).id;
  const done = () => setSel(next());

  const approve = () => {
    if (hasFail) return s.setModal({ kind: 'decide', type: 'approve', kyc: k, onDone: done });
    s.removeKyc(k.id);
    s.log('Approved KYC', k.id);
    s.say(k.name + ' verified. Passport badge added.');
    done();
  };

  return (
    <div className="stack g20">
      <PageHead
        eyebrow="A8 · Verification centre"
        title="KYC and background checks"
        lead="Aadhaar is read only through DigiLocker or licensed e-KYC. Only the last 4 digits are stored."
      />

      {!k ? (
        <motion.div className="banner ok" style={{ padding: 40, fontSize: 16, alignItems: 'center' }} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Icon name="task_alt" size={28} />Queue clear. New submissions appear here as they arrive.
        </motion.div>
      ) : (
        <div className="split-kyc">
          <motion.div className="stack g8" layout>
            <AnimatePresence initial={false}>
              {s.kyc.map(x => (
                <motion.button
                  key={x.id}
                  type="button"
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className={'select-card' + (x.id === k.id ? ' on' : '')}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
                  onClick={() => setSel(x.id)}
                >
                  <div className="initials grey">{ini(x.name)}</div>
                  <div className="stack" style={{ flex: 1, minWidth: 0, gap: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 500 }}>{x.name}</span>
                    <span className="muted" style={{ fontSize: 12.5 }}>{x.id} · {x.tier} · {x.when}</span>
                  </div>
                  <Tag sev={x.sev}>{x.issue}</Tag>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={k.id}
              className="card stack g14"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="row g16">
                <div className="icon-tile"><Icon name="face" /></div>
                <div className="icon-tile"><Icon name="badge" /></div>
                <div className="stack">
                  <span style={{ fontSize: 20 }}>{k.name}</span>
                  <span className="small muted">{k.id} · {k.role}</span>
                </div>
              </div>
              <div className="stack">
                {k.checks.map(([st, label, v], i) => (
                  <motion.div
                    key={label}
                    className="check-row"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06 }}
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 500, damping: 18 }}
                    >
                      <Icon name={IC[st][0]} style={{ color: IC[st][1] }} />
                    </motion.span>
                    <div className="stack" style={{ flex: 1, gap: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
                      <span className="small muted">{v}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              {hasFail && (
                <div className="row g8 small" style={{ color: '#8C1D18' }}>
                  <Icon name="info" size={18} />A failed check is present. Approving needs a written override reason.
                </div>
              )}
              <div className="row wrap g8">
                <Act size="" kind="p" label={hasFail ? 'Approve with override' : 'Approve'} on={approve} />
                <Act size="" kind="t" label="Ask to re-upload" on={() => s.setModal({ kind: 'decide', type: 'reupload', kyc: k, onDone: done })} />
                {k.vendor && (
                  <Act
                    size=""
                    label="Retry vendor"
                    on={() => {
                      s.log('Retried BGV vendor', k.id);
                      s.say('Retry sent. Fallback vendor will be used if no reply in 12 h.');
                    }}
                  />
                )}
                <button type="button" className="btn btn-outline danger" onClick={() => s.setModal({ kind: 'decide', type: 'reject', kyc: k, onDone: done })}>
                  Reject
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
