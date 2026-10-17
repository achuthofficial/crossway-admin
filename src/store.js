import { useCallback, useEffect, useRef, useState } from 'react';
import { AMBS, AUDIT, FLAGS, KYC, NAV, PAY, ROLES, SHIFTS, TIX, TS } from './data.js';

const SCREENS = NAV.map(n => n[0]);
const now = () => new Date().toTimeString().slice(0, 5);

const readHash = () => {
  const h = window.location.hash.replace(/^#\/?/, '');
  return SCREENS.includes(h) ? h : 'dashboard';
};

/** All prototype state and mutations. Pure client-side; resets on reload. */
export function useCommand() {
  const [screen, setScreenRaw] = useState(readHash);
  const [role, setRole] = useState('super');
  const [city, setCity] = useState('Bengaluru');
  const [range, setRange] = useState('Today');
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [edgeOpen, setEdgeOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const [shifts, setShifts] = useState(SHIFTS);
  const [kyc, setKyc] = useState(KYC);
  const [ts, setTs] = useState(TS);
  const [pay, setPay] = useState(PAY);
  const [flags, setFlags] = useState(FLAGS);
  const [tix, setTix] = useState(TIX);
  const [audit, setAudit] = useState(AUDIT);
  const [ambs, setAmbs] = useState(AMBS);
  const [wageBlock, setWageBlock] = useState(true);
  const [released, setReleased] = useState(false);

  const toastTimer = useRef();
  const roleObj = ROLES.find(r => r.id === role) || ROLES[0];

  // Keep the URL hash in sync so screens are linkable on a static host.
  const setScreen = useCallback(s => {
    setScreenRaw(s);
    setNavOpen(false);
    if (window.location.hash !== '#/' + s) window.history.replaceState(null, '', '#/' + s);
  }, []);
  useEffect(() => {
    const on = () => setScreenRaw(readHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  // Esc closes the top-most overlay.
  useEffect(() => {
    const on = e => {
      if (e.key !== 'Escape') return;
      if (modal) setModal(null);
      else if (edgeOpen) setEdgeOpen(false);
      else if (navOpen) setNavOpen(false);
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [modal, edgeOpen, navOpen]);

  const say = useCallback(msg => {
    clearTimeout(toastTimer.current);
    setToast({ msg, key: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  const log = useCallback(
    (action, entity) => setAudit(a => [{ t: now(), who: 'Asha N. (' + roleObj.label + ')', action, entity }, ...a]),
    [roleObj.label],
  );

  const patcher = setter => (id, p) => setter(list => list.map(x => (x.id === id ? { ...x, ...p } : x)));
  const remover = setter => id => setter(list => list.filter(x => x.id !== id));

  return {
    screen, setScreen, role, setRole, roleObj, city, setCity, range, setRange, q, setQ,
    modal, setModal, toast, say, log, edgeOpen, setEdgeOpen, navOpen, setNavOpen,
    shifts, patchShift: patcher(setShifts),
    kyc, removeKyc: remover(setKyc),
    ts, patchTs: patcher(setTs),
    pay, setPay, patchPay: patcher(setPay),
    flags, removeFlag: remover(setFlags),
    tix, patchTix: patcher(setTix),
    audit,
    ambs, patchAmb: patcher(setAmbs),
    wageBlock, setWageBlock, released, setReleased,
    now,
  };
}
