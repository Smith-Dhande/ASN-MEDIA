import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminCard } from '../components/ui/AdminCard';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { Star, RefreshCw, Plus, CheckCircle2, Search, MapPin, AlertCircle, BarChart2 } from 'lucide-react';

export const ReviewScannersModule = () => {
  const { reviewScanners: initialScanners } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [scanners, setScanners] = useState(initialScanners || []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedScanner, setSelectedScanner] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Form state for Create Scanner
  const [createForm, setCreateForm] = useState({
    clientName: 'Aura Luxury Beauty',
    placeName: 'Aura Flagship Salon & Spa',
    placeId: 'ChIJN1t_t_x55zsR9999',
    frequency: 'Daily (Every 24 Hours)',
    alertThreshold: 'Rating below 4.0',
  });
  const [createSuccess, setCreateSuccess] = useState(false);

  // Path modes
  const isCreateMode = location.pathname.endsWith('/create');

  // Filter scanners
  const filteredScanners = scanners.filter((scn) => {
    const matchesSearch =
      scn.clientName.toLowerCase().includes(search.toLowerCase()) ||
      scn.placeName.toLowerCase().includes(search.toLowerCase()) ||
      scn.placeId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || scn.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (scn) => {
    setSelectedScanner(scn);
    setIsDrawerOpen(true);
  };

  const handleManualScan = (scannerId) => {
    setIsScanning(true);
    setTimeout(() => {
      setScanners((prev) =>
        prev.map((s) =>
          s.id === scannerId
            ? {
                ...s,
                totalReviewsScraped: s.totalReviewsScraped + 3,
                lastScanDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
              }
            : s
        )
      );
      if (selectedScanner && selectedScanner.id === scannerId) {
        setSelectedScanner((prev) => ({
          ...prev,
          totalReviewsScraped: prev.totalReviewsScraped + 3,
          lastScanDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
        }));
      }
      setIsScanning(false);
    }, 1000);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newScanner = {
      id: `scn_${Date.now()}`,
      clientName: createForm.clientName,
      placeName: createForm.placeName,
      placeId: createForm.placeId,
      avgRating: 4.9,
      totalReviewsScraped: 12,
      sentimentPctPositive: 95,
      status: 'Active',
      lastScanDate: 'Just now',
    };
    setScanners([newScanner, ...scanners]);
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      navigate('/admin/scanners');
    }, 1200);
  };

  const columns = [
    {
      header: 'Place / Business Unit',
      key: 'placeName',
      render: (row) => (
        <div>
          <div className="font-semibold text-[#111111] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#8E722A] shrink-0" />
            <span>{row.placeName}</span>
          </div>
          <div className="text-[10px] text-[#66615A] font-mono ml-5">ID: {row.placeId}</div>
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
      render: (row) => (
        <span className="font-mono text-[#66615A] text-xs">{row.totalReviewsScraped} reviews</span>
      ),
    },
    {
      header: 'Positive Sentiment',
      key: 'sentimentPctPositive',
      render: (row) => (
        <div className="w-32">
          <div className="flex justify-between text-[10px] font-mono mb-1 text-[#66615A]">
            <span>Positive</span>
            <span className="font-bold text-emerald-700">{row.sentimentPctPositive}%</span>
          </div>
          <div className="w-full bg-[#0A0A0A]/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full"
              style={{ width: `${row.sentimentPctPositive}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Last Scan',
      key: 'lastScanDate',
      render: (row) => (
        <span className="font-mono text-[11px] text-[#66615A]">{row.lastScanDate}</span>
      ),
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
            className="px-2.5 py-1 text-[10px] font-mono font-semibold bg-[#F7F5EF] border border-[#0A0A0A]/14 hover:bg-[#0A0A0A] hover:text-[#F7F5EF] text-[#111111] rounded-xs transition-colors flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin text-[#8E722A]' : ''}`} />
            <span>Scan Now</span>
          </button>
          <button
            onClick={() => handleRowClick(row)}
            className="px-2 py-1 text-[10px] font-mono text-[#8E722A] hover:text-[#111111]"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <AdminCard className="p-4 border-l-4 border-l-[#8E722A]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#66615A]">Active Scanners</div>
          <div className="text-2xl font-bold font-mono text-[#111111] mt-1">{scanners.length} Monitors</div>
        </AdminCard>
        <AdminCard className="p-4 border-l-4 border-l-amber-500">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#66615A]">Average Rating</div>
          <div className="text-2xl font-bold font-mono text-[#111111] mt-1 flex items-center gap-1.5">
            <span>4.8</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
        </AdminCard>
        <AdminCard className="p-4 border-l-4 border-l-emerald-600">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#66615A]">Positive Sentiment</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">92.3%</div>
        </AdminCard>
        <AdminCard className="p-4 border-l-4 border-l-[#111111]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#66615A]">Total Scraped</div>
          <div className="text-2xl font-bold font-mono text-[#111111] mt-1">540 Reviews</div>
        </AdminCard>
      </div>

      {isCreateMode ? (
        /* Create Scanner Form view */
        <AdminCard className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#0A0A0A]/10 pb-4">
            <div>
              <h2 className="font-serif font-semibold text-xl text-[#111111]">Create New Review Scanner</h2>
              <p className="text-xs text-[#66615A] font-body mt-0.5">
                Configure automated review monitoring for a client's Google Business profile.
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/scanners')}
              className="text-xs font-mono text-[#66615A] hover:text-[#111111]"
            >
              ← Back to All Scanners
            </button>
          </div>

          {createSuccess ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <div className="font-serif text-xl font-semibold text-[#111111]">Scanner Configured!</div>
              <p className="text-xs font-mono text-[#66615A]">Redirecting to scanner management dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <FormSelect
                label="Assigned Client"
                value={createForm.clientName}
                onChange={(e) => setCreateForm({ ...createForm, clientName: e.target.value })}
                options={[
                  'Aura Luxury Beauty',
                  'Vanguard Architecture',
                  'Kalon Artisanal Apparel',
                  'Solace Hospitality Group',
                  'Elysian Fine Jewelry',
                ]}
              />

              <FormInput
                label="Google Place Name / Business Unit"
                value={createForm.placeName}
                onChange={(e) => setCreateForm({ ...createForm, placeName: e.target.value })}
                placeholder="e.g. Aura Flagship Studio - Worli"
                required
              />

              <FormInput
                label="Google Place ID or Google Maps URL"
                value={createForm.placeId}
                onChange={(e) => setCreateForm({ ...createForm, placeId: e.target.value })}
                placeholder="ChIJ..."
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Scan Frequency"
                  value={createForm.frequency}
                  onChange={(e) => setCreateForm({ ...createForm, frequency: e.target.value })}
                  options={[
                    'Daily (Every 24 Hours)',
                    'Twice Weekly',
                    'Weekly (Every Monday)',
                    'Real-time Webhook Sync',
                  ]}
                />

                <FormSelect
                  label="Low Rating Alert Threshold"
                  value={createForm.alertThreshold}
                  onChange={(e) => setCreateForm({ ...createForm, alertThreshold: e.target.value })}
                  options={[
                    'Rating below 4.0',
                    'Rating below 3.0',
                    'Any 1-Star Review',
                    'Disable Alerts',
                  ]}
                />
              </div>

              <div className="pt-4 border-t border-[#0A0A0A]/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/scanners')}
                  className="px-4 py-2 text-xs font-mono text-[#66615A] hover:text-[#111111]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono font-bold bg-[#8E722A] hover:bg-[#725B20] text-white rounded-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Deploy Review Scanner</span>
                </button>
              </div>
            </form>
          )}
        </AdminCard>
      ) : (
        /* All Scanners List view */
        <>
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by place name, client, or Place ID..."
            filterOptions={['All', 'Active', 'Paused']}
            selectedFilter={statusFilter}
            onFilterChange={setStatusFilter}
            actions={
              <button
                onClick={() => navigate('/admin/scanners/create')}
                className="px-3.5 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Scanner</span>
              </button>
            }
          />

          <DataTable
            columns={columns}
            data={filteredScanners}
            onRowClick={handleRowClick}
            emptyTitle="No Review Scanners Configured"
            emptyMessage="Create a new scanner monitor to start tracking Google Place reviews."
          />
        </>
      )}

      {/* Scanner Detail View Drawer */}
      <SlideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedScanner ? `Scanner Monitor: ${selectedScanner.placeName}` : 'Scanner View'}
      >
        {selectedScanner && (
          <div className="space-y-6">
            <div className="p-4 bg-[#F7F5EF] rounded-sm border border-[#0A0A0A]/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#66615A]">Assigned Client</span>
                <span className="font-mono font-semibold text-[#111111]">{selectedScanner.clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#66615A]">Current Rating</span>
                <div className="flex items-center gap-1 text-lg font-bold font-mono text-[#111111]">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{selectedScanner.avgRating} / 5.0</span>
                </div>
              </div>
            </div>

            {/* Sentiment breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#8E722A] font-bold">
                Sentiment Distribution
              </h4>
              <div className="p-3 bg-white border border-[#0A0A0A]/10 rounded-xs space-y-2 text-xs font-body">
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-[#66615A] mb-1">
                    <span>5 Stars / Positive</span>
                    <span className="font-bold text-emerald-700">{selectedScanner.sentimentPctPositive}%</span>
                  </div>
                  <div className="w-full bg-[#0A0A0A]/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${selectedScanner.sentimentPctPositive}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-[#66615A] mb-1">
                    <span>3-4 Stars / Neutral</span>
                    <span className="font-bold text-amber-600">{100 - selectedScanner.sentimentPctPositive - 3}%</span>
                  </div>
                  <div className="w-full bg-[#0A0A0A]/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${100 - selectedScanner.sentimentPctPositive - 3}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-[#66615A] mb-1">
                    <span>1-2 Stars / Negative</span>
                    <span className="font-bold text-red-600">3%</span>
                  </div>
                  <div className="w-full bg-[#0A0A0A]/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: '3%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Recent Reviews */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#8E722A] font-bold">
                Recent Scraped Excerpts
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-[#F7F5EF]/60 border border-[#0A0A0A]/08 rounded-xs text-xs space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#66615A]">
                    <span className="font-bold text-[#111111]">Rohit D.</span>
                    <span className="text-amber-500 flex items-center">★★★★★</span>
                  </div>
                  <p className="text-[#111111] italic font-serif">
                    "Exceptional aesthetic atmosphere and prompt service. Highly impressed!"
                  </p>
                </div>
                <div className="p-3 bg-[#F7F5EF]/60 border border-[#0A0A0A]/08 rounded-xs text-xs space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#66615A]">
                    <span className="font-bold text-[#111111]">Pooja S.</span>
                    <span className="text-amber-500 flex items-center">★★★★★</span>
                  </div>
                  <p className="text-[#111111] italic font-serif">
                    "Great experience, staff was friendly and attentive to details."
                  </p>
                </div>
              </div>
            </div>

            {/* Action manual scan button */}
            <div className="pt-4 border-t border-[#0A0A0A]/10">
              <button
                onClick={() => handleManualScan(selectedScanner.id)}
                disabled={isScanning}
                className="w-full py-2.5 bg-[#111111] hover:bg-[#8E722A] text-[#F7F5EF] text-xs font-mono font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Syncing Google Place Reviews...' : 'Trigger Immediate Scan Sync'}</span>
              </button>
            </div>
          </div>
        )}
      </SlideDrawer>
    </div>
  );
};
