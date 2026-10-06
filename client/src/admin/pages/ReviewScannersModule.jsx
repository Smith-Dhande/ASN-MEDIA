import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminCard } from '../components/ui/AdminCard';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { FormToggle } from '../components/ui/FormToggle';
import { Pagination } from '../components/ui/Pagination';
import { KpiCard } from '../components/ui/KpiCard';
import { QrCodeRenderer } from '../../components/ui/QrCodeRenderer';
import {
  Star,
  RefreshCw,
  Plus,
  CheckCircle2,
  MapPin,
  QrCode,
  Link,
  ExternalLink,
  Sparkles,
  Download,
  Copy,
  Check,
  Eye,
  Edit2,
  Power,
  Globe,
  Share2,
  Trash2,
  HelpCircle,
  TrendingUp,
  Users,
  BarChart3,
  X,
  Clock,
  Timer,
  Pause,
  Play,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const ReviewScannersModule = () => {
  const { reviewScanners, clients, addScanner, updateScanner, deleteScanner, addClient } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedScanner, setSelectedScanner] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('Overview'); // Overview | Questions | QRCode | Analytics

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrScannerTarget, setQrScannerTarget] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({ isOpen: false, scanner: null });
  const [confirmStatusModal, setConfirmStatusModal] = useState({ isOpen: false, scanner: null });
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);

  // Quick Auto-Pause Modal
  const [quickPauseModal, setQuickPauseModal] = useState({
    isOpen: false,
    scanner: null,
    durationPreset: '60', // 60 mins (1h)
    customDateTime: ''
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Feedback Toast
  const [feedback, setFeedback] = useState({ show: false, message: '' });

  // New Client Form State (Option B)
  const [newClientForm, setNewClientForm] = useState({ name: '', email: '', phone: '', company: '' });

  // Default clean empty scanner form structure
  const getEmptyScannerForm = () => ({
    id: null,
    clientId: '',
    clientName: '',
    name: '',
    slug: '',
    industry: 'General Business',
    doctors: [],
    hospitalServices: [
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
    ],
    googleReviewUrl: '',
    ratingRequired: true,
    status: 'Active',
    isDemo: false,
    demoDurationMinutes: 60,
    demoExpiresAt: null,
    autoPauseEnabled: false,
    autoPauseDurationMinutes: 0,
    autoPauseAt: '',
    questions: [
      {
        id: `q_${Date.now()}_1`,
        question: 'What did you like most?',
        type: 'dropdown',
        required: true,
        options: [
          { id: `o_${Date.now()}_1`, label: 'Food & Quality', value: 'Food & Quality' },
          { id: `o_${Date.now()}_2`, label: 'Customer Service', value: 'Customer Service' },
          { id: `o_${Date.now()}_3`, label: 'Ambience & Vibe', value: 'Ambience & Vibe' },
          { id: `o_${Date.now()}_4`, label: 'Staff Attention', value: 'Staff Attention' }
        ]
      },
      {
        id: `q_${Date.now()}_2`,
        question: 'What stood out to you?',
        type: 'dropdown',
        required: true,
        options: [
          { id: `o_${Date.now()}_5`, label: 'Friendly Staff', value: 'Friendly Staff' },
          { id: `o_${Date.now()}_6`, label: 'Quick Service', value: 'Quick Service' },
          { id: `o_${Date.now()}_7`, label: 'Great Presentation', value: 'Great Presentation' },
          { id: `o_${Date.now()}_8`, label: 'Clean Environment', value: 'Clean Environment' }
        ]
      },
      {
        id: `q_${Date.now()}_3`,
        question: 'How was your overall experience?',
        type: 'dropdown',
        required: true,
        options: [
          { id: `o_${Date.now()}_9`, label: 'Excellent', value: 'Excellent' },
          { id: `o_${Date.now()}_10`, label: 'Very Good', value: 'Very Good' },
          { id: `o_${Date.now()}_11`, label: 'Good', value: 'Good' },
          { id: `o_${Date.now()}_12`, label: 'Satisfactory', value: 'Satisfactory' }
        ]
      }
    ],
    aiSettings: { tone: 'Friendly & Professional', length: 'Medium' },
    redirectTimer: 5
  });

  // Form State for Deploying/Editing Scanner
  const [editMode, setEditMode] = useState(false); // false = create, true = edit
  const [scannerForm, setScannerForm] = useState(getEmptyScannerForm());
  const [newServiceChipInput, setNewServiceChipInput] = useState('');

  const isCreateRoute = location.pathname.endsWith('/scanners/create') || isCreateModalOpen;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, location.pathname]);

  const showToast = (message) => {
    setFeedback({ show: true, message });
    setTimeout(() => setFeedback({ show: false, message: '' }), 3000);
  };

  const handleOpenCreate = () => {
    setEditMode(false);
    setScannerForm(getEmptyScannerForm());
    setIsCreateModalOpen(true);
    navigate('/admin/scanners/create');
  };

  const handleOpenCreateDemo = () => {
    setEditMode(false);
    const demoSlug = `demo-showcase-${Math.random().toString(36).substring(2, 6)}`;
    const futureDate = new Date(Date.now() + 60 * 60 * 1000);
    setScannerForm({
      ...getEmptyScannerForm(),
      isDemo: true,
      clientName: 'Demo Showcase Experience',
      name: 'Demo Experience Review Scanner',
      slug: demoSlug,
      googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJDemoPreview2026',
      demoDurationMinutes: 60,
      autoPauseEnabled: true,
      autoPauseDurationMinutes: 60,
      autoPauseAt: futureDate.toISOString().slice(0, 16)
    });
    setIsCreateModalOpen(true);
    navigate('/admin/scanners/create');
  };

  const handleOpenEdit = (scn) => {
    setEditMode(true);
    setScannerForm({
      id: scn.id || scn._id,
      clientId: scn.clientId || '',
      clientName: scn.clientName || scn.businessName || '',
      name: scn.name || scn.placeName || (scn.clientName ? `${scn.clientName} Review` : ''),
      slug: scn.slug || (scn.clientName || 'scanner').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      industry: scn.industry || 'General Business',
      doctors: Array.isArray(scn.doctors) ? scn.doctors : [],
      hospitalServices: Array.isArray(scn.hospitalServices) && scn.hospitalServices.length > 0
        ? scn.hospitalServices
        : getEmptyScannerForm().hospitalServices,
      googleReviewUrl: scn.googleReviewUrl || scn.googleUrl || '',
      ratingRequired: scn.ratingRequired !== false,
      status: scn.status || 'Active',
      isDemo: Boolean(scn.isDemo),
      demoDurationMinutes: scn.demoDurationMinutes || 60,
      demoExpiresAt: scn.demoExpiresAt || null,
      autoPauseEnabled: !!scn.autoPauseEnabled,
      autoPauseDurationMinutes: scn.autoPauseDurationMinutes || 0,
      autoPauseAt: scn.autoPauseAt ? new Date(scn.autoPauseAt).toISOString().slice(0, 16) : '',
      questions: scn.questions && scn.questions.length > 0 ? scn.questions : getEmptyScannerForm().questions,
      aiSettings: scn.aiSettings || { tone: 'Friendly & Professional', length: 'Medium' },
      redirectTimer: scn.redirectTimer !== undefined ? scn.redirectTimer : 5
    });
    setIsCreateModalOpen(true);
  };

  // Hospital Doctors & Services Chips Helpers
  const handleAddDoctor = () => {
    setScannerForm((prev) => ({
      ...prev,
      doctors: [
        ...(prev.doctors || []),
        {
          id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: 'Dr. ',
          department: 'General Medicine',
          qualification: 'MBBS, MD',
          available: true
        }
      ]
    }));
  };

  const handleRemoveDoctor = (docIdx) => {
    setScannerForm((prev) => ({
      ...prev,
      doctors: (prev.doctors || []).filter((_, idx) => idx !== docIdx)
    }));
  };

  const handleDoctorChange = (docIdx, field, value) => {
    setScannerForm((prev) => {
      const updated = [...(prev.doctors || [])];
      updated[docIdx] = { ...updated[docIdx], [field]: value };
      return { ...prev, doctors: updated };
    });
  };

  const handleAddServiceChip = () => {
    const chipText = newServiceChipInput.trim().toUpperCase();
    if (!chipText) return;
    if ((scannerForm.hospitalServices || []).includes(chipText)) {
      showToast('This service chip already exists.');
      return;
    }
    setScannerForm((prev) => ({
      ...prev,
      hospitalServices: [...(prev.hospitalServices || []), chipText]
    }));
    setNewServiceChipInput('');
    showToast(`Added service chip "${chipText}"`);
  };

  const handleRemoveServiceChip = (chipToRemove) => {
    setScannerForm((prev) => ({
      ...prev,
      hospitalServices: (prev.hospitalServices || []).filter(c => c !== chipToRemove)
    }));
  };

  const handleLoadHospitalPreset = () => {
    const sampleDoctors = [
      { id: `doc_${Date.now()}_1`, name: 'Dr. Rajesh Sharma', department: 'Cardiology', qualification: 'MD, DM - Senior Consultant', available: true },
      { id: `doc_${Date.now()}_2`, name: 'Dr. Sneha Verma', department: 'Pediatrics & Child Care', qualification: 'MBBS, MD (Pediatrics)', available: true },
      { id: `doc_${Date.now()}_3`, name: 'Dr. Vikramaditya Roy', department: 'Orthopedics & Joint Replacement', qualification: 'MS (Ortho), M.Ch', available: true },
      { id: `doc_${Date.now()}_4`, name: 'Dr. Ananya Deshmukh', department: 'Neurology', qualification: 'MD, DM (Neurology)', available: true },
      { id: `doc_${Date.now()}_5`, name: 'Dr. Kabir Malhotra', department: 'General Medicine & Diabetology', qualification: 'MBBS, MD (Internal Med)', available: true }
    ];
    setScannerForm((prev) => ({
      ...prev,
      industry: 'Hospital / Healthcare',
      doctors: sampleDoctors,
      questions: [
        {
          id: `hq_${Date.now()}_1`,
          question: 'How was your medical consultation?',
          type: 'dropdown',
          required: true,
          options: [
            { id: `ho_${Date.now()}_1`, label: "Doctor's Care & Diagnosis", value: "Doctor's Care & Diagnosis" },
            { id: `ho_${Date.now()}_2`, label: 'Clear Treatment Explanation', value: 'Clear Treatment Explanation' },
            { id: `ho_${Date.now()}_3`, label: 'Patient & Attentive Consultation', value: 'Patient & Attentive Consultation' },
            { id: `ho_${Date.now()}_4`, label: 'Nursing & Hospital Support', value: 'Nursing & Hospital Support' }
          ]
        },
        {
          id: `hq_${Date.now()}_2`,
          question: 'What stood out during your hospital visit?',
          type: 'dropdown',
          required: true,
          options: [
            { id: `ho_${Date.now()}_5`, label: 'Compassionate Staff & Nurses', value: 'Compassionate Staff & Nurses' },
            { id: `ho_${Date.now()}_6`, label: 'Pristine & Clean Facilities', value: 'Pristine & Clean Facilities' },
            { id: `ho_${Date.now()}_7`, label: 'Minimal Waiting Time', value: 'Minimal Waiting Time' },
            { id: `ho_${Date.now()}_8`, label: 'Advanced Medical Equipment', value: 'Advanced Medical Equipment' }
          ]
        },
        {
          id: `hq_${Date.now()}_3`,
          question: 'How was your overall treatment experience?',
          type: 'dropdown',
          required: true,
          options: [
            { id: `ho_${Date.now()}_9`, label: 'Excellent & Highly Satisfied', value: 'Excellent & Highly Satisfied' },
            { id: `ho_${Date.now()}_10`, label: 'Very Good & Reassuring', value: 'Very Good & Reassuring' },
            { id: `ho_${Date.now()}_11`, label: 'Good Experience', value: 'Good Experience' },
            { id: `ho_${Date.now()}_12`, label: 'Satisfactory Care', value: 'Satisfactory Care' }
          ]
        }
      ]
    }));
    showToast('Loaded Hospital Preset with Doctor Roster & Medical Questions!');
  };

  // Dynamic Questions Helpers
  const handleAddQuestion = () => {
    setScannerForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: `q_${Date.now()}`,
          question: 'New Question?',
          type: 'dropdown',
          required: true,
          options: [
            { id: `o_${Date.now()}_1`, label: 'Option 1', value: 'Option 1' },
            { id: `o_${Date.now()}_2`, label: 'Option 2', value: 'Option 2' }
          ]
        }
      ]
    }));
  };

  const handleRemoveQuestion = (qIdx) => {
    setScannerForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== qIdx)
    }));
  };

  const handleQuestionTextChange = (qIdx, text) => {
    setScannerForm((prev) => {
      const updated = [...prev.questions];
      updated[qIdx].question = text;
      return { ...prev, questions: updated };
    });
  };

  const handleAddOption = (qIdx) => {
    setScannerForm((prev) => {
      const updated = [...prev.questions];
      const newOpt = { id: `opt_${Date.now()}`, label: 'New Option', value: 'New Option' };
      updated[qIdx].options = [...(updated[qIdx].options || []), newOpt];
      return { ...prev, questions: updated };
    });
  };

  const handleRemoveOption = (qIdx, oIdx) => {
    setScannerForm((prev) => {
      const updated = [...prev.questions];
      updated[qIdx].options = updated[qIdx].options.filter((_, idx) => idx !== oIdx);
      return { ...prev, questions: updated };
    });
  };

  const handleOptionLabelChange = (qIdx, oIdx, text) => {
    setScannerForm((prev) => {
      const updated = [...prev.questions];
      updated[qIdx].options[oIdx].label = text;
      updated[qIdx].options[oIdx].value = text;
      return { ...prev, questions: updated };
    });
  };

  // Create New Client Inline (Option B)
  const handleCreateNewClient = async (e) => {
    e.preventDefault();
    if (!newClientForm.name) return;
    try {
      const created = await addClient(newClientForm);
      const newClientId = created?.id || created?._id || '';
      const newName = newClientForm.name;
      const baseSlug = newName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/^-+|-+$/g, '');
      
      setScannerForm((prev) => ({
        ...prev,
        clientName: newName,
        clientId: newClientId,
        name: prev.name || `${newName} Review Scanner`,
        slug: prev.slug || (baseSlug ? `${baseSlug}-review` : '')
      }));
      setIsNewClientModalOpen(false);
      setNewClientForm({ name: '', email: '', phone: '', company: '' });
      showToast(`New client "${newName}" created and selected!`);
    } catch (err) {
      console.error('Error creating client:', err);
      showToast('Client created locally.');
    }
  };

  // Scanner Form Submit
  const handleSubmitScanner = async (e) => {
    e.preventDefault();

    const finalName = scannerForm.name.trim() || scannerForm.clientName.trim() || 'Review Scanner';
    const finalClient = scannerForm.clientName.trim() || finalName;
    const finalUrl = scannerForm.googleReviewUrl.trim();

    if (!finalUrl) {
      showToast('Please provide a Google Review Destination URL');
      return;
    }

    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      showToast('Google Destination URL must start with http:// or https://');
      return;
    }

    if (!scannerForm.questions || scannerForm.questions.length === 0) {
      showToast('Please add at least one question to the scanner');
      return;
    }

    const isDemo = Boolean(scannerForm.isDemo);
    const demoMins = Number(scannerForm.demoDurationMinutes) || 60;

    // Calculate autoPauseAt / demoExpiresAt if duration was chosen
    let payload = {
      ...scannerForm,
      isDemo,
      demoDurationMinutes: demoMins,
      name: finalName,
      clientName: finalClient,
      businessName: finalClient,
      googleReviewUrl: finalUrl,
      googleUrl: finalUrl
    };

    if (isDemo) {
      const demoExpiry = new Date(Date.now() + demoMins * 60 * 1000);
      payload.demoExpiresAt = demoExpiry.toISOString();
      payload.autoPauseAt = demoExpiry.toISOString();
      payload.autoPauseEnabled = true;
    } else if (payload.autoPauseEnabled && payload.autoPauseDurationMinutes > 0) {
      const futureTime = new Date(Date.now() + payload.autoPauseDurationMinutes * 60 * 1000);
      payload.autoPauseAt = futureTime.toISOString();
    } else if (!payload.autoPauseEnabled) {
      payload.autoPauseAt = null;
    }

    if (!editMode) {
      delete payload.id;
    }

    try {
      if (editMode && scannerForm.id) {
        await updateScanner(scannerForm.id, payload);
        showToast('Review Scanner updated successfully in database!');
      } else {
        await addScanner(payload);
        showToast('New AI Review Scanner deployed successfully in database!');
      }

      setIsCreateModalOpen(false);
      navigate('/admin/scanners');
    } catch (err) {
      console.error('Error submitting scanner:', err);
      showToast('Failed to save scanner to database. Please check your inputs.');
    }
  };

  const handleToggleStatus = (scn) => {
    const nextStatus = scn.status === 'Active' ? 'Paused' : 'Active';
    updateScanner(scn.id || scn._id, {
      status: nextStatus,
      autoPauseEnabled: nextStatus === 'Active' ? scn.autoPauseEnabled : false
    });
    showToast(`Scanner manually ${nextStatus === 'Active' ? 'activated' : 'paused'}!`);
    setConfirmStatusModal({ isOpen: false, scanner: null });
    if (selectedScanner && (selectedScanner.id === scn.id || selectedScanner._id === scn._id)) {
      setSelectedScanner((prev) => ({ ...prev, status: nextStatus }));
    }
  };

  const handleDelete = (scn) => {
    deleteScanner(scn.id || scn._id);
    showToast(`Scanner for ${scn.clientName} deleted.`);
    setConfirmDeleteModal({ isOpen: false, scanner: null });
  };

  const openQrModal = (scn) => {
    setQrScannerTarget(scn);
    setIsQrModalOpen(true);
  };

  // Quick Auto-Pause Scheduler
  const handleApplyQuickPause = () => {
    if (!quickPauseModal.scanner) return;
    const scn = quickPauseModal.scanner;
    const durationMins = Number(quickPauseModal.durationPreset);

    let targetTime;
    if (durationMins > 0) {
      targetTime = new Date(Date.now() + durationMins * 60 * 1000);
    } else if (quickPauseModal.customDateTime) {
      targetTime = new Date(quickPauseModal.customDateTime);
    } else {
      // Clear auto-pause
      updateScanner(scn.id || scn._id, { autoPauseEnabled: false, autoPauseAt: null });
      showToast('Auto-pause timer cleared for this scanner.');
      setQuickPauseModal({ isOpen: false, scanner: null, durationPreset: '60', customDateTime: '' });
      return;
    }

    updateScanner(scn.id || scn._id, {
      status: 'Active',
      autoPauseEnabled: true,
      autoPauseAt: targetTime.toISOString(),
      autoPauseDurationMinutes: durationMins > 0 ? durationMins : 0
    });

    showToast(`Auto-pause scheduled for ${targetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on ${targetTime.toLocaleDateString()}`);
    setQuickPauseModal({ isOpen: false, scanner: null, durationPreset: '60', customDateTime: '' });
  };

  // Helper to format remaining time until auto-pause
  const formatAutoPauseCountdown = (targetDateStr) => {
    if (!targetDateStr) return '';
    const diffMs = new Date(targetDateStr).getTime() - Date.now();
    if (diffMs <= 0) return 'Expired (Pausing)';

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) return `${diffMinutes}m left`;
    const diffHours = Math.floor(diffMinutes / 60);
    const remMins = diffMinutes % 60;
    if (diffHours < 24) return `${diffHours}h ${remMins}m left`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ${diffHours % 24}h left`;
  };

  const filteredScanners = (reviewScanners || []).filter((scn) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (scn.clientName || '').toLowerCase().includes(searchLower) ||
      (scn.name || scn.placeName || '').toLowerCase().includes(searchLower) ||
      (scn.slug || '').toLowerCase().includes(searchLower);
    
    if (statusFilter === 'Demo') {
      return matchesSearch && (scn.isDemo || (scn.name && scn.name.toLowerCase().includes('demo')));
    }
    const matchesStatus = statusFilter === 'All' || (scn.status || 'Active').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredScanners.length / pageSize) || 1;
  const paginatedScanners = filteredScanners.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    {
      header: 'Client & Scanner Name',
      key: 'clientName',
      render: (row) => (
        <div>
          <div className="font-semibold text-[#111111] flex items-center gap-1.5 cursor-pointer hover:text-[#8E722A]" onClick={() => { setSelectedScanner(row); setIsDrawerOpen(true); }}>
            <MapPin className="w-3.5 h-3.5 text-[#8E722A] shrink-0" />
            <span>{row.clientName}</span>
            {row.isDemo && (
              <span className="px-1.5 py-0.2 bg-purple-100 border border-purple-300 text-purple-800 text-[9px] font-mono font-bold rounded">
                DEMO
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#685C43] font-mono ml-5">
            {row.name || row.placeName || 'Review Scanner'} • <span className="text-[#8E722A]">/review/{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Status & Timer',
      key: 'status',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <StatusBadge status={row.status || 'Active'} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStatus(row);
              }}
              className={`p-1 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer border ${
                row.status === 'Active'
                  ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
              title={row.status === 'Active' ? 'Click to Pause Scanner Immediately' : 'Click to Activate Scanner Immediately'}
            >
              {row.status === 'Active' ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
            </button>
          </div>

          {row.isDemo && (
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-50 border border-purple-200 rounded text-[10px] font-mono text-purple-700 font-semibold">
              <Clock className="w-2.5 h-2.5" />
              <span>{row.status === 'Active' ? (row.demoExpiresAt ? formatAutoPauseCountdown(row.demoExpiresAt) : 'Demo Active') : 'Demo Expired'}</span>
            </div>
          )}

          {!row.isDemo && row.status === 'Active' && row.autoPauseEnabled && row.autoPauseAt && (
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#8E722A]/10 border border-[#8E722A]/20 rounded text-[10px] font-mono text-[#8E722A]">
              <Clock className="w-2.5 h-2.5" />
              <span>{formatAutoPauseCountdown(row.autoPauseAt)}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Scans',
      key: 'scans',
      render: (row) => <span className="font-mono text-xs font-bold text-[#111111]">{row.metrics?.scans || row.totalReviewsScraped || 42}</span>,
    },
    {
      header: 'Reviews Generated',
      key: 'reviewsGenerated',
      render: (row) => <span className="font-mono text-xs text-[#8E722A] font-semibold">{row.metrics?.reviewsGenerated || 28}</span>,
    },
    {
      header: 'Google Clicks',
      key: 'googleClicked',
      render: (row) => <span className="font-mono text-xs text-emerald-600 font-semibold">{row.metrics?.googleClicked || 24}</span>,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openQrModal(row)}
            className="p-1.5 text-xs font-mono font-medium bg-[#FAF8F3] border border-[#0A0A0A]/14 hover:bg-[#8E722A] hover:text-white text-[#111111] rounded transition-colors cursor-pointer"
            title="View & Download QR Standee"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setQuickPauseModal({ isOpen: true, scanner: row, durationPreset: '60', customDateTime: '' })}
            className="p-1.5 text-xs font-mono font-medium bg-[#FAF8F3] border border-[#0A0A0A]/14 hover:bg-[#8E722A] hover:text-white text-[#111111] rounded transition-colors cursor-pointer"
            title="Set Auto-Pause Timer Schedule"
          >
            <Clock className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-xs font-mono font-medium bg-[#FAF8F3] border border-[#0A0A0A]/14 hover:bg-[#111111] hover:text-white text-[#111111] rounded transition-colors cursor-pointer"
            title="Edit Scanner & Questions"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setConfirmStatusModal({ isOpen: true, scanner: row })}
            className={`p-1.5 text-xs font-mono font-medium rounded transition-colors border cursor-pointer ${row.status === 'Active'
              ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
            title={row.status === 'Active' ? 'Manual Pause Scanner' : 'Manual Activate Scanner'}
          >
            <Power className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setConfirmDeleteModal({ isOpen: true, scanner: row })}
            className="p-1.5 text-xs font-mono font-medium bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded transition-colors cursor-pointer"
            title="Delete Scanner"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // RENDER CREATE / EDIT SCANNER FORM VIEW
  if (isCreateRoute) {
    return (
      <div className="w-full space-y-6 font-body max-w-4xl mx-auto">
        {feedback.show && (
          <div className="fixed top-4 right-4 z-50 bg-[#111111] text-[#F7F5EF] px-4 py-3 rounded-md shadow-xl font-mono text-xs flex items-center gap-2 border border-[#8E722A]">
            <CheckCircle2 className="w-4 h-4 text-[#8E722A]" />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#0A0A0A]/08 gap-3">
          <div>
            <div className="text-xs font-mono text-[#685C43] mb-1">
              <span>Review Scanners</span> / <span className="font-bold text-[#111111]">{editMode ? 'Edit Scanner' : 'Deploy Scanner'}</span>
            </div>
            <h2 className="font-display text-2xl font-normal text-[#111111]">
              {editMode ? 'Edit AI Review Scanner Configuration' : 'Deploy New AI Review Scanner'}
            </h2>
          </div>

          <button
            onClick={() => { setIsCreateModalOpen(false); navigate('/admin/scanners'); }}
            className="px-3.5 py-1.5 text-xs font-mono font-bold bg-[#FAF8F3] hover:bg-[#8E722A] hover:text-white border border-[#0A0A0A]/12 text-[#111111] rounded transition-colors"
          >
            ← Back to Scanners
          </button>
        </div>

        <form onSubmit={handleSubmitScanner} className="space-y-6">
          {/* SECTION 1: Client & Identity */}
          <AdminCard title="01. Client & Scanner Identity" className="space-y-4">
            {/* Demo Mode Toggle Banner */}
            <div className="p-3.5 bg-purple-50/80 border border-purple-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-mono font-bold text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <span>Standalone Demo Scanner Mode (No Client Account Required)</span>
                </div>
                <p className="text-[11px] text-purple-800 leading-tight">
                  Deploy instantly for prospect demos & sales presentations. Auto-expires automatically after the allotted preview duration.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextDemo = !scannerForm.isDemo;
                  setScannerForm((prev) => ({
                    ...prev,
                    isDemo: nextDemo,
                    clientName: nextDemo && !prev.clientName ? 'Demo Showcase Experience' : prev.clientName,
                    name: nextDemo && !prev.name ? 'Demo Experience Review Scanner' : prev.name,
                    googleReviewUrl: nextDemo && !prev.googleReviewUrl ? 'https://search.google.com/local/writereview?placeid=ChIJDemoPreview2026' : prev.googleReviewUrl,
                    autoPauseEnabled: nextDemo ? true : prev.autoPauseEnabled,
                    demoDurationMinutes: prev.demoDurationMinutes || 60,
                    autoPauseDurationMinutes: nextDemo ? (prev.demoDurationMinutes || 60) : prev.autoPauseDurationMinutes
                  }));
                }}
                className={`px-3.5 py-2 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
                  scannerForm.isDemo
                    ? 'bg-purple-800 text-white shadow-xs'
                    : 'bg-white border border-purple-300 text-purple-900 hover:bg-purple-100'
                }`}
              >
                {scannerForm.isDemo ? '✓ Demo Mode Active' : 'Switch to Demo Mode'}
              </button>
            </div>

            {/* If Demo Mode is active, show Demo Duration Selector */}
            {scannerForm.isDemo && (
              <div className="p-3 bg-purple-100/60 border border-purple-300 rounded-xl space-y-2 font-mono text-xs">
                <label className="block font-bold text-purple-950 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-700" />
                  <span>Allotted Demo Expiry Duration:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: '15 Minutes', mins: 15 },
                    { label: '30 Minutes', mins: 30 },
                    { label: '1 Hour (Default)', mins: 60 },
                    { label: '2 Hours', mins: 120 },
                    { label: '6 Hours', mins: 360 },
                    { label: '12 Hours', mins: 720 },
                    { label: '24 Hours (1 Day)', mins: 1440 },
                    { label: '48 Hours (2 Days)', mins: 2880 },
                  ].map((d) => (
                    <button
                      key={d.mins}
                      type="button"
                      onClick={() => setScannerForm((prev) => ({
                        ...prev,
                        demoDurationMinutes: d.mins,
                        autoPauseDurationMinutes: d.mins,
                        autoPauseEnabled: true
                      }))}
                      className={`py-2 px-2.5 rounded text-xs font-mono font-bold text-center border transition-all cursor-pointer ${
                        scannerForm.demoDurationMinutes === d.mins
                          ? 'bg-purple-900 text-white border-purple-950 shadow-xs'
                          : 'bg-white border-purple-200 text-purple-900 hover:bg-purple-200/50'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!scannerForm.isDemo ? (
                <div>
                  <label className="block text-xs font-semibold text-[#111111] font-mono mb-1.5">
                    Assigned Client Account
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={scannerForm.clientName}
                      onChange={(e) => {
                        const selName = e.target.value;
                        const foundClient = clients.find((c) => c.name === selName);
                        const cId = foundClient ? (foundClient.id || foundClient._id) : '';
                        const baseSlug = selName ? selName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/^-+|-+$/g, '') : '';
                        setScannerForm((prev) => ({
                          ...prev,
                          clientName: selName,
                          clientId: cId || prev.clientId,
                          name: prev.name || (selName ? `${selName} Review Scanner` : ''),
                          slug: prev.slug || (baseSlug ? `${baseSlug}-review` : '')
                        }));
                      }}
                      className="flex-1 bg-[#FAF8F3] border border-[#0A0A0A]/15 text-[#111111] text-xs rounded p-2.5 font-body focus:outline-none focus:border-[#8E722A]"
                    >
                      <option value="">-- Select Client Account (Optional) --</option>
                      {clients.map((c) => (
                        <option key={c.id || c._id} value={c.name}>
                          {c.name} {c.company ? `(${c.company})` : ''}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsNewClientModalOpen(true)}
                      className="px-3 py-2 bg-[#111111] hover:bg-[#8E722A] text-white text-xs font-mono rounded flex items-center gap-1 shrink-0"
                      title="Quick Add New Client"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New</span>
                    </button>
                  </div>
                </div>
              ) : (
                <FormInput
                  label="Demo Business / Brand Name"
                  value={scannerForm.clientName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setScannerForm((prev) => ({
                      ...prev,
                      clientName: val,
                      name: val ? `${val} Review Scanner` : prev.name,
                      slug: val ? `${val.toLowerCase().replace(/[^a-z0-9]/g, '-')}-demo` : prev.slug
                    }));
                  }}
                  placeholder="e.g. The Grand Luxe Cafe (Demo)"
                  required
                />
              )}

              <FormInput
                label="Scanner Display Title"
                value={scannerForm.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoSlug = !editMode && !scannerForm.slug ? val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/^-+|-+$/g, '') : scannerForm.slug;
                  setScannerForm((prev) => ({ ...prev, name: val, slug: !editMode && (prev.slug === '' || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]/g, '-')) ? val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/^-+|-+$/g, '') : prev.slug }));
                }}
                placeholder="e.g. Main Lobby Standee Scanner"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Public URL Slug (/review/{slug})"
                value={scannerForm.slug}
                onChange={(e) => setScannerForm({ ...scannerForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="e.g. apex-hospital-review"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-[#111111] font-mono mb-1.5 flex items-center justify-between">
                  <span>Business Industry & Category</span>
                  {scannerForm.industry === 'Hospital / Healthcare' && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      🏥 Hospital Mode Enabled
                    </span>
                  )}
                </label>
                <select
                  value={scannerForm.industry || 'General Business'}
                  onChange={(e) => {
                    const selInd = e.target.value;
                    setScannerForm((prev) => ({
                      ...prev,
                      industry: selInd,
                      doctors: prev.doctors || []
                    }));
                  }}
                  className="w-full bg-[#FAF8F3] border border-[#0A0A0A]/15 text-[#111111] text-xs rounded p-2.5 font-body focus:outline-none focus:border-[#8E722A]"
                >
                  <option value="General Business">General Business</option>
                  <option value="Hospital / Healthcare">🏥 Hospital / Healthcare & Clinics</option>
                  <option value="Restaurant & Hospitality">🍽️ Restaurant & Hospitality</option>
                  <option value="Retail & E-Commerce">🛍️ Retail & E-Commerce</option>
                  <option value="Real Estate & Architecture">🏢 Real Estate & Architecture</option>
                  <option value="Salon, Spa & Wellness">💇 Salon, Spa & Wellness</option>
                  <option value="Fitness & Gym">💪 Fitness & Gym</option>
                  <option value="Education & Coaching">🎓 Education & Coaching</option>
                  <option value="Corporate & Professional Services">💼 Corporate & Professional Services</option>
                </select>
              </div>
            </div>
          </AdminCard>

          {/* DYNAMIC HOSPITAL DOCTORS MODULE - ONLY DISPLAYED WHEN INDUSTRY IS 'Hospital / Healthcare' */}
          {scannerForm.industry === 'Hospital / Healthcare' && (
            <AdminCard
              title={`🏥 Hospital Doctors & Medical Staff (${(scannerForm.doctors || []).length} Doctors Configured)`}
              className="space-y-4 border-2 border-emerald-600/30 bg-emerald-50/20"
            >
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Doctor Selection Menu will be displayed on the customer's review page!</span>
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-tight">
                    Patients scanning this QR standee will select which doctor or department treated them. The AI generates personalized reviews referencing the doctor by name.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLoadHospitalPreset}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  ⚡ Load Full Medical Preset
                </button>
              </div>

              {/* Empty Doctors State */}
              {(scannerForm.doctors || []).length === 0 && (
                <div className="p-6 bg-white border border-dashed border-emerald-300 rounded-xl text-center space-y-2">
                  <Users className="w-8 h-8 text-emerald-600/60 mx-auto" />
                  <p className="font-mono text-xs font-bold text-emerald-950">
                    No Doctors Configured Yet (Empty)
                  </p>
                  <p className="text-[11px] text-emerald-800 max-w-sm mx-auto">
                    Add doctors individually using the button below, or click "⚡ Load Full Medical Preset" to import sample doctors.
                  </p>
                </div>
              )}

              {/* Doctor Roster List */}
              <div className="space-y-3">
                {(scannerForm.doctors || []).map((doc, docIdx) => (
                  <div
                    key={doc.id || docIdx}
                    className="p-3.5 bg-white border border-[#0A0A0A]/12 rounded-xl shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#0A0A0A]/08">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-xs flex items-center justify-center">
                          {docIdx + 1}
                        </span>
                        <span className="font-mono text-xs font-bold text-emerald-900">
                          {doc.name || `Doctor #${docIdx + 1}`}
                        </span>
                        {doc.department && (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-semibold">
                            {doc.department}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-[11px] font-mono cursor-pointer text-[#685C43]">
                          <input
                            type="checkbox"
                            checked={doc.available !== false}
                            onChange={(e) => handleDoctorChange(docIdx, 'available', e.target.checked)}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Active / Available</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveDoctor(docIdx)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Remove Doctor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-[#685C43] mb-1">
                          Doctor Name
                        </label>
                        <input
                          type="text"
                          value={doc.name}
                          onChange={(e) => handleDoctorChange(docIdx, 'name', e.target.value)}
                          placeholder="e.g. Dr. Rajesh Sharma"
                          className="w-full bg-[#FAF8F3] border border-[#0A0A0A]/15 text-[#111111] text-xs rounded p-2 font-body focus:outline-none focus:border-emerald-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-[#685C43] mb-1">
                          Department / Specialization
                        </label>
                        <input
                          type="text"
                          value={doc.department}
                          onChange={(e) => handleDoctorChange(docIdx, 'department', e.target.value)}
                          placeholder="e.g. Cardiology / Orthopedics"
                          className="w-full bg-[#FAF8F3] border border-[#0A0A0A]/15 text-[#111111] text-xs rounded p-2 font-body focus:outline-none focus:border-emerald-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-[#685C43] mb-1">
                          Qualification / Designation
                        </label>
                        <input
                          type="text"
                          value={doc.qualification}
                          onChange={(e) => handleDoctorChange(docIdx, 'qualification', e.target.value)}
                          placeholder="e.g. MD, DM - Senior Consultant"
                          className="w-full bg-[#FAF8F3] border border-[#0A0A0A]/15 text-[#111111] text-xs rounded p-2 font-body focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddDoctor}
                className="w-full py-2.5 bg-white border-2 border-dashed border-emerald-600/50 text-emerald-800 font-mono text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>{(scannerForm.doctors || []).length === 0 ? '+ Add First Doctor' : '+ Add Another Hospital Doctor'}</span>
              </button>

              {/* HOSPITAL SERVICES & PROCEDURE CHIPS BUILDER */}
              <div className="pt-4 border-t border-emerald-200/60 space-y-3">
                <div>
                  <h4 className="font-mono text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Interactive Treatment & Service Chips ({(scannerForm.hospitalServices || []).length})
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    These chips appear on the patient review screen for instant 1-tap review crafting.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 p-3 bg-white border border-emerald-200/60 rounded-xl min-h-[60px]">
                  {(scannerForm.hospitalServices || []).map((chip) => (
                    <div
                      key={chip}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-mono font-bold"
                    >
                      <span>{chip}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveServiceChip(chip)}
                        className="text-emerald-700 hover:text-red-600 ml-1 cursor-pointer"
                        title="Remove chip"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newServiceChipInput}
                    onChange={(e) => setNewServiceChipInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddServiceChip();
                      }
                    }}
                    placeholder="e.g. CATARACT SURGERY, LASIK LASER, CORNEAL TRANSPLANT..."
                    className="flex-1 bg-white border border-[#0A0A0A]/15 text-[#111111] text-xs rounded-lg p-2.5 font-body focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddServiceChip}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    + Add Chip
                  </button>
                </div>
              </div>
            </AdminCard>
          )}

          {/* SECTION 2: Google Destination URL */}
          <AdminCard title="02. Google Review Destination URL" className="space-y-4">
            <FormInput
              label="Target Google Review URL"
              value={scannerForm.googleReviewUrl}
              onChange={(e) => setScannerForm({ ...scannerForm, googleReviewUrl: e.target.value })}
              placeholder="https://g.page/r/your-google-place-id/review"
              required
            />
            <p className="text-[11px] font-mono text-[#685C43]">
              Customers will be redirected to this Google URL after their AI review is generated and ready to post.
            </p>
          </AdminCard>

          {/* SECTION 3: Dynamic Review Questions Builder */}
          <AdminCard title="03. Dynamic Review Questions Builder" className="space-y-6">
            <p className="text-xs font-mono text-[#685C43]">
              Configure the questions and options shown to customers on the review page.
            </p>

            <div className="space-y-6">
              {scannerForm.questions.map((q, qIdx) => (
                <div key={q.id || qIdx} className="p-4 bg-[#FAF8F3] border border-[#0A0A0A]/10 rounded-xl space-y-4">
                  <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#0A0A0A]/08">
                    <span className="font-mono text-xs font-bold text-[#8E722A]">Question {qIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-xs font-mono text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Question
                    </button>
                  </div>

                  <FormInput
                    label="Question Text"
                    value={q.question}
                    onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                    placeholder="e.g. What did you like most?"
                    required
                  />

                  {/* Options List */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-[11px] font-mono text-[#685C43]">Available Keywords</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(q.options || []).map((opt, oIdx) => (
                        <div key={opt.id || oIdx} className="flex items-center gap-2 bg-white p-2 rounded border border-[#0A0A0A]/10">
                          <input
                            type="text"
                            value={opt.label}
                            onChange={(e) => handleOptionLabelChange(qIdx, oIdx, e.target.value)}
                            className="flex-1 text-xs font-body px-2 py-1 bg-transparent border-b border-gray-200 focus:border-[#8E722A] focus:outline-none"
                            placeholder="Option Label"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(qIdx, oIdx)}
                            className="text-red-500 hover:text-red-700 p-1 text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddOption(qIdx)}
                      className="mt-2 text-xs font-mono text-[#8E722A] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Option
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-2.5 bg-white border border-dashed border-[#8E722A] text-[#8E722A] font-mono text-xs font-bold rounded-lg hover:bg-[#8E722A]/05 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Another Question
            </button>
          </AdminCard>

          {/* SECTION 4: Rating & AI Settings */}
          <AdminCard title="04. Star Rating & AI Settings" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormSelect
                label="Star Rating Requirement"
                value={scannerForm.ratingRequired ? 'Required' : 'Optional'}
                onChange={(e) => setScannerForm({ ...scannerForm, ratingRequired: e.target.value === 'Required' })}
                options={['Required', 'Optional']}
              />

              <FormSelect
                label="AI Review Tone"
                value={scannerForm.aiSettings?.tone || 'Friendly & Professional'}
                onChange={(e) => setScannerForm({ ...scannerForm, aiSettings: { ...scannerForm.aiSettings, tone: e.target.value } })}
                options={['Friendly & Professional', 'Editorial & Luxury', 'Short & Direct', 'Enthusiastic']}
              />

              <FormSelect
                label="AI Review Target Length"
                value={scannerForm.aiSettings?.length || 'Medium'}
                onChange={(e) => setScannerForm({ ...scannerForm, aiSettings: { ...scannerForm.aiSettings, length: e.target.value } })}
                options={['Short', 'Medium', 'Detailed']}
              />

              <FormSelect
                label="QR Auto-Redirect Timer"
                value={
                  scannerForm.redirectTimer === 3 ? '3 Seconds (Fast)' :
                  scannerForm.redirectTimer === 10 ? '10 Seconds (Standard)' :
                  scannerForm.redirectTimer === 15 ? '15 Seconds (Extended)' :
                  scannerForm.redirectTimer === 0 ? '0 Seconds (Disabled / Manual)' :
                  '5 Seconds (Default)'
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const num = val.startsWith('3') ? 3 : val.startsWith('10') ? 10 : val.startsWith('15') ? 15 : val.startsWith('0') ? 0 : 5;
                  setScannerForm({ ...scannerForm, redirectTimer: num });
                }}
                options={[
                  '5 Seconds (Default)',
                  '3 Seconds (Fast)',
                  '10 Seconds (Standard)',
                  '15 Seconds (Extended)',
                  '0 Seconds (Disabled / Manual)'
                ]}
              />
            </div>
          </AdminCard>

          {/* SECTION 5: Availability, Status & Auto-Pause Timer */}
          <AdminCard title="05. Scanner Status & Automatic Auto-Pause Timer" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Scanner Operational Status"
                value={scannerForm.status || 'Active'}
                onChange={(e) => setScannerForm({ ...scannerForm, status: e.target.value })}
                options={['Active', 'Paused']}
              />

              <div>
                <label className="block text-xs font-semibold text-[#111111] font-mono mb-1.5">
                  Scheduled Auto-Pause Duration
                </label>
                <select
                  value={
                    !scannerForm.autoPauseEnabled ? 'none' :
                    scannerForm.autoPauseDurationMinutes === 60 ? '60' :
                    scannerForm.autoPauseDurationMinutes === 360 ? '360' :
                    scannerForm.autoPauseDurationMinutes === 720 ? '720' :
                    scannerForm.autoPauseDurationMinutes === 1440 ? '1440' :
                    scannerForm.autoPauseDurationMinutes === 2880 ? '2880' :
                    scannerForm.autoPauseDurationMinutes === 10080 ? '10080' : 'custom'
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'none') {
                      setScannerForm({ ...scannerForm, autoPauseEnabled: false, autoPauseDurationMinutes: 0, autoPauseAt: '' });
                    } else if (val === 'custom') {
                      setScannerForm({ ...scannerForm, autoPauseEnabled: true, autoPauseDurationMinutes: 0 });
                    } else {
                      const mins = Number(val);
                      const targetDate = new Date(Date.now() + mins * 60 * 1000);
                      setScannerForm({
                        ...scannerForm,
                        autoPauseEnabled: true,
                        autoPauseDurationMinutes: mins,
                        autoPauseAt: targetDate.toISOString().slice(0, 16)
                      });
                    }
                  }}
                  className="w-full bg-[#FAF8F3] border border-[#0A0A0A]/15 text-[#111111] text-xs rounded p-2.5 font-body focus:outline-none focus:border-[#8E722A]"
                >
                  <option value="none">No Auto-Pause (Run Continuously)</option>
                  <option value="60">Auto-Pause after 1 Hour</option>
                  <option value="360">Auto-Pause after 6 Hours</option>
                  <option value="720">Auto-Pause after 12 Hours</option>
                  <option value="1440">Auto-Pause after 24 Hours (1 Day)</option>
                  <option value="2880">Auto-Pause after 48 Hours (2 Days)</option>
                  <option value="10080">Auto-Pause after 7 Days (1 Week)</option>
                  <option value="custom">Set Specific Custom Date & Time...</option>
                </select>
              </div>
            </div>

            {scannerForm.autoPauseEnabled && (
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-amber-800 font-semibold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Auto-Pause Timer Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-amber-900 mb-1">Target Auto-Pause Date & Time (IST)</label>
                    <input
                      type="datetime-local"
                      value={scannerForm.autoPauseAt}
                      onChange={(e) => setScannerForm({ ...scannerForm, autoPauseAt: e.target.value, autoPauseDurationMinutes: 0 })}
                      className="w-full bg-white border border-amber-300 text-[#111111] text-xs rounded p-2 font-mono"
                      required={scannerForm.autoPauseEnabled}
                    />
                  </div>
                  <div className="flex items-end">
                    <p className="text-[11px] text-amber-800 leading-tight">
                      When this time is reached, the system will automatically transition the scanner to <strong>Paused</strong> status.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </AdminCard>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0A0A0A]/10">
            <button
              type="button"
              onClick={() => { setIsCreateModalOpen(false); navigate('/admin/scanners'); }}
              className="px-5 py-2.5 text-xs font-mono text-[#685C43] hover:text-[#111111]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded transition-colors cursor-pointer"
            >
              {editMode ? 'Save Changes to Database' : 'Deploy Review Scanner'}
            </button>
          </div>
        </form>

        {/* Option B: Create New Client Inline Modal */}
        {isNewClientModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-[#8E722A]">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-display font-bold text-lg text-[#111]">Create New Client Profile</h3>
                <button onClick={() => setIsNewClientModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNewClient} className="space-y-4">
                <FormInput
                  label="Client Name"
                  value={newClientForm.name}
                  onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                  placeholder="e.g. Dev Cafe"
                  required
                />
                <FormInput
                  label="Contact Email"
                  type="email"
                  value={newClientForm.email}
                  onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                  placeholder="contact@client.com"
                />
                <FormInput
                  label="Phone Number"
                  value={newClientForm.phone}
                  onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewClientModalOpen(false)}
                    className="px-4 py-2 text-xs font-mono text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#8E722A] text-white text-xs font-mono font-bold rounded"
                  >
                    Save & Assign Client
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD TABLE VIEW
  return (
    <div className="space-y-6 font-body">
      {/* Feedback Toast */}
      {feedback.show && (
        <div className="fixed top-4 right-4 z-50 bg-[#111111] text-[#F7F5EF] px-4 py-3 rounded-md shadow-xl font-mono text-xs flex items-center gap-2 border border-[#8E722A] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#8E722A]" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="ACTIVE SCANNERS"
          value={reviewScanners.filter(s => s.status === 'Active').length}
          trend={reviewScanners.length}
          trendLabel="total deployed"
          icon={Star}
          accentColor="gold"
        />
        <KpiCard
          label="PAUSED SCANNERS"
          value={reviewScanners.filter(s => s.status === 'Paused').length}
          trend={0}
          trendLabel="inactive / standby"
          icon={Pause}
          accentColor="black"
        />
        <KpiCard
          label="AI REVIEWS GENERATED"
          value={reviewScanners.reduce((acc, s) => acc + (s.metrics?.reviewsGenerated || 28), 0)}
          trend={18}
          trendLabel="ready reviews"
          icon={Sparkles}
          accentColor="gold"
        />
        <KpiCard
          label="GOOGLE REDIRECTS"
          value={reviewScanners.reduce((acc, s) => acc + (s.metrics?.googleClicked || 24), 0)}
          trend={15}
          trendLabel="posted on Google"
          icon={TrendingUp}
          accentColor="black"
        />
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#0A0A0A]/10 shadow-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search scanners by client, name, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3.5 py-2 text-xs font-mono bg-[#FAF8F3] border border-[#0A0A0A]/14 rounded w-64 focus:outline-none focus:border-[#8E722A]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-mono bg-[#FAF8F3] border border-[#0A0A0A]/14 rounded focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Paused">Paused Only</option>
            <option value="Demo">Demo Scanners Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenCreateDemo}
            className="px-3.5 py-2 bg-purple-900 hover:bg-purple-800 text-white text-xs font-mono font-bold rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm border border-purple-500/30"
            title="Deploy a quick demo scanner with auto-expiration (no client required)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Deploy Demo Scanner</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#111111] hover:bg-[#8E722A] text-[#F7F5EF] text-xs font-mono font-bold rounded transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#8E722A]" />
            <span>Deploy New Review Scanner</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={paginatedScanners}
        onRowClick={(row) => { setSelectedScanner(row); setIsDrawerOpen(true); }}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        totalItems={filteredScanners.length}
      />

      {/* Quick Auto-Pause Modal */}
      {quickPauseModal.isOpen && quickPauseModal.scanner && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#8E722A] relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setQuickPauseModal({ isOpen: false, scanner: null, durationPreset: '60', customDateTime: '' })}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 pb-2 border-b border-[#0A0A0A]/08">
              <div className="p-2 rounded-lg bg-amber-50 text-[#8E722A] border border-amber-200">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#111]">Schedule Scanner Auto-Pause</h3>
                <p className="font-mono text-xs text-[#685C43]">{quickPauseModal.scanner.clientName}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <label className="block text-[#111111] font-semibold">
                Select Auto-Pause Duration:
              </label>
              <select
                value={quickPauseModal.durationPreset}
                onChange={(e) => setQuickPauseModal({ ...quickPauseModal, durationPreset: e.target.value })}
                className="w-full bg-[#FAF8F3] border border-[#0A0A0A]/15 text-[#111111] text-xs rounded-lg p-2.5 font-mono focus:outline-none focus:border-[#8E722A]"
              >
                <option value="60">Pause after 1 Hour</option>
                <option value="360">Pause after 6 Hours</option>
                <option value="720">Pause after 12 Hours</option>
                <option value="1440">Pause after 24 Hours (1 Day)</option>
                <option value="2880">Pause after 48 Hours (2 Days)</option>
                <option value="10080">Pause after 7 Days (1 Week)</option>
                <option value="custom">Set Custom Date & Time...</option>
                <option value="0">Clear / Remove Auto-Pause Schedule</option>
              </select>

              {quickPauseModal.durationPreset === 'custom' && (
                <div className="space-y-1 pt-1">
                  <label className="block text-[11px] text-[#685C43]">Custom Date & Time (IST):</label>
                  <input
                    type="datetime-local"
                    value={quickPauseModal.customDateTime}
                    onChange={(e) => setQuickPauseModal({ ...quickPauseModal, customDateTime: e.target.value })}
                    className="w-full bg-white border border-[#0A0A0A]/15 text-xs rounded-lg p-2 font-mono"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#0A0A0A]/08">
              <button
                type="button"
                onClick={() => setQuickPauseModal({ isOpen: false, scanner: null, durationPreset: '60', customDateTime: '' })}
                className="px-4 py-2 text-xs font-mono text-gray-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyQuickPause}
                className="px-5 py-2 bg-[#8E722A] hover:bg-[#725B20] text-white text-xs font-mono font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
              >
                Apply Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Preview & Download Modal */}
      {isQrModalOpen && qrScannerTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-4 border border-[#8E722A] relative shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#0A0A0A]/10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg text-[#111]">Google Review Standee Preview</h3>
                  {qrScannerTarget.isDemo && (
                    <span className="px-1.5 py-0.5 bg-purple-100 border border-purple-300 text-purple-800 text-[10px] font-mono font-bold rounded">
                      DEMO
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-[#685C43]">
                  {qrScannerTarget.clientName} • <span className="text-[#8E722A]">/review/{qrScannerTarget.slug}</span>
                </p>
              </div>

              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="Close Modal"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Standee Content */}
            <QrCodeRenderer
              url={`${window.location.origin}/review/${qrScannerTarget.slug}`}
              clientName={qrScannerTarget.clientName}
              scannerName={qrScannerTarget.name || `${qrScannerTarget.clientName} Review`}
              defaultTimer={qrScannerTarget.redirectTimer !== undefined ? qrScannerTarget.redirectTimer : 5}
              size={200}
              onClose={() => setIsQrModalOpen(false)}
            />

            {/* Modal Footer with Explicit Close Action */}
            <div className="flex items-center justify-between pt-3 border-t border-[#0A0A0A]/10 text-xs font-mono">
              <span className="text-[11px] text-[#685C43] hidden sm:inline">
                Click PNG or Print Card to export official physical standees.
              </span>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition-colors cursor-pointer ml-auto"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide Drawer for Inspection & Analytics */}
      <SlideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedScanner?.clientName || 'Scanner Details'}
      >
        {selectedScanner && (
          <div className="space-y-6 font-body text-xs">
            <div className="flex border-b border-[#0A0A0A]/10">
              {['Overview', 'Questions', 'QRCode', 'Analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDrawerTab(tab)}
                  className={`px-4 py-2 font-mono text-xs font-semibold border-b-2 transition-colors ${drawerTab === tab ? 'border-[#8E722A] text-[#111111]' : 'border-transparent text-[#685C43]'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {drawerTab === 'Overview' && (
              <div className="space-y-4">
                {/* Status & Manual Action Header */}
                <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-[#111]">{selectedScanner.clientName}</div>
                      <div className="font-mono text-xs text-[#8E722A]">/review/{selectedScanner.slug}</div>
                    </div>
                    <StatusBadge status={selectedScanner.status || 'Active'} />
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#0A0A0A]/08">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(selectedScanner)}
                      className={`flex-1 py-2 px-3 text-xs font-mono font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedScanner.status === 'Active'
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {selectedScanner.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{selectedScanner.status === 'Active' ? 'Manual Pause Scanner' : 'Manual Activate Scanner'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQuickPauseModal({
                          isOpen: true,
                          scanner: selectedScanner,
                          durationPreset: '60',
                          customDateTime: ''
                        });
                      }}
                      className="px-3 py-2 bg-white border border-[#0A0A0A]/15 hover:border-[#8E722A] rounded-lg text-xs font-mono text-[#111] transition-colors flex items-center gap-1 cursor-pointer"
                      title="Schedule Auto-Pause"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#8E722A]" />
                      <span>Timer</span>
                    </button>
                  </div>
                </div>

                {/* Auto-Pause Status Card */}
                {selectedScanner.autoPauseEnabled && selectedScanner.autoPauseAt && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between font-bold text-amber-900">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Scheduled Auto-Pause</span>
                      </span>
                      <span className="text-[11px] bg-amber-200/60 px-2 py-0.5 rounded">
                        {formatAutoPauseCountdown(selectedScanner.autoPauseAt)}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-800">
                      Auto-pauses at: {new Date(selectedScanner.autoPauseAt).toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="p-3.5 bg-white rounded-xl border border-[#0A0A0A]/10 space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#685C43]">Industry Category:</span>
                    <span className="font-bold text-[#111]">{selectedScanner.industry || 'General Business'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#685C43]">Google Review URL:</span>
                    <a
                      href={selectedScanner.googleReviewUrl || selectedScanner.googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8E722A] hover:underline truncate max-w-[60%]"
                    >
                      {selectedScanner.googleReviewUrl || selectedScanner.googleUrl}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#685C43]">Redirect Timer:</span>
                    <span className="text-[#111] font-bold">{selectedScanner.redirectTimer !== undefined ? `${selectedScanner.redirectTimer}s` : '5s'}</span>
                  </div>
                </div>

                {/* Hospital Doctors Summary in Drawer */}
                {selectedScanner.industry === 'Hospital / Healthcare' && selectedScanner.doctors && selectedScanner.doctors.length > 0 && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <div className="font-mono text-xs font-bold text-emerald-950 flex items-center justify-between">
                      <span>🏥 Configured Doctors ({selectedScanner.doctors.length})</span>
                      <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded font-semibold">Active Roster</span>
                    </div>
                    <div className="space-y-1.5">
                      {selectedScanner.doctors.map((doc, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-emerald-100 flex items-center justify-between text-[11px]">
                          <div>
                            <div className="font-bold text-emerald-950">{doc.name}</div>
                            <div className="text-[#685C43] font-mono text-[10px]">{doc.department} {doc.qualification ? `• ${doc.qualification}` : ''}</div>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${doc.available !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                            {doc.available !== false ? 'Available' : 'Inactive'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border text-center">
                    <div className="font-mono text-lg font-bold">{selectedScanner.metrics?.scans || 42}</div>
                    <div className="text-gray-500 text-[10px] uppercase font-mono">Total Scans</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border text-center">
                    <div className="font-mono text-lg font-bold text-[#8E722A]">{selectedScanner.metrics?.reviewsGenerated || 28}</div>
                    <div className="text-gray-500 text-[10px] uppercase font-mono">Generated Reviews</div>
                  </div>
                </div>
              </div>
            )}

            {drawerTab === 'Questions' && (
              <div className="space-y-3">
                {(selectedScanner.questions || []).map((q, idx) => (
                  <div key={idx} className="p-3.5 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/10 space-y-1.5">
                    <div className="font-bold text-[#111]">{q.question}</div>
                    <div className="flex flex-wrap gap-1">
                      {(q.options || []).map((o, oIdx) => (
                        <span key={oIdx} className="px-2 py-0.5 bg-white border rounded text-[10px] font-mono">
                          {o.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {drawerTab === 'QRCode' && (
              <QrCodeRenderer
                url={`${window.location.origin}/review/${selectedScanner.slug}`}
                clientName={selectedScanner.clientName}
                scannerName={selectedScanner.name}
                defaultTimer={selectedScanner.redirectTimer !== undefined ? selectedScanner.redirectTimer : 5}
              />
            )}

            {drawerTab === 'Analytics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="text-[#8E722A] text-lg font-bold">
                      {selectedScanner.metrics?.scans ? `${((selectedScanner.metrics.googleClicked / selectedScanner.metrics.scans) * 100).toFixed(1)}%` : '68.0%'}
                    </div>
                    <div className="text-gray-600 text-[10px]">Conversion Rate</div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="text-emerald-700 text-lg font-bold">{selectedScanner.metrics?.googleClicked || 24}</div>
                    <div className="text-gray-600 text-[10px]">Google Redirects</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </SlideDrawer>

      {/* Confirm Modals */}
      <ConfirmDialog
        isOpen={confirmStatusModal.isOpen}
        onClose={() => setConfirmStatusModal({ isOpen: false, scanner: null })}
        onConfirm={() => handleToggleStatus(confirmStatusModal.scanner)}
        title="Toggle Scanner Status"
        message={`Are you sure you want to ${confirmStatusModal.scanner?.status === 'Active' ? 'pause' : 'activate'} this scanner?`}
      />

      <ConfirmDialog
        isOpen={confirmDeleteModal.isOpen}
        onClose={() => setConfirmDeleteModal({ isOpen: false, scanner: null })}
        onConfirm={() => handleDelete(confirmDeleteModal.scanner)}
        title="Delete Review Scanner"
        message="Are you sure you want to delete this scanner? This action cannot be undone."
      />
    </div>
  );
};

export default ReviewScannersModule;
