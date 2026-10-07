import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Star,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Clock,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { mockData } from '../admin/data/mockData';
import reviewsPoolData from '../data/reviewsPool.json';

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

// Helper to determine exact industry category on client
function getIndustryCategory(industryStr, businessNameStr) {
  const ind = (industryStr || '').toLowerCase();
  const bName = (businessNameStr || '').toLowerCase();
  
  if (ind.includes('hospital') || ind.includes('health') || ind.includes('eye') || ind.includes('clinic') || ind.includes('dental') || ind.includes('doctor') || ind.includes('medical') || bName.includes('hospital') || bName.includes('clinic') || bName.includes('eye care') || bName.includes('deshmukh')) {
    return 'hospital';
  }
  if (ind.includes('auto') || ind.includes('garage') || ind.includes('car') || ind.includes('motor') || ind.includes('workshop') || ind.includes('bike') || ind.includes('vehicle') || bName.includes('garage') || bName.includes('auto') || bName.includes('motors') || bName.includes('workshop') || bName.includes('service center')) {
    return 'automotive';
  }
  if (ind.includes('dining') || ind.includes('restaurant') || ind.includes('food') || ind.includes('cafe') || ind.includes('hotel') || ind.includes('bakery') || ind.includes('dhaba') || bName.includes('cafe') || bName.includes('restaurant') || bName.includes('kitchen') || bName.includes('dhaba')) {
    return 'dining';
  }
  if (ind.includes('retail') || ind.includes('shopping') || ind.includes('store') || ind.includes('market') || ind.includes('fashion') || ind.includes('jewel') || bName.includes('store') || bName.includes('mart') || bName.includes('jewellers') || bName.includes('fashion')) {
    return 'retail';
  }
  if (ind.includes('salon') || ind.includes('spa') || ind.includes('beauty') || ind.includes('parlour') || ind.includes('hair') || ind.includes('grooming')) {
    return 'salon';
  }
  if (ind.includes('gym') || ind.includes('fit') || ind.includes('workout') || ind.includes('crossfit') || ind.includes('yoga')) {
    return 'fitness';
  }
  if (ind.includes('edu') || ind.includes('coach') || ind.includes('school') || ind.includes('class') || ind.includes('academy') || ind.includes('institute') || ind.includes('tutor')) {
    return 'education';
  }
  if (ind.includes('real estate') || ind.includes('estate') || ind.includes('architect') || ind.includes('interior') || ind.includes('property') || ind.includes('builder')) {
    return 'realestate';
  }
  if (ind.includes('corp') || ind.includes('tech') || ind.includes('it') || ind.includes('consult') || ind.includes('software') || ind.includes('media') || ind.includes('agency') || ind.includes('law') || ind.includes('legal')) {
    return 'corporate';
  }
  return 'general';
}

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
  const [recentReviewsHistory, setRecentReviewsHistory] = useState([]);

  // Demo Mode State & Countdown
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoExpiresAt, setDemoExpiresAt] = useState(null);
  const [demoRemainingSeconds, setDemoRemainingSeconds] = useState(null);

  // Auto-Redirect Timer State
  const [autoRedirectDuration, setAutoRedirectDuration] = useState(0);
  const [copied, setCopied] = useState(true);
  const [redirectNotice, setRedirectNotice] = useState(false);

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
    const rawQuestions = rawScanner.questions && rawScanner.questions.length > 0 ? rawScanner.questions : DEFAULT_QUESTIONS;
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
    } catch (e) {}
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
      initializeAnswers(normalized.questions);
      
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
        craftDynamicReview(initialChip, selectedLanguage, rating, normalized);
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
      } catch (err) {}
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
        } catch (e) {}
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
    } catch (e) {}

    // 3. Fallback: Generate a smart branded scanner for this link slug
    const smartFallback = normalizeScanner({}, targetSlug);
    applyNormalizedScanner(smartFallback);
  };

  const initializeAnswers = (questionsList) => {
    if (!questionsList) return;
    const initial = {};
    questionsList.forEach((q) => {
      if (q.options && q.options.length > 0) {
        initial[q.question] = q.options[0].value || q.options[0].label;
      } else {
        initial[q.question] = '';
      }
    });
    setAnswers(initial);
  };

  // Dynamic Multi-Language AI Crafting for Reviews
  const craftDynamicReview = async (chip, lang, stars, currentScanner = scanner) => {
    setIsGenerating(true);
    const targetScanner = currentScanner || scanner;
    const bName = targetScanner?.clientName || targetScanner?.businessName || 'Our Business';
    const industry = targetScanner?.industry || 'Hospital / Healthcare';
    
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
      targetServiceName = 'comprehensive healthcare & consultation';
    }

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
          previousReview: generatedReview || ''
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reviewText) {
          setGeneratedReview(data.reviewText);
          setEditedReview(data.reviewText);
          setRecentReviewsHistory((prev) => [data.reviewText, ...prev.filter(p => p !== data.reviewText)].slice(0, 8));
          setIsGenerating(false);
          try {
            navigator.clipboard.writeText(data.reviewText);
            setCopied(true);
          } catch (e) {}
          return;
        }
      }
    } catch (e) {}

    // Client-side fallback from diverse multi-industry review pool
    setTimeout(() => {
      const cat = getIndustryCategory(industry, bName);
      const catTemplates = reviewsPoolData?.templates?.[cat] || reviewsPoolData?.templates?.general || {};
      
      let langKey = 'english';
      if (lang === 'मराठी') langKey = 'marathi';
      else if (lang === 'हिंदी') langKey = 'hindi';

      const pool = catTemplates[langKey] || catTemplates.english || reviewsPoolData?.templates?.general?.[langKey] || [];
      
      // Filter out templates that were recently used to ensure unique structure every time
      let eligible = pool.filter(t => !recentReviewsHistory.includes(t) && t !== generatedReview);
      if (eligible.length === 0) {
        eligible = pool.filter(t => t !== generatedReview);
        if (eligible.length === 0) eligible = pool;
      }

      const randomIndex = Math.floor(Math.random() * (eligible.length || 1));
      let templateStr = eligible[randomIndex] || `Great experience with ${bName}! Highly recommended.`;

      let displayService = targetServiceName;
      if (chip === 'ALL' || !displayService) {
        displayService = lang === 'मराठी' ? 'उत्तम सेवा व सहकार्य' : lang === 'हिंदी' ? 'उत्कृष्ट सेवा व परामर्श' : 'exceptional service';
      }

      let displayDoc = targetDocName || (cat === 'hospital' ? (lang === 'मराठी' ? 'तज्ज्ञ डॉक्टर' : lang === 'हिंदी' ? 'अनुभवी डॉक्टर' : 'the doctor') : '');

      let text = templateStr
        .replace(/{businessName}/g, bName)
        .replace(/{doctorName}/g, displayDoc || (lang === 'मराठी' ? 'तज्ज्ञ' : lang === 'हिंदी' ? 'विशेषज्ञ' : 'the specialist'))
        .replace(/{serviceName}/g, displayService)
        .replace(/{phrase}/g, 'exceptional service');

      setGeneratedReview(text);
      setEditedReview(text);
      setRecentReviewsHistory((prev) => [templateStr, ...prev.filter(p => p !== templateStr)].slice(0, 8));
      setIsGenerating(false);

      try {
        navigator.clipboard.writeText(text);
        setCopied(true);
      } catch (e) {}
    }, 250);
  };

  const handleChipSelect = (chip) => {
    setSelectedChip(chip);
    
    // Check if the clicked chip corresponds to a doctor in DB
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
    
    craftDynamicReview(chip, selectedLanguage, rating);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    craftDynamicReview(selectedChip, lang, rating);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    craftDynamicReview(selectedChip, selectedLanguage, newRating);
  };

  const handleAnswerChange = (qText, val) => {
    const updated = { ...answers, [qText]: val };
    setAnswers(updated);
    const chosenValues = Object.values(updated).filter(Boolean);
    const servicePhrase = chosenValues.join(', ');
    craftDynamicReview(servicePhrase, selectedLanguage, rating);
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
    } catch (e) {}

    // Record interaction metric
    try {
      fetch(`/api/scanners/public/${encodeURIComponent(slug || 'scanner')}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'GOOGLE_CLICKED', rating, metadata: { selectedChip, selectedLanguage } })
      });
    } catch (e) {}

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f3] flex flex-col items-center justify-center p-6 text-[#0d594b] font-body">
        <RefreshCw className="w-10 h-10 animate-spin mb-4 text-[#008768]" />
        <p className="font-mono text-xs tracking-widest uppercase font-bold text-[#0d594b]">
          Loading Review Experience...
        </p>
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
      <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] font-body flex flex-col justify-center items-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#12131A] border border-red-500/40 rounded-[28px] p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
          
          {/* Glowing background halo */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Warning / Lock Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span>Not Permitted Now</span>
          </div>

          {/* Main Icon */}
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-400 shadow-inner">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {scanner?.isDemo ? 'Demo Scanner Expired' : 'Scanner Paused & Closed'}
            </h1>
            <p className="font-mono text-xs text-red-400 font-semibold uppercase tracking-wider">
              {scanner?.clientName || scanner?.businessName || 'Review Scanner'}
            </p>
          </div>

          {/* Explanation Box */}
          <div className="p-4 bg-[#1B1D28] border border-[#2B2E3E] rounded-2xl text-left space-y-2.5 text-xs sm:text-sm text-gray-300">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="font-medium text-gray-200 leading-relaxed">
                {scanner?.isDemo
                  ? 'This demo review scanner session has reached its allotted duration and is now closed. Review submissions and QR scans are not permitted through this link.'
                  : 'This review scanner link is currently inactive or paused by the administrator. Direct review submissions are not permitted at this time.'}
              </p>
            </div>
            <div className="pt-2 border-t border-[#2B2E3E] flex items-center justify-between text-[11px] font-mono text-gray-400">
              <span>Status: <strong className="text-red-400">CLOSED</strong></span>
              <span>Access: <strong className="text-red-400">NOT PERMITTED</strong></span>
            </div>
          </div>

          {/* ASN Digital Media Info Notice */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200/90 text-center space-y-1 font-mono">
            <div className="font-bold text-amber-300 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Get Your Business Live QR Standee</span>
            </div>
            <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
              Activate a permanent Commercial QR Review Scanner with custom branding, multi-doctor support & Google integration.
            </p>
          </div>

          {/* Action Link */}
          <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
            <Link
              to="/"
              className="flex-1 py-3 px-4 bg-[#1E202B] hover:bg-[#2A2D3D] text-white font-mono text-xs font-bold rounded-xl transition-all text-center border border-[#2B2E3E]"
            >
              Return Home
            </Link>
            <a
              href="mailto:contact@asnmedia.in"
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl transition-all text-center shadow-lg shadow-emerald-600/20"
            >
              Contact ASN Media
            </a>
          </div>

        </div>
      </div>
    );
  }

  // INDUSTRY CHECK: Only Hospital/Healthcare gets the 2-Column Mint Doctor layout
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

  // 3. Unified dynamic chips list: 'ALL', followed by available doctors from DB, followed by services from DB
  const chipsList = Array.from(new Set([
    'ALL',
    ...dynamicDoctorChips,
    ...dynamicServiceChips
  ]));

  // ==========================================
  // 1. HOSPITAL INDUSTRY SPECIALIZED UI (Exact Screenshot Match)
  // ==========================================
  if (isHospital) {
    return (
      <div className="min-h-screen bg-[#d8f0ea] text-[#0a2520] font-body flex flex-col justify-between items-center p-4 sm:p-8 selection:bg-[#008768] selection:text-white">
        {/* Toast Alert */}
        {redirectNotice && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#008768] text-white px-5 py-2.5 rounded-full shadow-2xl font-mono text-xs flex items-center gap-2 animate-bounce border border-white/20">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Review copied to clipboard! Opening Google Reviews...</span>
          </div>
        )}

        {/* Top Hospital Title with Accent Dash */}
        <div className="pt-2 pb-6 text-center space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a2520] tracking-tight">
            {scanner?.clientName || scanner?.businessName || 'Deshmukh Eye Hospital'}
          </h1>
          <div className="w-12 h-1.5 bg-[#008768] rounded-full mx-auto" />
        </div>

        {/* Main Two-Column Wide Card (As in user screenshot) */}
        <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-xl border border-[#cbe6dd] p-6 sm:p-10 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT COLUMN: Experience, Chips & Star Rating */}
            <div className="lg:col-span-6 space-y-6 lg:pr-6 lg:border-r border-[#e8f2ee]">
              <div className="space-y-1">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0a2520] tracking-tight">
                  How was your experience?
                </h2>
                <p className="text-xs sm:text-sm text-[#4b6f68] font-medium">
                  Select a service & tap a star for your perfect review.
                </p>
              </div>

              {/* Which Doctor / Services Section Header */}
              <div className="space-y-3 pt-1">
                <label className="block text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#4b6f68]">
                  WHICH DOCTOR? (OPTIONAL)
                </label>

                {/* Responsive Chip Grid */}
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {chipsList.map((chipItem) => {
                    const isSelected = selectedChip === chipItem;
                    return (
                      <button
                        key={chipItem}
                        type="button"
                        onClick={() => handleChipSelect(chipItem)}
                        className={`text-[10px] sm:text-[10.5px] font-bold uppercase tracking-tight px-3 py-2.5 rounded-2xl transition-all cursor-pointer select-none text-center ${
                          isSelected
                            ? 'bg-[#008768] text-white shadow-sm border border-[#008768]'
                            : 'bg-[#edf8f5] text-[#006b52] border border-[#d6ebe3] hover:bg-[#e2f3ed]'
                        }`}
                      >
                        {chipItem}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating & Label */}
              <div className="pt-4 flex flex-col items-center justify-center gap-2 border-t border-[#edf6f2]">
                <div className="flex items-center gap-2.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="p-1 transition-transform active:scale-125 focus:outline-none cursor-pointer"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                          star <= rating
                            ? 'fill-[#008768] text-[#008768]'
                            : 'text-[#d6ebe3] fill-transparent'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="font-mono text-xs sm:text-sm font-extrabold tracking-widest text-[#0a2520] uppercase">
                  {getRatingLabel(rating)}
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: AI Crafting, Language Pills, Textarea, Name Input & Post on Google Button */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4 lg:pl-4">
              
              {/* Top Language Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-[#e2f0ea] pb-3">
                <span className="text-[11px] font-mono font-extrabold tracking-wider uppercase text-[#4b6f68]">
                  CRAFTING YOUR REVIEWS...
                </span>

                {/* Language Switcher Pills (English, हिंदी, मराठी) */}
                <div className="flex items-center gap-1 bg-[#edf8f5] p-1 rounded-xl border border-[#d6ebe3]">
                  {['English', 'हिंदी', 'मराठी'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageChange(lang)}
                      className={`px-3 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                        selectedLanguage === lang
                          ? 'bg-[#008768] text-white font-bold shadow-xs'
                          : 'text-[#4b6f68] font-medium hover:text-[#0a2520]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sparkle Generating Header + Regenerate Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#008768]">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>{isGenerating ? 'GENERATING...' : 'AI REVIEW READY'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => craftDynamicReview(selectedChip, selectedLanguage, rating)}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#008768] hover:text-[#00523f] bg-[#edf8f5] hover:bg-[#d8f0ea] px-2.5 py-1 rounded-lg border border-[#cbe6dd] transition-all cursor-pointer shadow-xs"
                  title="Generate another unique review"
                >
                  <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Try Different Style</span>
                </button>
              </div>

              {/* Review Display / Edit Textarea */}
              <div className="relative">
                <textarea
                  value={editedReview || generatedReview}
                  onChange={(e) => setEditedReview(e.target.value)}
                  rows={5}
                  placeholder="Our AI is crafting your review..."
                  className="w-full bg-[#eef6f3] border border-[#d6ebe3] text-[#0a2520] text-xs sm:text-sm leading-relaxed p-4 rounded-2xl focus:outline-none focus:border-[#008768] focus:ring-1 focus:ring-[#008768] transition-all font-body resize-none"
                />
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="absolute top-3 right-3 p-1.5 bg-white border border-[#cbebe0] rounded-lg shadow-xs hover:bg-[#f0faf6] text-[#4b6f68] transition-colors cursor-pointer"
                  title="Copy to clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Name Input Box (Optional) */}
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full bg-white border border-[#cbebe0] text-[#0a2520] placeholder-[#7d9e96] text-xs sm:text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#008768] transition-all"
              />

              {/* Action Buttons & Status */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={handleOpenGoogle}
                  disabled={isGenerating}
                  className="w-full py-3.5 px-6 bg-[#48a994] hover:bg-[#008768] active:bg-[#006e54] text-white font-mono font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>GENERATING...</span>
                    </>
                  ) : (
                    <>
                      <span>POST ON GOOGLE</span>
                      <ExternalLink className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono font-bold text-[#4b6f68]">
                  <span className="w-2 h-2 rounded-full bg-[#008768] inline-block" />
                  <span>AUTO-COPIED</span>
                </div>

                {/* Secondary Direct In-Web Post button */}
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={handleDirectWebSubmit}
                    disabled={isSubmittingDirect || directSubmitted}
                    className="text-xs font-mono text-[#006b52] hover:text-[#0a2520] hover:underline transition-colors cursor-pointer"
                  >
                    {directSubmitted
                      ? `✓ Review Published on ${scanner?.clientName || 'Hospital'} Portal`
                      : `Or Submit Directly to ${scanner?.clientName || 'Hospital'} Portal →`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 pb-2 text-center flex items-center justify-center gap-4 text-xs font-mono text-[#4b6f68]">
          <Link to="/terms" className="hover:underline hover:text-[#0a2520]">
            Terms & Conditions
          </Link>
          <span>•</span>
          <Link to="/terms" className="hover:underline hover:text-[#0a2520]">
            Privacy Policy
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. UNIVERSAL BUSINESS & GARAGE & RETAIL & DINING UI
  // ==========================================
  const questionsList = scanner?.questions && scanner.questions.length > 0
    ? scanner.questions
    : DEFAULT_QUESTIONS;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-body flex flex-col justify-between items-center p-4 sm:p-8">
      {/* Toast Alert */}
      {redirectNotice && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-5 py-2.5 rounded-full shadow-2xl font-mono text-xs flex items-center gap-2 animate-bounce border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Review copied to clipboard! Opening Google Reviews...</span>
        </div>
      )}

      {/* Top Business Title */}
      <div className="pt-2 pb-6 text-center space-y-2 max-w-xl">
        <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-slate-800 text-indigo-400 rounded-full border border-slate-700">
          {scanner?.industry || 'Verified Business'}
        </span>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {scanner?.clientName || scanner?.businessName || 'Business Review Experience'}
        </h1>
      </div>

      {/* Main Universal Card */}
      <div className="w-full max-w-2xl bg-slate-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700 p-6 sm:p-8 my-auto space-y-6">
        
        {/* Star Rating Selector */}
        <div className="text-center space-y-3 pb-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">How was your experience?</h2>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="p-1 transition-transform active:scale-125 focus:outline-none cursor-pointer"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-600 fill-transparent'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="font-mono text-xs font-bold tracking-widest text-indigo-400 uppercase">
            {getRatingLabel(rating)}
          </span>
        </div>

        {/* Dynamic Business Questions */}
        {questionsList.length > 0 && (
          <div className="space-y-4">
            {questionsList.map((q) => (
              <div key={q.id} className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-300">
                  {q.question}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(q.options || []).map((opt) => {
                    const isSelected = answers[q.question] === opt.value || answers[q.question] === opt.label;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleAnswerChange(q.question, opt.value || opt.label)}
                        className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Language & Generated Review Section */}
        <div className="space-y-3 pt-2 bg-slate-900/60 p-5 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isGenerating ? 'GENERATING...' : 'AI REVIEW READY'}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const chosenValues = Object.values(answers).filter(Boolean);
                  const servicePhrase = chosenValues.join(', ') || 'service';
                  craftDynamicReview(servicePhrase, selectedLanguage, rating);
                }}
                disabled={isGenerating}
                className="flex items-center gap-1 text-[11px] font-mono font-semibold text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-all cursor-pointer shadow-xs"
                title="Generate another unique review"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Try Different Style</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              {['English', 'हिंदी', 'मराठी'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              value={editedReview || generatedReview}
              onChange={(e) => setEditedReview(e.target.value)}
              rows={4}
              placeholder="Your review is ready..."
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm leading-relaxed p-4 rounded-xl focus:outline-none focus:border-indigo-500 font-body resize-none"
            />
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="absolute top-3 right-3 p-1.5 bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Copy"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
          />

          <button
            type="button"
            onClick={handleOpenGoogle}
            disabled={isGenerating}
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>POST ON GOOGLE</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleDirectWebSubmit}
              disabled={isSubmittingDirect || directSubmitted}
              className="text-xs font-mono text-slate-400 hover:text-indigo-400 hover:underline transition-colors cursor-pointer"
            >
              {directSubmitted
                ? `✓ Review Published to ${scanner?.clientName || 'Business'}`
                : `Or Submit Review Directly to ${scanner?.clientName || 'Business'} →`}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 pb-2 text-center flex items-center justify-center gap-4 text-xs font-mono text-slate-500">
        <Link to="/terms" className="hover:underline hover:text-slate-300">
          Terms & Conditions
        </Link>
        <span>•</span>
        <Link to="/terms" className="hover:underline hover:text-slate-300">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default PublicReviewScanner;
