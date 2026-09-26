import React, { useEffect, useState } from 'react';
import { Search, X, Users, Inbox, Package, Kanban, ArrowUpRight } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useNavigate } from 'react-router-dom';

export const GlobalSearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, clients, enquiries, projects, packages } = useAdminData();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredClients = query.trim()
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.company.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredEnquiries = query.trim()
    ? enquiries.filter(
        (e) =>
          e.name.toLowerCase().includes(query.toLowerCase()) ||
          e.company.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredProjects = query.trim()
    ? projects.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const hasResults =
    filteredClients.length > 0 || filteredEnquiries.length > 0 || filteredProjects.length > 0;

  const handleSelect = (path) => {
    setIsSearchOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-[8px] border border-[#0A0A0A]/20 shadow-2xl overflow-hidden font-body text-xs">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#0A0A0A]/12 bg-[#F7F5EF]">
          <Search className="w-4 h-4 text-[#8E722A] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search clients, enquiries, projects, packages... (Press Esc to close)"
            className="w-full bg-transparent text-sm text-[#0A0A0A] placeholder-[#66615A] focus:outline-none font-body"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-[#66615A] hover:text-[#0A0A0A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {!query.trim() && (
            <div className="py-8 text-center text-[#66615A] text-xs">
              Type a client name, enquiry, or project title above to filter internal records.
            </div>
          )}

          {query.trim() && !hasResults && (
            <div className="py-8 text-center text-[#66615A] text-xs">
              No matching records found for "{query}".
            </div>
          )}

          {filteredClients.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-[#8E722A] uppercase font-bold tracking-widest block mb-2">
                CLIENTS ({filteredClients.length})
              </span>
              <div className="space-y-1">
                {filteredClients.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(`/admin/clients/${c.id}`)}
                    className="p-2.5 rounded-sm hover:bg-[#F7F5EF] flex items-center justify-between cursor-pointer border border-transparent hover:border-[#0A0A0A]/10"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-[#8E722A]" />
                      <div>
                        <span className="font-bold text-[#0A0A0A] block">{c.name}</span>
                        <span className="text-[11px] text-[#66615A]">{c.company} • {c.packageAssigned}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#8E722A]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredEnquiries.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-[#8E722A] uppercase font-bold tracking-widest block mb-2">
                LEADS & ENQUIRIES ({filteredEnquiries.length})
              </span>
              <div className="space-y-1">
                {filteredEnquiries.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => handleSelect(`/admin/enquiries`)}
                    className="p-2.5 rounded-sm hover:bg-[#F7F5EF] flex items-center justify-between cursor-pointer border border-transparent hover:border-[#0A0A0A]/10"
                  >
                    <div className="flex items-center gap-3">
                      <Inbox className="w-4 h-4 text-[#8E722A]" />
                      <div>
                        <span className="font-bold text-[#0A0A0A] block">{e.name}</span>
                        <span className="text-[11px] text-[#66615A]">{e.company} • {e.serviceRequested} ({e.status})</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#8E722A]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredProjects.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-[#8E722A] uppercase font-bold tracking-widest block mb-2">
                ACTIVE PROJECTS ({filteredProjects.length})
              </span>
              <div className="space-y-1">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(`/admin/projects`)}
                    className="p-2.5 rounded-sm hover:bg-[#F7F5EF] flex items-center justify-between cursor-pointer border border-transparent hover:border-[#0A0A0A]/10"
                  >
                    <div className="flex items-center gap-3">
                      <Kanban className="w-4 h-4 text-[#8E722A]" />
                      <div>
                        <span className="font-bold text-[#0A0A0A] block">{p.title}</span>
                        <span className="text-[11px] text-[#66615A]">{p.clientName} • Due {p.dueDate}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#8E722A]" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
