import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MATCH, REQS } from '../data.js';
import { Fill, Icon, ini, itemVariants, PageHead, Stagger, Tag } from '../ui.jsx';
import { useMotion } from '../motion';

export default function Requisitions({ s }) {
  const m = useMotion();
  const [selReq, setSelReq] = useState('REQ-2291');
  const [picked, setPicked] = useState({});

  const rq = REQS.find(r => r.id === selReq);
  const open = rq.need - rq.filled;
  const blocked = rq.kind === 'blocked';
  const matches = MATCH[rq.kind === 'pro' ? 'pro' : 'blue'];
  const pickedCount = Object.values(picked).filter(Boolean).length;
  const cap = Math.ceil(open * 1.3);
  const overInvite = pickedCount > 0 && pickedCount > open;
  const overInviteMsg =
    open === 0
      ? 'This requisition is already filled. Invites will go to the standby pool only.'
      : `${pickedCount} selected for ${open} open slots. The no-show model allows up to ${cap} (130%). ${
          pickedCount > cap ? 'Extra invites will be queued as standby.' : 'Extra acceptances become paid standby.'
        }`;

  const invite = () => {
    s.log('Invited ' + pickedCount + ' candidates', rq.id);
    s.say(pickedCount + ' invites sent by app push and WhatsApp.');
    setPicked({});
  };
  const pickTop = () => {
    const p = {};
    matches
      .filter(x => x.st !== 'conflict')
      .slice(0, Math.min(open || 3, cap || 3))
      .forEach(x => (p[x.id] = true));
    setPicked(p);
  };

  return (
    <div className="stack g20">
      <PageHead eyebrow="A5 · A6 · Requisitions and AI matching" title="Open requisitions" />
      <div className="split">
        <Stagger className="stack g8">
          {REQS.map(r => {
            const on = r.id === selReq;
            return (
              <motion.button
                key={r.id}
                type="button"
                variants={itemVariants}
                whileHover={{ x: 3 }}
                className={'select-card' + (on ? ' on' : '')}
                onClick={() => { setSelReq(r.id); setPicked({}); }}
              >
                <div className="row between g8">
                  <span className="xs muted">{r.id} · {r.line} · {r.tier}</span>
                  <Tag sev={r.sev}>{r.sla}</Tag>
                </div>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{r.role}</span>
                <span className="small muted">{r.client} · Owner {r.owner}</span>
                <div className="row g10">
                  <div className="track"><Fill width={Math.round((r.filled / r.need) * 100) + '%'} color="var(--brand)" /></div>
                  <span className="xs muted">{r.filled}/{r.need}</span>
                </div>
              </motion.button>
            );
          })}
        </Stagger>

        <AnimatePresence mode="wait">
          <motion.div
            key={rq.id}
            className="card stack g14"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={m.spatial()}
          >
            <div className="row between start wrap g12">
              <div>
                <span className="xs muted">{rq.id} · {rq.client}</span>
                <h2 style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 400 }}>{rq.role}</h2>
              </div>
              <span className="small muted">{open} open · {pickedCount} selected</span>
            </div>

            {blocked ? (
              <div className="banner bad">
                <Icon name="block" />
                <span>
                  Matching is paused. Ambrosia Foods is at 98% of its ₹2,00,000 credit limit and this request would cross it.
                  Finance must raise the limit or collect an advance first.
                </span>
              </div>
            ) : (
              <>
                <div className="banner info" style={{ fontSize: 12.5 }}>
                  <Icon name="auto_awesome" style={{ color: 'var(--primary)' }} />
                  Ranked by skills, distance, availability, reliability and client history. Caste, religion, gender, age and
                  marital status are never used. Recruiter decides.
                </div>
                <Stagger className="stack">
                  {matches.map(c => {
                    const dis = c.st === 'conflict';
                    const wfg = c.st === 'conflict' ? 'var(--danger)' : c.st === 'docs' ? 'var(--warn-text)' : 'var(--muted)';
                    const wicon = c.st === 'conflict' ? 'event_busy' : c.st === 'docs' ? 'description' : 'info';
                    return (
                      <motion.label key={c.id} variants={itemVariants} className="match-row" style={{ opacity: dis ? 0.55 : 1, cursor: dis ? 'not-allowed' : 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={!!picked[c.id]}
                          disabled={dis}
                          onChange={() => setPicked(p => ({ ...p, [c.id]: !p[c.id] }))}
                        />
                        <div className="initials">{ini(c.name)}</div>
                        <div className="stack" style={{ flex: 1, minWidth: 0, gap: 3 }}>
                          <span style={{ fontSize: 15, fontWeight: 500 }}>{c.name}</span>
                          <span className="small muted">{c.reasons}</span>
                          {c.why && (
                            <span className="row g6" style={{ fontSize: 12.5, color: wfg }}>
                              <Icon name={wicon} size={16} />{c.why}
                            </span>
                          )}
                        </div>
                        <div className="stack" style={{ alignItems: 'flex-end' }}>
                          <span style={{ fontSize: 20, color: 'var(--primary)' }}>{c.match}</span>
                          <span style={{ fontSize: 11 }} className="muted">match</span>
                        </div>
                      </motion.label>
                    );
                  })}
                </Stagger>
                <span className="muted" style={{ fontSize: 12.5 }}>
                  {rq.kind === 'pro'
                    ? 'Shortlist goes to the client with AI interview scorecards. Final hiring decision stays with people.'
                    : '2 candidates hidden: blocked by this client.'}
                </span>
                <AnimatePresence>
                  {overInvite && (
                    <motion.div
                      className="banner warn"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Icon name="warning" />{overInviteMsg}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="row wrap g8">
                  <motion.button whileTap={{ scale: 0.96 }} type="button" className="btn btn-filled" disabled={!pickedCount} onClick={invite}>
                    Invite selected{pickedCount ? ` (${pickedCount})` : ''}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} type="button" className="btn btn-outline" onClick={pickTop}>
                    Select best available
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
