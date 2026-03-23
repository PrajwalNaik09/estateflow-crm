import React, { useEffect, useState, useMemo } from 'react';
import { fetchLeadsFromSheet } from './services/sheetService';
import { Lead, LeadStatus, TimeFilter } from './types';
import StatCard from './components/StatCard';
import LeadRow from './components/LeadRow';
import DatePicker from './components/DatePicker';
import MonthPicker from './components/MonthPicker';
import PropertiesView from './components/PropertiesView';
import AnalyticsView from './components/AnalyticsView';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  RefreshCw, 
  Filter, 
  Bell, 
  PhoneMissed,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';

const STORAGE_KEY = 'estateflow_crm_data_v1';

type Tab = 'leads' | 'properties' | 'analytics';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('Daily');
  const [searchQuery, setSearchQuery] = useState('');

  const [dateFilter, setDateFilter] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  
  const [monthFilter, setMonthFilter] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const sheetData = await fetchLeadsFromSheet();
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (savedData) {
        const overrides = JSON.parse(savedData);
        const mergedData = sheetData.map(lead => {
          const savedLead = overrides[lead.id];
          if (savedLead) {
            return {
              ...lead,
              status: savedLead.status || lead.status,
              contactedPhone: savedLead.contactedPhone !== undefined ? savedLead.contactedPhone : lead.contactedPhone,
              contactedEmail: savedLead.contactedEmail !== undefined ? savedLead.contactedEmail : lead.contactedEmail
            };
          }
          return lead;
        });
        setLeads(mergedData);
        
        if (sheetData.length > 0) {
          const latestDate = sheetData[0].date;
          const latestStr = `${latestDate.getFullYear()}-${String(latestDate.getMonth() + 1).padStart(2, '0')}-${String(latestDate.getDate()).padStart(2, '0')}`;
          setDateFilter(latestStr);
        }
      } else {
        setLeads(sheetData);
      }
    } catch (e) {
      console.error("Failed to load data", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const persistChanges = (currentLeads: Lead[]) => {
    const overrides: Record<string, any> = {};
    currentLeads.forEach(l => {
      if (l.status !== LeadStatus.NEW || l.contactedPhone || l.contactedEmail) {
        overrides[l.id] = {
          status: l.status,
          contactedPhone: l.contactedPhone,
          contactedEmail: l.contactedEmail
        };
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  };

  const stats = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const uncontacted = leads.filter(l => l.status === LeadStatus.NEW).length;

    return {
      daily: leads.filter(l => l.date >= startOfDay).length,
      weekly: leads.filter(l => l.date >= startOfWeek).length,
      monthly: leads.filter(l => l.date >= startOfMonth).length,
      uncontacted: uncontacted,
      uncontactedRate: leads.length > 0 ? (uncontacted / leads.length) * 100 : 0
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let result = leads;

    if (selectedFilter === 'Daily') {
      result = result.filter(l => {
        const leadDateStr = `${l.date.getFullYear()}-${String(l.date.getMonth() + 1).padStart(2, '0')}-${String(l.date.getDate()).padStart(2, '0')}`;
        return leadDateStr === dateFilter;
      });
    } else if (selectedFilter === 'Weekly') {
      const now = new Date();
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      result = result.filter(l => l.date >= startOfWeek);
    } else if (selectedFilter === 'Monthly') {
      result = result.filter(l => {
        const leadMonthStr = `${l.date.getFullYear()}-${String(l.date.getMonth() + 1).padStart(2, '0')}`;
        return leadMonthStr === monthFilter;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => 
        l.name.toLowerCase().includes(q) || 
        l.email.toLowerCase().includes(q) || 
        l.phoneNumber.includes(q) ||
        l.preferredLocation.toLowerCase().includes(q)
      );
    }

    return result;
  }, [leads, selectedFilter, dateFilter, monthFilter, searchQuery]);

  const handleUpdateStatus = (id: string, newStatus: LeadStatus) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, status: newStatus } : l);
      persistChanges(updated);
      return updated;
    });
  };

  const handleToggleContact = (id: string, type: 'phone' | 'email') => {
    setLeads(prev => {
      const updated = prev.map(l => {
        if (l.id !== id) return l;
        return type === 'phone' 
          ? { ...l, contactedPhone: !l.contactedPhone }
          : { ...l, contactedEmail: !l.contactedEmail };
      });
      persistChanges(updated);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('leads')}>
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-200">E</div>
                <span className="font-bold text-xl tracking-tight text-slate-900">EstateFlow</span>
              </div>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8 h-full">
                <button 
                  onClick={() => setActiveTab('leads')}
                  className={`${activeTab === 'leads' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors`}
                >
                  Leads
                </button>
                <button 
                  onClick={() => setActiveTab('properties')}
                  className={`${activeTab === 'properties' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors`}
                >
                  Properties
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className={`${activeTab === 'analytics' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors`}
                >
                  Analytics
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hidden sm:flex btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 px-4 rounded-lg flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Add Lead</span>
              </button>
              <button onClick={loadData} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
              </button>
              <div className="h-9 w-9 rounded-full ring-2 ring-slate-100 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfdEAFf0FplVrZBgvr-b5E9SqH4rxuOhHaPzAfsGDYZyJ3yxjeKhopCmJUPtvPxURZ95tTrrJhEUFJ_Zvh0l9K42ieQ2A4XLi_p1eoizgpCyQ5hvsYZSkqdGC8mrAXPhBwVKIE_DiMq54nL9-yrBf2CsT_wAyikcJXJs7T56zci9fVLmwiL_hrMPrord-c_BIG_l4B_ez48s3LEwjoOZW2cNFjP3eVcbgfBIbHUOuGPzL0lnY-3B9egf8ksEdXPU_-SkE9f_Vjsp4")' }}></div>
            </div>
          </div>
        </div>
      </nav>

      {activeTab === 'leads' ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Real Estate Leads</h1>
            <p className="mt-1 text-slate-500">Manage and track your incoming property inquiries efficiently.</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard label="New Leads Today" count={stats.daily} icon={<Calendar />} variant="blue" />
            <StatCard label="Weekly Leads" count={stats.weekly} icon={<TrendingUp />} variant="trend" />
            <StatCard label="Monthly Leads" count={stats.monthly} icon={<Users />} trendText="12% vs last month" />
            <StatCard label="Uncontacted" count={stats.uncontacted} icon={<PhoneMissed />} variant="progress" progress={stats.uncontactedRate} />
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-slate-900 mr-3">{selectedFilter} Inquiries</h2>
                <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-0.5 rounded-full">{filteredLeads.filter(l => l.status === LeadStatus.NEW).length} New</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-grow lg:flex-grow-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search leads..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full lg:w-48 text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
                  />
                </div>
                
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as TimeFilter)}
                  className="pl-3 pr-8 py-2 text-sm border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer shadow-sm"
                >
                  <option value="Daily">Status: Daily</option>
                  <option value="Weekly">Status: Weekly</option>
                  <option value="Monthly">Status: Monthly</option>
                </select>

                {selectedFilter === 'Daily' && (
                  <DatePicker value={dateFilter} onChange={setDateFilter} />
                )}
                {selectedFilter === 'Monthly' && (
                  <MonthPicker value={monthFilter} onChange={setMonthFilter} />
                )}
                
                <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 shadow-sm transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Table Header Replacement */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="col-span-12 md:col-span-2">Date Received</div>
                <div className="col-span-12 md:col-span-7">Lead Details</div>
                <div className="col-span-12 md:col-span-3 text-right md:pr-4">Actions</div>
              </div>

              <div className="divide-y divide-slate-100">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                    <RefreshCw className="w-10 h-10 animate-spin text-indigo-400" />
                    <p className="font-bold">Fetching the latest leads...</p>
                  </div>
                ) : filteredLeads.length > 0 ? (
                  filteredLeads.map(lead => (
                    <LeadRow 
                      key={lead.id} 
                      lead={lead} 
                      onUpdateStatus={handleUpdateStatus} 
                      onToggleContact={handleToggleContact} 
                    />
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                    <p className="text-lg font-bold">No inquiries found</p>
                    <p className="text-sm">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-900">1</span> to <span className="font-bold text-slate-900">{filteredLeads.length}</span> of <span className="font-bold text-slate-900">{leads.length}</span> results
              </p>
              <div className="flex items-center gap-1">
                <button className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-400 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-100">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700">3</button>
                <span className="px-2 text-slate-400 font-bold">...</span>
                <button className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-400"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </main>
      ) : activeTab === 'properties' ? (
        <PropertiesView />
      ) : (
        <AnalyticsView leads={leads} />
      )}
    </div>
  );
};

export default App;