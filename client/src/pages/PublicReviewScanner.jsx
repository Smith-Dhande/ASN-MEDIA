import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Sparkles, CheckCircle2, Copy, ExternalLink, RefreshCw, AlertCircle, MessageSquareQuote, ChevronRight } from 'lucide-react';

export const PublicReviewScanner = () => {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [scanner, setScanner] = useState(null);
  const [error, setError] = useState(null);

  // Customer Form State
  const [rating, setRating] = useState(5);
  const [answers, setAnswers] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Review Result State
  const [generatedReview, setGeneratedReview] = useState('');
  const [editedReview, setEditedReview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [googleUrl, setGoogleUrl] = useState('');

  // UI States
  const [copied, setCopied] = useState(false);
  const [redirectNotice, setRedirectNotice] = useState(false);

  useEffect(() => {
    fetchScanner();
  }, [slug]);

  const fetchScanner = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try Backend Server API first
      const response = await fetch(`http://localhost:5000/api/review-scanners/public/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setScanner(data);
        setGoogleUrl(data.googleReviewUrl);
        initializeAnswers(data.questions);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend API server unavailable, checking local storage fallback:', err.message);
    }

    // 2. Fallback to localStorage mock data if backend server is not running
    try {
      const savedMock = localStorage.getItem('asn_admin_mock_data');
      if (savedMock) {
        const parsed = JSON.parse(savedMock);
        const scanners = parsed.reviewScanners || [];
        const found = scanners.find((s) => s.slug === slug || s.id === slug || s.clientName.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug);

        if (found) {
          if (found.status !== 'Active') {
            setError('This review scanner link is currently inactive.');
            setLoading(false);
            return;
          }

          const publicConfig = {
            id: found.id,
            slug: found.slug || slug,
            clientName: found.clientName || found.placeName,
            name: found.name || found.placeName,
            googleReviewUrl: found.googleUrl || found.googleReviewUrl || 'https://google.com',
            ratingRequired: found.ratingRequired !== false,
            questions: found.questions || [
              {
                id: 'q1',
                question: 'What did you like most?',
                type: 'dropdown',
                required: true,
                options: [
                  { id: 'o1', label: 'Food & Quality', value: 'Food & Quality' },
                  { id: 'o2', label: 'Customer Service', value: 'Customer Service' },
                  { id: 'o3', label: 'Ambience & Vibe', value: 'Ambience & Vibe' },
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
                  { id: 'o6', label: 'Quick Service', value: 'Quick Service' },
                  { id: 'o7', label: 'Great Presentation', value: 'Great Presentation' },
                  { id: 'o8', label: 'Clean Environment', value: 'Clean Environment' }
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
            ]
          };

          setScanner(publicConfig);
          setGoogleUrl(publicConfig.googleReviewUrl);
          initializeAnswers(publicConfig.questions);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error('Error loading fallback scanner:', e);
    }

    setError('This review scanner link is no longer available or invalid.');
    setLoading(false);
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

  const handleOptionChange = (questionText, value) => {
    setAnswers((prev) => ({ ...prev, [questionText]: value }));

    // Track FORM_STARTED event
    trackEvent('FORM_STARTED');
  };

  const trackEvent = async (eventType, metadata = {}) => {
    try {
      await fetch(`http://localhost:5000/api/review-scanners/public/${slug}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, rating, metadata })
      });
    } catch (e) {
      // non-blocking
    }
  };

  const handleGenerateReview = async () => {
    setIsGenerating(true);

    const formattedAnswers = Object.entries(answers).map(([q, a]) => ({ question: q, answer: a }));

    try {
      // 1. Try Backend AI Service
      const res = await fetch(`http://localhost:5000/api/review-scanners/public/${slug}/generate-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, answers: formattedAnswers })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedReview(data.reviewText);
        setEditedReview(data.reviewText);
        if (data.googleReviewUrl) setGoogleUrl(data.googleReviewUrl);
        setIsGenerating(false);
        return;
      }
    } catch (err) {
      console.warn('Backend review generator API call failed, using client generator fallback:', err.message);
    }

    // 2. Client-side fallback generator
    setTimeout(() => {
      const selectedValues = Object.values(answers).filter(Boolean);
      let text = `Had a fantastic experience at ${scanner?.clientName || 'this business'}! `;
      if (selectedValues.length > 0) {
        text += `I particularly loved the ${selectedValues.join(' and ').toLowerCase()}. `;
      }
      if (rating >= 4) {
        text += `Everything exceeded my expectations. Highly recommended!`;
      } else {
        text += `Overall, it was a good visit.`;
      }

      setGeneratedReview(text);
      setEditedReview(text);
      setIsGenerating(false);
    }, 800);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editedReview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleContinueToGoogle = async () => {
    // 1. Attempt automatic copy to clipboard
    try {
      await navigator.clipboard.writeText(editedReview);
      setCopied(true);
    } catch (e) {
      console.warn('Clipboard copy permission denied:', e);
    }

    // 2. Track GOOGLE_CLICKED event
    trackEvent('GOOGLE_CLICKED', { reviewTextLength: editedReview.length });

    // 3. Show redirect toast
    setRedirectNotice(true);

    // 4. Open Google URL in new window/tab
    setTimeout(() => {
      if (googleUrl) {
        window.open(googleUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.open('https://search.google.com', '_blank');
      }
      setRedirectNotice(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex flex-col items-center justify-center p-4 font-body">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-3 border-[#8E722A] border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm text-[#685C43]">Loading review scanner...</p>
        </div>
      </div>
    );
  }

  if (error || !scanner) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex flex-col items-center justify-center p-4 font-body">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-[#0A0A0A]/10 text-center space-y-4">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#8E722A]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#111111]">Scanner Unavailable</h2>
          <p className="text-sm text-[#685C43] font-body">{error || 'This scanner link is no longer available.'}</p>
          <a
            href="https://asnmedia.in"
            className="inline-block mt-4 px-6 py-2.5 bg-[#111111] text-[#F7F5EF] font-mono text-xs rounded hover:bg-[#8E722A] transition-colors"
          >
            Visit ASN Media
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#111111] font-body flex flex-col items-center justify-between p-4 sm:p-6 selection:bg-[#C8A13A] selection:text-black">
      {/* Toast Notification */}
      {redirectNotice && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-[#F7F5EF] px-5 py-3 rounded-full shadow-2xl font-mono text-xs flex items-center gap-2 border border-[#8E722A] animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#8E722A]" />
          <span>Review copied! Opening Google Reviews...</span>
        </div>
      )}

      {/* Main Card Container */}
      <div className="w-full max-w-md my-auto space-y-6">
        {/* Branded Header */}
        <div className="text-center space-y-2 pt-2">
          {/* <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8E722A]/10 border border-[#8E722A]/30 rounded-full text-[11px] font-mono text-[#8E722A]">
            <Sparkles className="w-3 h-3 text-[#8E722A]" />
            <span>AI Review Assistant</span>
          </div> */}

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            {scanner.clientName}
          </h1>
          <p className="text-xs sm:text-sm text-[#685C43] font-mono">
            {!generatedReview ? 'How was your experience today?' : 'Review Generated Successfully!'}
          </p>
        </div>

        {/* STEP 1: QUESTION SELECTION FORM */}
        {!generatedReview ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#0A0A0A]/08 space-y-6">
            {/* Star Rating Component */}
            <div className="text-center space-y-2 pb-4 border-b border-[#0A0A0A]/08">
              <label className="block text-xs font-mono text-[#685C43] uppercase tracking-wider">
                Overall Rating {scanner.ratingRequired && <span className="text-amber-600">*</span>}
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform active:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= rating
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]'
                        : 'text-gray-300'
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Questions & Dropdowns */}
            <div className="space-y-5">
              {(scanner.questions || []).map((q, idx) => (
                <div key={q.id || idx} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#111111] font-mono">
                    {q.question}
                  </label>

                  <div className="relative">
                    <select
                      value={answers[q.question] || ''}
                      onChange={(e) => handleOptionChange(q.question, e.target.value)}
                      className="w-full bg-[#FAF8F3] border border-[#0A0A0A]/15 text-[#111111] text-xs sm:text-sm rounded-lg px-3.5 py-2.5 font-body focus:outline-none focus:border-[#8E722A] focus:ring-1 focus:ring-[#8E722A] transition-all cursor-pointer appearance-none"
                    >
                      {(q.options || []).map((opt, oIdx) => (
                        <option key={opt.id || oIdx} value={opt.value || opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#685C43]">
                      ▼
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleGenerateReview}
              disabled={isGenerating}
              className="w-full py-3.5 px-6 bg-[#111111] hover:bg-[#8E722A] text-[#F7F5EF] font-mono text-xs sm:text-sm font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#8E722A]" />
                  <span>Generating your review...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#8E722A] group-hover:text-white transition-colors" />
                  <span>Generate My Review</span>
                  <ChevronRight className="w-4 h-4 text-[#685C43] group-hover:text-white transition-colors ml-auto" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* STEP 2: GENERATED REVIEW DISPLAY & EDIT */
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#0A0A0A]/08 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#0A0A0A]/08">
              <div className="flex items-center gap-2 font-mono text-xs text-[#685C43]">
                <MessageSquareQuote className="w-4 h-4 text-[#8E722A]" />
                <span>Your Generated Review</span>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-mono text-[#8E722A] hover:underline flex items-center gap-1"
              >
                {isEditing ? 'Done Editing' : 'Edit Review'}
              </button>
            </div>

            {/* Editable Review Text Box */}
            <div className="relative">
              <textarea
                value={editedReview}
                onChange={(e) => setEditedReview(e.target.value)}
                disabled={!isEditing}
                rows={5}
                className={`w-full text-xs sm:text-sm leading-relaxed font-body p-4 rounded-xl transition-all focus:outline-none ${isEditing
                  ? 'bg-white border-2 border-[#8E722A] text-[#111111] shadow-inner'
                  : 'bg-[#FAF8F3] border border-[#0A0A0A]/10 text-[#111111]'
                  }`}
              />

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="absolute top-3 right-3 p-1.5 bg-white border border-[#0A0A0A]/10 rounded shadow hover:bg-[#FAF8F3] transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#685C43]" />}
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleContinueToGoogle}
                className="w-full py-3.5 px-6 bg-[#8E722A] hover:bg-[#725B20] text-white font-mono text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
              >
                <span>Continue to Google Reviews</span>
                <ExternalLink className="w-4 h-4 text-amber-200 group-hover:text-white" />
              </button>

              <button
                type="button"
                onClick={() => setGeneratedReview('')}
                className="w-full py-2 text-xs font-mono text-[#685C43] hover:text-[#111111] transition-colors text-center"
              >
                ← Change Selections
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="text-center pt-8 pb-2">
        <p className="font-mono text-[11px] text-[#685C43]/70">
          Powered by <span className="font-semibold text-[#111111]">ASN Media</span> AI Scanner System
        </p>
      </div>
    </div>
  );
};
