import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CANDS } from '../data.js';
import { Icon, PageHead, Tag } from '../ui.jsx';
import { useMotion } from '../motion';

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

const KYC_ORDER = { Blocked: 0, 'On hold': 1, 'In review': 2, 'BGV pending': 3, Verified: 4 };
const SORTS = {
  name: c => c.name,
  tier: c => c.tier + c.mode,
  kyc: c => KYC_ORDER[c.kyc] ?? 9,
  rel: c => (c.rel === '—' ? -1 : +c.rel),
};
const COLS = [['name', 'Candidate'], ['tier', 'Tier · mode'], ['kyc', 'Verification'], ['rel', 'Reliability'], [null, 'Flags']];

export default function Candidates({ s }) {
  const m = useMotion();
  const [tier, setTier] = useState('All');
  const [sort, setSort] = useState({ key: null, dir: 1 });
  const q = s.q.trim().toLowerCase();
  const filtered = CANDS.filter(
    c => (tier === 'All' || c.tier === tier) && (!q || (c.name + c.id + c.phone).toLowerCase().includes(q)),
  );
  const cands = sort.key
    ? [...filtered].sort((a, b) => {
        const x = SORTS[sort.key](a), y = SORTS[sort.key](b);
        return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
      })
    : filtered;
  const toggleSort = key => setSort(cur => (cur.key === key ? { key, dir: -cur.dir } : { key, dir: 1 }));

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
          <button type="button" className="btn md btn-outline" style={{ marginTop: 6, background: 'var(--surface)' }} onClick={() => { s.setQ(''); setTier('All'); }}>
            Clear search
          </button>
        </motion.div>
      ) : (
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                {COLS.map(([key, label]) => (
                  <th key={label} aria-sort={sort.key === key ? (sort.dir > 0 ? 'ascending' : 'descending') : undefined}>
                    {key ? (
                      <button type="button" className="th-sort" onClick={() => toggleSort(key)}>
                        {label}
                        <motion.span
                          className="icon"
                          style={{ fontSize: 16, opacity: sort.key === key ? 1 : 0.35 }}
                          animate={{ rotate: sort.key === key && sort.dir < 0 ? 180 : 0 }}
                          transition={m.spatial('fast')}
                          aria-hidden
                        >
                          arrow_upward
                        </motion.span>
                      </button>
                    ) : label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {cands.map((c, i) => (
                  /* layout = FLIP: re-sorting slides rows to their new positions with transforms. */
                  <motion.tr
                    key={c.id}
                    layout="position"
                    transition={m.spatial()}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: { ...m.spatial(), delay: m.stagger(i) } }}
                    exit={{ opacity: 0, transition: m.effects('fast') }}
                  >
                    <td>
                      <div className="stack"><span style={{ fontWeight: 500 }}>{c.name}</span><span className="xs muted">{c.id} · {c.phone}</span></div>
                    </td>
                    <td>{c.tier} · {c.mode}</td>
                    <td><Tag sev={c.sev} lg>{c.kyc}</Tag></td>
                    <td>{c.rel}</td>
                    <td className="small" style={{ color: c.flag === '—' ? 'var(--muted)' : c.sev === 'bad' ? 'var(--danger)' : 'var(--warn-text)' }}>{c.flag}</td>
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
