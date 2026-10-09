const mongoose = require('mongoose');
const Scanner = require('../models/Scanner');
const Client = require('../models/Client');
const ActivityLog = require('../models/ActivityLog');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const reviewsPoolData = require('../data/reviewsPool.json');
const { generateInputBasedReview } = require('../utils/reviewGenerator');

// Helper to determine exact industry category
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

// In-memory cache to ensure non-repetition across sequential requests for the same scanner/session
const recentPicksMap = new Map();

// Helper function to pick a diverse template from industry-scoped review pool and interpolate variables
function generateDynamicReviewFromPool({ language, industry, rating, businessName, doctorName, serviceName, phraseStr, excludeText, contextKey }) {
  const langKey = (language || 'English').toLowerCase();
  let lang = 'english';
  if (langKey === 'मराठी' || langKey === 'mr' || langKey === 'marathi') {
    lang = 'marathi';
  } else if (langKey === 'हिंदी' || langKey === 'hi' || langKey === 'hindi') {
    lang = 'hindi';
  }

  const cat = getIndustryCategory(industry, businessName);
  const catTemplates = reviewsPoolData.templates[cat] || reviewsPoolData.templates.general;
  const pool = catTemplates[lang] || catTemplates.english || reviewsPoolData.templates.general[lang] || [];

  if (!pool || pool.length === 0) {
    return `Great experience with ${businessName || 'this business'}! Highly recommended.`;
  }

  // Anti-repetition: avoid recent picks for this business/session
  const cacheKey = contextKey || `${businessName}_${cat}_${lang}`;
  const recentPicks = recentPicksMap.get(cacheKey) || [];

  // Filter pool candidates not in recent history and not equal to excludeText
  let eligibleTemplates = pool.filter(t => !recentPicks.includes(t) && (!excludeText || t !== excludeText));
  if (eligibleTemplates.length === 0) {
    eligibleTemplates = pool.filter(t => !excludeText || t !== excludeText);
    if (eligibleTemplates.length === 0) eligibleTemplates = pool;
  }

  // Pick a random template from eligible candidates
  const randomIndex = Math.floor(Math.random() * eligibleTemplates.length);
  let template = eligibleTemplates[randomIndex];

  // Update recent picks history (keep last 5)
  const updatedPicks = [template, ...recentPicks.filter(p => p !== template)].slice(0, 5);
  recentPicksMap.set(cacheKey, updatedPicks);

  const finalDoc = doctorName || (cat === 'hospital' ? (lang === 'marathi' ? 'तज्ज्ञ डॉक्टर' : lang === 'hindi' ? 'अनुभवी डॉक्टर' : 'the doctor') : '');
  
  let defaultService = 'exceptional service';
  if (cat === 'automotive') {
    defaultService = lang === 'marathi' ? 'गाडीची सर्व्हिसिंग व दुरुस्ती' : lang === 'hindi' ? 'गाड़ी की सर्विसिंग व रिपेयर' : 'vehicle maintenance & service';
  } else if (cat === 'hospital') {
    defaultService = lang === 'marathi' ? 'उपचार व तपासणी' : lang === 'hindi' ? 'उपचार व परामर्श' : 'consultation & treatment';
  } else if (cat === 'dining') {
    defaultService = lang === 'marathi' ? 'स्वादिष्ट भोजन' : lang === 'hindi' ? 'स्वादिष्ट भोजन' : 'dining experience';
  } else if (cat === 'retail') {
    defaultService = lang === 'marathi' ? 'खरेदी' : lang === 'hindi' ? 'खरीदारी' : 'shopping experience';
  } else if (cat === 'salon') {
    defaultService = lang === 'marathi' ? 'ग्रूमिंग सेवा' : lang === 'hindi' ? 'ब्यूटी व हेयर सर्विस' : 'hair & grooming service';
  } else if (cat === 'fitness') {
    defaultService = lang === 'marathi' ? 'फिटनेस ट्रेनिंग' : lang === 'hindi' ? 'वर्कआउट व ट्रेनिंग' : 'fitness training';
  } else if (cat === 'education') {
    defaultService = lang === 'marathi' ? 'शिक्षण व मार्गदर्शन' : lang === 'hindi' ? 'कोचिंग व शिक्षण' : 'coaching & training';
  } else if (cat === 'realestate') {
    defaultService = lang === 'marathi' ? 'वास्तु सल्ला' : lang === 'hindi' ? 'प्रॉपर्टी परामर्श' : 'consultation & design';
  }

  const finalService = serviceName || (phraseStr || defaultService);
  const finalBusiness = businessName || (cat === 'hospital' ? (lang === 'marathi' ? 'रुग्णालय' : lang === 'hindi' ? 'अस्पताल' : 'the hospital') : (cat === 'automotive' ? (lang === 'marathi' ? 'गॅरेज' : lang === 'hindi' ? 'गैराज' : 'the garage') : (lang === 'marathi' ? 'संस्था' : lang === 'hindi' ? 'प्रतिष्ठान' : 'this business')));

  let text = template
    .replace(/{businessName}/g, finalBusiness)
    .replace(/{doctorName}/g, finalDoc || (lang === 'marathi' ? 'मार्गदर्शक' : lang === 'hindi' ? 'विशेषज्ञ' : 'the specialist'))
    .replace(/{serviceName}/g, finalService)
    .replace(/{phrase}/g, phraseStr || 'exceptional service');

  return text;
}

// @desc    Get all review scanners
// @route   GET /api/scanners
exports.getScanners = async (req, res, next) => {
  try {
    // Check and auto-pause any scanners whose auto-pause schedule or demo duration has elapsed
    const now = new Date();
    await Scanner.updateMany(
      {
        status: 'Active',
        $or: [
          { autoPauseEnabled: true, autoPauseAt: { $ne: null, $lte: now } },
          { isDemo: true, demoExpiresAt: { $ne: null, $lte: now } }
        ]
      },
      {
        $set: { status: 'Paused', autoPauseEnabled: false }
      }
    );

    const scanners = await Scanner.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: scanners.length, data: scanners });
  } catch (err) {
    next(err);
  }
};

const defaultQuestions = [
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
];

// Helper to find scanner by slug/id/name
const findScannerFlexible = async (slug) => {
  if (!slug) return null;
  const cleanSlug = String(slug).trim();

  // 1. Direct case-insensitive slug match
  let scanner = await Scanner.findOne({ slug: new RegExp(`^${cleanSlug}$`, 'i') });
  if (scanner) return scanner;

  // 2. Try by MongoDB _id
  if (cleanSlug.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      scanner = await Scanner.findById(cleanSlug);
      if (scanner) return scanner;
    } catch (e) {}
  }

  // 3. Partial slug match or search by name / businessName / clientName
  const cleanTerm = cleanSlug.replace(/[-_]+/g, ' ').trim();
  scanner = await Scanner.findOne({
    $or: [
      { slug: new RegExp(cleanSlug.replace(/[-_]/g, '.*'), 'i') },
      { clientName: new RegExp(cleanTerm, 'i') },
      { businessName: new RegExp(cleanTerm, 'i') },
      { name: new RegExp(cleanTerm, 'i') },
      { placeName: new RegExp(cleanTerm, 'i') }
    ]
  });

  if (scanner) return scanner;

  // 4. If still not found, generate an on-demand structure with matching industry
  const isHospital = cleanSlug.includes('hospital') || cleanSlug.includes('eye') || cleanSlug.includes('deshmukh') || cleanSlug.includes('clinic') || cleanSlug.includes('care');
  const isAuto = cleanSlug.includes('garage') || cleanSlug.includes('auto') || cleanSlug.includes('motor') || cleanSlug.includes('car') || cleanSlug.includes('star');
  const isDining = cleanSlug.includes('restaurant') || cleanSlug.includes('cafe') || cleanSlug.includes('food') || cleanSlug.includes('hotel') || cleanSlug.includes('dining');
  const formattedTitle = cleanTerm.replace(/\b\w/g, c => c.toUpperCase()) || 'ASN Partner';

  return {
    _id: `temp_${Date.now()}`,
    slug: cleanSlug,
    clientName: formattedTitle,
    businessName: formattedTitle,
    name: `${formattedTitle} Review Scanner`,
    industry: isHospital ? 'Hospital / Healthcare' : (isAuto ? 'Automobile / Garage' : (isDining ? 'Restaurant / Dining' : 'General Business')),
    googleReviewUrl: 'https://search.google.com',
    googleUrl: 'https://search.google.com',
    status: 'Active',
    doctors: isHospital ? [
      { id: 'doc_1', name: 'Dr. Himanshu Deshmukh', department: 'Ophthalmology & Eye Surgeon', qualification: 'MBBS, MS', available: true }
    ] : [],
    hospitalServices: isHospital ? [
      'ALL', 'CATARACT SURGERY', 'LASIK LASER', 'RETINAL DETACHMENT', 'GLAUCOMA MANAGEMENT'
    ] : [],
    questions: defaultQuestions,
    save: async () => {}
  };
};

// @desc    Get scanner by slug or id (Public Customer Access)
// @route   GET /api/scanners/public/:slug
exports.getScannerBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let scanner = await findScannerFlexible(slug);

    if (!scanner) {
      // Fallback: If not found, try to get the first active scanner or a default one
      const anyActive = await Scanner.findOne({ status: 'Active' });
      if (anyActive) {
        scanner = anyActive;
      } else {
        return res.status(404).json({ success: false, message: 'Review scanner link not found.' });
      }
    }

    // Check if demo scanner or auto-pause timer has expired
    const isExpiredDemo = Boolean(scanner.isDemo && scanner.demoExpiresAt && new Date() >= new Date(scanner.demoExpiresAt));
    const isExpiredSchedule = Boolean(scanner.autoPauseEnabled && scanner.autoPauseAt && new Date() >= new Date(scanner.autoPauseAt));

    if (scanner.status === 'Active' && (isExpiredDemo || isExpiredSchedule)) {
      scanner.status = 'Paused';
      scanner.autoPauseEnabled = false;
      try {
        await scanner.save();
      } catch (e) {}
    }

    const scannerObj = scanner.toObject ? scanner.toObject() : scanner;

    if (scanner.status && scanner.status !== 'Active' && scanner.status !== 'active') {
      return res.status(200).json({
        success: true,
        isPaused: true,
        isDemo: Boolean(scanner.isDemo),
        isExpired: true,
        status: 'Closed',
        message: scanner.isDemo
          ? 'Not permitted now. This demo review scanner session has expired and the link is closed.'
          : 'Not permitted now. This review scanner link is currently inactive or paused.',
        clientName: scannerObj.clientName || scannerObj.businessName || scannerObj.name || (scanner.isDemo ? 'Demo Showcase Experience' : 'ASN Partner Business'),
        demoExpiresAt: scanner.demoExpiresAt,
        data: {
          ...scannerObj,
          isExpired: true,
          isPaused: true,
          status: 'Closed'
        }
      });
    }

    // Calculate live remaining seconds for demo scanners
    let demoRemainingSeconds = null;
    if (scanner.isDemo && scanner.demoExpiresAt) {
      demoRemainingSeconds = Math.max(0, Math.floor((new Date(scanner.demoExpiresAt).getTime() - Date.now()) / 1000));
    }

    // Ensure questions array is valid
    if (!Array.isArray(scannerObj.questions)) {
      scannerObj.questions = [];
    }

    // Increment scan counter
    try {
      scanner.totalScans = (scanner.totalScans || 0) + 1;
      if (!scanner.metrics) {
        scanner.metrics = { scans: 0, formStarted: 0, formSubmitted: 0, reviewsGenerated: 0, googleClicked: 0 };
      }
      scanner.metrics.scans = (scanner.metrics.scans || 0) + 1;
      scanner.lastScanAt = new Date().toISOString();
      await scanner.save();
    } catch (e) {}

    res.status(200).json({
      success: true,
      data: scannerObj,
      ...scannerObj,
      isDemo: Boolean(scanner.isDemo),
      demoExpiresAt: scanner.demoExpiresAt,
      demoRemainingSeconds,
      clientName: scannerObj.clientName || scannerObj.businessName || scannerObj.name || (scanner.isDemo ? 'Demo Showcase Experience' : 'ASN Partner'),
      googleReviewUrl: scannerObj.googleReviewUrl || scannerObj.googleUrl || 'https://asnmedia.in'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate instant review for public customer
// @route   POST /api/scanners/public/:slug/generate-review
exports.generatePublicReview = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const {
      rating,
      answers,
      doctorId,
      doctorName,
      doctorDepartment,
      selectedDoctor,
      selectedService,
      serviceName,
      language,
      variationIndex
    } = req.body;

    let scanner = await findScannerFlexible(slug);
    if (!scanner) {
      return res.status(404).json({ success: false, message: 'Review scanner link not found' });
    }

    const isExpired = Boolean(
      (scanner.isDemo && scanner.demoExpiresAt && new Date() >= new Date(scanner.demoExpiresAt)) ||
      (scanner.autoPauseEnabled && scanner.autoPauseAt && new Date() >= new Date(scanner.autoPauseAt)) ||
      (scanner.status && scanner.status !== 'Active' && scanner.status !== 'active')
    );

    if (isExpired) {
      return res.status(403).json({
        success: false,
        isExpired: true,
        message: 'Not permitted now. This demo review scanner session has expired and is now closed.'
      });
    }

    const businessName = scanner.businessName || scanner.name || scanner.clientName || 'this business';
    const numRating = Number(rating) || 5;

    const targetDocName = doctorName || selectedDoctor?.name || scanner.doctorName || (scanner.doctors?.[0]?.name) || '';
    const targetDocDept = doctorDepartment || selectedDoctor?.department || '';
    const targetService = serviceName || selectedService || '';
    const previousReview = req.body.previousReview || '';

    let answerPhrases = [];
    if (Array.isArray(answers)) {
      answerPhrases = answers.map(a => a.answer || a.value || a).filter(Boolean);
    } else if (answers && typeof answers === 'object') {
      answerPhrases = Object.values(answers).filter(Boolean);
    }
    const phraseStr = answerPhrases.length > 0 ? answerPhrases.join(' and ') : 'the outstanding medical care and supportive staff';

    // Primary: Generate factual, polished review derived directly from customer answers (Om's engine)
    let reviewText = generateInputBasedReview({
      rating: numRating,
      language,
      businessName,
      doctorName: targetDocName,
      serviceName: targetService,
      answers,
      variationIndex: Number(variationIndex) || 0
    });

    // Fallback: Draw dynamic review with variation from unique review pool (Palash's engine)
    if (!reviewText) {
      reviewText = generateDynamicReviewFromPool({
        language,
        industry: scanner.industry,
        rating: numRating,
        businessName,
        doctorName: targetDocName,
        serviceName: targetService,
        phraseStr,
        excludeText: previousReview,
        contextKey: `${scanner.slug || slug}_${language}`
      });
    }

    // Update scanner metrics
    if (!scanner.metrics) {
      scanner.metrics = { scans: 1, formStarted: 1, formSubmitted: 1, reviewsGenerated: 0, googleClicked: 0 };
    }
    scanner.metrics.reviewsGenerated = (scanner.metrics.reviewsGenerated || 0) + 1;
    scanner.totalAiGenerated = (scanner.totalAiGenerated || 0) + 1;
    await scanner.save();

    res.status(200).json({
      success: true,
      reviewText,
      googleReviewUrl: scanner.googleReviewUrl || scanner.googleUrl
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Track public review scanner interaction events
// @route   POST /api/scanners/public/:slug/events
exports.trackPublicEvent = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { eventType } = req.body;

    let scanner = await findScannerFlexible(slug);

    if (scanner) {
      if (!scanner.metrics) {
        scanner.metrics = { scans: 0, formStarted: 0, formSubmitted: 0, reviewsGenerated: 0, googleClicked: 0 };
      }

      if (eventType === 'FORM_STARTED') {
        scanner.metrics.formStarted = (scanner.metrics.formStarted || 0) + 1;
      } else if (eventType === 'GOOGLE_CLICKED') {
        scanner.metrics.googleClicked = (scanner.metrics.googleClicked || 0) + 1;
        scanner.totalRedirects = (scanner.totalRedirects || 0) + 1;
      }
      await scanner.save();
    }

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// @desc    Direct in-web review submission for Google Business & Web
// @route   POST /api/scanners/public/:slug/submit-review
exports.submitPublicReview = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const {
      reviewerName,
      reviewerEmail,
      reviewerPhone,
      rating,
      reviewText,
      answers,
      source,
      googleSyncStatus,
      doctorId,
      doctorName,
      doctorDepartment,
      selectedDoctor
    } = req.body;

    let scanner = await findScannerFlexible(slug);
    if (!scanner) {
      return res.status(404).json({ success: false, message: 'Review Scanner not found' });
    }

    const isExpired = Boolean(
      (scanner.isDemo && scanner.demoExpiresAt && new Date() >= new Date(scanner.demoExpiresAt)) ||
      (scanner.autoPauseEnabled && scanner.autoPauseAt && new Date() >= new Date(scanner.autoPauseAt)) ||
      (scanner.status && scanner.status !== 'Active' && scanner.status !== 'active')
    );

    if (isExpired) {
      return res.status(403).json({
        success: false,
        isExpired: true,
        message: 'Not permitted now. This demo review scanner session has expired and is now closed.'
      });
    }

    const businessName = scanner.businessName || scanner.name || scanner.clientName || 'ASN Partner Business';
    const clientName = scanner.clientName || businessName;

    const finalDocName = (doctorName || selectedDoctor?.name || scanner.doctorName || (scanner.doctors?.[0]?.name) || '').trim();
    const finalDocDept = (doctorDepartment || selectedDoctor?.department || '').trim();
    const finalDocId = (doctorId || selectedDoctor?.id || '').trim();

    // Create the review record in database
    const review = await Review.create({
      scannerId: scanner._id ? scanner._id.toString() : '',
      scannerSlug: scanner.slug || slug,
      clientId: scanner.clientId || '',
      clientName,
      businessName,
      reviewerName: (reviewerName || 'Verified Guest').trim(),
      reviewerEmail: (reviewerEmail || '').trim(),
      reviewerPhone: (reviewerPhone || '').trim(),
      rating: Number(rating) || 5,
      reviewText: (reviewText || 'Great experience!').trim(),
      doctorId: finalDocId,
      doctorName: finalDocName,
      doctorDepartment: finalDocDept,
      answers: Array.isArray(answers) ? answers : [],
      source: source || 'Direct Web Submission',
      status: 'Published',
      googleSyncStatus: googleSyncStatus || 'Direct Submitted',
      googleReviewUrl: scanner.googleReviewUrl || scanner.googleUrl || ''
    });

    // Update scanner metrics
    if (!scanner.metrics) {
      scanner.metrics = { scans: 0, formStarted: 0, formSubmitted: 0, reviewsGenerated: 0, googleClicked: 0 };
    }
    scanner.metrics.formSubmitted = (scanner.metrics.formSubmitted || 0) + 1;
    scanner.totalReviewsScraped = (scanner.totalReviewsScraped || 0) + 1;
    await scanner.save();

    // Create notification
    try {
      const docBadge = finalDocName ? ` (Dr. ${finalDocName.replace(/^Dr\.\s*/i, '')})` : '';
      await Notification.create({
        type: 'scanner',
        title: `New Direct Review for ${businessName}${docBadge}`,
        message: `${reviewerName || 'A patient/customer'} rated ${rating || 5}★: "${(reviewText || '').substring(0, 60)}..."`,
        recipientRole: 'Admin',
        read: false
      });
    } catch (e) {}

    // Create activity log
    try {
      await ActivityLog.create({
        user: reviewerName || 'Customer',
        userRole: 'Client',
        action: 'Review Submitted',
        target: `Scanner: ${businessName}`,
        details: `Direct review submitted with ${rating || 5} Stars for ${businessName}${finalDocName ? ` [Doctor: ${finalDocName}]` : ''}`,
        category: 'scanners'
      });
    } catch (e) {}

    res.status(201).json({
      success: true,
      message: 'Review posted successfully directly from web!',
      data: review,
      googleReviewUrl: scanner.googleReviewUrl || scanner.googleUrl
    });
  } catch (err) {
    console.error('Error submitting public review:', err);
    next(err);
  }
};

// @desc    Get all direct reviews for a scanner
// @route   GET /api/scanners/public/:slug/reviews
exports.getScannerReviews = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let scanner = await findScannerFlexible(slug);

    let query = {};
    if (scanner) {
      query = {
        $or: [
          { scannerSlug: scanner.slug },
          { scannerId: scanner._id.toString() },
          { clientName: scanner.clientName }
        ]
      };
    } else {
      query = { scannerSlug: slug };
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new review scanner
// @route   POST /api/scanners
exports.createScanner = async (req, res, next) => {
  try {
    const data = { ...req.body };
    delete data._id;
    delete data.id;

    const businessName = (data.businessName || data.clientName || data.name || 'Review Scanner').trim();
    const clientName = (data.clientName || businessName).trim();
    const name = (data.name || businessName).trim();
    let placeId = (data.placeId || '').trim();
    let googleUrl = (data.googleUrl || '').trim();
    let googleReviewUrl = (data.googleReviewUrl || '').trim();

    if (placeId && (!googleReviewUrl || !googleReviewUrl.includes('writereview'))) {
      googleReviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
    } else if (!googleReviewUrl && googleUrl) {
      const pMatch = googleUrl.match(/[?&](?:placeid|place_id)=([^&#]+)/i) || googleUrl.match(/(ChIJ[a-zA-Z0-9_-]{15,})/);
      if (pMatch && pMatch[1]) {
        placeId = pMatch[1];
        googleReviewUrl = `https://search.google.com/local/writereview?placeid=${pMatch[1]}`;
      } else {
        googleReviewUrl = googleUrl;
      }
    } else if (googleReviewUrl && !placeId) {
      const pMatch = googleReviewUrl.match(/[?&](?:placeid|place_id)=([^&#]+)/i) || googleReviewUrl.match(/(ChIJ[a-zA-Z0-9_-]{15,})/);
      if (pMatch && pMatch[1]) {
        placeId = pMatch[1];
      }
    }

    // Generate clean slug
    let baseSlug = (data.slug || name || businessName || 'scanner')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!baseSlug) baseSlug = 'scanner';

    let slug = baseSlug;
    let existing = await Scanner.findOne({ slug });
    let count = 0;
    while (existing) {
      count++;
      slug = `${baseSlug}-${count}-${Math.random().toString(36).substring(2, 5)}`;
      existing = await Scanner.findOne({ slug });
    }

    const isDemo = Boolean(data.isDemo);
    let demoDurationMinutes = Number(data.demoDurationMinutes) || (isDemo ? 60 : 0);
    let demoExpiresAt = null;

    let autoPauseAt = data.autoPauseAt ? new Date(data.autoPauseAt) : null;

    if (isDemo) {
      demoExpiresAt = new Date(Date.now() + demoDurationMinutes * 60 * 1000);
      autoPauseAt = demoExpiresAt;
      data.autoPauseEnabled = true;
    } else if (data.autoPauseEnabled && data.autoPauseDurationMinutes > 0) {
      autoPauseAt = new Date(Date.now() + Number(data.autoPauseDurationMinutes) * 60 * 1000);
    }

    const scanner = await Scanner.create({
      ...data,
      isDemo,
      demoDurationMinutes,
      demoExpiresAt,
      businessName,
      clientName,
      name,
      placeName: data.placeName || name,
      placeId,
      googleUrl: googleUrl || googleReviewUrl || (isDemo ? 'https://search.google.com/local/writereview?placeid=ChIJDemo2026' : ''),
      googleReviewUrl: googleReviewUrl || (isDemo ? 'https://search.google.com/local/writereview?placeid=ChIJDemo2026' : ''),
      slug,
      autoPauseAt,
      questions: Array.isArray(data.questions) ? data.questions : []
    });

    if (scanner.clientId) {
      try {
        await Client.findByIdAndUpdate(scanner.clientId, {
          scannerId: scanner._id.toString(),
          reviewScannerId: scanner._id.toString()
        });
      } catch (e) {}
    } else if (scanner.clientName) {
      try {
        await Client.findOneAndUpdate(
          { name: new RegExp(`^${scanner.clientName}$`, 'i') },
          {
            scannerId: scanner._id.toString(),
            reviewScannerId: scanner._id.toString()
          }
        );
      } catch (e) {}
    }

    try {
      await ActivityLog.create({
        user: req.user?.name || 'Admin',
        userRole: req.user?.role || 'Admin',
        action: 'Scanner Created',
        target: `Scanner: ${scanner.businessName || scanner.name}`,
        details: `Generated AI Review QR Standee for ${scanner.businessName || scanner.name}`,
        category: 'scanners'
      });
    } catch (e) {}

    res.status(201).json({ success: true, data: scanner });
  } catch (err) {
    console.error('Error creating scanner in DB:', err);
    next(err);
  }
};

// @desc    Get single scanner by ID or slug (Admin)
// @route   GET /api/scanners/:id
exports.getScannerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let scanner = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      scanner = await Scanner.findById(id);
    }
    if (!scanner) {
      scanner = await Scanner.findOne({ slug: id });
    }
    if (!scanner) {
      scanner = await Scanner.findOne({
        $or: [
          { clientId: id },
          { clientName: new RegExp(`^${id}$`, 'i') },
          { name: new RegExp(`^${id}$`, 'i') }
        ]
      });
    }
    if (!scanner) {
      return res.status(404).json({ success: false, message: 'Scanner not found.' });
    }
    res.status(200).json({ success: true, data: scanner });
  } catch (err) {
    next(err);
  }
};

// @desc    Update review scanner
// @route   PUT /api/scanners/:id
exports.updateScanner = async (req, res, next) => {
  try {
    const data = { ...req.body };
    delete data._id;
    delete data.id;

    // Find existing scanner first
    let scanner = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      scanner = await Scanner.findById(req.params.id);
    }
    if (!scanner) {
      scanner = await Scanner.findOne({ slug: req.params.id });
    }
    if (!scanner) {
      return res.status(404).json({ success: false, message: 'Scanner not found' });
    }

    // Name & Business Name fields
    if (data.clientName !== undefined) {
      data.clientName = String(data.clientName || '').trim();
      if (!data.businessName) data.businessName = data.clientName;
    }
    if (data.businessName !== undefined) {
      data.businessName = String(data.businessName || '').trim();
      if (!data.clientName) data.clientName = data.businessName;
    }
    if (data.name !== undefined) {
      data.name = String(data.name || '').trim();
      if (!data.placeName) data.placeName = data.name;
    }
    if (data.placeName !== undefined) {
      data.placeName = String(data.placeName || '').trim();
    }

    // Handle slug uniqueness if slug is being updated
    if (data.slug !== undefined) {
      const cleanSlug = String(data.slug || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!cleanSlug) {
        return res.status(400).json({ success: false, message: 'URL slug cannot be empty.' });
      }

      data.slug = cleanSlug;

      if (data.slug !== scanner.slug) {
        const existing = await Scanner.findOne({ slug: data.slug, _id: { $ne: scanner._id } });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: `URL slug "${data.slug}" is already used by another scanner. Please choose a unique slug.`
          });
        }
      }
    }

    // Handle Google links & Place ID
    if (data.placeId !== undefined || data.googleUrl !== undefined || data.googleReviewUrl !== undefined) {
      let pId = (data.placeId !== undefined ? data.placeId : (scanner.placeId || '')).trim();
      let gUrl = (data.googleUrl !== undefined ? data.googleUrl : (scanner.googleUrl || '')).trim();
      let gReviewUrl = (data.googleReviewUrl !== undefined ? data.googleReviewUrl : (scanner.googleReviewUrl || '')).trim();

      if (pId && (!gReviewUrl || !gReviewUrl.includes('writereview'))) {
        gReviewUrl = `https://search.google.com/local/writereview?placeid=${pId}`;
      } else if (!gReviewUrl && gUrl) {
        const pMatch = gUrl.match(/[?&](?:placeid|place_id)=([^&#]+)/i) || gUrl.match(/(ChIJ[a-zA-Z0-9_-]{15,})/);
        if (pMatch && pMatch[1]) {
          pId = pMatch[1];
          gReviewUrl = `https://search.google.com/local/writereview?placeid=${pMatch[1]}`;
        } else {
          gReviewUrl = gUrl;
        }
      } else if (gReviewUrl && !pId) {
        const pMatch = gReviewUrl.match(/[?&](?:placeid|place_id)=([^&#]+)/i) || gReviewUrl.match(/(ChIJ[a-zA-Z0-9_-]{15,})/);
        if (pMatch && pMatch[1]) {
          pId = pMatch[1];
        }
      }
      data.placeId = pId;
      data.googleUrl = gUrl || gReviewUrl;
      data.googleReviewUrl = gReviewUrl;
    }

    // Demo / Auto-Pause Schedule handling
    if (data.isDemo !== undefined) {
      data.isDemo = Boolean(data.isDemo);
      if (data.isDemo) {
        const dur = Number(data.demoDurationMinutes) || 60;
        data.demoDurationMinutes = dur;
        if (!data.demoExpiresAt) {
          data.demoExpiresAt = new Date(Date.now() + dur * 60 * 1000);
        } else {
          data.demoExpiresAt = new Date(data.demoExpiresAt);
        }
        data.autoPauseAt = data.demoExpiresAt;
        data.autoPauseEnabled = true;
      }
    }

    if (data.autoPauseEnabled !== undefined && !data.isDemo) {
      if (data.autoPauseEnabled) {
        if (data.autoPauseDurationMinutes > 0) {
          data.autoPauseAt = new Date(Date.now() + Number(data.autoPauseDurationMinutes) * 60 * 1000);
        } else if (data.autoPauseAt) {
          data.autoPauseAt = new Date(data.autoPauseAt);
        }
      } else {
        data.autoPauseAt = null;
        data.autoPauseDurationMinutes = 0;
      }
    }

    // Ensure questions array is cleanly handled
    if (data.questions !== undefined && Array.isArray(data.questions)) {
      data.questions = data.questions.map((q, idx) => ({
        id: q.id || `q_${Date.now()}_${idx}`,
        question: String(q.question || '').trim(),
        type: q.type || 'dropdown',
        required: q.required !== false,
        options: Array.isArray(q.options)
          ? q.options.map((opt, oi) => {
              const label = typeof opt === 'string' ? opt : (opt.label || opt.value || '');
              const val = typeof opt === 'string' ? opt : (opt.value || opt.label || '');
              return {
                id: (opt && opt.id) ? opt.id : `opt_${Date.now()}_${oi}`,
                label: String(label).trim(),
                value: String(val).trim(),
                isActive: opt.isActive !== false
              };
            }).filter(o => o.label.length > 0)
          : []
      }));
    }

    // Ensure doctors array is cleanly handled
    if (data.doctors !== undefined && Array.isArray(data.doctors)) {
      data.doctors = data.doctors.map((d, di) => ({
        id: d.id || `doc_${Date.now()}_${di}`,
        name: String(d.name || '').trim(),
        department: String(d.department || 'General').trim(),
        qualification: String(d.qualification || '').trim(),
        available: d.available !== false
      })).filter(d => d.name.length > 0);
    }

    // Ensure hospitalServices array is cleanly handled
    if (data.hospitalServices !== undefined && Array.isArray(data.hospitalServices)) {
      data.hospitalServices = data.hospitalServices
        .map(s => String(s || '').trim())
        .filter(Boolean);
    }

    // Apply updates
    Object.assign(scanner, data);
    const updatedScanner = await scanner.save();

    // Sync with Client record if attached
    if (updatedScanner.clientId) {
      try {
        await Client.findByIdAndUpdate(updatedScanner.clientId, {
          scannerId: updatedScanner._id.toString(),
          reviewScannerId: updatedScanner._id.toString()
        });
      } catch (e) {}
    }

    // Create activity log
    try {
      await ActivityLog.create({
        user: req.user?.name || 'Admin',
        userRole: req.user?.role || 'Admin',
        action: 'Scanner Updated',
        target: `Scanner: ${updatedScanner.name || updatedScanner.clientName}`,
        details: `Updated configuration for review scanner ${updatedScanner.name || updatedScanner.clientName}`,
        category: 'scanners'
      });
    } catch (e) {}

    res.status(200).json({ success: true, data: updatedScanner });
  } catch (err) {
    console.error('Error updating scanner in DB:', err);
    next(err);
  }
};

// @desc    Delete review scanner
// @route   DELETE /api/scanners/:id
exports.deleteScanner = async (req, res, next) => {
  try {
    let scanner = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      scanner = await Scanner.findByIdAndDelete(req.params.id);
    }
    if (!scanner) {
      scanner = await Scanner.findOneAndDelete({ slug: req.params.id });
    }
    if (!scanner) {
      return res.status(404).json({ success: false, message: 'Scanner not found' });
    }

    if (scanner.clientId) {
      try {
        await Client.findByIdAndUpdate(scanner.clientId, {
          scannerId: '',
          reviewScannerId: ''
        });
      } catch (e) {}
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error('Error deleting scanner in DB:', err);
    next(err);
  }
};

// @desc    Regenerate review scanner code / slug
// @route   POST /api/scanners/:id/regenerate
exports.regenerateScanner = async (req, res, next) => {
  try {
    const scanner = await Scanner.findById(req.params.id);
    if (!scanner) {
      return res.status(404).json({ success: false, message: 'Scanner not found' });
    }

    const baseSlug = (scanner.businessName || scanner.name || 'scanner')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    scanner.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    await scanner.save();

    res.status(200).json({ success: true, data: scanner });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate AI Review suggestions
// @route   POST /api/scanners/:id/generate-suggestions
exports.generateSuggestions = async (req, res, next) => {
  try {
    const { keywords, rating, answers } = req.body;
    let scanner = await Scanner.findById(req.params.id);

    if (!scanner) {
      scanner = await Scanner.findOne({ slug: req.params.id });
    }

    if (!scanner) {
      return res.status(404).json({ success: false, message: 'Scanner not found' });
    }

    const businessName = scanner.businessName || scanner.name || 'ASN Digital Media';
    
    let keyString = 'exceptional service and wonderful quality';
    if (keywords) {
      keyString = typeof keywords === 'string' ? keywords : keywords.join(', ');
    } else if (answers && typeof answers === 'object') {
      const vals = Object.values(answers).filter(Boolean);
      if (vals.length > 0) keyString = vals.join(', ');
    }

    const userRating = rating || 5;

    const opt1 = generateInputBasedReview({
      rating: userRating,
      language: 'English',
      businessName,
      doctorName: scanner.doctors?.[0]?.name || '',
      serviceName: scanner.hospitalServices?.[0] || '',
      answers,
      variationIndex: 0
    });

    const opt2 = generateInputBasedReview({
      rating: userRating,
      language: 'English',
      businessName,
      doctorName: scanner.doctors?.[1]?.name || scanner.doctors?.[0]?.name || '',
      serviceName: scanner.hospitalServices?.[1] || '',
      answers,
      variationIndex: 1
    });

    const opt3 = generateInputBasedReview({
      rating: userRating,
      language: 'English',
      businessName,
      doctorName: scanner.doctors?.[2]?.name || scanner.doctors?.[0]?.name || '',
      serviceName: scanner.hospitalServices?.[2] || '',
      answers,
      variationIndex: 2
    });

    const suggestions = [
      {
        type: 'Option 1 • Professional & Caring',
        rating: userRating,
        reviewText: opt1
      },
      {
        type: 'Option 2 • Detailed Experience',
        rating: userRating,
        reviewText: opt2
      },
      {
        type: 'Option 3 • High Recommendation',
        rating: userRating,
        reviewText: opt3
      }
    ];

    scanner.totalAiGenerated = (scanner.totalAiGenerated || 0) + 1;
    if (!scanner.metrics) {
      scanner.metrics = { scans: 1, formStarted: 1, formSubmitted: 1, reviewsGenerated: 0, googleClicked: 0 };
    }
    scanner.metrics.reviewsGenerated = (scanner.metrics.reviewsGenerated || 0) + 1;
    await scanner.save();

    res.status(200).json({ success: true, data: suggestions });
  } catch (err) {
    next(err);
  }
};
