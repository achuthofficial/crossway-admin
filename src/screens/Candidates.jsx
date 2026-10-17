import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CANDS } from '../data.js';
import { Icon, PageHead, Tag } from '../ui.jsx';

const TIERS = ['All', 'Blue', 'Grey', 'White', 'Tech', 'Campus'];

/** Download the current (filtered) list as a CSV file, entirely in the browser. */
function exportCsv(rows) {
  const head = ['ID', 'Name', 'Phone', 'Tier', 'Mode', 'Verification', 'Reliability', 'Flags'];
  const esc = v => '"' + String(v).replace(/"/g, '""') + '"';
  const body = rows.map(c => [c.id, c.name, c.phone, c.tier, c.mode, c.kyc, c.rel, c.flag].map(esc).join(','));
  const blob = new Blob([[head.join(','), ...body].join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'crossway-candidates.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function Candidates({ s }) {
  const [tier, setTier] = useState('All');
  const q = s.q.trim().toLowerCase();
  const cands = CANDS.filter(
    c => (tier === 'All' || c.tier === tier) && (!q || (c.name + c.id + c.phone).toLowerCase().includes(q)),
  );

  return (
    <div className="stack g20">
      <PageHead eyebrow="A4 · Candidate database" title="Candidates">
        <div className="row wrap g6">
          {TIERS.map(l => (
            <button key={l} type="button" className={'chip' + (tier === l ? ' on' : '')} onClick={() => setTier(l)}>
              {tier === l && <Icon name="check" />}
              {l}
            </button>
          ))}
          <button type="button" className="chip" onClick={() => { exportCsv(cands); s.say('Exported ' + cands.length + ' candidates to CSV.'); }} disabled={!cands.length}>
            <Icon name="download" />Export
          </button>
        </div>
      </PageHead>

      {!cands.length ? (
        <motion.div className="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Icon name="person_search" size={32} className="muted" />
          <span style={{ fontSize: 16, fontWeight: 500 }}>No candidates match "{s.q || tier}"</span>
          <span className="muted" style={{ fontSize: 14 }}>Try a mobile number, CrossWay ID or a different tier.</span>
          <button type="button" className="btn md btn-outline" style={{ marginTop: 6, background: '#fff' }} onClick={() => { s.setQ(''); setTier('All'); }}>
            Clear search
          </button>
        </motion.div>
      ) : (
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr><th>Candidate</th><th>Tier · mode</th><th>Verification</th><th>Reliability</th><th>Flags</th></tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {cands.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.025 } }}
                    exit={{ opacity: 0 }}
                  >
                    <td>
                      <div className="stack"><span style={{ fontWeight: 500 }}>{c.name}</span><span className="xs muted">{c.id} · {c.phone}</span></div>
                    </td>
                    <td>{c.tier} · {c.mode}</td>
                    <td><Tag sev={c.sev} lg>{c.kyc}</Tag></td>
                    <td>{c.rel}</td>
                    <td className="small" style={{ color: c.flag === '—' ? '#444746' : c.sev === 'bad' ? '#B3261E' : '#7A5900' }}>{c.flag}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
