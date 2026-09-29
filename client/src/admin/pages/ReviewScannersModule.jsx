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
  X
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Feedback Toast
  const [feedback, setFeedback] = useState({ show: false, message: '' });

  // New Client Form State (Option B)
  const [newClientForm, setNewClientForm] = useState({ name: '', email: '', phone: '', company: '' });

  // Form State for Deploying/Editing Scanner
  const [editMode, setEditMode] = useState(false); // false = create, true = edit
  const [scannerForm, setScannerForm] = useState({
    id: null,
    clientName: clients[0]?.name || 'Dev Cafe',
    name: 'Dev Cafe Review',
    slug: 'dev-cafe-review',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_t_x55zsR9999',
    ratingRequired: true,
    questions: [
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
    ],
    aiSettings: { tone: 'Friendly & Professional', length: 'Medium' }
  });

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
    setScannerForm({
      id: null,
      clientName: clients[0]?.name || 'Dev Cafe',
      name: `${clients[0]?.name || 'Dev Cafe'} Review Scanner`,
      slug: `${(clients[0]?.name || 'dev-cafe').toLowerCase().replace(/[^a-z0-9]/g, '-')}-review`,
      googleReviewUrl: 'https://g.page/r/example/review',
      ratingRequired: true,
      questions: [
        {
          id: `q_${Date.now()}_1`,
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
          id: `q_${Date.now()}_2`,
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
          id: `q_${Date.now()}_3`,
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
      ],
      aiSettings: { tone: 'Friendly & Professional', length: 'Medium' }
    });
    setIsCreateModalOpen(true);
    navigate('/admin/scanners/create');
  };

  const handleOpenEdit = (scn) => {
    setEditMode(true);
    setScannerForm({
      id: scn.id || scn._id,
      clientName: scn.clientName,
      name: scn.name || scn.placeName || `${scn.clientName} Review`,
      slug: scn.slug || (scn.clientName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      googleReviewUrl: scn.googleReviewUrl || scn.googleUrl || '',
      ratingRequired: scn.ratingRequired !== false,
      questions: scn.questions && scn.questions.length > 0 ? scn.questions : [
        {
          id: 'q1',
          question: 'What did you like most?',
          type: 'dropdown',
          required: true,
          options: [
            { id: 'o1', label: 'Food & Quality', value: 'Food & Quality' },
            { id: 'o2', label: 'Customer Service', value: 'Customer Service' }
          ]
        }
      ],
      aiSettings: scn.aiSettings || { tone: 'Friendly & Professional', length: 'Medium' }
    });
    setIsCreateModalOpen(true);
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
  const handleCreateNewClient = (e) => {
    e.preventDefault();
    if (!newClientForm.name) return;
    const newId = addClient(newClientForm);
    setScannerForm((prev) => ({ ...prev, clientName: newClientForm.name }));
    setIsNewClientModalOpen(false);
    setNewClientForm({ name: '', email: '', phone: '', company: '' });
    showToast(`New client "${newClientForm.name}" created and assigned!`);
  };

  // Scanner Form Submit
  const handleSubmitScanner = (e) => {
    e.preventDefault();

    if (!scannerForm.googleReviewUrl.startsWith('http://') && !scannerForm.googleReviewUrl.startsWith('https://')) {
      showToast('Google Destination URL must start with http:// or https://');
      return;
    }

    if (!scannerForm.questions || scannerForm.questions.length === 0) {
      showToast('Please add at least one question to the scanner');
      return;
    }

    if (editMode && scannerForm.id) {
      updateScanner(scannerForm.id, scannerForm);
      showToast('Review Scanner updated successfully!');
    } else {
      addScanner(scannerForm);
      showToast('New AI Review Scanner deployed successfully!');
    }

    setIsCreateModalOpen(false);
    navigate('/admin/scanners');
  };

  const handleToggleStatus = (scn) => {
    const nextStatus = scn.status === 'Active' ? 'Paused' : 'Active';
    updateScanner(scn.id || scn._id, { status: nextStatus });
    showToast(`Scanner status set to ${nextStatus}`);
    setConfirmStatusModal({ isOpen: false, scanner: null });
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

  const filteredScanners = (reviewScanners || []).filter((scn) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (scn.clientName || '').toLowerCase().includes(searchLower) ||
      (scn.name || scn.placeName || '').toLowerCase().includes(searchLower) ||
      (scn.slug || '').toLowerCase().includes(searchLower);
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
          </div>
          <div className="text-[11px] text-[#685C43] font-mono ml-5">
            {row.name || row.placeName || 'Review Scanner'} • <span className="text-[#8E722A]">/review/{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status || 'Active'} />,
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
            className="p-1.5 text-xs font-mono font-medium bg-[#FAF8F3] border border-[#0A0A0A]/14 hover:bg-[#8E722A] hover:text-white text-[#111111] rounded transition-colors"
            title="View QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-xs font-mono font-medium bg-[#FAF8F3] border border-[#0A0A0A]/14 hover:bg-[#111111] hover:text-white text-[#111111] rounded transition-colors"
            title="Edit Scanner & Questions"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setConfirmStatusModal({ isOpen: true, scanner: row })}
            className={`p-1.5 text-xs font-mono font-medium rounded transition-colors border ${row.status === 'Active'
              ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
            title={row.status === 'Active' ? 'Pause Scanner' : 'Activate Scanner'}
          >
            <Power className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setConfirmDeleteModal({ isOpen: true, scanner: row })}
            className="p-1.5 text-xs font-mono font-medium bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded transition-colors"
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
          {/* SECTION 1: Client Selection */}
          <AdminCard title="01. Assigned Client & Basic Details" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="sm:col-span-2">
                <FormSelect
                  label="Select Client (Option A)"
                  value={scannerForm.clientName}
                  onChange={(e) => {
                    const chosen = e.target.value;
                    setScannerForm({
                      ...scannerForm,
                      clientName: chosen,
                      name: `${chosen} Review Scanner`,
                      slug: `${chosen.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-review`
                    });
                  }}
                  options={clients.map((c) => c.name)}
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewClientModalOpen(true)}
                className="py-2.5 px-4 bg-[#8E722A]/10 hover:bg-[#8E722A] text-[#8E722A] hover:text-white border border-[#8E722A]/30 text-xs font-mono font-semibold rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span> Create New Client</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Scanner Display Name"
                value={scannerForm.name}
                onChange={(e) => setScannerForm({ ...scannerForm, name: e.target.value })}
                placeholder="e.g. Dev Cafe Bandra Scanner"
                required
              />

              <FormInput
                label="Public URL Slug"
                value={scannerForm.slug}
                onChange={(e) => setScannerForm({ ...scannerForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                placeholder="dev-cafe-review"
                required
              />
            </div>
          </AdminCard>

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
            </div>
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
              className="px-6 py-2.5 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded transition-colors"
            >
              {editMode ? 'Save Changes' : 'Deploy Review Scanner'}
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
        <div className="fixed top-4 right-4 z-50 bg-[#111111] text-[#F7F5EF] px-4 py-3 rounded-md shadow-xl font-mono text-xs flex items-center gap-2 border border-[#8E722A]">
          <CheckCircle2 className="w-4 h-4 text-[#8E722A]" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="ACTIVE SCANNERS"
          value={reviewScanners.length}
          trend={2}
          trendLabel="total deployed"
          icon={Star}
          accentColor="gold"
        />
        <KpiCard
          label="TOTAL SCANS"
          value={reviewScanners.reduce((acc, s) => acc + (s.metrics?.scans || 42), 0)}
          trend={12}
          trendLabel="customer visits"
          icon={QrCode}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#0A0A0A]/10">
        <div className="flex items-center gap-3">
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
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#111111] hover:bg-[#8E722A] text-[#F7F5EF] text-xs font-mono font-bold rounded transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#8E722A]" />
          <span> Deploy New Review Scanner</span>
        </button>
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

      {/* QR Code Preview & Download Modal */}
      {isQrModalOpen && qrScannerTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#8E722A] relative">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-lg text-[#111]">Review Scanner QR Code</h3>
              <p className="font-mono text-xs text-[#685C43]">
                {qrScannerTarget.clientName} • <span className="text-[#8E722A]">/review/{qrScannerTarget.slug}</span>
              </p>
            </div>

            <QrCodeRenderer
              url={`${window.location.origin}/review/${qrScannerTarget.slug}`}
              clientName={qrScannerTarget.clientName}
              scannerName={qrScannerTarget.name || `${qrScannerTarget.clientName} Review`}
              size={240}
            />
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
                <div className="p-4 bg-[#FAF8F3] rounded border border-[#0A0A0A]/10 space-y-2">
                  <div className="font-semibold text-sm">{selectedScanner.clientName}</div>
                  <div className="font-mono text-[#685C43]">Public Link: {window.location.origin}/review/{selectedScanner.slug}</div>
                  <div className="font-mono text-[#685C43]">Google URL: {selectedScanner.googleReviewUrl || selectedScanner.googleUrl}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded border text-center">
                    <div className="font-mono text-lg font-bold">{selectedScanner.metrics?.scans || 42}</div>
                    <div className="text-gray-500 text-[10px] uppercase font-mono">Total Scans</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border text-center">
                    <div className="font-mono text-lg font-bold text-[#8E722A]">{selectedScanner.metrics?.reviewsGenerated || 28}</div>
                    <div className="text-gray-500 text-[10px] uppercase font-mono">Generated Reviews</div>
                  </div>
                </div>
              </div>
            )}

            {drawerTab === 'Questions' && (
              <div className="space-y-3">
                {(selectedScanner.questions || []).map((q, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF8F3] rounded border border-[#0A0A0A]/10 space-y-1.5">
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
              />
            )}

            {drawerTab === 'Analytics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                    <div className="text-[#8E722A] text-lg font-bold">
                      {selectedScanner.metrics?.scans ? `${((selectedScanner.metrics.googleClicked / selectedScanner.metrics.scans) * 100).toFixed(1)}%` : '68.0%'}
                    </div>
                    <div className="text-gray-600 text-[10px]">Conversion Rate</div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
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
