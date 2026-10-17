import { AnimatePresence, motion } from 'motion/react';
import { NFG } from '../data.js';
import { Act, Icon, itemVariants, PageHead, Stagger, Tag } from '../ui.jsx';

const FICON = { ok: 'check_circle', warn: 'warning', bad: 'error', info: 'schedule' };

export default function Attendance({ s }) {
  const actions = t => {
    if (t.kind === 'dispute') return [{ label: 'Resolve', kind: 'p', on: () => s.setModal({ kind: 'dispute', id: t.id }) }];
    if (t.kind === 'missing')
      return [{
        label: 'Enter check-out',
        kind: 'p',
        on: () => {
          s.patchTs(t.id, { inout: 'In 10:00 · Out 18:00 (manual, site manager confirmed)', hours: '8.0 h', flag: 'Manual entry by ops, confirmed by site manager on call', sev: 'ok', status: 'Pending client', kind: null });
          s.log('Manual check-out entered', 'Manjunath S.');
        },
      }];
    if (t.kind === 'geo')
      return [{
        label: 'Accept',
        kind: 'p',
        on: () => {
          s.patchTs(t.id, { flag: 'Accepted: worker at Gate 4 (outside drawn fence)', sev: 'ok', status: 'Accepted', kind: null });
          s.log('Accepted out-of-geofence check-in', 'Imran P.');
        },
      }];
    if (t.kind === 'proxy') return [{ label: 'Send to fraud', on: () => s.setScreen('fraud') }];
    if (t.kind === 'ot')
      return [{
        label: 'Ask client',
        on: () => {
          s.patchTs(t.id, { flag: 'OT approval requested from site manager', sev: 'info', kind: null });
          s.say('Approval request sent to Prestige site manager.');
        },
      }];
    return [];
  };

  return (
    <div className="stack g20">
      <PageHead
        eyebrow="A9 · Attendance and timesheets"
        title="Timesheets"
        lead="Clients have 48 hours to approve or dispute. Untouched timesheets auto-approve per contract."
      />
      <Stagger className="list">
        {s.ts.map(t => (
          <motion.div key={t.id} layout variants={itemVariants} className="list-row" style={{ padding: '14px 18px' }}>
            <div className="stack" style={{ flex: '1 1 220px', gap: 2 }}>
              <span style={{ fontSize: 15, fontWeight: 500 }}>{t.worker}</span>
              <span className="small muted">{t.client} · {t.date}</span>
            </div>
            <div className="small muted" style={{ flex: '1 1 160px' }}>
              {t.inout}<br /><span style={{ color: 'var(--text)', fontWeight: 500 }}>{t.hours}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={t.flag}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="row g6 small start"
                style={{ flex: '2 1 260px', color: NFG[t.sev] }}
              >
                <Icon name={FICON[t.sev]} size={18} />{t.flag}
              </motion.div>
            </AnimatePresence>
            <Tag sev={t.sev} lg>{t.status}</Tag>
            <div className="row g6">{actions(t).map(a => <Act key={a.label} {...a} />)}</div>
          </motion.div>
        ))}
      </Stagger>
    </div>
  );
}
