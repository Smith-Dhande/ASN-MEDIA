import { ReviewScanner } from '../models/ReviewScanner.js';
import { ScannerEvent } from '../models/ScannerEvent.js';
import { generateReviewText } from '../services/reviewAI.service.js';

// Helper to generate a clean URL-friendly slug
const generateSlug = (name) => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${randomSuffix}`;
};

// Admin: Create Scanner
export const createScanner = async (req, res) => {
  try {
    const { clientId, clientName, name, googleReviewUrl, questions, ratingRequired, aiSettings } = req.body;

    if (!clientName || !name || !googleReviewUrl) {
      return res.status(400).json({ error: 'clientName, name, and googleReviewUrl are required' });
    }

    let slug = req.body.slug ? req.body.slug.trim().toLowerCase() : generateSlug(name);
    const existing = await ReviewScanner.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newScanner = new ReviewScanner({
      clientId: clientId || null,
      clientName,
      name,
      slug,
      googleReviewUrl,
      ratingRequired: ratingRequired !== false,
      questions: questions || [
        {
          question: 'What did you like most?',
          type: 'dropdown',
          required: true,
          options: [
            { label: 'Food & Quality', value: 'Food & Quality', isActive: true },
            { label: 'Customer Service', value: 'Customer Service', isActive: true },
            { label: 'Ambience & Vibe', value: 'Ambience & Vibe', isActive: true },
            { label: 'Staff Attention', value: 'Staff Attention', isActive: true }
          ]
        },
        {
          question: 'What stood out to you?',
          type: 'dropdown',
          required: true,
          options: [
            { label: 'Friendly Staff', value: 'Friendly Staff', isActive: true },
            { label: 'Quick Service', value: 'Quick Service', isActive: true },
            { label: 'Great Presentation', value: 'Great Presentation', isActive: true },
            { label: 'Clean Environment', value: 'Clean Environment', isActive: true }
          ]
        },
        {
          question: 'How was your overall experience?',
          type: 'dropdown',
          required: true,
          options: [
            { label: 'Excellent', value: 'Excellent', isActive: true },
            { label: 'Very Good', value: 'Very Good', isActive: true },
            { label: 'Good', value: 'Good', isActive: true },
            { label: 'Satisfactory', value: 'Satisfactory', isActive: true }
          ]
        }
      ],
      aiSettings: aiSettings || { tone: 'Friendly & Professional', length: 'Medium' },
      status: 'Active',
      metrics: { scans: 0, formStarted: 0, formSubmitted: 0, reviewsGenerated: 0, googleClicked: 0 }
    });

    await newScanner.save();
    return res.status(201).json(newScanner);
  } catch (error) {
    console.error('Error creating scanner:', error);
    return res.status(500).json({ error: error.message || 'Server error creating scanner' });
  }
};

// Admin: Get All Scanners
export const getScanners = async (req, res) => {
  try {
    const scanners = await ReviewScanner.find().sort({ createdAt: -1 });
    return res.json(scanners);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Admin: Get Scanner By ID
export const getScannerById = async (req, res) => {
  try {
    const scanner = await ReviewScanner.findById(req.params.id);
    if (!scanner) return res.status(404).json({ error: 'Scanner not found' });
    return res.json(scanner);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Admin: Update Scanner
export const updateScanner = async (req, res) => {
  try {
    const updated = await ReviewScanner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Scanner not found' });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Admin: Delete Scanner
export const deleteScanner = async (req, res) => {
  try {
    const deleted = await ReviewScanner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Scanner not found' });
    return res.json({ message: 'Scanner deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Public: Get Public Scanner Config by Slug
export const getPublicScannerBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const scanner = await ReviewScanner.findOne({ slug });

    if (!scanner) {
      return res.status(404).json({ error: 'Review scanner link not found or invalid' });
    }

    if (scanner.status !== 'Active') {
      return res.status(403).json({ error: 'This review scanner is currently inactive', status: 'Paused' });
    }

    // Increment scan metrics
    scanner.metrics.scans = (scanner.metrics.scans || 0) + 1;
    await scanner.save();

    // Log SCAN event
    try {
      await ScannerEvent.create({
        scannerId: scanner._id,
        slug: scanner.slug,
        eventType: 'SCAN',
        userAgent: req.headers['user-agent']
      });
    } catch (e) {
      // non-blocking
    }

    // Return sanitized public scanner payload (strip sensitive admin data)
    return res.json({
      id: scanner._id,
      slug: scanner.slug,
      clientName: scanner.clientName,
      name: scanner.name,
      googleReviewUrl: scanner.googleReviewUrl,
      ratingRequired: scanner.ratingRequired,
      questions: scanner.questions,
      aiSettings: scanner.aiSettings
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Public: Generate Review via AI
export const generatePublicReview = async (req, res) => {
  try {
    const { slug } = req.params;
    const { rating, answers } = req.body;

    const scanner = await ReviewScanner.findOne({ slug });
    if (!scanner) return res.status(404).json({ error: 'Scanner not found' });
    if (scanner.status !== 'Active') return res.status(403).json({ error: 'Scanner inactive' });

    if (scanner.ratingRequired && (!rating || rating < 1)) {
      return res.status(400).json({ error: 'Star rating is required' });
    }

    const reviewText = await generateReviewText({
      clientName: scanner.clientName,
      rating: rating || 5,
      answers: answers || [],
      length: scanner.aiSettings?.length || 'Medium',
      tone: scanner.aiSettings?.tone || 'Friendly & Professional'
    });

    // Increment reviewsGenerated metrics
    scanner.metrics.reviewsGenerated = (scanner.metrics.reviewsGenerated || 0) + 1;
    scanner.metrics.formSubmitted = (scanner.metrics.formSubmitted || 0) + 1;
    await scanner.save();

    // Log REVIEW_GENERATED event
    try {
      await ScannerEvent.create({
        scannerId: scanner._id,
        slug: scanner.slug,
        eventType: 'REVIEW_GENERATED',
        rating: rating || 5,
        metadata: { answers, generatedLength: reviewText.length }
      });
    } catch (e) {
      // non-blocking
    }

    return res.json({
      reviewText,
      googleReviewUrl: scanner.googleReviewUrl,
      clientName: scanner.clientName
    });
  } catch (error) {
    console.error('Error in generatePublicReview:', error);
    return res.status(500).json({ error: error.message || 'AI review generation failed' });
  }
};

// Public: Track Scanner Events (FORM_STARTED, GOOGLE_CLICKED)
export const trackPublicEvent = async (req, res) => {
  try {
    const { slug } = req.params;
    const { eventType, rating, metadata } = req.body;

    const scanner = await ReviewScanner.findOne({ slug });
    if (!scanner) return res.status(404).json({ error: 'Scanner not found' });

    if (eventType === 'FORM_STARTED') {
      scanner.metrics.formStarted = (scanner.metrics.formStarted || 0) + 1;
    } else if (eventType === 'GOOGLE_CLICKED') {
      scanner.metrics.googleClicked = (scanner.metrics.googleClicked || 0) + 1;
    }
    await scanner.save();

    await ScannerEvent.create({
      scannerId: scanner._id,
      slug: scanner.slug,
      eventType,
      rating,
      metadata,
      userAgent: req.headers['user-agent']
    });

    return res.json({ success: true, eventType });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Admin: Get Analytics for a Scanner
export const getScannerAnalytics = async (req, res) => {
  try {
    const scanner = await ReviewScanner.findById(req.params.id);
    if (!scanner) return res.status(404).json({ error: 'Scanner not found' });

    const events = await ScannerEvent.find({ scannerId: scanner._id }).sort({ createdAt: -1 }).limit(100);

    const m = scanner.metrics || {};
    const totalScans = m.scans || 0;
    const formSubmissions = m.formSubmitted || 0;
    const reviewsGenerated = m.reviewsGenerated || 0;
    const googleClicks = m.googleClicked || 0;
    const conversionRate = totalScans > 0 ? ((googleClicks / totalScans) * 100).toFixed(1) : 0;

    return res.json({
      metrics: {
        totalScans,
        formSubmissions,
        reviewsGenerated,
        googleClicks,
        conversionRate: `${conversionRate}%`
      },
      recentEvents: events
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
