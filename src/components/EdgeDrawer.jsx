import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '../ui.jsx';

const EDGES = [
  ['A2', 'Unfilled shift with empty standby pool → surge, widen radius, escalate', 'liveops'],
  ['A2', 'No-show inside vs outside the free replacement window', 'liveops'],
  ['A2', 'Late worker unreachable → swap with backup', 'liveops'],
  ['A2', 'Check-in outside geofence', 'liveops'],
  ['A2', 'Backup with overlapping shift or blocked by client is unselectable', 'liveops'],
  ['A6', 'Over-inviting beyond open slots (130% cap)', 'reqs'],
  ['A6', 'Expired police verification: invite yes, deploy no', 'reqs'],
  ['A5', 'Requisition paused by client credit limit', 'reqs'],
  ['A4', 'Duplicate profile, under-18, DPDP erasure, blocked worker', 'candidates'],
  ['A4', 'Search with no results', 'candidates'],
  ['A8', 'Face match below threshold → override needs reason', 'verification'],
  ['A8', 'BGV vendor timeout, DigiLocker down fallback', 'verification'],
  ['A9', 'Client vs app hours dispute', 'attendance'],
  ['A9', 'Missing check-out, OT above cap, proxy selfie, auto-approve', 'attendance'],
  ['A10', 'Over credit limit, IRN failure, partial payment, credit note', 'billing'],
  ['A11', 'Wage below state minimum blocks payroll', 'payroll'],
  ['A12', 'Failed payouts: bad IFSC, frozen account; EWA above cap', 'payroll'],
  ['A12', 'MFA to release payouts, lockout after 3 wrong codes', 'payroll'],
  ['A13', 'Referral ring clawback, monthly budget cap', 'growth'],
  ['A20', 'GPS spoofing, proxy attendance; human decides holds', 'fraud'],
  ['A15', 'Licence expiring / missing for a client site', 'compliance'],
  ['A16', 'Anonymous harassment grievance, breached SLA, zero-fee violation', 'support'],
  ['A21', 'Rate below minimum wage cannot be saved', 'config'],
  ['A1', 'City not launched → empty state', 'city'],
  ['RBAC', 'Role without access → locked module + request access', 'rbac'],
];
export const EDGE_COUNT = EDGES.length;

export default function EdgeDrawer({ s }) {
  const jump = to => {
    s.setEdgeOpen(false);
    if (to === 'city') { s.setRole('super'); s.setCity('Hyderabad'); }
    else if (to === 'rbac') { s.setCity('Bengaluru'); s.setRole('support'); s.setScreen('billing'); }
    else { s.setCity('Bengaluru'); s.setRole('super'); s.setScreen(to); }
  };
  return (
    <AnimatePresence>
      {s.edgeOpen && (
        <motion.div className="drawer-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => s.setEdgeOpen(false)}>
          <motion.aside
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="row between" style={{ marginBottom: 8 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 400 }}>Edge cases covered</h2>
              <button type="button" className="icon-btn" aria-label="Close" onClick={() => s.setEdgeOpen(false)}><Icon name="close" /></button>
            </div>
            <p className="small muted" style={{ margin: '0 0 12px' }}>Tap one to jump to it.</p>
            {EDGES.map(([mod, l, to], i) => (
              <motion.button
                key={l}
                type="button"
                className="edge-item"
                onClick={() => jump(to)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.015 }}
              >
                <span className="tag" style={{ background: 'var(--primary-soft)', color: 'var(--primary-dark)', marginTop: 1, padding: '3px 8px' }}>{mod}</span>
                <span style={{ fontSize: 14, lineHeight: 1.4 }}>{l}</span>
              </motion.button>
            ))}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
