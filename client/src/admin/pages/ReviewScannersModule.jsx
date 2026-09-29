import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminCard } from '../components/ui/AdminCard';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { Pagination } from '../components/ui/Pagination';
import { KpiCard } from '../components/ui/KpiCard';
import { ModuleSkeleton } from '../components/ui/LoadingSkeleton';
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
} from 'lucide-react';

export const ReviewScannersModule = () => {
  const { reviewScanners, clients, addScanner, updateScanner, deleteScanner } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedScanner, setSelectedScanner] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('Overview'); // Overview | QRCode | Destination | AIResponse
  const [isScanning, setIsScanning] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPublicPreviewOpen, setIsPublicPreviewOpen] = useState(false);
  const [confirmStatusModal, setConfirmStatusModal] = useState({ isOpen: false, scanner: null });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Feedback Toast
  const [feedback, setFeedback] = useState({ show: false, message: '' });

  // Form State for Create Scanner
  const [createForm, setCreateForm] = useState({
    clientName: clients[0]?.name || 'Aura Luxury Beauty',
    placeName: 'Aura Flagship Salon & Spa - Bandra',
    placeId: 'ChIJN1t_t_x55zsR9999',
    googleUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_t_x55zsR9999',
    frequency: 'Daily (Every 24 Hours)',
    alertThreshold: 'Rating below 4.0',
  });

  // Destination URL Config Form State
  const [destinationUrlInput, setDestinationUrlInput] = useState('');
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [urlError, setUrlError] = useState('');

  // AI Response Generator State
  const [sampleReviewIndex, setSampleReviewIndex] = useState(0);
  const [aiTone, setAiTone] = useState('Editorial & Luxury');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [editedAiResponse, setEditedAiResponse] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const sampleReviews = [
    {
      author: 'Elena Rostova',
      rating: 5,
      date: 'Yesterday',
      text: 'The brand aesthetic and digital service level is unmatched! Exceptional ambiance and staff attention to detail.',
    },
    {
      author: 'Vikram Malhotra',
      rating: 3,
      date: '3 days ago',
      text: 'Good experience overall, but the appointment delay was roughly 20 minutes. Hope scheduling improves.',
    },
    {
      author: 'Ananya Sharma',
      rating: 1,
      date: '1 week ago',
      text: 'Extremely disappointing follow-up regarding our custom order inquiry. Expected much better from ASN Media client standards.',
    },
  ];

  const aiPresetResponses = {
    'Editorial & Luxury': [
      "Dear Elena, We are deeply honored by your gracious compliments. Curating an exceptional aesthetic experience remains our guiding commitment. We look forward to welcoming you back.",
      "Dear Vikram, Thank you for sharing your valued feedback. While we are pleased you enjoyed our ambiance, we regret the delay in your schedule. We are actively refining our conciergerie protocol.",
      "Dear Ananya, Please accept our sincere apologies for not meeting the luxury standard you rightfully expect. Our executive management is personally inspecting your account to ensure an immediate resolution."
    ],
    'Warm & Professional': [
      "Hi Elena! Thank you so much for the glowing 5-star review! Our team is thrilled to hear you had such a wonderful experience.",
      "Hi Vikram, thanks for letting us know! We apologize for the wait time you experienced and appreciate your patience as we streamline our appointment system.",
      "Hi Ananya, we are truly sorry to hear about your experience. Your satisfaction is our priority and we'd love the opportunity to make this right immediately."
    ]
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, location.pathname]);

  useEffect(() => {
    if (selectedScanner) {
      setDestinationUrlInput(
        selectedScanner.googleUrl || `https://search.google.com/local/writereview?placeid=${selectedScanner.placeId}`
      );
      setEditedAiResponse(
        aiPresetResponses[aiTone][sampleReviewIndex] || aiPresetResponses['Editorial & Luxury'][0]
      );
    }
  }, [selectedScanner, sampleReviewIndex, aiTone]);

  const showToast = (message) => {
    setFeedback({ show: true, message });
    setTimeout(() => setFeedback({ show: false, message: '' }), 3000);
  };

  const filteredScanners = (reviewScanners || []).filter((scn) => {
    const matchesSearch =
      scn.clientName.toLowerCase().includes(search.toLowerCase()) ||
      scn.placeName.toLowerCase().includes(search.toLowerCase()) ||
      scn.placeId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || scn.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredScanners.length / pageSize) || 1;
  const paginatedScanners = filteredScanners.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleRowClick = (scn) => {
    setSelectedScanner(scn);
    setDrawerTab('Overview');
    setIsDrawerOpen(true);
  };

  const handleManualScan = (scannerId) => {
    setIsScanning(true);
    setTimeout(() => {
      updateScanner(scannerId, {
        totalReviewsScraped: (selectedScanner?.totalReviewsScraped || 10) + 3,
        lastScanDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      });
      if (selectedScanner && selectedScanner.id === scannerId) {
        setSelectedScanner((prev) => ({
          ...prev,
          totalReviewsScraped: prev.totalReviewsScraped + 3,
          lastScanDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
        }));
      }
      setIsScanning(false);
      showToast('Scan complete! Synced 3 new Google Place reviews.');
    }, 1000);
  };

  const isCreateScannerMode = location.pathname.endsWith('/scanners/create') || isCreateModalOpen;

  const handleOpenCreateScanner = () => {
    setIsCreateModalOpen(true);
    navigate('/admin/scanners/create');
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    addScanner(createForm);
    setIsCreateModalOpen(false);
    navigate('/admin/scanners');
    showToast('New Review Scanner deployed successfully!');
  };

  const handleSaveDestinationUrl = () => {
    if (!destinationUrlInput.startsWith('http://') && !destinationUrlInput.startsWith('https://')) {
      setUrlError('URL must begin with http:// or https://');
      return;
    }
    setUrlError('');
    updateScanner(selectedScanner.id, { googleUrl: destinationUrlInput });
    setSelectedScanner((prev) => ({ ...prev, googleUrl: destinationUrlInput }));
    setIsEditingDestination(false);
    showToast('Google Review Destination URL saved!');
  };

  const handleToggleScannerStatus = () => {
    if (!confirmStatusModal.scanner) return;
    const newStatus = confirmStatusModal.scanner.status === 'Active' ? 'Paused' : 'Active';
    updateScanner(confirmStatusModal.scanner.id, { status: newStatus });
    if (selectedScanner && selectedScanner.id === confirmStatusModal.scanner.id) {
      setSelectedScanner((prev) => ({ ...prev, status: newStatus }));
    }
    setConfirmStatusModal({ isOpen: false, scanner: null });
    showToast(`Scanner status updated to ${newStatus}.`);
  };

  const handleGenerateAiResponse = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const presets = aiPresetResponses[aiTone] || aiPresetResponses['Editorial & Luxury'];
      setEditedAiResponse(presets[sampleReviewIndex]);
      setIsGeneratingAi(false);
      showToast('Generated new AI response recommendation!');
    }, 600);
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    showToast('Copied to clipboard!');
  };

  const columns = [
    {
      header: 'Place / Business Unit',
      key: 'placeName',
      render: (row) => (
        <div>
          <div className="font-semibold text-[#111111] flex items-center gap-1.5 cursor-pointer hover:text-[#8E722A]" onClick={() => handleRowClick(row)}>
            <MapPin className="w-3.5 h-3.5 text-[#8E722A] shrink-0" />
            <span>{row.placeName}</span>
          </div>
          <div className="text-[10px] text-[#685C43] font-mono ml-5">ID: {row.placeId}</div>
        </div>
      ),
    },
    {
      header: 'Assigned Client',
      key: 'clientName',
      render: (row) => <span className="font-mono text-xs text-[#111111]">{row.clientName}</span>,
    },
    {
      header: 'Avg Rating',
      key: 'avgRating',
      render: (row) => (
        <div className="flex items-center gap-1 font-mono font-bold text-[#111111]">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{row.avgRating}</span>
        </div>
      ),
    },
    {
      header: 'Reviews Scraped',
      key: 'totalReviewsScraped',
      render: (row) => <span className="font-mono text-[#685C43] text-xs">{row.totalReviewsScraped} reviews</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleManualScan(row.id)}
            disabled={isScanning}
            className="px-2.5 py-1 text-[10px] font-mono font-semibold bg-[#FAF8F3] border border-[#0A0A0A]/14 hover:bg-[#111111] hover:text-[#FAF8F3] text-[#111111] rounded-xs transition-colors flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin text-[#8E722A]' : ''}`} />
            <span>Scan</span>
          </button>
          <button
            onClick={() => handleRowClick(row)}
            className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#8E722A] text-white hover:bg-[#725B20] rounded-xs transition-colors"
          >
            Inspect
          </button>
        </div>
      ),
    },
  ];

  if (isCreateScannerMode) {
    return (
      <div className="w-full space-y-6 font-body">
        {feedback.show && (
          <div className="fixed top-4 right-4 z-50 bg-[#111111] text-[#F7F5EF] px-4 py-3 rounded-md shadow-xl font-mono text-xs flex items-center gap-2 border border-[#8E722A]">
            <CheckCircle2 className="w-4 h-4 text-[#8E722A]" />
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#0A0A0A]/08 gap-3">
          <div>
            <div className="text-xs font-mono text-[#685C43] mb-1">
              <span>Review Scanners</span> / <span className="font-bold text-[#111111]">Deploy Scanner</span>
            </div>
            <h2 className="font-display text-2xl font-normal text-[#111111]">
              Deploy New Google Review Scanner Monitor
            </h2>
          </div>

          <button
            onClick={() => { setIsCreateModalOpen(false); navigate('/admin/scanners'); }}
            className="px-3.5 py-1.5 text-xs font-mono font-bold bg-[#FAF8F3] hover:bg-[#8E722A] hover:text-white border border-[#0A0A0A]/12 text-[#111111] rounded-xs transition-colors"
          >
            ← Back to Scanners
          </button>
        </div>

        <form onSubmit={handleCreateSubmit} className="space-y-6">
          <AdminCard title="01. Client & Business Unit Identity" className="space-y-4">
            <FormSelect
              label="Assigned Client"
              value={createForm.clientName}
              onChange={(e) => setCreateForm({ ...createForm, clientName: e.target.value })}
              options={clients.map((c) => c.name)}
            />

            <FormInput
              label="Google Place Name / Business Unit"
              value={createForm.placeName}
              onChange={(e) => setCreateForm({ ...createForm, placeName: e.target.value })}
              placeholder="e.g. Aura Flagship Salon & Spa - Bandra"
              required
            />
          </AdminCard>

          <AdminCard title="02. Google Integration Parameters" className="space-y-4">
            <FormInput
              label="Google Place ID"
              value={createForm.placeId}
              onChange={(e) => setCreateForm({ ...createForm, placeId: e.target.value })}
              placeholder="ChIJN1t_t_x55zsR9999..."
              required
            />

            <FormInput
              label="Target Google Destination Review URL"
              value={createForm.googleUrl}
              onChange={(e) => setCreateForm({ ...createForm, googleUrl: e.target.value })}
              placeholder="https://search.google.com/local/writereview?placeid=..."
              required
            />
          </AdminCard>

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
              className="px-6 py-2.5 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors"
            >
              Deploy Review Scanner
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-body">
      {/* Toast Feedback */}
      {feedback.show && (
        <div className="fixed top-4 right-4 z-50 bg-[#111111] text-[#F7F5EF] px-4 py-3 rounded-md shadow-xl font-mono text-xs flex items-center gap-2 border border-[#8E722A] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#8E722A]" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Quick Stats Summary Grid (4 Cards - Stage 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="ACTIVE SCANNERS"
          value={reviewScanners.length}
          trend={2}
          trendLabel="google place monitors"
          icon={Star}
          accentColor="gold"
        />
        <KpiCard
          label="AVERAGE RATING"
          value="4.8 / 5.0"
          trend={5}
          trendLabel="across client places"
          icon={Sparkles}
          accentColor="amber"
        />
        <KpiCard
          label="POSITIVE SENTIMENT"
          value="94.2%"
          trend={3}
          trendLabel="positive review ratio"
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <KpiCard
          label="TOTAL REVIEWS SCRAPED"
          value="680+"
          trend={14}
          trendLabel="scraped feedback items"
          icon={RefreshCw}
          accentColor="charcoal"
        />
      </div>

      {/* Controls Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search place name, client, or Place ID..."
        filterOptions={['All', 'Active', 'Paused']}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        actions={
          <button
            onClick={handleOpenCreateScanner}
            className="px-3.5 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Scanner</span>
          </button>
        }
      />

      {/* Main Scanners Table */}
      <AdminCard noPadding>
        <DataTable
          columns={columns}
          data={paginatedScanners}
          onRowClick={handleRowClick}
          emptyTitle="No Review Scanners Configured"
          emptyMessage="Deploy a new scanner to monitor Google Place ratings."
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredScanners.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setPageSize}
        />
      </AdminCard>

      {/* ========================================================= */}
      {/* SCANNER WORKSPACE SLIDE DRAWER (WITH 4 ADVANCED TABS)      */}
      {/* ========================================================= */}
      <SlideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedScanner ? selectedScanner.placeName : 'Scanner Workspace'}
      >
        {selectedScanner && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="p-4 bg-[#F7F5EF] rounded-sm border border-[#0A0A0A]/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#685C43]">Client: {selectedScanner.clientName}</span>
                <StatusBadge status={selectedScanner.status} />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-mono text-[#685C43]">Google Rating</span>
                <div className="flex items-center gap-1 text-base font-bold font-mono text-[#111111]">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{selectedScanner.avgRating} / 5.0</span>
                </div>
              </div>
            </div>

            {/* Contextual Navigation Tabs */}
            <div className="flex border-b border-[#0A0A0A]/10 overflow-x-auto no-scrollbar font-mono text-xs">
              {[
                { id: 'Overview', label: 'Overview' },
                { id: 'QRCode', label: 'QR Generator' },
                { id: 'Destination', label: 'Google Link' },
                { id: 'AIResponse', label: 'AI Assistant' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDrawerTab(tab.id)}
                  className={`px-3 py-2 border-b-2 font-bold whitespace-nowrap transition-colors ${
                    drawerTab === tab.id
                      ? 'border-[#8E722A] text-[#8E722A]'
                      : 'border-transparent text-[#685C43] hover:text-[#111111]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {drawerTab === 'Overview' && (
              <div className="space-y-4 text-xs font-body">
                <div className="space-y-2">
                  <h4 className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider">Sentiment Spectrum</h4>
                  <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs space-y-2 font-mono">
                    <div>
                      <div className="flex justify-between text-[10px] text-[#685C43]">
                        <span>Positive (5 Stars)</span>
                        <span className="font-bold text-emerald-700">{selectedScanner.sentimentPctPositive}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#FAF8F3] rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${selectedScanner.sentimentPctPositive}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider">Google Place Metadata</h4>
                  <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between border-b border-[#0A0A0A]/06 pb-1">
                      <span className="text-[#685C43]">Google Place ID</span>
                      <span className="font-bold text-[#111111]">{selectedScanner.placeId}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#0A0A0A]/06 pb-1">
                      <span className="text-[#685C43]">Last Automatic Scan</span>
                      <span className="text-[#111111]">{selectedScanner.lastScanDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#685C43]">Scanner State</span>
                      <span className="font-bold text-[#111111]">{selectedScanner.status}</span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Button */}
                <div className="pt-4 border-t border-[#0A0A0A]/10 flex gap-2">
                  <button
                    onClick={() => setConfirmStatusModal({ isOpen: true, scanner: selectedScanner })}
                    className={`w-full py-2.5 text-xs font-mono font-bold rounded-xs transition-colors flex items-center justify-center gap-2 border ${
                      selectedScanner.status === 'Active'
                        ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>{selectedScanner.status === 'Active' ? 'Pause Review Scanner' : 'Activate Scanner'}</span>
                  </button>
                  <button
                    onClick={() => setIsPublicPreviewOpen(true)}
                    className="py-2.5 px-4 bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] text-xs font-mono font-bold rounded-xs transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Public Preview</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: QR CODE GENERATOR */}
            {drawerTab === 'QRCode' && (
              <div className="space-y-4 font-body">
                <div className="p-4 bg-white border border-[#0A0A0A]/10 rounded-sm text-center space-y-3">
                  <div className="inline-block p-4 bg-[#FAF8F3] border-2 border-[#8E722A]/30 rounded-lg shadow-sm">
                    {/* Visual QR Code Representation */}
                    <div className="w-40 h-40 bg-[#111111] p-2 rounded-xs flex flex-col justify-between items-center relative overflow-hidden">
                      <div className="grid grid-cols-5 gap-1.5 w-full h-full p-1 bg-white rounded-2xs">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-2xs ${
                              (i * 7) % 3 === 0 || i === 0 || i === 4 || i === 20 || i === 24
                                ? 'bg-[#111111]'
                                : 'bg-[#FAF8F3]'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-[#8E722A] text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-2xs shadow-md">
                          ASN
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif font-semibold text-sm text-[#111111]">{selectedScanner.placeName}</h4>
                    <p className="text-[11px] font-mono text-[#685C43]">Google Review QR Code Card</p>
                  </div>

                  <div className="flex justify-center gap-2 pt-2 border-t border-[#0A0A0A]/08">
                    <button
                      onClick={() => showToast('QR Code SVG downloaded successfully!')}
                      className="px-3 py-1.5 bg-[#111111] text-white text-xs font-mono font-bold rounded-xs hover:bg-[#8E722A] transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download QR (PNG)</span>
                    </button>
                    <button
                      onClick={() => handleCopyText(`https://asnmedia.in/scanner/${selectedScanner.id}`)}
                      className="px-3 py-1.5 bg-[#FAF8F3] border border-[#0A0A0A]/14 text-xs font-mono font-bold text-[#111111] hover:bg-[#8E722A] hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GOOGLE DESTINATION CONFIG */}
            {drawerTab === 'Destination' && (
              <div className="space-y-4 font-body">
                <div className="p-4 bg-white border border-[#0A0A0A]/10 rounded-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">Configured Google Review URL</span>
                    {!isEditingDestination && (
                      <button
                        onClick={() => setIsEditingDestination(true)}
                        className="text-xs font-mono text-[#8E722A] font-bold flex items-center gap-1 hover:underline"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit URL</span>
                      </button>
                    )}
                  </div>

                  {isEditingDestination ? (
                    <div className="space-y-3 pt-2">
                      <FormInput
                        label="Target Google Destination URL"
                        value={destinationUrlInput}
                        onChange={(e) => setDestinationUrlInput(e.target.value)}
                        placeholder="https://search.google.com/local/writereview?placeid=..."
                        error={urlError}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setIsEditingDestination(false); setUrlError(''); }}
                          className="px-3 py-1.5 text-xs font-mono text-[#685C43]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveDestinationUrl}
                          className="px-3 py-1.5 bg-[#8E722A] text-white text-xs font-mono font-bold rounded-xs hover:bg-[#725B20] transition-colors"
                        >
                          Save Target URL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#FAF8F3] border border-[#0A0A0A]/08 rounded-xs font-mono text-xs text-[#111111] break-all flex items-center justify-between gap-2">
                      <span className="truncate">{selectedScanner.googleUrl || `https://search.google.com/local/writereview?placeid=${selectedScanner.placeId}`}</span>
                      <a
                        href={selectedScanner.googleUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#8E722A] hover:text-[#111111]"
                      >
                        <ExternalLink className="w-4 h-4 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: MOCK AI RESPONSE ASSISTANT */}
            {drawerTab === 'AIResponse' && (
              <div className="space-y-4 font-body">
                <div className="p-4 bg-white border border-[#0A0A0A]/10 rounded-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#8E722A] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Review Response Suite (Frontend Mock)</span>
                    </span>
                  </div>

                  {/* Sample review selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#685C43] uppercase font-bold">Select Sample Customer Review</label>
                    <select
                      value={sampleReviewIndex}
                      onChange={(e) => setSampleReviewIndex(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono bg-[#FAF8F3] border border-[#0A0A0A]/14 rounded-xs text-[#111111]"
                    >
                      {sampleReviews.map((r, i) => (
                        <option key={i} value={i}>{r.author} ({r.rating}★) - "{r.text.substring(0, 30)}..."</option>
                      ))}
                    </select>
                  </div>

                  {/* Customer Review Snippet */}
                  <div className="p-3 bg-[#FAF8F3] border border-[#0A0A0A]/08 rounded-xs space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-[10px] text-[#685C43]">
                      <span className="font-bold text-[#111111]">{sampleReviews[sampleReviewIndex].author}</span>
                      <span className="text-amber-500 font-bold">{sampleReviews[sampleReviewIndex].rating}★</span>
                    </div>
                    <p className="italic font-serif text-[#111111]">"{sampleReviews[sampleReviewIndex].text}"</p>
                  </div>

                  {/* Tone selector */}
                  <div className="grid grid-cols-2 gap-2">
                    <FormSelect
                      label="Response Tone"
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      options={['Editorial & Luxury', 'Warm & Professional']}
                    />
                    <div className="flex items-end">
                      <button
                        onClick={handleGenerateAiResponse}
                        disabled={isGeneratingAi}
                        className="w-full py-2 bg-[#111111] text-white hover:bg-[#8E722A] text-xs font-mono font-bold rounded-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin text-[#8E722A]' : ''}`} />
                        <span>Regenerate AI</span>
                      </button>
                    </div>
                  </div>

                  {/* Editable AI Suggestion */}
                  <div className="space-y-1 pt-2 border-t border-[#0A0A0A]/08">
                    <label className="text-[10px] font-mono text-[#685C43] uppercase font-bold">Suggested Response Recommendation</label>
                    <textarea
                      rows={4}
                      value={editedAiResponse}
                      onChange={(e) => setEditedAiResponse(e.target.value)}
                      className="w-full p-3 text-xs font-body border border-[#0A0A0A]/14 rounded-xs focus:outline-none focus:border-[#8E722A]"
                    />
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleCopyText(editedAiResponse)}
                        className="px-3 py-1.5 bg-[#8E722A] text-white text-xs font-mono font-bold rounded-xs hover:bg-[#725B20] transition-colors flex items-center gap-1"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied Response!' : 'Copy to Clipboard'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </SlideDrawer>

      {/* PUBLIC REVIEW SCANNER LANDING PAGE PREVIEW DRAWER */}
      <SlideDrawer
        isOpen={isPublicPreviewOpen}
        onClose={() => setIsPublicPreviewOpen(false)}
        title="Public Review Scanner Landing Experience (Live Preview)"
        subtitle={selectedScanner?.placeName}
      >
        {selectedScanner && (
          <div className="p-6 bg-[#FAF8F3] border border-[#0A0A0A]/10 rounded-lg text-center space-y-6 max-w-sm mx-auto shadow-xl">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#111111] text-[#8E722A] font-serif text-lg font-bold flex items-center justify-center mx-auto border border-[#8E722A]">
                ASN
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8E722A] font-bold block">
                ASN MEDIA CONCIERGERIE
              </span>
              <h3 className="font-serif font-bold text-xl text-[#111111]">
                {selectedScanner.placeName}
              </h3>
              <p className="text-xs font-body text-[#685C43]">
                Your feedback elevates our craftsmanship. Please rate your recent experience below.
              </p>
            </div>

            {/* Star Selector UI */}
            <div className="p-4 bg-white border border-[#0A0A0A]/08 rounded-md space-y-3">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} className="p-2 text-amber-500 hover:scale-125 transition-transform">
                    <Star className="w-6 h-6 fill-amber-500" />
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-mono text-[#685C43] block">Tap a star to leave a review</span>
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/08">
              <button
                onClick={() => {
                  showToast('Simulating direct redirect to Google Review page!');
                  setIsPublicPreviewOpen(false);
                }}
                className="w-full py-3 bg-[#111111] text-white hover:bg-[#8E722A] font-mono text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Write Google Review</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </SlideDrawer>

      {/* CONFIRM SCANNER STATUS DIALOG */}
      <ConfirmDialog
        isOpen={confirmStatusModal.isOpen}
        onClose={() => setConfirmStatusModal({ isOpen: false, scanner: null })}
        onConfirm={handleToggleScannerStatus}
        title={`${confirmStatusModal.scanner?.status === 'Active' ? 'Pause' : 'Activate'} Review Scanner`}
        message={`Are you sure you want to change the monitoring status of "${confirmStatusModal.scanner?.placeName}" to ${confirmStatusModal.scanner?.status === 'Active' ? 'Paused' : 'Active'}?`}
        confirmText="Confirm Status Update"
      />
    </div>
  );
};

