import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/ui/Pagination';
import { KpiCard } from '../components/ui/KpiCard';
import { QrCodeRenderer } from '../../components/ui/QrCodeRenderer';
import { ModuleSkeleton } from '../components/ui/LoadingSkeleton';
import { ScannerDetailView } from '../components/scanners/ScannerDetailView';
import {
  Star, Plus, CheckCircle2, QrCode, Sparkles, Edit2, Power, Trash2, TrendingUp,
  X, Clock, Pause, Play, ChevronDown, ExternalLink, Stethoscope, Check, ArrowLeft, Search,
  Store, Utensils, ShoppingBag, Building, Scissors, Dumbbell, GraduationCap, Briefcase,
  ArrowUp, ArrowDown
} from 'lucide-react';

/* ---------- helpers ---------- */
const uid = (p = 'id') => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const slugify = (s = '') => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const opt = (label) => ({ id: uid('o'), label: label.trim(), value: label.trim(), isActive: true });
const makeQ = (question, labels) => ({ id: uid('q'), question: question.trim(), type: 'dropdown', required: true, options: labels.map(opt) });
const toLocalInput = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

/* Extract Place ID from raw text or Google URLs */
const extractPlaceId = (text = '') => {
  const str = String(text || '').trim();
  if (/^ChIJ[a-zA-Z0-9_-]{10,}$/i.test(str)) return str;
  const matchParam = str.match(/[?&](?:placeid|place_id)=([^&#]+)/i);
  if (matchParam && matchParam[1]) return decodeURIComponent(matchParam[1]);
  const matchChIJ = str.match(/(ChIJ[a-zA-Z0-9_-]{15,})/);
  if (matchChIJ && matchChIJ[1]) return matchChIJ[1];
  return '';
};

/* System generates the exact direct Google review link */
const buildReviewUrl = (placeId = '', pageUrl = '') => {
  const pId = (placeId || '').trim();
  const url = (pageUrl || '').trim();
  if (pId) return `https://search.google.com/local/writereview?placeid=${pId}`;
  if (!url) return '';
  const extracted = extractPlaceId(url);
  if (extracted) return `https://search.google.com/local/writereview?placeid=${extracted}`;
  if (url.includes('search.google.com/local/writereview') || url.endsWith('/review')) return url;
  if (/^https?:\/\/g\.page\/[^\s]+$/i.test(url)) return url.replace(/\/+$/, '') + '/review';
  return url;
};

const defaultQuestions = () => [
  makeQ('What did you like most?', ['Food & Quality', 'Customer Service', 'Ambience & Vibe', 'Staff Attention']),
  makeQ('What stood out to you?', ['Friendly Staff', 'Quick Service', 'Great Presentation', 'Clean Environment']),
  makeQ('How was your overall experience?', ['Excellent', 'Very Good', 'Good', 'Satisfactory'])
];

const hospitalQuestions = () => [
  makeQ('How was your consultation?', ["Doctor's care & diagnosis", 'Clear treatment explanation', 'Patient, attentive listening', 'Nursing & hospital support']),
  makeQ('What stood out during your visit?', ['Compassionate staff', 'Clean facilities', 'Minimal waiting time', 'Advanced equipment']),
  makeQ('How was your overall treatment?', ['Excellent', 'Very good', 'Good', 'Satisfactory'])
];

const INDUSTRIES = [
  ['General Business', Store, 'General'],
  ['Hospital / Healthcare', Stethoscope, 'Hospital & clinic'],
  ['Restaurant & Hospitality', Utensils, 'Restaurant'],
  ['Retail & E-Commerce', ShoppingBag, 'Retail'],
  ['Real Estate & Architecture', Building, 'Real estate'],
  ['Salon, Spa & Wellness', Scissors, 'Salon & spa'],
  ['Fitness & Gym', Dumbbell, 'Fitness'],
  ['Education & Coaching', GraduationCap, 'Education'],
  ['Corporate & Professional Services', Briefcase, 'Services'],
  ['Other', Store, 'Custom / Other']
];

const PAUSE_PRESETS = [
  [0, 'Never'], [60, '1 hour'], [360, '6 hours'], [720, '12 hours'],
  [1440, '1 day'], [2880, '2 days'], [10080, '1 week'], ['custom', 'Pick a time']
];
const DEMO_PRESETS = [[15, '15 min'], [30, '30 min'], [60, '1 hour'], [120, '2 hours'], [360, '6 hours'], [1440, '1 day'], [2880, '2 days']];

const emptyForm = () => ({
  id: null, clientId: '', clientName: '', name: '', slug: '', slugTouched: false,
  industry: 'General Business', customIndustry: '', doctorName: '', doctors: [], hospitalServices: [],
  googleUrl: '', placeId: '', googleReviewUrl: '', ratingRequired: true, status: 'Active',
  isDemo: false, demoDurationMinutes: 60, demoExpiresAt: null,
  autoPauseEnabled: false, autoPauseDurationMinutes: 0, autoPauseAt: '', pausePreset: 0,
  questions: [],
  aiSettings: { tone: 'Friendly & Professional', length: 'Medium' },
  redirectTimer: 5
});

const countdown = (iso) => {
  if (!iso) return '';
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return 'Expired';
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m left`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m left`;
  return `${Math.floor(h / 24)}d ${h % 24}h left`;
};

/* ---------- small UI pieces ---------- */
const inputCls = 'w-full bg-white border border-[#0A0A0A]/15 rounded-lg px-3 py-2.5 text-sm text-[#111] placeholder:text-[#0A0A0A]/35 focus:outline-none focus:border-[#8E722A] focus:ring-2 focus:ring-[#8E722A]/20 transition';

const Field = ({ label, hint, error, children }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-[#111]">{label}</label>}
    {children}
    {error ? <p className="text-xs text-red-600 font-medium">{error}</p> : hint ? <p className="text-xs text-[#685C43]">{hint}</p> : null}
  </div>
);

const Segmented = ({ value, onChange, options }) => (
  <div className="inline-flex flex-wrap gap-1 p-1 bg-[#EFEBDF] rounded-lg">
    {options.map(([v, label]) => (
      <button
        key={String(v)} type="button" onClick={() => onChange(v)} aria-pressed={value === v}
        className={`px-3 py-1.5 text-sm rounded-md transition cursor-pointer ${value === v ? 'bg-white text-[#111] font-medium shadow-sm' : 'text-[#685C43] hover:text-[#111]'}`}
      >{label}</button>
    ))}
  </div>
);

const Section = ({ id, title, desc, children, tone = 'default' }) => (
  <section id={id} className={`scroll-mt-28 rounded-2xl border p-5 sm:p-6 space-y-5 ${tone === 'health' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-[#0A0A0A]/10 shadow-xs'}`}>
    <header>
      <h3 className="font-display text-xl text-[#111] font-semibold">{title}</h3>
      {desc && <p className="text-sm text-[#685C43] mt-0.5 max-w-prose">{desc}</p>}
    </header>
    {children}
  </section>
);

/* Chip input: type + Enter to add, × to remove */
const ChipInput = ({ items, onAdd, onRemove, placeholder, upper }) => {
  const [text, setText] = useState('');
  const commit = () => {
    const v = (upper ? text.trim().toUpperCase() : text.trim());
    if (!v || items.some((i) => (i.label ?? i) === v)) return setText('');
    onAdd(v); setText('');
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border border-[#0A0A0A]/15 rounded-lg focus-within:border-[#8E722A] focus-within:ring-2 focus-within:ring-[#8E722A]/20">
      {items.map((it, i) => (
        <span key={it.id || it} className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 bg-[#F3EEDD] text-[#111] rounded-md text-sm">
          {it.label ?? it}
          <button type="button" onClick={() => onRemove(i)} aria-label={`Remove ${it.label ?? it}`} className="p-0.5 rounded hover:bg-black/10 cursor-pointer"><X className="w-3 h-3" /></button>
        </span>
      ))}
      <input
        value={text} onChange={(e) => setText(e.target.value)} placeholder={items.length ? 'Add another…' : placeholder}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit(); } if (e.key === 'Backspace' && !text && items.length) onRemove(items.length - 1); }}
        onBlur={commit}
        className="flex-1 min-w-[140px] px-1.5 py-1 text-sm bg-transparent focus:outline-none"
      />
    </div>
  );
};

/* Live customer-facing preview */
const PhonePreview = ({ form }) => {
  const [qi, setQi] = useState(0);
  const q = form.questions && form.questions.length > 0 ? form.questions[Math.min(qi, form.questions.length - 1)] : null;
  const isHealth = form.industry === 'Hospital / Healthcare';
  return (
    <div className="rounded-3xl border-[6px] border-[#1B1B1B] bg-[#FBFAF6] overflow-hidden shadow-xl">
      <div className="px-4 pt-5 pb-3 text-center border-b border-[#0A0A0A]/08">
        <div className="text-[11px] text-[#685C43]">{form.clientName || 'Your client'}</div>
        <div className="font-display text-lg leading-tight text-[#111]">{form.name || 'Scanner title'}</div>
        <div className="flex justify-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((n) => <Star key={n} className="w-5 h-5 text-[#8E722A] fill-[#8E722A]/80" />)}
        </div>
        {!form.ratingRequired && <div className="text-[10px] text-[#685C43] mt-1">Rating is optional</div>}
      </div>
      <div className="p-4 space-y-3 min-h-[220px]">
        {isHealth && (form.doctorName || form.doctors.length > 0) && (
          <div className="text-xs bg-white border border-[#0A0A0A]/12 rounded-lg px-3 py-2 text-[#685C43] flex justify-between">
            <span>{form.doctorName ? `Consulted: Dr. ${form.doctorName.replace(/^Dr\.\s*/i, '')}` : 'Who treated you?'}</span><ChevronDown className="w-4 h-4" />
          </div>
        )}
        {q ? (
          <div>
            <div className="text-sm font-medium text-[#111] mb-2">{q.question || 'Your question'}</div>
            <div className="flex flex-wrap gap-1.5">
              {(q.options || []).map((o) => <span key={o.id || o.label} className="px-2.5 py-1 text-xs rounded-full border border-[#8E722A]/40 text-[#5d4a18] bg-white">{o.label || o.value || '…'}</span>)}
            </div>
          </div>
        ) : (
          <div className="text-xs text-[#685C43] text-center py-4 px-2 bg-[#FAF8F3] rounded-xl border border-dashed border-[#0A0A0A]/10">
            Direct review mode (no questions). Customers review directly with star ratings.
          </div>
        )}
        {isHealth && form.hospitalServices.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {form.hospitalServices.slice(0, 5).map((s) => <span key={s} className="px-2 py-0.5 text-[10px] rounded bg-emerald-100 text-emerald-900">{s}</span>)}
            {form.hospitalServices.length > 5 && <span className="text-[10px] text-[#685C43]">+{form.hospitalServices.length - 5}</span>}
          </div>
        )}
        <div className="w-full py-2 text-center text-xs font-medium rounded-lg bg-[#111] text-white">Write my review</div>
      </div>
      {form.questions.length > 1 && (
        <div className="flex justify-center gap-1.5 pb-3">
          {form.questions.map((_, i) => (
            <button key={i} type="button" onClick={() => setQi(i)} aria-label={`Preview question ${i + 1}`} className={`h-1.5 rounded-full transition-all cursor-pointer ${i === qi ? 'w-5 bg-[#8E722A]' : 'w-1.5 bg-[#0A0A0A]/20'}`} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================ */
/* MAIN REVIEW SCANNERS MODULE                                  */
/* ============================================================ */
export const ReviewScannersModule = () => {
  const { reviewScanners, clients, addScanner, updateScanner, deleteScanner, addClient, isLoading } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();
  const { id: routeScannerId } = useParams();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [openQ, setOpenQ] = useState(0);
  const [saving, setSaving] = useState(false);
  const [qrTarget, setQrTarget] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [quickPause, setQuickPause] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState('');

  const isFormRoute = location.pathname.endsWith('/scanners/create') || isFormOpen;
  const isDetailRoute = Boolean(routeScannerId && routeScannerId !== 'create' && !isFormRoute);

  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };
  const patch = (p) => setForm((f) => ({ ...f, ...p }));

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  // Lock background body scroll when modals are open & handle ESC
  useEffect(() => {
    const hasModal = Boolean(qrTarget || quickPause || confirmDelete || confirmStatus || newClientOpen);
    if (hasModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (qrTarget) setQrTarget(null);
        if (quickPause) setQuickPause(null);
        if (confirmDelete) setConfirmDelete(null);
        if (confirmStatus) setConfirmStatus(null);
        if (newClientOpen) setNewClientOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [qrTarget, quickPause, confirmDelete, confirmStatus, newClientOpen]);

  /* Find current scanner for details view */
  const activeScannerForDetails = useMemo(() => {
    if (!routeScannerId || routeScannerId === 'create') return null;
    return (reviewScanners || []).find(
      s => s.id === routeScannerId || s._id === routeScannerId || s.slug === routeScannerId
    );
  }, [reviewScanners, routeScannerId]);

  /* ----- open / close form ----- */
  const openCreate = (demo = false) => {
    setEditMode(false); setErrors({}); setOpenQ(0);
    const base = emptyForm();
    if (demo) {
      Object.assign(base, {
        isDemo: true, clientName: 'Demo Showcase', name: 'Demo Review Scanner',
        slug: `demo-${Math.random().toString(36).slice(2, 6)}`, slugTouched: true,
        placeId: 'ChIJDemoPreview2026',
        googleUrl: 'https://maps.google.com/?cid=1029384756',
        googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJDemoPreview2026',
        demoDurationMinutes: 60, autoPauseEnabled: true, autoPauseDurationMinutes: 60
      });
    }
    setForm(base); setIsFormOpen(true); navigate('/admin/scanners/create');
  };

  const openEdit = (s) => {
    const isPreset = INDUSTRIES.some(([v]) => v !== 'Other' && v.toLowerCase() === (s.industry || '').toLowerCase());
    const isCustom = !isPreset && Boolean(s.industry && s.industry !== 'General Business');
    setEditMode(true); setErrors({}); setOpenQ(-1);
    const dur = s.autoPauseDurationMinutes || 0;
    const gUrl = s.googleUrl || '';
    const pId = s.placeId || extractPlaceId(s.googleReviewUrl) || extractPlaceId(gUrl) || '';
    const gReviewUrl = s.googleReviewUrl || buildReviewUrl(pId, gUrl);
    setForm({
      ...emptyForm(), ...s,
      industry: isCustom ? 'Other' : (s.industry || 'General Business'),
      customIndustry: isCustom ? s.industry : '',
      id: s.id || s._id, clientName: s.clientName || s.businessName || '',
      name: s.name || s.placeName || '', slug: s.slug || '', slugTouched: true,
      doctorName: s.doctorName || (s.doctors?.[0]?.name ? s.doctors[0].name.replace(/^Dr\.\s*/i, '') : ''),
      doctors: Array.isArray(s.doctors) ? s.doctors : [],
      hospitalServices: Array.isArray(s.hospitalServices) ? s.hospitalServices : [],
      googleUrl: gUrl,
      placeId: pId,
      googleReviewUrl: gReviewUrl,
      ratingRequired: s.ratingRequired !== false,
      autoPauseEnabled: !!s.autoPauseEnabled,
      autoPauseAt: s.autoPauseAt ? toLocalInput(new Date(s.autoPauseAt)) : '',
      pausePreset: !s.autoPauseEnabled ? 0 : PAUSE_PRESETS.some(([v]) => v === dur && dur > 0) ? dur : 'custom',
      questions: Array.isArray(s.questions) ? s.questions : [],
      aiSettings: s.aiSettings || { tone: 'Friendly & Professional', length: 'Medium' },
      redirectTimer: s.redirectTimer ?? 5
    });
    setIsFormOpen(true); navigate('/admin/scanners/create');
  };

  const closeForm = () => {
    setIsFormOpen(false);
    if (form.id) {
      navigate(`/admin/scanners/${form.id}`);
    } else {
      navigate('/admin/scanners');
    }
  };

  /* ----- form handlers ----- */
  const setTitle = (name) => setForm((f) => ({ ...f, name, slug: f.slugTouched ? f.slug : slugify(name) }));
  const pickClient = (clientName) => {
    const c = clients.find((x) => x.name === clientName);
    setForm((f) => ({
      ...f, clientName, clientId: c ? c.id || c._id : f.clientId,
      name: f.name || (clientName ? `${clientName} Review Scanner` : ''),
      slug: f.slugTouched || f.slug ? f.slug : slugify(clientName ? `${clientName}-review` : '')
    }));
  };
  const setIndustry = (industry) => setForm((f) => ({ ...f, industry }));

  const handlePageUrlChange = (val) => {
    const extracted = extractPlaceId(val);
    setForm((f) => {
      const newPlaceId = extracted || f.placeId;
      const generated = buildReviewUrl(newPlaceId, val);
      return { ...f, googleUrl: val, placeId: newPlaceId, googleReviewUrl: generated };
    });
  };

  const handlePlaceIdChange = (val) => {
    const cleanId = val.trim();
    setForm((f) => {
      const generated = buildReviewUrl(cleanId, f.googleUrl);
      return { ...f, placeId: cleanId, googleReviewUrl: generated };
    });
  };

  const toggleDemo = (isDemo) => setForm((f) => ({
    ...f, isDemo,
    clientName: isDemo ? f.clientName || 'Demo Showcase' : f.clientName === 'Demo Showcase' ? '' : f.clientName,
    name: isDemo && !f.name ? 'Demo Review Scanner' : f.name,
    googleReviewUrl: isDemo && !f.googleReviewUrl ? 'https://search.google.com/local/writereview?placeid=ChIJDemoPreview2026' : f.googleReviewUrl,
    autoPauseEnabled: isDemo ? true : f.autoPauseEnabled,
    autoPauseDurationMinutes: isDemo ? f.demoDurationMinutes : f.autoPauseDurationMinutes
  }));

  const updateQ = (qi, fn) => setForm((f) => ({ ...f, questions: f.questions.map((q, i) => (i === qi ? fn(q) : q)) }));
  const addQ = () => { setForm((f) => ({ ...f, questions: [...f.questions, makeQ('', ['Option 1', 'Option 2'])] })); setOpenQ(form.questions.length); };
  const removeQ = (qi) => setForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== qi) }));
  const moveQ = (qi, dir) => setForm((f) => {
    const arr = [...f.questions]; const j = qi + dir;
    if (j < 0 || j >= arr.length) return f;
    [arr[qi], arr[j]] = [arr[j], arr[qi]]; return { ...f, questions: arr };
  });

  const addDoctor = () => setForm((f) => ({ ...f, doctors: [...f.doctors, { id: uid('doc'), name: 'Dr. ', department: '', qualification: '', available: true }] }));
  const updateDoctor = (i, p) => setForm((f) => ({ ...f, doctors: f.doctors.map((d, k) => (k === i ? { ...d, ...p } : d)) }));
  const loadHospitalPreset = () => {
    setForm((f) => ({
      ...f, industry: 'Hospital / Healthcare', questions: hospitalQuestions(),
      doctors: [
        { id: uid('doc'), name: 'Dr. Rajesh Sharma', department: 'Cardiology', qualification: 'MD, DM', available: true },
        { id: uid('doc'), name: 'Dr. Sneha Verma', department: 'Pediatrics', qualification: 'MBBS, MD', available: true },
        { id: uid('doc'), name: 'Dr. Ananya Deshmukh', department: 'Neurology', qualification: 'MD, DM', available: true }
      ],
      hospitalServices: f.hospitalServices.length ? f.hospitalServices : ['GENERAL CONSULTATION', 'SURGERY', 'DIAGNOSTICS', 'EMERGENCY CARE']
    }));
    notify('Sample doctors, services and questions loaded. Edit them to match this hospital.');
  };

  const saveClient = async (e) => {
    e.preventDefault();
    if (!newClient.name.trim()) return;
    try {
      const created = await addClient(newClient);
      setForm((f) => ({
        ...f, clientName: newClient.name, clientId: created?.id || created?._id || '',
        name: f.name || `${newClient.name} Review Scanner`,
        slug: f.slugTouched || f.slug ? f.slug : `${slugify(newClient.name)}-review`
      }));
      notify(`Client "${newClient.name}" added and selected.`);
    } catch { notify('Could not save the client. Try again.'); }
    setNewClientOpen(false); setNewClient({ name: '', email: '', phone: '' });
  };

  /* ----- validation + submit ----- */
  const validate = () => {
    const e = {};
    if (!form.name.trim() && !form.clientName.trim()) e.name = 'Give the scanner a title.';
    if (!form.slug.trim()) e.slug = 'Add a URL slug.';
    const finalReviewUrl = form.googleReviewUrl.trim() || buildReviewUrl(form.placeId, form.googleUrl);
    if (!finalReviewUrl) {
      e.url = 'Provide either a Google Place ID or Google Page/Maps link to generate the review URL.';
    } else if (!/^https?:\/\//i.test(finalReviewUrl)) {
      e.url = 'Review link must start with https://';
    }
    if (form.questions?.length > 0 && form.questions.some((q) => !q.question?.trim() || (q.options || []).length < 2)) {
      e.questions = 'Every question added needs text and at least two options.';
    }
    if (form.autoPauseEnabled && !form.isDemo && !form.autoPauseAt) e.pause = 'Choose when the scanner should pause.';
    setErrors(e);
    if (Object.keys(e).length) {
      const target = e.name || e.slug ? 'sec-identity' : e.url ? 'sec-url' : e.questions ? 'sec-questions' : 'sec-availability';
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return !Object.keys(e).length;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const name = form.name.trim() || form.clientName.trim();
    const client = form.clientName.trim() || name;
    const pId = form.placeId.trim() || extractPlaceId(form.googleReviewUrl) || extractPlaceId(form.googleUrl) || '';
    const reviewUrl = form.googleReviewUrl.trim() || buildReviewUrl(pId, form.googleUrl);
    const pageUrl = form.googleUrl.trim() || reviewUrl;
    let finalIndustry = (form.industry || 'General Business').trim();
    if (finalIndustry === 'Other' && form.customIndustry?.trim()) {
      finalIndustry = form.customIndustry.trim();
    } else if (finalIndustry === 'Other') {
      finalIndustry = 'General Business';
    }
    const { slugTouched, pausePreset, customIndustry, ...rest } = form;
    const payload = {
      ...rest,
      name,
      clientName: client,
      businessName: client,
      placeId: pId,
      googleUrl: pageUrl,
      googleReviewUrl: reviewUrl,
      industry: finalIndustry,
      doctorName: form.doctorName ? (form.doctorName.startsWith('Dr.') ? form.doctorName : `Dr. ${form.doctorName}`) : '',
      demoDurationMinutes: Number(form.demoDurationMinutes) || 60
    };

    if (form.isDemo) {
      const exp = new Date(Date.now() + payload.demoDurationMinutes * 60000).toISOString();
      Object.assign(payload, { demoExpiresAt: exp, autoPauseAt: exp, autoPauseEnabled: true });
    } else if (form.autoPauseEnabled) {
      payload.autoPauseAt = form.autoPauseDurationMinutes > 0
        ? new Date(Date.now() + form.autoPauseDurationMinutes * 60000).toISOString()
        : new Date(form.autoPauseAt).toISOString();
    } else payload.autoPauseAt = null;
    if (!editMode) delete payload.id;

    setSaving(true);
    try {
      if (editMode && form.id) {
        await updateScanner(form.id, payload);
        notify('Scanner changes saved.');
        setIsFormOpen(false);
        navigate(`/admin/scanners/${form.id}`);
      } else {
        const created = await addScanner(payload);
        notify('Scanner deployed. Its QR code is ready.');
        setIsFormOpen(false);
        if (created?.id || created?._id) {
          navigate(`/admin/scanners/${created.id || created._id}`);
        } else {
          navigate('/admin/scanners');
        }
      }
    } catch (err) {
      console.error(err);
      notify('Could not save the scanner. Check your connection and try again.');
    } finally { setSaving(false); }
  };

  /* ----- list actions ----- */
  const toggleStatus = async (s) => {
    const next = s.status === 'Active' ? 'Paused' : 'Active';
    try {
      const res = await updateScanner(s.id || s._id, { status: next, autoPauseEnabled: next === 'Active' ? s.autoPauseEnabled : false });
      notify(next === 'Active' ? 'Scanner activated.' : 'Scanner paused.');
      return res;
    } catch (err) {
      notify('Failed to update scanner status.');
      throw err;
    } finally {
      setConfirmStatus(null);
    }
  };

  const applyQuickPause = () => {
    const { scanner: s, preset, custom } = quickPause;
    const id = s.id || s._id;
    if (preset === 'clear') updateScanner(id, { autoPauseEnabled: false, autoPauseAt: null });
    else {
      const at = preset === 'custom' ? new Date(custom) : new Date(Date.now() + Number(preset) * 60000);
      if (isNaN(at)) return notify('Pick a date and time first.');
      updateScanner(id, { status: 'Active', autoPauseEnabled: true, autoPauseAt: at.toISOString(), autoPauseDurationMinutes: preset === 'custom' ? 0 : Number(preset) });
    }
    notify(preset === 'clear' ? 'Auto-pause removed.' : 'Auto-pause scheduled.');
    setQuickPause(null);
  };

  const filtered = useMemo(() => (reviewScanners || []).filter((s) => {
    const q = search.toLowerCase();
    const hit = [s.clientName, s.businessName, s.name, s.placeName, s.slug, s.industry, s.doctorName].some((v) => (v || '').toLowerCase().includes(q));
    if (!hit) return false;
    if (statusFilter === 'Demo') return s.isDemo || (s.name || '').toLowerCase().includes('demo');
    return statusFilter === 'All' || (s.status || 'Active') === statusFilter;
  }), [reviewScanners, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const Toast = () => toast ? (
    <div role="status" className="fixed top-4 right-4 z-[60] max-w-sm bg-[#111] text-[#F7F5EF] px-4 py-3 rounded-lg shadow-xl text-sm flex items-start gap-2 border border-[#8E722A]">
      <CheckCircle2 className="w-4 h-4 text-[#C9A44C] mt-0.5 shrink-0" /><span>{toast}</span>
    </div>
  ) : null;

  /* ============================================================ */
  /* DETAIL VIEW                                                  */
  /* ============================================================ */
  if (isDetailRoute) {
    return (
      <div className="w-full font-body">
        <Toast />
        <ScannerDetailView
          scannerId={routeScannerId}
          scanner={activeScannerForDetails}
          onEdit={(s) => openEdit(s)}
          onDelete={async (s) => {
            await deleteScanner(s.id || s._id);
            notify(`Deleted scanner "${s.name || s.clientName}".`);
          }}
          onToggleStatus={(s) => toggleStatus(s)}
          onUpdateQuestions={async (sId, newQs) => {
            const updated = await updateScanner(sId, { questions: newQs });
            return updated;
          }}
          onQuickPause={(qp) => setQuickPause(qp)}
          notify={notify}
        />
        {/* Render Auto-Pause Modal if triggered from Details */}
        {quickPause && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setQuickPause(null)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#0A0A0A]/10 my-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#111]">Auto-pause timer</h3>
                  <p className="text-sm text-[#685C43]">{quickPause.scanner.clientName}</p>
                </div>
                <button onClick={() => setQuickPause(null)} aria-label="Close" className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <Segmented value={quickPause.preset} onChange={(v) => setQuickPause({ ...quickPause, preset: v })}
                options={[['60', '1 hour'], ['360', '6 hours'], ['1440', '1 day'], ['2880', '2 days'], ['10080', '1 week'], ['custom', 'Pick a time'], ['clear', 'Remove timer']]} />
              {quickPause.preset === 'custom' && <input type="datetime-local" className={inputCls} value={quickPause.custom} onChange={(e) => setQuickPause({ ...quickPause, custom: e.target.value })} />}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#0A0A0A]/10">
                <button onClick={() => setQuickPause(null)} className="px-4 py-2 text-sm text-[#685C43] hover:text-[#111] cursor-pointer">Cancel</button>
                <button onClick={applyQuickPause} className="px-5 py-2 text-sm font-medium rounded-lg bg-[#8E722A] text-white hover:bg-[#785E22] cursor-pointer">{quickPause.preset === 'clear' ? 'Remove timer' : 'Set timer'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ============================================================ */
  /* FORM VIEW (CREATE / EDIT)                                    */
  /* ============================================================ */
  if (isFormRoute) {
    const isHealth = form.industry === 'Hospital / Healthcare';
    const nav = [
      ['sec-identity', 'Basics'],
      ['sec-url', 'Google link'],
      ['sec-questions', 'Questions'],
      ['sec-experience', 'Experience'],
      ['sec-availability', 'Availability']
    ];

    return (
      <div className="w-full font-body max-w-7xl mx-auto pb-12">
        <Toast />
        <div className="flex items-center justify-between gap-3 pb-5">
          <div className="flex items-center gap-3">
            <button type="button" onClick={closeForm} className="p-2 rounded-lg border border-[#0A0A0A]/12 bg-white hover:bg-[#F3EEDD] cursor-pointer" aria-label="Back to scanners"><ArrowLeft className="w-4 h-4" /></button>
            <div>
              <h2 className="font-display text-2xl text-[#111] font-semibold leading-tight">{editMode ? 'Edit review scanner' : 'New review scanner'}</h2>
              <p className="text-sm text-[#685C43]">Customers scan a QR code, answer a few taps, and get a ready-to-post Google review.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={closeForm} className="px-4 py-2 text-sm text-[#685C43] hover:text-[#111] cursor-pointer">Cancel</button>
            <button type="submit" form="scanner-form" disabled={saving} className="px-5 py-2.5 text-sm font-medium rounded-lg bg-[#111] text-white hover:bg-[#8E722A] disabled:opacity-60 cursor-pointer shadow-xs transition-colors">
              {saving ? 'Saving…' : editMode ? 'Save changes' : 'Deploy scanner'}
            </button>
          </div>
        </div>

        <form id="scanner-form" onSubmit={submit} noValidate className="grid grid-cols-1 lg:grid-cols-[150px_minmax(0,1fr)_300px] gap-6 items-start">
          {/* section nav */}
          <nav className="hidden lg:block sticky top-24 text-sm space-y-0.5" aria-label="Form sections">
            {nav.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                className="block px-3 py-1.5 rounded-md text-[#685C43] hover:bg-[#EFEBDF] hover:text-[#111] transition">{label}</a>
            ))}
          </nav>

          {/* main column */}
          <div className="space-y-5 min-w-0">
            <Section id="sec-identity" title="Who is this scanner for?">
              <Segmented value={form.isDemo ? 'demo' : 'client'} onChange={(v) => toggleDemo(v === 'demo')} options={[['client', 'A client'], ['demo', 'Sales demo']]} />
              {form.isDemo && (
                <div className="p-4 rounded-xl bg-[#F5F0FF] border border-purple-200 space-y-3">
                  <p className="text-sm text-purple-900"><Sparkles className="inline w-4 h-4 mr-1 -mt-0.5" />Demo scanners need no client account and switch themselves off after the time you pick.</p>
                  <Field label="Stays live for">
                    <Segmented value={form.demoDurationMinutes} onChange={(m) => patch({ demoDurationMinutes: m, autoPauseDurationMinutes: m, autoPauseEnabled: true })} options={DEMO_PRESETS} />
                  </Field>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                {form.isDemo ? (
                  <Field label="Brand name for the demo">
                    <input className={inputCls} value={form.clientName} placeholder="e.g. The Grand Luxe Cafe" onChange={(e) => { const v = e.target.value; setForm((f) => ({ ...f, clientName: v, name: `${v} Review Scanner`, slug: f.slugTouched ? f.slug : `${slugify(v)}-demo` })); }} />
                  </Field>
                ) : (
                  <Field label="Client" hint="Optional. You can link a client later.">
                    <div className="flex gap-2">
                      <select className={inputCls} value={form.clientName} onChange={(e) => pickClient(e.target.value)}>
                        <option value="">No client yet</option>
                        {clients.map((c) => <option key={c.id || c._id} value={c.name}>{c.name}{c.company ? ` (${c.company})` : ''}</option>)}
                      </select>
                      <button type="button" onClick={() => setNewClientOpen(true)} className="shrink-0 inline-flex items-center gap-1 px-3 rounded-lg bg-[#111] text-white text-sm hover:bg-[#8E722A] cursor-pointer"><Plus className="w-4 h-4" />New</button>
                    </div>
                  </Field>
                )}
                <Field label="Scanner title" error={errors.name} hint="Staff see this in the dashboard.">
                  <input className={inputCls} value={form.name} placeholder="e.g. Reception desk standee" onChange={(e) => setTitle(e.target.value)} />
                </Field>
              </div>

              {/* Doctor / Specialist field */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Doctor / Lead Specialist" hint="Optional. If provided, reviews can refer to Dr. [Name].">
                  <input
                    className={inputCls}
                    value={form.doctorName || ''}
                    placeholder="e.g. Rahul Sharma"
                    onChange={(e) => patch({ doctorName: e.target.value })}
                  />
                </Field>
                <Field label="Review page address" error={errors.slug} hint="Customers land here after scanning.">
                  <div className="flex items-stretch">
                    <span className="px-3 inline-flex items-center text-sm text-[#685C43] bg-[#EFEBDF] border border-r-0 border-[#0A0A0A]/15 rounded-l-lg truncate">{typeof window !== 'undefined' ? window.location.host : ''}/review/</span>
                    <input className={`${inputCls} rounded-l-none`} value={form.slug} placeholder="apex-hospital-review" onChange={(e) => patch({ slug: slugify(e.target.value), slugTouched: true })} />
                  </div>
                </Field>
              </div>

              <Field label="Type of business">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INDUSTRIES.map(([val, Icon, label]) => (
                    <button key={val} type="button" onClick={() => setIndustry(val)} aria-pressed={form.industry === val}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm text-left transition cursor-pointer ${form.industry === val ? 'border-[#8E722A] bg-[#F8F1DC] text-[#111] font-medium shadow-xs' : 'border-[#0A0A0A]/12 bg-white text-[#3b3425] hover:border-[#8E722A]/50 hover:bg-[#FAF8F3]'}`}>
                      <Icon className={`w-4 h-4 shrink-0 ${form.industry === val ? 'text-[#8E722A]' : 'text-[#685C43]'}`} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                {form.industry === 'Other' && (
                  <div className="mt-2.5 p-3 bg-amber-50/90 border border-amber-300 rounded-xl space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold text-amber-950 flex items-center justify-between">
                      <span>Specify Business Category:</span>
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-200/70 px-1.5 py-0.2 rounded font-semibold">
                        Manual Type
                      </span>
                    </label>
                    <input
                      type="text"
                      value={form.customIndustry || ''}
                      onChange={(e) => setForm((f) => ({ ...f, customIndustry: e.target.value }))}
                      placeholder="e.g. Photography Studio, Dental Clinic, Legal & Law Firm..."
                      className={inputCls}
                    />
                    <p className="text-[10.5px] text-amber-800/90 leading-tight">
                      When customers scan this standee, review vocabulary and praise tone will adapt to this category.
                    </p>
                  </div>
                )}
              </Field>
            </Section>

            <Section
              id="sec-url"
              title="Where should happy customers post?"
              desc="Enter the client's Google page link and Place ID. Our system automatically integrates them into a direct 5-star Google review link."
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Google page / Maps link"
                  hint="Client's Google Business Profile or Google Maps link."
                >
                  <input
                    className={inputCls}
                    value={form.googleUrl || ''}
                    placeholder="https://maps.app.goo.gl/... or https://google.com/maps/place/..."
                    onChange={(e) => handlePageUrlChange(e.target.value)}
                  />
                </Field>
                <Field
                  label="Google Place ID"
                  hint="Place ID (e.g. ChIJ... from Google Place ID Finder)."
                >
                  <input
                    className={inputCls}
                    value={form.placeId || ''}
                    placeholder="e.g. ChIJN1t_t_x55zsR2001"
                    onChange={(e) => handlePlaceIdChange(e.target.value)}
                  />
                </Field>
              </div>

              {/* Integrated review link generated by our system */}
              <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#0A0A0A]/12 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#111] uppercase tracking-wider">System-Generated Google Review Link</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">Integrated</span>
                  </div>
                  {form.googleReviewUrl && /^https?:\/\//i.test(form.googleReviewUrl) && (
                    <a
                      href={form.googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#8E722A] hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />Test direct review link
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    className={`${inputCls} bg-white text-xs font-mono`}
                    value={form.googleReviewUrl || ''}
                    placeholder="Review link will generate automatically once you provide Place ID or Page Link"
                    onChange={(e) => patch({ googleReviewUrl: e.target.value })}
                  />
                  <a
                    href={/^https?:\/\//i.test(form.googleReviewUrl) ? form.googleReviewUrl : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 rounded-lg border text-xs font-medium transition ${
                      /^https?:\/\//i.test(form.googleReviewUrl)
                        ? 'border-[#8E722A] bg-white text-[#8E722A] hover:bg-[#F8F1DC] cursor-pointer shadow-xs'
                        : 'border-[#0A0A0A]/10 text-[#0A0A0A]/30 pointer-events-none'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />Test
                  </a>
                </div>
                {errors.url && <p className="text-xs text-red-600 font-medium">{errors.url}</p>}
                <p className="text-[11px] text-[#685C43]">
                  Customers who scan this QR code will be routed directly to Google's review dialog to post their review.
                </p>
              </div>
            </Section>

            {isHealth && (
              <Section id="sec-health" tone="health" title="Doctors and treatments" desc="Patients pick who treated them and what they had done, so the review can name both.">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-emerald-900">{form.doctors.length} doctor{form.doctors.length === 1 ? '' : 's'} · {form.hospitalServices.length} treatment{form.hospitalServices.length === 1 ? '' : 's'}</span>
                  <button type="button" onClick={loadHospitalPreset} className="text-sm px-3 py-1.5 rounded-lg border border-emerald-700 text-emerald-800 hover:bg-emerald-100 cursor-pointer">Fill with sample data</button>
                </div>
                <div className="space-y-2">
                  {form.doctors.length === 0 && <p className="text-sm text-emerald-900 bg-white border border-dashed border-emerald-300 rounded-xl p-4 text-center">No doctors yet. Add the first one below.</p>}
                  {form.doctors.map((d, i) => (
                    <div key={d.id || i} className="grid sm:grid-cols-[1.2fr_1fr_1fr_auto] gap-2 items-center bg-white border border-[#0A0A0A]/10 rounded-xl p-2.5">
                      <input aria-label="Doctor name" className={inputCls} value={d.name} placeholder="Dr. Name" onChange={(e) => updateDoctor(i, { name: e.target.value })} />
                      <input aria-label="Department" className={inputCls} value={d.department} placeholder="Department" onChange={(e) => updateDoctor(i, { department: e.target.value })} />
                      <input aria-label="Qualification" className={inputCls} value={d.qualification} placeholder="Qualification" onChange={(e) => updateDoctor(i, { qualification: e.target.value })} />
                      <div className="flex items-center gap-2 justify-end">
                        <label className="flex items-center gap-1.5 text-xs text-[#685C43] cursor-pointer"><input type="checkbox" checked={d.available !== false} onChange={(e) => updateDoctor(i, { available: e.target.checked })} />Shown</label>
                        <button type="button" aria-label="Remove doctor" onClick={() => setForm((f) => ({ ...f, doctors: f.doctors.filter((_, k) => k !== i) }))} className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addDoctor} className="w-full py-2.5 rounded-xl border border-dashed border-emerald-600/60 text-emerald-800 text-sm hover:bg-emerald-50 inline-flex items-center justify-center gap-1.5 cursor-pointer"><Plus className="w-4 h-4" />Add doctor</button>
                <Field label="Treatments patients can tap" hint="Type a name and press Enter.">
                  <ChipInput upper items={form.hospitalServices} placeholder="e.g. CATARACT SURGERY"
                    onAdd={(v) => setForm((f) => ({ ...f, hospitalServices: [...f.hospitalServices, v] }))}
                    onRemove={(i) => setForm((f) => ({ ...f, hospitalServices: f.hospitalServices.filter((_, k) => k !== i) }))} />
                </Field>
              </Section>
            )}

            <Section id="sec-questions" title="Questions customers answer" desc="Optional. Add questions if you want guided answers, or leave empty to generate QR with zero questions.">
              {errors.questions && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errors.questions}</p>}
              {form.questions.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-[#0A0A0A]/12 bg-[#FAF8F3] text-center text-sm text-[#685C43]">
                  No questions added. The QR scanner will generate reviews directly without question prompts. (Click below to add questions if desired)
                </div>
              ) : (
                <div className="space-y-2">
                  {form.questions.map((q, qi) => {
                    const open = openQ === qi;
                    return (
                      <div key={q.id} className={`rounded-xl border transition ${open ? 'border-[#8E722A] bg-[#FDFBF5]' : 'border-[#0A0A0A]/12 bg-white'}`}>
                        <div className="flex items-center gap-2 px-3 py-2.5">
                          <button type="button" onClick={() => setOpenQ(open ? -1 : qi)} aria-expanded={open} className="flex-1 flex items-center gap-2 text-left min-w-0 cursor-pointer">
                            <ChevronDown className={`w-4 h-4 shrink-0 text-[#685C43] transition-transform ${open ? '' : '-rotate-90'}`} />
                            <span className="truncate text-sm font-medium text-[#111]">{q.question || 'Untitled question'}</span>
                            {!open && <span className="text-xs text-[#685C43] shrink-0">{q.options?.length || 0} options</span>}
                          </button>
                          <button type="button" aria-label="Move up" disabled={qi === 0} onClick={() => moveQ(qi, -1)} className="p-1.5 text-[#685C43] disabled:opacity-25 hover:bg-[#EFEBDF] rounded cursor-pointer"><ArrowUp className="w-3.5 h-3.5" /></button>
                          <button type="button" aria-label="Move down" disabled={qi === form.questions.length - 1} onClick={() => moveQ(qi, 1)} className="p-1.5 text-[#685C43] disabled:opacity-25 hover:bg-[#EFEBDF] rounded cursor-pointer"><ArrowDown className="w-3.5 h-3.5" /></button>
                          <button type="button" aria-label="Delete question" onClick={() => removeQ(qi)} className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        {open && (
                          <div className="px-4 pb-4 space-y-3">
                            <Field label="Question">
                              <input className={inputCls} value={q.question} placeholder="e.g. What did you like most?" onChange={(e) => updateQ(qi, (x) => ({ ...x, question: e.target.value }))} />
                            </Field>
                            <Field label="Answer choices" hint="Type a choice and press Enter. Customers pick one or more.">
                              <ChipInput items={q.options || []} placeholder="e.g. Friendly staff"
                                onAdd={(v) => updateQ(qi, (x) => ({ ...x, options: [...(x.options || []), opt(v)] }))}
                                onRemove={(oi) => updateQ(qi, (x) => ({ ...x, options: (x.options || []).filter((_, k) => k !== oi) }))} />
                            </Field>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <button type="button" onClick={addQ} className="w-full py-2.5 rounded-xl border border-dashed border-[#8E722A] text-[#8E722A] text-sm hover:bg-[#F8F1DC] inline-flex items-center justify-center gap-1.5 cursor-pointer"><Plus className="w-4 h-4" />Add question</button>
            </Section>

            <Section id="sec-experience" title="Customer experience">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Star rating"><Segmented value={form.ratingRequired} onChange={(v) => patch({ ratingRequired: v })} options={[[true, 'Required'], [false, 'Optional']]} /></Field>
                <Field label="Review length"><Segmented value={form.aiSettings.length} onChange={(v) => patch({ aiSettings: { ...form.aiSettings, length: v } })} options={[['Short', 'Short'], ['Medium', 'Medium'], ['Detailed', 'Detailed']]} /></Field>
                <Field label="Review tone" hint="Sets the voice of the generated review."><Segmented value={form.aiSettings.tone} onChange={(v) => patch({ aiSettings: { ...form.aiSettings, tone: v } })} options={[['Friendly & Professional', 'Friendly'], ['Editorial & Luxury', 'Luxury'], ['Short & Direct', 'Direct'], ['Enthusiastic', 'Enthusiastic']]} /></Field>
                <Field label="Send to Google after" hint="Choose Manual to let customers tap when ready."><Segmented value={form.redirectTimer} onChange={(v) => patch({ redirectTimer: v })} options={[[3, '3s'], [5, '5s'], [10, '10s'], [15, '15s'], [0, 'Manual']]} /></Field>
              </div>
            </Section>

            <Section id="sec-availability" title="Availability" desc="Pause scanners that shouldn't collect reviews, or set a timer to switch off automatically.">
              <Field label="Status"><Segmented value={form.status} onChange={(v) => patch({ status: v })} options={[['Active', 'Live'], ['Paused', 'Paused']]} /></Field>
              {!form.isDemo && (
                <Field label="Pause automatically after" error={errors.pause}>
                  <Segmented value={form.autoPauseEnabled ? form.pausePreset : 0}
                    onChange={(v) => {
                      if (v === 0) return patch({ autoPauseEnabled: false, autoPauseDurationMinutes: 0, autoPauseAt: '', pausePreset: 0 });
                      if (v === 'custom') return patch({ autoPauseEnabled: true, autoPauseDurationMinutes: 0, pausePreset: 'custom' });
                      patch({ autoPauseEnabled: true, autoPauseDurationMinutes: v, pausePreset: v, autoPauseAt: toLocalInput(new Date(Date.now() + v * 60000)) });
                    }}
                    options={PAUSE_PRESETS} />
                </Field>
              )}
              {!form.isDemo && form.autoPauseEnabled && (
                <div className="max-w-xs">
                  <Field label="Pauses at (IST)" hint={form.autoPauseDurationMinutes ? 'Counted from the moment you save.' : undefined}>
                    <input type="datetime-local" className={inputCls} value={form.autoPauseAt} onChange={(e) => patch({ autoPauseAt: e.target.value, autoPauseDurationMinutes: 0, pausePreset: 'custom' })} />
                  </Field>
                </div>
              )}
            </Section>

            {/* Form actions */}
            <div className="pt-6 border-t border-[#0A0A0A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-sm text-[#685C43] truncate">
                <span className="font-semibold text-[#111]">{form.name || 'Untitled scanner'}</span> · {form.questions.length} question{form.questions.length === 1 ? '' : 's'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={closeForm} className="px-4 py-2 text-sm text-[#685C43] hover:text-[#111] cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium rounded-lg bg-[#111] text-white hover:bg-[#8E722A] disabled:opacity-60 cursor-pointer shadow-xs transition-colors">
                  {saving ? 'Saving…' : editMode ? 'Save changes' : 'Deploy scanner'}
                </button>
              </div>
            </div>
          </div>

          {/* live preview */}
          <aside className="hidden lg:block sticky top-24 space-y-2">
            <div className="text-sm font-medium text-[#111]">What customers see</div>
            <PhonePreview form={form} />
            <p className="text-xs text-[#685C43]">Updates as you type. Tap the dots to flip through questions.</p>
          </aside>
        </form>

        {newClientOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setNewClientOpen(false)}>
            <form onSubmit={saveClient} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#0A0A0A]/10 my-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-[#111]">Add a client</h3>
                <button type="button" onClick={() => setNewClientOpen(false)} aria-label="Close" className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <Field label="Client name"><input autoFocus required className={inputCls} value={newClient.name} placeholder="e.g. Dev Cafe" onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} /></Field>
              <Field label="Email"><input type="email" className={inputCls} value={newClient.email} placeholder="contact@client.com" onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} /></Field>
              <Field label="Phone"><input className={inputCls} value={newClient.phone} placeholder="+91 98765 43210" onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} /></Field>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#0A0A0A]/10">
                <button type="button" onClick={() => setNewClientOpen(false)} className="px-4 py-2 text-sm text-[#685C43] hover:text-[#111] cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium rounded-lg bg-[#8E722A] text-white hover:bg-[#785E22] cursor-pointer">Add and select</button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  /* ============================================================ */
  /* LIST VIEW                                                    */
  /* ============================================================ */
  const iconBtn = 'p-1.5 rounded-md border border-[#0A0A0A]/14 bg-[#FAF8F3] text-[#111] hover:bg-[#111] hover:text-white transition cursor-pointer shadow-2xs';
  const columns = [
    {
      header: 'Scanner', key: 'clientName',
      render: (r) => (
        <div>
          <button
            type="button"
            className="font-semibold text-[#111] hover:text-[#8E722A] flex items-center gap-1.5 cursor-pointer text-left"
            onClick={() => navigate(`/admin/scanners/${r.id || r._id || r.slug}`)}
          >
            {r.clientName}
            {r.isDemo && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-semibold rounded">Demo</span>}
          </button>
          <div className="text-xs text-[#685C43] flex items-center gap-1.5 flex-wrap"><span>{r.name || r.placeName || 'Review scanner'}</span><span>·</span><span className="text-[#8E722A]">/review/{r.slug}</span><span className="px-1.5 py-0.5 bg-[#FAF8F3] border border-[#0A0A0A]/15 text-[#555] rounded text-[10px] font-sans font-semibold">{r.industry || 'General Business'}</span></div>
        </div>
      )
    },
    {
      header: 'Status', key: 'status',
      render: (r) => {
        const timer = r.status === 'Active' && (r.isDemo ? r.demoExpiresAt : r.autoPauseEnabled && r.autoPauseAt);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <StatusBadge status={r.status || 'Active'} />
              <button type="button" onClick={(e) => { e.stopPropagation(); toggleStatus(r); }} className={iconBtn} title={r.status === 'Active' ? 'Pause now' : 'Activate now'}>
                {r.status === 'Active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>
            {timer && <div className="inline-flex items-center gap-1 text-xs text-[#8E722A]"><Clock className="w-3 h-3" />{countdown(r.isDemo ? r.demoExpiresAt : r.autoPauseAt)}</div>}
          </div>
        );
      }
    },
    { header: 'Scans', key: 'scans', render: (r) => <span className="text-sm font-semibold">{r.metrics?.scans ?? 0}</span> },
    { header: 'Reviews written', key: 'rg', render: (r) => <span className="text-sm font-semibold text-[#8E722A]">{r.metrics?.reviewsGenerated ?? 0}</span> },
    { header: 'Sent to Google', key: 'gc', render: (r) => <span className="text-sm font-semibold text-emerald-700">{r.metrics?.googleClicked ?? 0}</span> },
    {
      header: '', key: 'actions', align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button className={iconBtn} title="QR code standee" aria-label="QR code" onClick={() => setQrTarget(r)}><QrCode className="w-3.5 h-3.5" /></button>
          <button className={iconBtn} title="Auto-pause timer" aria-label="Auto-pause timer" onClick={() => setQuickPause({ scanner: r, preset: '60', custom: '' })}><Clock className="w-3.5 h-3.5" /></button>
          <button className={iconBtn} title="Edit scanner" aria-label="Edit" onClick={() => openEdit(r)}><Edit2 className="w-3.5 h-3.5" /></button>
          <button className="p-1.5 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer shadow-2xs" title="Delete scanner" aria-label="Delete" onClick={() => setConfirmDelete(r)}><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      )
    }
  ];

  const list = reviewScanners || [];

  if (isLoading && list.length === 0) {
    return (
      <div className="space-y-6 font-body">
        <ModuleSkeleton hasKpi={true} type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-body">
      <Toast />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Live scanners" value={list.filter((s) => s.status === 'Active').length} trend={list.length} trendLabel="total deployed" icon={Star} accentColor="gold" />
        <KpiCard label="Paused scanners" value={list.filter((s) => s.status === 'Paused').length} trend={0} trendLabel="on standby" icon={Pause} accentColor="black" />
        <KpiCard label="AI reviews written" value={list.reduce((a, s) => a + (s.metrics?.reviewsGenerated || 0), 0)} trend={0} trendLabel="all time" icon={Sparkles} accentColor="gold" />
        <KpiCard label="Sent to Google" value={list.reduce((a, s) => a + (s.metrics?.googleClicked || 0), 0)} trend={0} trendLabel="all time" icon={TrendingUp} accentColor="black" />
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#0A0A0A]/10 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#685C43]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by client, title or slug" className={`${inputCls} pl-9 w-72`} />
          </div>
          <Segmented value={statusFilter} onChange={setStatusFilter} options={[['All', 'All'], ['Active', 'Live'], ['Paused', 'Paused'], ['Demo', 'Demos']]} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => openCreate(true)} className="px-3.5 py-2 text-sm rounded-lg border border-purple-300 text-purple-900 bg-purple-50 hover:bg-purple-100 inline-flex items-center gap-1.5 cursor-pointer shadow-xs"><Sparkles className="w-4 h-4" />New demo</button>
          <button onClick={() => openCreate(false)} className="px-4 py-2 text-sm font-medium rounded-lg bg-[#111] text-white hover:bg-[#8E722A] inline-flex items-center gap-1.5 cursor-pointer shadow-xs"><Plus className="w-4 h-4" />New scanner</button>
        </div>
      </div>

      {/* Main Table */}
      {rows.length === 0 && !search && statusFilter === 'All' ? (
        <div className="bg-white border border-dashed border-[#0A0A0A]/20 rounded-xl p-10 text-center space-y-3">
          <QrCode className="w-8 h-8 mx-auto text-[#8E722A]" />
          <p className="font-display text-xl font-semibold text-[#111]">No scanners yet</p>
          <p className="text-sm text-[#685C43]">Create one for a client, or spin up a demo to show a prospect.</p>
          <button onClick={() => openCreate(false)} className="px-4 py-2 text-sm font-medium rounded-lg bg-[#111] text-white hover:bg-[#8E722A] cursor-pointer">Create the first scanner</button>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={rows}
            onRowClick={(r) => navigate(`/admin/scanners/${r.id || r._id || r.slug}`)}
          />
          {rows.length === 0 && <p className="text-center text-sm text-[#685C43] py-6">No scanners match your search query or filter.</p>}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            itemsPerPage={pageSize}
            onItemsPerPageChange={setPageSize}
            totalItems={filtered.length}
          />
        </>
      )}

      {/* Auto-pause timer modal */}
      {quickPause && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setQuickPause(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#0A0A0A]/10 my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div><h3 className="font-display text-xl font-semibold text-[#111]">Auto-pause timer</h3><p className="text-sm text-[#685C43]">{quickPause.scanner.clientName}</p></div>
              <button onClick={() => setQuickPause(null)} aria-label="Close" className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <Segmented value={quickPause.preset} onChange={(v) => setQuickPause({ ...quickPause, preset: v })}
              options={[['60', '1 hour'], ['360', '6 hours'], ['1440', '1 day'], ['2880', '2 days'], ['10080', '1 week'], ['custom', 'Pick a time'], ['clear', 'Remove timer']]} />
            {quickPause.preset === 'custom' && <input type="datetime-local" className={inputCls} value={quickPause.custom} onChange={(e) => setQuickPause({ ...quickPause, custom: e.target.value })} />}
            <div className="flex justify-end gap-2 pt-2 border-t border-[#0A0A0A]/10">
              <button onClick={() => setQuickPause(null)} className="px-4 py-2 text-sm text-[#685C43] hover:text-[#111] cursor-pointer">Cancel</button>
              <button onClick={applyQuickPause} className="px-5 py-2 text-sm font-medium rounded-lg bg-[#8E722A] text-white hover:bg-[#785E22] cursor-pointer">{quickPause.preset === 'clear' ? 'Remove timer' : 'Set timer'}</button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Standee Modal - Viewport & Centering Fix */}
      {qrTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setQrTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
        >
          <div
            className="relative bg-white rounded-2xl max-w-xl w-full max-h-[90vh] my-auto flex flex-col shadow-2xl border border-[#0A0A0A]/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header - never clipped, close always accessible */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs px-5 py-4 border-b border-[#0A0A0A]/10 flex items-center justify-between">
              <div>
                <h3 id="qr-modal-title" className="font-display text-lg sm:text-xl text-[#111] font-semibold">
                  Google Review Standee
                </h3>
                <p className="text-xs sm:text-sm text-[#685C43] truncate">
                  {qrTarget.clientName} · /review/{qrTarget.slug}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQrTarget(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-[#685C43] hover:text-[#111] hover:bg-[#F3EEDD] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1">
              <QrCodeRenderer
                url={`${window.location.origin}/review/${qrTarget.slug}`}
                clientName={qrTarget.clientName}
                scannerName={qrTarget.name || `${qrTarget.clientName} Review`}
                defaultTimer={qrTarget.redirectTimer ?? 5}
                size={190}
                onClose={() => setQrTarget(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          const target = confirmDelete;
          setConfirmDelete(null);
          try {
            await deleteScanner(target.id || target._id);
            notify(`Deleted the scanner for ${target.clientName || target.name}.`);
          } catch {
            notify('Could not delete scanner. Try again.');
          }
        }}
        title="Delete this scanner?"
        message={`Are you sure you want to permanently delete "${confirmDelete?.clientName || confirmDelete?.name}"? Its QR standee link will stop working. This action cannot be undone.`}
      />
    </div>
  );
};

export default ReviewScannersModule;