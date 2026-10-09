import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Pause, Play, Clock, Trash2, ExternalLink,
  Copy, Check, Plus, X, ArrowUp, ArrowDown, Stethoscope, Store,
  Utensils, ShoppingBag, Building, Scissors, Dumbbell, GraduationCap,
  Briefcase, QrCode, Sparkles, TrendingUp, HelpCircle, RefreshCw
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { QrCodeRenderer } from '../../../components/ui/QrCodeRenderer';
import { SkeletonBar } from '../ui/LoadingSkeleton';
import { api } from '../../../services/api';

const uid = (p = 'id') => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const opt = (label) => ({ id: uid('o'), label: label.trim(), value: label.trim(), isActive: true });
const makeQ = (question, labels = []) => ({
  id: uid('q'),
  question: question.trim(),
  type: 'dropdown',
  required: true,
  options: labels.map(opt)
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

const getIndustryIcon = (industry = '') => {
  const ind = (industry || '').toLowerCase();
  if (ind.includes('hospital') || ind.includes('health') || ind.includes('clinic')) return Stethoscope;
  if (ind.includes('restaurant') || ind.includes('dining') || ind.includes('cafe')) return Utensils;
  if (ind.includes('retail') || ind.includes('shop')) return ShoppingBag;
  if (ind.includes('real estate') || ind.includes('property')) return Building;
  if (ind.includes('salon') || ind.includes('spa')) return Scissors;
  if (ind.includes('fitness') || ind.includes('gym')) return Dumbbell;
  if (ind.includes('education')) return GraduationCap;
  if (ind.includes('services') || ind.includes('corporate')) return Briefcase;
  return Store;
};

export const ScannerDetailView = ({
  scannerId,
  scanner: initialScanner,
  onEdit,
  onDelete,
  onToggleStatus,
  onUpdateQuestions,
  onQuickPause,
  notify
}) => {
  const navigate = useNavigate();
  const [scanner, setScanner] = useState(initialScanner);
  const [loading, setLoading] = useState(!initialScanner);
  const [fetchError, setFetchError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGoogleLink, setCopiedGoogleLink] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editingQIndex, setEditingQIndex] = useState(-1);
  const [editingQText, setEditingQText] = useState('');
  const [editingOptions, setEditingOptions] = useState([]);
  const [newOptText, setNewOptText] = useState('');
  const [isAddingQ, setIsAddingQ] = useState(false);
  const [newQText, setNewQText] = useState('');
  const [newQOptions, setNewQOptions] = useState([]);
  const [newQOptInput, setNewQOptInput] = useState('');
  const [isSavingQuestions, setIsSavingQuestions] = useState(false);

  const fetchScanner = async () => {
    if (!scannerId) return;
    setLoading(true);
    setFetchError(null);
    try {
      const res = await api.scanners.getById(scannerId);
      if (res?.data) {
        setScanner(res.data);
      } else if (res && !res.error) {
        setScanner(res);
      } else {
        setFetchError('Unable to load scanner details. Please check the scanner ID.');
      }
    } catch (err) {
      console.error('Failed to load scanner by ID:', err);
      setFetchError('Unable to load scanner details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialScanner) {
      setScanner(initialScanner);
      setLoading(false);
      setFetchError(null);
    } else if (scannerId) {
      fetchScanner();
    }
  }, [initialScanner, scannerId]);

  const publicUrl = typeof window !== 'undefined' && scanner?.slug
    ? `${window.location.origin}/review/${scanner.slug}`
    : '';

  const copyPublicUrl = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    notify('Public review link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyGoogleUrl = () => {
    const url = scanner?.googleReviewUrl || scanner?.googleUrl;
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedGoogleLink(true);
    notify('Google review URL copied to clipboard.');
    setTimeout(() => setCopiedGoogleLink(false), 2000);
  };

  /* ----- Question Actions ----- */
  const startEditingQuestion = (index) => {
    const q = (scanner.questions || [])[index];
    if (!q) return;
    setEditingQIndex(index);
    setEditingQText(q.question || '');
    setEditingOptions((q.options || []).map(o => o.label || o.value || o));
    setNewOptText('');
  };

  const cancelEditingQuestion = () => {
    setEditingQIndex(-1);
    setEditingQText('');
    setEditingOptions([]);
    setNewOptText('');
  };

  const saveEditedQuestion = async () => {
    if (!editingQText.trim()) {
      notify('Question text cannot be empty.');
      return;
    }
    if (editingOptions.length < 2) {
      notify('Please provide at least 2 answer options for this question.');
      return;
    }

    const currentQs = Array.isArray(scanner.questions) ? [...scanner.questions] : [];
    const targetQ = currentQs[editingQIndex];
    if (!targetQ) return;

    const updatedQ = {
      ...targetQ,
      question: editingQText.trim(),
      options: editingOptions.map(opt)
    };

    currentQs[editingQIndex] = updatedQ;
    await persistQuestions(currentQs, 'Question updated.');
    cancelEditingQuestion();
  };

  const handleAddOptionToEditing = () => {
    const val = newOptText.trim();
    if (!val) return;
    if (editingOptions.includes(val)) return setNewOptText('');
    setEditingOptions([...editingOptions, val]);
    setNewOptText('');
  };

  const handleRemoveOptionFromEditing = (optIdx) => {
    setEditingOptions(editingOptions.filter((_, i) => i !== optIdx));
  };

  const handleDeleteQuestion = async (index) => {
    const currentQs = Array.isArray(scanner.questions) ? [...scanner.questions] : [];
    const removed = currentQs.splice(index, 1);
    await persistQuestions(currentQs, `Question "${removed[0]?.question || ''}" deleted.`);
  };

  const handleMoveQuestion = async (index, dir) => {
    const currentQs = Array.isArray(scanner.questions) ? [...scanner.questions] : [];
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= currentQs.length) return;
    const temp = currentQs[index];
    currentQs[index] = currentQs[targetIdx];
    currentQs[targetIdx] = temp;
    await persistQuestions(currentQs, 'Questions reordered.');
  };

  const handleSaveNewQuestion = async () => {
    if (!newQText.trim()) {
      notify('Please enter the question prompt.');
      return;
    }
    if (newQOptions.length < 2) {
      notify('Please add at least 2 answer options for customers to choose from.');
      return;
    }

    const currentQs = Array.isArray(scanner.questions) ? [...scanner.questions] : [];
    const newQ = makeQ(newQText, newQOptions);
    const updatedQs = [...currentQs, newQ];

    await persistQuestions(updatedQs, 'New question added to scanner.');
    setIsAddingQ(false);
    setNewQText('');
    setNewQOptions([]);
    setNewQOptInput('');
  };

  const persistQuestions = async (newQuestions, successMsg) => {
    setIsSavingQuestions(true);
    try {
      const updated = await onUpdateQuestions(scanner.id || scanner._id, newQuestions);
      setScanner(prev => ({ ...prev, ...(updated || {}), questions: newQuestions }));
      notify(successMsg || 'Questions saved successfully.');
    } catch (err) {
      console.error(err);
      notify('Could not save questions. Check your connection.');
    } finally {
      setIsSavingQuestions(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 font-body">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#0A0A0A]/10">
          <SkeletonBar className="h-6 w-48" />
          <SkeletonBar className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-4 bg-white rounded-xl border border-[#0A0A0A]/10 space-y-2">
              <SkeletonBar className="h-3 w-20" />
              <SkeletonBar className="h-7 w-28" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#0A0A0A]/10 space-y-4">
              <SkeletonBar className="h-6 w-36" />
              <SkeletonBar className="h-24 w-full" />
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#0A0A0A]/10 space-y-4">
              <SkeletonBar className="h-6 w-40" />
              <SkeletonBar className="h-36 w-full" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#0A0A0A]/10 space-y-4">
            <SkeletonBar className="h-6 w-32" />
            <SkeletonBar className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="w-full max-w-xl mx-auto py-16 text-center space-y-4 font-body">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="font-display text-2xl text-[#111]">Unable to load scanner details</h2>
        <p className="text-sm text-[#685C43]">
          {fetchError}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={fetchScanner}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8E722A] text-white text-sm font-medium hover:bg-[#725a20] transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/scanners')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0A0A0A]/15 bg-white text-sm font-medium text-[#111] hover:bg-[#FAF8F3] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all scanners
          </button>
        </div>
      </div>
    );
  }

  if (!scanner) {
    return (
      <div className="w-full max-w-xl mx-auto py-16 text-center space-y-4 font-body">
        <div className="w-12 h-12 rounded-full bg-[#F3EEDD] text-[#8E722A] flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="font-display text-2xl text-[#111]">Scanner not found</h2>
        <p className="text-sm text-[#685C43]">
          The review scanner you are looking for does not exist or has been removed.
        </p>
        <button
          type="button"
          onClick={() => navigate('/admin/scanners')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111] text-white text-sm font-medium hover:bg-[#8E722A] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all scanners
        </button>
      </div>
    );
  }

  const IndustryIcon = getIndustryIcon(scanner.industry);
  const metrics = scanner.metrics || {};
  const scans = metrics.scans || 0;
  const reviewsGen = metrics.reviewsGenerated || 0;
  const googleClicks = metrics.googleClicked || 0;
  const convRate = scans > 0 ? ((googleClicks / scans) * 100).toFixed(1) : '0.0';
  const questions = Array.isArray(scanner.questions) ? scanner.questions : [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 font-body">
      {/* Top Breadcrumb & Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#0A0A0A]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/admin/scanners')}
            aria-label="Back to scanners list"
            className="p-2 rounded-lg border border-[#0A0A0A]/12 bg-white hover:bg-[#F3EEDD] text-[#111] transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl sm:text-2xl text-[#111] font-semibold truncate leading-tight">
                {scanner.name || scanner.clientName || 'Review Scanner'}
              </h1>
              <StatusBadge status={scanner.status || 'Active'} />
              {scanner.isDemo && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800">
                  Demo
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#685C43] truncate mt-0.5">
              Client: <span className="font-medium text-[#111]">{scanner.clientName || scanner.businessName || 'ASN Partner'}</span> · Slug: <span className="text-[#8E722A]">/review/{scanner.slug}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={async () => {
              try {
                const res = await onToggleStatus(scanner);
                if (res) {
                  setScanner(prev => ({
                    ...prev,
                    ...res,
                    status: res.status || (prev.status === 'Active' ? 'Paused' : 'Active')
                  }));
                } else {
                  setScanner(prev => ({
                    ...prev,
                    status: prev.status === 'Active' ? 'Paused' : 'Active'
                  }));
                }
              } catch (err) {
                // error notification is handled by caller
              }
            }}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
              scanner.status === 'Active'
                ? 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {scanner.status === 'Active' ? (
              <>
                <Pause className="w-4 h-4" />
                Pause scanner
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Activate scanner
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onQuickPause({ scanner, preset: '60', custom: '' })}
            className="px-3.5 py-2 rounded-lg border border-[#0A0A0A]/14 bg-white text-sm text-[#111] hover:bg-[#FAF8F3] inline-flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            title="Auto-pause schedule timer"
          >
            <Clock className="w-4 h-4 text-[#8E722A]" />
            Timer
          </button>

          <button
            type="button"
            onClick={() => onEdit ? onEdit(scanner) : navigate(`/admin/scanners/edit/${scanner.id || scanner._id || scanner.slug}`)}
            className="px-3.5 py-2 rounded-lg bg-[#111] text-white text-sm font-medium hover:bg-[#8E722A] inline-flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Edit2 className="w-4 h-4" />
            Edit scanner
          </button>

          <button
            type="button"
            onClick={() => setConfirmDeleteOpen(true)}
            aria-label="Delete scanner"
            className="p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer shadow-xs"
            title="Delete scanner"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#0A0A0A]/10 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#685C43]">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Scans</span>
            <QrCode className="w-4 h-4 text-[#8E722A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-semibold text-[#111]">{scans}</div>
          <p className="text-[11px] text-[#685C43]">QR standee encounters</p>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#0A0A0A]/10 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#685C43]">
            <span className="text-xs uppercase tracking-wider font-semibold">Reviews Written</span>
            <Sparkles className="w-4 h-4 text-[#8E722A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-semibold text-[#8E722A]">{reviewsGen}</div>
          <p className="text-[11px] text-[#685C43]">Drafts prepared from answers</p>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#0A0A0A]/10 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#685C43]">
            <span className="text-xs uppercase tracking-wider font-semibold">Sent to Google</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-semibold text-emerald-700">{googleClicks}</div>
          <p className="text-[11px] text-[#685C43]">Customers directed to Google review dialog</p>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#0A0A0A]/10 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#685C43]">
            <span className="text-xs uppercase tracking-wider font-semibold">Conversion Rate</span>
            <span className="text-xs font-semibold text-[#8E722A]">%</span>
          </div>
          <div className="text-2xl sm:text-3xl font-display font-semibold text-[#111]">{convRate}%</div>
          <p className="text-[11px] text-[#685C43]">Scan to Google click ratio</p>
        </div>
      </div>

      {/* Main Content Layout: Overview & Questions (Left) + Tabletop QR Standee (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Overview + Questions */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
          {/* Overview Card */}
          <section className="bg-white rounded-2xl border border-[#0A0A0A]/10 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#0A0A0A]/08">
              <h2 className="font-display text-xl text-[#111] font-semibold">Scanner Configuration</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF8F3] border border-[#0A0A0A]/10 text-xs text-[#685C43]">
                <IndustryIcon className="w-3.5 h-3.5 text-[#8E722A]" />
                {scanner.industry || 'General Business'}
              </span>
            </div>

            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <dt className="text-xs text-[#685C43] font-medium">Business / Client Name</dt>
                <dd className="font-medium text-[#111]">{scanner.clientName || scanner.businessName || '—'}</dd>
              </div>

              <div className="space-y-1">
                <dt className="text-xs text-[#685C43] font-medium">Scanner Display Title</dt>
                <dd className="font-medium text-[#111]">{scanner.name || scanner.placeName || '—'}</dd>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <dt className="text-xs text-[#685C43] font-medium">Customer Review Page (QR Target)</dt>
                <dd className="flex items-center gap-2 bg-[#FAF8F3] p-2 rounded-lg border border-[#0A0A0A]/10">
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#8E722A] hover:underline truncate flex-1"
                  >
                    {publicUrl}
                  </a>
                  <button
                    type="button"
                    onClick={copyPublicUrl}
                    className="p-1 text-[#685C43] hover:text-[#111] rounded cursor-pointer shrink-0"
                    title="Copy URL"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-[#685C43] hover:text-[#111] rounded cursor-pointer shrink-0"
                    title="Open public scanner"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </dd>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <dt className="text-xs text-[#685C43] font-medium">Integrated Direct Google Review URL</dt>
                <dd className="flex items-center gap-2 bg-[#FAF8F3] p-2 rounded-lg border border-[#0A0A0A]/10">
                  <span className="text-xs font-mono text-[#111] truncate flex-1">
                    {scanner.googleReviewUrl || scanner.googleUrl || 'No review link configured'}
                  </span>
                  {scanner.googleReviewUrl && (
                    <>
                      <button
                        type="button"
                        onClick={copyGoogleUrl}
                        className="p-1 text-[#685C43] hover:text-[#111] rounded cursor-pointer shrink-0"
                        title="Copy Google link"
                      >
                        {copiedGoogleLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={scanner.googleReviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-[#685C43] hover:text-[#111] rounded cursor-pointer shrink-0"
                        title="Test direct Google review link"
                      >
                        <ExternalLink className="w-4 h-4 text-[#8E722A]" />
                      </a>
                    </>
                  )}
                </dd>
              </div>

              {/* Doctor / Specialist support */}
              {(scanner.doctorName || (scanner.doctors && scanner.doctors.length > 0)) && (
                <div className="space-y-1 sm:col-span-2 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <dt className="text-xs font-semibold text-emerald-950 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
                    Doctor / Specialist Information
                  </dt>
                  <dd className="text-xs text-emerald-900 mt-1">
                    {scanner.doctorName ? (
                      <span className="font-semibold">{scanner.doctorName}</span>
                    ) : (
                      <div className="space-y-1">
                        {scanner.doctors.map((d, i) => (
                          <div key={d.id || i} className="flex justify-between">
                            <span className="font-medium">{d.name}</span>
                            <span className="text-emerald-700">{d.department || d.qualification}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </dd>
                </div>
              )}

              <div className="space-y-1">
                <dt className="text-xs text-[#685C43] font-medium">Auto-Redirect Timer</dt>
                <dd className="font-medium text-[#111]">
                  {scanner.redirectTimer === 0 ? 'Manual (Customer taps when ready)' : `${scanner.redirectTimer ?? 5} seconds`}
                </dd>
              </div>

              <div className="space-y-1">
                <dt className="text-xs text-[#685C43] font-medium">Created On</dt>
                <dd className="font-medium text-[#111]">
                  {scanner.createdAt ? new Date(scanner.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                </dd>
              </div>
            </dl>
          </section>

          {/* Questions Management Card */}
          <section className="bg-white rounded-2xl border border-[#0A0A0A]/10 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#0A0A0A]/08">
              <div>
                <h2 className="font-display text-xl text-[#111] font-semibold">Review Prompt Questions</h2>
                <p className="text-xs text-[#685C43] mt-0.5">
                  Customers answer these questions. The answers become the factual source of their generated review.
                </p>
              </div>
              {!isAddingQ && (
                <button
                  type="button"
                  onClick={() => setIsAddingQ(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#111] text-white text-xs font-medium hover:bg-[#8E722A] transition cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add question
                </button>
              )}
            </div>

            {/* Questions List */}
            {questions.length === 0 && !isAddingQ ? (
              <div className="p-6 rounded-xl border border-dashed border-[#0A0A0A]/15 bg-[#FAF8F3] text-center space-y-3">
                <p className="text-sm font-medium text-[#111]">Direct Review Mode (Zero Questions)</p>
                <p className="text-xs text-[#685C43] max-w-md mx-auto">
                  This scanner currently has zero custom questions. Customers will provide star ratings directly without question prompts.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddingQ(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#8E722A] text-[#8E722A] text-xs font-semibold hover:bg-[#F8F1DC] transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add your first question
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, qi) => {
                  const isEditingThis = editingQIndex === qi;

                  if (isEditingThis) {
                    return (
                      <div key={q.id || qi} className="p-4 rounded-xl border border-[#8E722A] bg-[#FDFBF5] space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#111]">Edit Question Prompt</label>
                          <input
                            type="text"
                            value={editingQText}
                            onChange={(e) => setEditingQText(e.target.value)}
                            placeholder="e.g. How was the food?"
                            className="w-full bg-white border border-[#0A0A0A]/15 rounded-lg px-3 py-2 text-sm text-[#111] focus:outline-none focus:border-[#8E722A]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-[#111]">Answer Choices ({editingOptions.length})</label>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {editingOptions.map((optLabel, oi) => (
                              <span
                                key={oi}
                                className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full bg-white border border-[#8E722A]/40 text-[#5d4a18] text-xs"
                              >
                                {optLabel}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOptionFromEditing(oi)}
                                  className="p-0.5 rounded-full hover:bg-black/10 cursor-pointer"
                                  aria-label={`Remove option ${optLabel}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-2 pt-1">
                            <input
                              type="text"
                              value={newOptText}
                              onChange={(e) => setNewOptText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddOptionToEditing(); } }}
                              placeholder="Type option and press Enter"
                              className="flex-1 bg-white border border-[#0A0A0A]/15 rounded-lg px-3 py-1.5 text-xs text-[#111] focus:outline-none focus:border-[#8E722A]"
                            />
                            <button
                              type="button"
                              onClick={handleAddOptionToEditing}
                              className="px-3 py-1.5 rounded-lg bg-[#FAF8F3] border border-[#0A0A0A]/15 text-xs text-[#111] hover:bg-[#F3EEDD] cursor-pointer"
                            >
                              Add option
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-[#0A0A0A]/10">
                          <button
                            type="button"
                            onClick={cancelEditingQuestion}
                            className="px-3 py-1.5 rounded-lg text-xs text-[#685C43] hover:text-[#111] cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={isSavingQuestions}
                            onClick={saveEditedQuestion}
                            className="px-4 py-1.5 rounded-lg bg-[#111] text-white text-xs font-medium hover:bg-[#8E722A] transition cursor-pointer"
                          >
                            {isSavingQuestions ? 'Saving…' : 'Save changes'}
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={q.id || qi}
                      className="p-4 rounded-xl border border-[#0A0A0A]/10 bg-[#FAF8F3] hover:bg-[#FAF8F3]/80 transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-white border border-[#0A0A0A]/10 text-xs font-semibold text-[#8E722A] flex items-center justify-center shrink-0 mt-0.5">
                            {qi + 1}
                          </span>
                          <div>
                            <h3 className="font-semibold text-sm text-[#111]">{q.question}</h3>
                            <p className="text-[11px] text-[#685C43]">
                              {(q.options || []).length} answer choices available
                            </p>
                          </div>
                        </div>

                        {/* Question controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveQuestion(qi, -1)}
                            disabled={qi === 0}
                            aria-label="Move question up"
                            className="p-1 text-[#685C43] hover:text-[#111] disabled:opacity-20 cursor-pointer"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveQuestion(qi, 1)}
                            disabled={qi === questions.length - 1}
                            aria-label="Move question down"
                            className="p-1 text-[#685C43] hover:text-[#111] disabled:opacity-20 cursor-pointer"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditingQuestion(qi)}
                            aria-label="Edit question"
                            className="p-1 text-[#685C43] hover:text-[#111] cursor-pointer"
                            title="Edit question & choices"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(qi)}
                            aria-label="Delete question"
                            className="p-1 text-red-600 hover:text-red-700 cursor-pointer"
                            title="Delete question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Options Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(q.options || []).map((o, oi) => (
                          <span
                            key={o.id || oi}
                            className="px-2.5 py-1 text-xs rounded-full border border-[#8E722A]/30 text-[#5d4a18] bg-white shadow-2xs"
                          >
                            {o.label || o.value || o}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add New Question Section */}
            {isAddingQ && (
              <div className="p-4 rounded-xl border border-[#8E722A] bg-[#FDFBF5] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-[#111]">New Review Question</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddingQ(false)}
                    className="p-1 text-[#685C43] hover:text-[#111] cursor-pointer"
                    aria-label="Cancel new question"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#111]">Question Prompt</label>
                  <input
                    type="text"
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    placeholder="e.g. What impressed you the most?"
                    className="w-full bg-white border border-[#0A0A0A]/15 rounded-lg px-3 py-2 text-sm text-[#111] focus:outline-none focus:border-[#8E722A]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#111]">
                    Answer Options ({newQOptions.length}) - Add at least 2
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {newQOptions.map((optLabel, oi) => (
                      <span
                        key={oi}
                        className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full bg-white border border-[#8E722A]/40 text-[#5d4a18] text-xs"
                      >
                        {optLabel}
                        <button
                          type="button"
                          onClick={() => setNewQOptions(newQOptions.filter((_, i) => i !== oi))}
                          className="p-0.5 rounded-full hover:bg-black/10 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newQOptInput}
                      onChange={(e) => setNewQOptInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = newQOptInput.trim();
                          if (val && !newQOptions.includes(val)) {
                            setNewQOptions([...newQOptions, val]);
                            setNewQOptInput('');
                          }
                        }
                      }}
                      placeholder="Type option and press Enter"
                      className="flex-1 bg-white border border-[#0A0A0A]/15 rounded-lg px-3 py-1.5 text-xs text-[#111] focus:outline-none focus:border-[#8E722A]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = newQOptInput.trim();
                        if (val && !newQOptions.includes(val)) {
                          setNewQOptions([...newQOptions, val]);
                          setNewQOptInput('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF8F3] border border-[#0A0A0A]/15 text-xs text-[#111] hover:bg-[#F3EEDD] cursor-pointer"
                    >
                      Add option
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#0A0A0A]/10">
                  <button
                    type="button"
                    onClick={() => setIsAddingQ(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#685C43] hover:text-[#111] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSavingQuestions}
                    onClick={handleSaveNewQuestion}
                    className="px-4 py-1.5 rounded-lg bg-[#111] text-white text-xs font-medium hover:bg-[#8E722A] transition cursor-pointer"
                  >
                    {isSavingQuestions ? 'Saving…' : 'Save Question'}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: High-Resolution Tabletop Standee Card */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-[#0A0A0A]/10 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#0A0A0A]/08">
              <div>
                <h3 className="font-display text-lg text-[#111] font-semibold">Tabletop QR Standee</h3>
                <p className="text-xs text-[#685C43]">Ready to print or download for counter display</p>
              </div>
              <button
                type="button"
                onClick={copyPublicUrl}
                className="px-3 py-1 rounded-lg border border-[#0A0A0A]/12 text-xs font-medium text-[#111] hover:bg-[#FAF8F3] inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                Copy link
              </button>
            </div>

            <QrCodeRenderer
              url={publicUrl}
              clientName={scanner.clientName || scanner.businessName || 'ASN Partner'}
              scannerName={scanner.name || `${scanner.clientName} Review`}
              defaultTimer={scanner.redirectTimer ?? 5}
              size={180}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={async () => {
          setConfirmDeleteOpen(false);
          await onDelete(scanner);
          navigate('/admin/scanners');
        }}
        title="Delete this scanner?"
        message={`Are you sure you want to permanently delete "${scanner.name || scanner.clientName}"? Its QR code link will stop working immediately. This action cannot be undone.`}
      />
    </div>
  );
};
