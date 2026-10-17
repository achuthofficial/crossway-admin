import { AnimatePresence, motion } from 'motion/react';
import { NFG } from '../data.js';
import { Act, Icon, PageHead, Tag } from '../ui.jsx';

const COLS = [
  ['unassigned', 'Unassigned', '#EA4335'],
  ['confirmed', 'Confirmed', '#4285F4'],
  ['checkedin', 'Checked in', '#34A853'],
  ['late', 'Late', '#FBBC04'],
  ['noshow', 'No-show', 'var(--danger)'],
];
const SEV_LABEL = { ok: 'On track', warn: 'Watch', bad: 'Act now' };

function actionsFor(x, s) {
  const assign = () => s.setModal({ kind: 'assign', id: x.id });
  if (x.status === 'unassigned')
    return [
      { label: 'Assign', on: assign, kind: 'p' },
      {
        label: 'Surge +15%',
        on: () => {
          s.patchShift(x.id, { note: 'Surge +15% live. Re-invited 22 workers within 8 km.', sev: 'warn' });
          s.log('Applied surge pay +15%', x.id);
          s.say('Surge applied. 22 workers re-invited.');
        },
      },
      {
        label: 'Escalate',
        on: () => {
          s.log('Escalated to City Manager', x.id);
          s.say('Escalated to City Manager Vivek R. by call and WhatsApp.');
        },
      },
    ];
  if (x.status === 'confirmed' && x.sev === 'warn')
    return [
      {
        label: 'Add standby',
        kind: 'p',
        on: () => {
          s.patchShift(x.id, { note: 'Standby Sanjay V. on hold within 3 km until 17:45.', sev: 'ok' });
          s.log('Added standby worker', x.id);
          s.say('Standby booked. Released automatically if Deepa checks in.');
        },
      },
      { label: 'Call', on: () => s.say('Calling Deepa R. through a masked number…') },
    ];
  if (x.status === 'checkedin' && x.sev === 'warn')
    return [
      {
        label: 'Accept',
        kind: 'p',
        on: () => {
          s.patchShift(x.id, { note: 'Accepted: worker at Gate 4 loading bay (site map out of date).', sev: 'ok' });
          s.log('Accepted out-of-geofence check-in', x.id);
          s.say('Check-in accepted. Geofence update suggested to Config.');
        },
      },
      {
        label: 'Reject',
        on: () => {
          s.patchShift(x.id, { status: 'noshow', note: 'Check-in rejected. Treated as no-show; backup search started.', sev: 'bad' });
          s.log('Rejected check-in', x.id);
        },
      },
    ];
  if (x.status === 'late')
    return [
      { label: 'Swap with backup', on: assign, kind: 'p' },
      { label: 'Call', on: () => s.say('No answer. SMS and WhatsApp sent to Kiran B.') },
    ];
  if (x.status === 'noshow')
    return x.sev === 'bad'
      ? [
          { label: 'Reassign now', on: assign, kind: 'p' },
          {
            label: 'Notify client',
            on: () => {
              s.log('Sent no-show notice + credit note', x.id);
              s.say('Client notified. Credit note drafted for the missed hours.');
            },
          },
        ]
      : [{ label: 'Track backup', on: () => s.say('Arun T. is 3.4 km away and moving.') }];
  return [];
}

export default function LiveOps({ s }) {
  return (
    <div className="stack g20">
      <PageHead
        eyebrow="A2 · Live operations"
        title="Today's shifts"
        lead="Free replacement window: 45 min from scheduled start. Autopilot books backups for every shift with no-show risk above 50%."
      >
        <span className="row g6 small" style={{ height: 32, padding: '0 12px', borderRadius: 8, background: 'var(--surface-2)' }}>
          <span className="live-dot" />
          <Icon name="smart_toy" size={18} style={{ color: 'var(--primary)' }} />
          Autopilot on
        </span>
      </PageHead>

      <div className="board">
        {COLS.map(([k, l, dot]) => {
          const items = s.shifts.filter(x => x.status === k);
          return (
            <div className="lane" key={k}>
              <div className="row g8" style={{ padding: '4px 6px' }}>
                <span className="legend-dot" style={{ background: dot }} />
                <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{l}</span>
                <motion.span key={items.length} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="small muted">
                  {items.length}
                </motion.span>
              </div>
              {!items.length && <div className="small muted" style={{ padding: '24px 8px', textAlign: 'center' }}>Nothing here</div>}
              <AnimatePresence mode="popLayout">
                {items.map(x => (
                  <motion.div
                    key={x.id}
                    layout
                    layoutId={'shift-' + x.id}
                    className="shift"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="row between g8">
                      <span className="xs muted">{x.id} · {x.time}</span>
                      <Tag sev={x.sev}>{SEV_LABEL[x.sev]}</Tag>
                    </div>
                    <div className="stack" style={{ gap: 2 }}>
                      <span style={{ fontSize: 15, fontWeight: 500 }}>{x.role}</span>
                      <span className="small muted">{x.client} · {x.site}</span>
                    </div>
                    <div className="row g6 small"><Icon name="person" size={18} className="muted" />{x.worker}</div>
                    <motion.div key={x.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 12.5, lineHeight: 1.45, color: NFG[x.sev] }}>
                      {x.note}
                    </motion.div>
                    <div className="row wrap g6">
                      {actionsFor(x, s).map(a => <Act key={a.label} {...a} />)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

