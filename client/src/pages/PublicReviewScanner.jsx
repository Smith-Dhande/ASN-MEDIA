import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Star,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  Clock
} from 'lucide-react';
import { mockData } from '../admin/data/mockData';
import reviewsPoolData from '../data/reviewsPool.json';
import { generateInputBasedReview } from '../utils/reviewGenerator';

const DEFAULT_QUESTIONS = [
  {
    id: 'q1',
    question: 'What did you like most?',
    type: 'dropdown',
    required: true,
    options: [
      { id: 'o1', label: 'Quality & Craftsmanship', value: 'Quality & Craftsmanship' },
      { id: 'o2', label: 'Customer Service', value: 'Customer Service' },
      { id: 'o3', label: 'Speed & Timeliness', value: 'Speed & Timeliness' },
      { id: 'o4', label: 'Staff Attention', value: 'Staff Attention' }
    ]
  },
  {
    id: 'q2',
    question: 'What stood out to you?',
    type: 'dropdown',
    required: true,
    options: [
      { id: 'o5', label: 'Friendly Staff', value: 'Friendly Staff' },
      { id: 'o6', label: 'Quick Response', value: 'Quick Response' },
      { id: 'o7', label: 'Professional Setup', value: 'Professional Setup' },
      { id: 'o8', label: 'Fair & Transparent', value: 'Fair & Transparent' }
    ]
  },
  {
    id: 'q3',
    question: 'How was your overall experience?',
    type: 'dropdown',
    required: true,
    options: [
      { id: 'o9', label: 'Excellent', value: 'Excellent' },
      { id: 'o10', label: 'Very Good', value: 'Very Good' },
      { id: 'o11', label: 'Good', value: 'Good' },
      { id: 'o12', label: 'Satisfactory', value: 'Satisfactory' }
    ]
  }
];

const DEFAULT_HOSPITAL_CHIPS = [
  'ALL',
  'DR. HIMANSHU DESHMUKH',
  'CATARACT SURGERY',
  'LASIK LASER',
  'RETINAL DETACHMENT',
  'DIABETIC RETINOPATHY',
  'GLAUCOMA MANAGEMENT',
  'SQUINT CORRECTION',
  'PEDIATRIC EYE CARE',
  'CORNEAL TRANSPLANTATION',
  'OCULOPLASTY SURGERY',
  'OPTICAL COHERENCE TOMOGRAPHY (OCT)',
  'VISUAL FIELD TESTING',
  'FUNDUS PHOTOGRAPHY',
  'B-SCAN ULTRASONOGRAPHY',
  'FLUORESCEIN ANGIOGRAPHY'
];

const LANGUAGES = ['English', 'हिंदी', 'मराठी'];

// Minimum time the "generating" state stays visible
const MIN_GENERATING_MS = 2000;

// Helper to determine exact industry category on client
function getIndustryCategory(industryStr, businessNameStr) {
  const ind = (industryStr || '').toLowerCase();
  const bName = (businessNameStr || '').toLowerCase();

  if (ind.includes('hospital') || ind.includes('health') || ind.includes('eye') || ind.includes('clinic') || ind.includes('dental') || bName.includes('hospital') || bName.includes('clinic') || bName.includes('eye care') || bName.includes('deshmukh')) {
    return 'hospital';
  }
  if (ind.includes('auto') || ind.includes('garage') || ind.includes('car') || ind.includes('motor') || ind.includes('workshop') || bName.includes('garage') || bName.includes('auto') || bName.includes('motors') || bName.includes('workshop') || bName.includes('service center')) {
    return 'automotive';
  }
  if (ind.includes('dining') || ind.includes('restaurant') || ind.includes('food') || ind.includes('cafe') || ind.includes('hotel') || bName.includes('cafe') || bName.includes('restaurant') || bName.includes('kitchen') || bName.includes('dhaba')) {
    return 'dining';
  }
  if (ind.includes('retail') || ind.includes('shopping') || ind.includes('store') || ind.includes('market') || ind.includes('fashion') || bName.includes('store') || bName.includes('mart') || bName.includes('jewellers') || bName.includes('fashion')) {
    return 'retail';
  }
  if (ind.includes('corp') || ind.includes('tech') || ind.includes('it') || ind.includes('consult') || ind.includes('software') || ind.includes('media') || ind.includes('agency')) {
    return 'corporate';
  }
  return 'general';
}

// "CATARACT SURGERY" -> "Cataract surgery", "DR. HIMANSHU DESHMUKH" -> "Dr. Himanshu Deshmukh" (display only)
function toDisplayCase(str) {
  const s = String(str || '').trim();
  if (!s) return s;
  const lower = s.toLowerCase();
  if (lower.startsWith('dr.')) {
    return lower.replace(/\b([a-z])/g, (c) => c.toUpperCase());
  }
  return (lower.charAt(0).toUpperCase() + lower.slice(1)).replace(/\(oct\)/i, '(OCT)');
}

// ------------------------------------------------------------
// Small presentational pieces (kept outside the page component)
// ------------------------------------------------------------
const FIELD_BASE =
  'w-full bg-white border border-[#cfd4d0] text-[15px] text-slate-900 rounded-md px-3.5 py-3 focus:outline-none focus:border-[#0f5f4a] focus:ring-2 focus:ring-[#0f5f4a]/15 transition-colors';

const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-baseline justify-between gap-3">
      <label className="text-sm font-medium text-slate-800">{label}</label>
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </div>
    {children}
  </div>
);

const SelectBox = ({ value, onChange, children, ariaLabel }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      className={`${FIELD_BASE} appearance-none pr-10 cursor-pointer truncate`}
    >
      {children}
    </select>
    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

const Shell = ({ children, toast }) => (
  <div className="min-h-screen bg-[#f3f4f2] text-slate-900 font-body flex flex-col items-center px-4 py-8 sm:py-14 selection:bg-[#0f5f4a] selection:text-white">
    {toast && (
      <div
        role="status"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-md flex items-center gap-2"
      >
        <Check className="w-4 h-4" />
        <span>Review copied. Opening Google…</span>
      </div>
    )}
    {children}
  </div>
);

const Footer = () => (
  <div className="mt-auto pt-10 flex items-center justify-center gap-5 text-xs text-slate-500">
    <Link to="/terms" className="hover:text-slate-900 hover:underline underline-offset-2">
      Terms &amp; conditions
    </Link>
    <Link to="/terms" className="hover:text-slate-900 hover:underline underline-offset-2">
      Privacy policy
    </Link>
  </div>
);

export const PublicReviewScanner = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const timerQuery = searchParams.get('timer');

  const [loading, setLoading] = useState(true);
  const [scanner, setScanner] = useState(null);

  // Customer Form State
  const [rating, setRating] = useState(4); // default 4/5
  const [answers, setAnswers] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedChip, setSelectedChip] = useState('CATARACT SURGERY');
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // 'English' | 'हिंदी' | 'मराठी'
  const [isGenerating, setIsGenerating] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');

  // Review Result State
  const [generatedReview, setGeneratedReview] = useState('');
  const [editedReview, setEditedReview] = useState('');
  const [googleUrl, setGoogleUrl] = useState('');

  // Direct Submission Status State
  const [isSubmittingDirect, setIsSubmittingDirect] = useState(false);
  const [directSubmitted, setDirectSubmitted] = useState(false);
  const [recentReviews, setRecentReviews] = useState([]);

  // Demo Mode State & Countdown
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoExpiresAt, setDemoExpiresAt] = useState(null);
  const [demoRemainingSeconds, setDemoRemainingSeconds] = useState(null);

  // Auto-Redirect Timer State
  const [autoRedirectDuration, setAutoRedirectDuration] = useState(0);
  const [copied, setCopied] = useState(true);
  const [redirectNotice, setRedirectNotice] = useState(false);
  const [variationIndex, setVariationIndex] = useState(0);
  const generationId = useRef(0); // latest request wins

  useEffect(() => {
    fetchScanner();
    fetchRecentReviews();
  }, [slug]);

  // Live countdown timer for active Demo Scanners
  useEffect(() => {
    if (!isDemoMode || demoRemainingSeconds === null || demoRemainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setDemoRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setScanner((curr) => curr ? { ...curr, status: 'Paused', isExpired: true, isPaused: true } : curr);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDemoMode, demoRemainingSeconds]);

  const normalizeScanner = (rawScanner, targetSlug) => {
    const rawQuestions = Array.isArray(rawScanner.questions) ? rawScanner.questions : DEFAULT_QUESTIONS;
    const isDemo = Boolean(rawScanner.isDemo || rawScanner.clientId === 'demo-preview' || (rawScanner.name && rawScanner.name.toLowerCase().includes('demo')));

    // Check if slug or name implies Hospital
    const cleanSlug = String(targetSlug || '').toLowerCase();
    const isHospitalSlug = cleanSlug.includes('hospital') || cleanSlug.includes('eye') || cleanSlug.includes('deshmukh') || cleanSlug.includes('clinic') || cleanSlug.includes('care');
    const isAutoSlug = cleanSlug.includes('garage') || cleanSlug.includes('auto') || cleanSlug.includes('motor') || cleanSlug.includes('car');

    let industry = rawScanner.industry;
    if (!industry || industry === 'General Business') {
      if (isHospitalSlug) industry = 'Hospital / Healthcare';
      else if (isAutoSlug) industry = 'Automobile / Garage';
      else industry = 'General Business';
    }

    const clientTitle = rawScanner.clientName || rawScanner.businessName || rawScanner.name || rawScanner.placeName ||
      (isHospitalSlug ? 'Deshmukh Eye Hospital' : isDemo ? 'Demo Business Experience' : (targetSlug ? targetSlug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'ASN Partner Business'));

    const effectiveTimer = timerQuery !== null && !isNaN(Number(timerQuery))
      ? Number(timerQuery)
      : (rawScanner.redirectTimer !== undefined ? Number(rawScanner.redirectTimer) : 0);

    let remSecs = null;
    if (isDemo && rawScanner.demoExpiresAt) {
      remSecs = Math.max(0, Math.floor((new Date(rawScanner.demoExpiresAt).getTime() - Date.now()) / 1000));
    } else if (rawScanner.demoRemainingSeconds !== undefined) {
      remSecs = rawScanner.demoRemainingSeconds;
    }

    const isExpired = Boolean(
      rawScanner.isExpired ||
      (remSecs !== null && remSecs <= 0) ||
      rawScanner.status === 'Paused' ||
      rawScanner.status === 'Disabled' ||
      rawScanner.status === 'Inactive' ||
      rawScanner.status === 'Closed' ||
      (isDemo && rawScanner.demoExpiresAt && new Date() >= new Date(rawScanner.demoExpiresAt))
    );

    const isPaused = Boolean(
      rawScanner.isPaused ||
      rawScanner.status === 'Paused' ||
      rawScanner.status === 'Disabled' ||
      rawScanner.status === 'Inactive' ||
      rawScanner.status === 'Closed' ||
      isExpired
    );

    const doctors = Array.isArray(rawScanner.doctors) && rawScanner.doctors.length > 0 ? rawScanner.doctors : [
      { id: 'doc_deshmukh', name: 'Dr. Himanshu Deshmukh', department: 'Ophthalmology & Eye Surgeon', qualification: 'MBBS, MS (Ophthalmology)', available: true },
      { id: 'doc_2', name: 'Dr. Rajesh Sharma', department: 'Cataract & Refractive Specialist', qualification: 'MS, FICO', available: true }
    ];

    const hospitalServices = Array.isArray(rawScanner.hospitalServices) && rawScanner.hospitalServices.length > 0
      ? rawScanner.hospitalServices
      : DEFAULT_HOSPITAL_CHIPS;

    return {
      id: rawScanner.id || rawScanner._id || `scn_${Date.now()}`,
      slug: rawScanner.slug || targetSlug,
      clientName: clientTitle,
      businessName: clientTitle,
      name: rawScanner.name || rawScanner.placeName || `${clientTitle} Review Scanner`,
      industry,
      doctors,
      hospitalServices,
      googleReviewUrl: rawScanner.googleReviewUrl || rawScanner.googleUrl || 'https://search.google.com/local/writereview?placeid=ChIJReviewScanner',
      ratingRequired: rawScanner.ratingRequired !== false,
      questions: rawQuestions,
      redirectTimer: effectiveTimer,
      status: isExpired ? 'Closed' : (rawScanner.status || 'Active'),
      isDemo,
      demoExpiresAt: rawScanner.demoExpiresAt,
      demoRemainingSeconds: remSecs,
      isExpired,
      isPaused
    };
  };

  const fetchRecentReviews = async () => {
    const targetSlug = String(slug || '').trim();
    if (!targetSlug) return;
    try {
      const res = await fetch(`/api/scanners/public/${encodeURIComponent(targetSlug)}/reviews`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setRecentReviews(json.data);
        }
      }
    } catch (e) { }
  };

  const fetchScanner = async () => {
    setLoading(true);
    const targetSlug = String(slug || '').trim();

    const applyNormalizedScanner = (normalized) => {
      setScanner(normalized);
      setIsDemoMode(Boolean(normalized.isDemo));
      setDemoExpiresAt(normalized.demoExpiresAt);
      setDemoRemainingSeconds(normalized.demoRemainingSeconds);
      setGoogleUrl(normalized.googleReviewUrl);
      setAutoRedirectDuration(normalized.redirectTimer !== undefined ? normalized.redirectTimer : 0);
      const initAns = initializeAnswers(normalized.questions);

      // Auto-select first available doctor if present
      if (normalized.doctors && normalized.doctors.length > 0) {
        const activeDoc = normalized.doctors.find(d => d.available !== false) || normalized.doctors[0];
        setSelectedDoctor(activeDoc || null);
      }

      // Set initial chip
      const availableDocNames = (normalized.doctors || [])
        .filter(d => d.available !== false && (d.name || '').trim())
        .map(d => d.name.trim().toUpperCase().startsWith('DR.') ? d.name.trim().toUpperCase() : `DR. ${d.name.trim().toUpperCase()}`);

      const availableServices = (normalized.hospitalServices || [])
        .filter(s => typeof s === 'string' && s.trim() && s.trim().toUpperCase() !== 'ALL' && !s.trim().toUpperCase().startsWith('DR.'))
        .map(s => s.trim().toUpperCase());

      const initialChip = availableServices[0] || availableDocNames[0] || 'ALL';
      setSelectedChip(initialChip);

      setLoading(false);
      if (!normalized.isExpired && !normalized.isPaused) {
        craftDynamicReview(initialChip, selectedLanguage, rating, normalized, 0, initAns);
      }
    };

    // 1. Try Backend Server API endpoints
    const endpoints = [
      `/api/scanners/public/${encodeURIComponent(targetSlug)}`,
      `/api/review-scanners/public/${encodeURIComponent(targetSlug)}`,
      `http://localhost:5000/api/scanners/public/${encodeURIComponent(targetSlug)}`
    ];

    for (const url of endpoints) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const resJson = await response.json();
          const rawData = resJson.data || resJson;
          if (rawData && (rawData.clientName || rawData.businessName || rawData.slug || rawData.googleReviewUrl)) {
            const normalized = normalizeScanner(rawData, targetSlug);
            applyNormalizedScanner(normalized);
            return;
          }
        }
      } catch (err) { }
    }

    // 2. Fallback to LocalStorage and In-Memory Mock Data
    try {
      let candidateScanners = [];
      const savedMock = localStorage.getItem('asn_admin_mock_data');
      if (savedMock) {
        try {
          const parsed = JSON.parse(savedMock);
          if (Array.isArray(parsed.reviewScanners)) {
            candidateScanners = [...parsed.reviewScanners];
          }
        } catch (e) { }
      }

      if (Array.isArray(mockData.reviewScanners)) {
        candidateScanners = [...candidateScanners, ...mockData.reviewScanners];
      }

      const cleanSlugLower = targetSlug.toLowerCase();
      const cleanSlugWords = cleanSlugLower.replace(/[-_]+/g, ' ');

      const found = candidateScanners.find((s) => {
        if (!s) return false;
        const sSlug = (s.slug || '').toLowerCase();
        const sId = (s.id || s._id || '').toLowerCase();
        const sClient = (s.clientName || s.businessName || s.name || s.placeName || '').toLowerCase();
        const sClientSlug = sClient.replace(/[^a-z0-9]/g, '-');

        return (
          sSlug === cleanSlugLower ||
          sId === cleanSlugLower ||
          sClientSlug === cleanSlugLower ||
          (cleanSlugLower && sSlug.includes(cleanSlugLower)) ||
          (cleanSlugWords && sClient.includes(cleanSlugWords))
        );
      });

      if (found) {
        const normalized = normalizeScanner(found, targetSlug);
        applyNormalizedScanner(normalized);
        return;
      }
    } catch (e) { }

    // 3. Fallback: Generate a smart branded scanner for this link slug
    const smartFallback = normalizeScanner({}, targetSlug);
    applyNormalizedScanner(smartFallback);
  };

  const initializeAnswers = (questionsList) => {
    if (!questionsList) return {};
    const initial = {};
    questionsList.forEach((q) => {
      if (q.options && q.options.length > 0) {
        initial[q.question] = q.options[0].value || q.options[0].label;
      } else {
        initial[q.question] = '';
      }
    });
    setAnswers(initial);
    return initial;
  };

  // Dynamic Multi-Language Input-Based Crafting for Reviews
  const craftDynamicReview = async (
    chip = selectedChip,
    lang = selectedLanguage,
    stars = rating,
    currentScanner = scanner,
    explicitVariation = null,
    currentAnswers = null
  ) => {
    const requestId = ++generationId.current;
    const startedAt = Date.now();
    setIsGenerating(true);

    const activeVariation = explicitVariation !== null ? explicitVariation : variationIndex;
    const activeAnswers = currentAnswers !== null ? currentAnswers : answers;

    // Keep the loading state on screen for at least MIN_GENERATING_MS
    const waitForMinimum = () =>
      new Promise((resolve) =>
        setTimeout(resolve, Math.max(0, MIN_GENERATING_MS - (Date.now() - startedAt)))
      );
    const targetScanner = currentScanner || scanner;
    const bName = targetScanner?.clientName || targetScanner?.businessName || 'Our Business';

    // Check if the chip is a doctor
    const cleanChip = (chip || '').replace(/^DR\.\s*/i, '').trim().toUpperCase();
    const matchedDoc = (targetScanner?.doctors || []).find(d => {
      const docName = (d.name || '').replace(/^DR\.\s*/i, '').trim().toUpperCase();
      return docName === cleanChip;
    });

    const isDocChip = chip && (
      chip.toUpperCase().startsWith('DR.') ||
      Boolean(matchedDoc)
    );

    let targetDocName = '';
    let targetServiceName = '';

    if (isDocChip) {
      targetDocName = matchedDoc?.name
        ? (matchedDoc.name.toUpperCase().startsWith('DR.') ? matchedDoc.name : `Dr. ${matchedDoc.name}`)
        : (chip.toUpperCase().startsWith('DR.') ? chip : `Dr. ${chip}`);
      targetServiceName = matchedDoc?.department || 'consultation & treatment';
    } else if (chip !== 'ALL') {
      targetServiceName = chip;
      const firstAvailableDoc = (targetScanner?.doctors || []).find(d => d.available !== false);
      targetDocName = selectedDoctor?.name || firstAvailableDoc?.name || '';
      if (targetDocName && !targetDocName.toUpperCase().startsWith('DR.')) {
        targetDocName = `Dr. ${targetDocName}`;
      }
    } else {
      // 'ALL' selected
      const firstAvailableDoc = (targetScanner?.doctors || []).find(d => d.available !== false);
      targetDocName = firstAvailableDoc?.name || '';
      if (targetDocName && !targetDocName.toUpperCase().startsWith('DR.')) {
        targetDocName = `Dr. ${targetDocName}`;
      }
      targetServiceName = '';
    }

    const formattedAnswers = Object.entries(activeAnswers || {})
      .map(([q, a]) => ({ question: q, answer: a }))
      .filter(item => item.answer && String(item.answer).trim());

    try {
      const res = await fetch(`/api/scanners/public/${encodeURIComponent(slug || targetScanner?.slug || 'scanner')}/generate-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: stars,
          language: lang,
          serviceName: targetServiceName,
          doctorName: targetDocName,
          selectedDoctor: matchedDoc || (targetDocName ? { name: targetDocName } : null),
          answers: formattedAnswers,
          variationIndex: activeVariation
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reviewText) {
          await waitForMinimum();
          if (requestId !== generationId.current) return;
          setGeneratedReview(data.reviewText);
          setEditedReview(data.reviewText);
          setIsGenerating(false);
          try {
            navigator.clipboard.writeText(data.reviewText);
            setCopied(true);
          } catch (e) { }
          return;
        }
      }
    } catch (e) { }

    // Client-side fallback from generic input-based review generator
    await waitForMinimum();
    if (requestId !== generationId.current) return;

    const fallbackReview = generateInputBasedReview({
      rating: stars,
      language: lang,
      businessName: bName,
      doctorName: targetDocName,
      serviceName: targetServiceName,
      answers: formattedAnswers,
      variationIndex: activeVariation
    });

    setGeneratedReview(fallbackReview);
    setEditedReview(fallbackReview);
    setIsGenerating(false);

    try {
      navigator.clipboard.writeText(fallbackReview);
      setCopied(true);
    } catch (e) { }
  };

  const handleChipSelect = (chip) => {
    setSelectedChip(chip);

    const cleanChip = chip.replace(/^DR\.\s*/i, '').trim().toUpperCase();
    const matchedDoc = (scanner?.doctors || []).find(d => {
      const docName = (d.name || '').replace(/^DR\.\s*/i, '').trim().toUpperCase();
      return docName === cleanChip;
    });

    if (matchedDoc) {
      setSelectedDoctor(matchedDoc);
    } else if (chip === 'ALL') {
      setSelectedDoctor(null);
    }

    craftDynamicReview(chip, selectedLanguage, rating, scanner, variationIndex, answers);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    craftDynamicReview(selectedChip, lang, rating, scanner, variationIndex, answers);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    craftDynamicReview(selectedChip, selectedLanguage, newRating, scanner, variationIndex, answers);
  };

  const handleAnswerChange = (qText, val) => {
    const updated = { ...answers, [qText]: val };
    setAnswers(updated);
    craftDynamicReview(selectedChip, selectedLanguage, rating, scanner, variationIndex, updated);
  };

  const handleRegenerate = () => {
    const nextVar = variationIndex + 1;
    setVariationIndex(nextVar);
    craftDynamicReview(selectedChip, selectedLanguage, rating, scanner, nextVar, answers);
  };

  const getRatingLabel = (r) => {
    switch (r) {
      case 5: return 'EXCELLENT';
      case 4: return 'GOOD';
      case 3: return 'AVERAGE';
      case 2: return 'FAIR';
      case 1: return 'POOR';
      default: return 'GOOD';
    }
  };

  const handleCopyToClipboard = () => {
    const textToCopy = editedReview || generatedReview;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setRedirectNotice(true);
    setTimeout(() => setRedirectNotice(false), 2500);
  };

  const handleOpenGoogle = async () => {
    const textToCopy = editedReview || generatedReview;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (e) { }

    // Record interaction metric
    try {
      fetch(`/api/scanners/public/${encodeURIComponent(slug || 'scanner')}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'GOOGLE_CLICKED', rating, metadata: { selectedChip, selectedLanguage } })
      });
    } catch (e) { }

    // Open Google Review destination in a clean modal/window
    const targetUrl = googleUrl || scanner?.googleReviewUrl || 'https://search.google.com';
    const width = 640;
    const height = 720;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      targetUrl,
      'GoogleReviewWindow',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };

  // Direct Web Submission
  const handleDirectWebSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmittingDirect(true);

    const finalReviewText = editedReview || generatedReview;

    try {
      const res = await fetch(`/api/scanners/public/${encodeURIComponent(slug || 'scanner')}/submit-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerName: reviewerName || 'Verified Customer',
          reviewerEmail,
          rating,
          reviewText: finalReviewText,
          source: 'Direct Web Submission',
          doctorName: selectedChip?.startsWith('DR.') ? selectedChip : (selectedDoctor?.name || ''),
          doctorDepartment: selectedChip
        })
      });

      if (res.ok) {
        const json = await res.json();
        setDirectSubmitted(true);
        if (json.data) {
          setRecentReviews((prev) => [json.data, ...prev]);
        }
      } else {
        setDirectSubmitted(true);
      }
    } catch (err) {
      setDirectSubmitted(true);
    } finally {
      setIsSubmittingDirect(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f2] flex flex-col items-center justify-center p-6 text-slate-600 font-body">
        <RefreshCw className="w-5 h-5 animate-spin mb-3 text-[#0f5f4a]" />
        <p className="text-sm">Loading…</p>
      </div>
    );
  }

  // ==========================================
  // EXPIRED / CLOSED / PAUSED SCANNER VIEW
  // ==========================================
  const isScannerExpired = Boolean(
    scanner?.isExpired ||
    scanner?.isPaused ||
    scanner?.status === 'Paused' ||
    scanner?.status === 'Disabled' ||
    scanner?.status === 'Inactive' ||
    scanner?.status === 'Closed' ||
    (isDemoMode && demoRemainingSeconds !== null && demoRemainingSeconds <= 0) ||
    (scanner?.isDemo && scanner?.demoExpiresAt && new Date() >= new Date(scanner.demoExpiresAt))
  );

  if (isScannerExpired) {
    return (
      <Shell>
        <div className="w-full max-w-md my-auto">
          <div className="bg-white border border-[#d9ddd9] rounded-xl p-7 sm:p-8 space-y-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Clock className="w-5 h-5" />
            </div>

            <div className="space-y-1.5">
              <h1 className="font-display text-2xl font-semibold text-slate-900 tracking-tight">
                {scanner?.isDemo ? 'This demo has ended' : 'This review link is paused'}
              </h1>
              <p className="text-sm text-slate-500">
                {scanner?.clientName || scanner?.businessName || 'Review scanner'}
              </p>
            </div>

            <p className="text-[15px] leading-relaxed text-slate-700">
              {scanner?.isDemo
                ? 'The demo session has reached its time limit, so reviews can no longer be submitted through this link.'
                : 'The administrator has paused this link, so reviews can’t be submitted right now. Please try again later or contact the business directly.'}
            </p>

            <div className="border-t border-[#e6e9e6] pt-5 space-y-1">
              <p className="text-sm font-medium text-slate-900">Want a QR review scanner for your business?</p>
              <p className="text-sm text-slate-500">
                We set up branded scanners with multi-doctor support and Google integration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href="mailto:contact@asnmedia.in"
                className="flex-1 text-center text-sm font-medium bg-[#0f5f4a] hover:bg-[#0b4c3b] text-white rounded-md px-4 py-3 transition-colors"
              >
                Contact ASN Media
              </a>
              <Link
                to="/"
                className="flex-1 text-center text-sm font-medium border border-[#cfd4d0] hover:bg-slate-50 text-slate-800 rounded-md px-4 py-3 transition-colors"
              >
                Go to home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </Shell>
    );
  }

  // INDUSTRY CHECK: Hospital/Healthcare gets the doctor + treatment selector
  const isHospital = scanner?.industry === 'Hospital / Healthcare' ||
    (scanner?.industry && scanner.industry.toLowerCase().includes('hospital')) ||
    String(slug || '').toLowerCase().includes('deshmukh');

  // 1. Extract dynamic available doctors from DB
  const availableDoctors = Array.isArray(scanner?.doctors)
    ? scanner.doctors.filter(d => d && d.available !== false && (d.name || '').trim().length > 0)
    : [];

  const dynamicDoctorChips = availableDoctors.map(d => {
    const rawName = (d.name || '').trim();
    return rawName.toUpperCase().startsWith('DR.') ? rawName.toUpperCase() : `DR. ${rawName.toUpperCase()}`;
  });

  // 2. Extract dynamic hospital services & procedures from DB
  const rawHospitalServices = Array.isArray(scanner?.hospitalServices) && scanner.hospitalServices.length > 0
    ? scanner.hospitalServices
    : DEFAULT_HOSPITAL_CHIPS;

  const dynamicServiceChips = rawHospitalServices
    .filter(s => {
      if (!s || typeof s !== 'string') return false;
      const upper = s.trim().toUpperCase();
      return upper !== 'ALL' && !upper.startsWith('DR.');
    })
    .map(s => s.trim().toUpperCase());

  // 3. Unified chip lists (doctors first, then services)
  const doctorOptions = Array.from(new Set(dynamicDoctorChips));
  const serviceOptions = Array.from(new Set(dynamicServiceChips));

  const questionsList = scanner?.questions && scanner.questions.length > 0
    ? scanner.questions
    : DEFAULT_QUESTIONS;

  const businessTitle = scanner?.clientName || scanner?.businessName || 'Review';
  const ratingLabel = getRatingLabel(rating);
  const ratingText = ratingLabel.charAt(0) + ratingLabel.slice(1).toLowerCase();
  const reviewValue = editedReview || generatedReview;

  // ==========================================
  // MAIN FORM (hospital + all other industries)
  // ==========================================
  return (
    <Shell toast={redirectNotice}>
      <div className="w-full max-w-lg my-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="font-display text-[26px] sm:text-3xl font-semibold text-slate-900 tracking-tight leading-tight">
            {businessTitle}
          </h1>
          <p className="mt-1.5 text-[15px] text-slate-600">
            Rate your visit and we’ll draft a review you can edit and post.
          </p>
        </header>

        <div className="bg-white border border-[#d9ddd9] rounded-xl">
          {/* Rating */}
          <section className="p-5 sm:p-7 border-b border-[#e6e9e6]">
            <p className="text-sm font-medium text-slate-800 mb-3">Your rating</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center -ml-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5f4a]/40 cursor-pointer"
                    aria-label={`Rate ${star} ${star === 1 ? 'star' : 'stars'}`}
                    aria-pressed={star === rating}
                  >
                    <Star
                      className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors ${star <= rating
                        ? 'fill-[#e0a100] text-[#e0a100]'
                        : 'text-[#c9cec9] fill-transparent'
                        }`}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-slate-700">{ratingText}</span>
            </div>
          </section>

          {/* Questions (dropdowns & inputs) */}
          <section className="p-5 sm:p-7 border-b border-[#e6e9e6] space-y-5">
            {isHospital && (
              <Field label="Doctor or treatment" hint="Optional">
                <SelectBox
                  value={selectedChip}
                  onChange={(e) => handleChipSelect(e.target.value)}
                  ariaLabel="Doctor or treatment"
                >
                  <option value="ALL">All / general visit</option>
                  {doctorOptions.length > 0 && (
                    <optgroup label="Doctors">
                      {doctorOptions.map((d) => (
                        <option key={d} value={d}>{toDisplayCase(d)}</option>
                      ))}
                    </optgroup>
                  )}
                  {serviceOptions.length > 0 && (
                    <optgroup label="Treatments & services">
                      {serviceOptions.map((s) => (
                        <option key={s} value={s}>{toDisplayCase(s)}</option>
                      ))}
                    </optgroup>
                  )}
                </SelectBox>
              </Field>
            )}

            {questionsList.map((q) => (
              <Field key={q.id || q.question} label={q.question}>
                {q.options && q.options.length > 0 ? (
                  <SelectBox
                    value={answers[q.question] ?? ''}
                    onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                    ariaLabel={q.question}
                  >
                    {q.options.map((opt) => (
                      <option key={opt.id || opt.value || opt.label} value={opt.value || opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </SelectBox>
                ) : (
                  <input
                    type="text"
                    value={answers[q.question] ?? ''}
                    onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                    placeholder="Your answer..."
                    aria-label={q.question}
                    className={`${FIELD_BASE} placeholder-slate-400`}
                  />
                )}
              </Field>
            ))}
          </section>

          {/* Review */}
          <section className="p-5 sm:p-7 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-800">Your review</p>

              <div className="inline-flex border border-[#cfd4d0] rounded-md overflow-hidden" role="group" aria-label="Review language">
                {LANGUAGES.map((lang, i) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageChange(lang)}
                    aria-pressed={selectedLanguage === lang}
                    className={`px-3 py-1.5 text-[13px] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0f5f4a]/40 ${i > 0 ? 'border-l border-[#cfd4d0]' : ''
                      } ${selectedLanguage === lang
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="relative">
                <textarea
                  value={reviewValue}
                  onChange={(e) => setEditedReview(e.target.value)}
                  rows={6}
                  placeholder="Writing your review…"
                  aria-label="Review text"
                  disabled={isGenerating}
                  className={`${FIELD_BASE} leading-relaxed resize-none ${isGenerating ? 'text-transparent' : ''}`}
                />
                {isGenerating && (
                  <div
                    className="absolute inset-0 rounded-md bg-white border border-[#cfd4d0] p-4 flex flex-col justify-between"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="space-y-2.5 animate-pulse">
                      <div className="h-2.5 rounded bg-slate-200 w-11/12" />
                      <div className="h-2.5 rounded bg-slate-200 w-full" />
                      <div className="h-2.5 rounded bg-slate-200 w-10/12" />
                      <div className="h-2.5 rounded bg-slate-200 w-7/12" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#0f5f4a]" />
                      Generating your review…
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between text-[13px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Writing a new draft…
                    </>
                  ) : copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0f5f4a]" />
                      Copied to clipboard
                    </>
                  ) : (
                    'Draft ready'
                  )}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer underline-offset-2 hover:underline"
                    title="Generate another variation with the same answers"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyToClipboard}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer underline-offset-2 hover:underline"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <Field label="Your name" hint="Optional">
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Rahul Patil"
                autoComplete="name"
                className={`${FIELD_BASE} placeholder-slate-400`}
              />
            </Field>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleOpenGoogle}
                disabled={isGenerating}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0f5f4a] hover:bg-[#0b4c3b] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-medium rounded-md px-5 py-3.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0f5f4a]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating review…
                  </>
                ) : (
                  <>
                    Post on Google
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center">
                {directSubmitted ? (
                  <p className="inline-flex items-center gap-1.5 text-sm text-[#0f5f4a]">
                    <Check className="w-4 h-4" />
                    Review sent to {businessTitle}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleDirectWebSubmit}
                    disabled={isSubmittingDirect}
                    className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmittingDirect ? 'Sending…' : `Send directly to ${businessTitle} instead`}
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </Shell>
  );
};

export default PublicReviewScanner;