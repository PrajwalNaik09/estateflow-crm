import React, { useMemo } from 'react';
import { Lead } from '../types';

interface AnalyticsViewProps {
  leads: Lead[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ leads }) => {
  const analyticsData = useMemo(() => {
    if (!leads || leads.length === 0) return null;

    // 1. Core aggregates
    const typeCounts: Record<string, number> = {};
    const locCounts: Record<string, number> = {};
    
    leads.forEach(l => {
      typeCounts[l.propertyType] = (typeCounts[l.propertyType] || 0) + 1;
      locCounts[l.preferredLocation] = (locCounts[l.preferredLocation] || 0) + 1;
    });

    const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    const sortedLocs = Object.entries(locCounts).sort((a, b) => b[1] - a[1]);

    const mostPopularType = sortedTypes[0]?.[0] || 'N/A';
    const topLocality = sortedLocs[0]?.[0] || 'N/A';

    const totalLeads = leads.length;
    const aptPct = Math.round(((typeCounts['Apartment'] || 0) / totalLeads) * 100);
    const rentPct = Math.round(((typeCounts['Rented Apartment'] || 0) / totalLeads) * 100);
    const housePct = Math.round(((typeCounts['House/Land'] || 0) / totalLeads) * 100);

    const circ = 251.3;
    const aptStroke = (aptPct / 100) * circ;
    const rentStroke = (rentPct / 100) * circ;
    const houseStroke = (housePct / 100) * circ;

    const hotspots = sortedLocs.slice(0, 5).map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / (sortedLocs[0]?.[1] || 1)) * 100)
    }));

    // 2. Dynamic Timeline Logic (Strictly following the data range, e.g., Nov - Dec)
    const sortedLeads = [...leads].sort((a, b) => a.date.getTime() - b.date.getTime());
    const minDate = new Date(sortedLeads[0].date);
    minDate.setHours(0, 0, 0, 0);
    const maxDate = new Date(sortedLeads[sortedLeads.length - 1].date);
    maxDate.setHours(0, 0, 0, 0);

    // Grouping by day
    const dailyCounts: Record<number, number> = {};
    leads.forEach(l => {
      const d = new Date(l.date);
      d.setHours(0, 0, 0, 0);
      const ts = d.getTime();
      dailyCounts[ts] = (dailyCounts[ts] || 0) + 1;
    });

    // Create days array from minDate to maxDate
    const days: Date[] = [];
    let current = new Date(minDate);
    while (current <= maxDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const totalDays = days.length;
    const timelinePoints: { x: number; y: number }[] = [];
    const labels: { text: string; pos: number }[] = [];
    
    // Scale for Y (Max daily leads usually low in this dataset, ~5-10)
    const yMaxScale = 15; 
    const svgHeight = 240;
    const svgWidth = 1000;

    days.forEach((day, i) => {
      const count = dailyCounts[day.getTime()] || 0;
      const x = (i / (totalDays - 1)) * svgWidth;
      // Invert Y and leave some padding top/bottom
      const y = (svgHeight - 20) - (Math.min(count, yMaxScale) / yMaxScale) * (svgHeight - 60);
      timelinePoints.push({ x, y });

      // Add labels (Start, Middle of each month transition, and End)
      const isStart = i === 0;
      const isEnd = i === totalDays - 1;
      const isFirstOfMonth = day.getDate() === 1;
      const isMiddleOfMonth = day.getDate() === 15;

      if (isStart || isEnd || isFirstOfMonth || isMiddleOfMonth) {
        labels.push({
          text: day.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          pos: (i / (totalDays - 1)) * 100
        });
      }
    });

    // Smoothing the line path
    let pathD = `M ${timelinePoints[0].x},${timelinePoints[0].y}`;
    for (let i = 1; i < timelinePoints.length; i++) {
      const p = timelinePoints[i];
      const prev = timelinePoints[i - 1];
      const cpX = prev.x + (p.x - prev.x) / 2;
      pathD += ` C ${cpX},${prev.y} ${cpX},${p.y} ${p.x},${p.y}`;
    }

    const areaD = pathD + ` V ${svgHeight} H 0 Z`;

    return {
      totalLeads,
      mostPopularType,
      topLocality,
      aptPct,
      rentPct,
      housePct,
      aptStroke,
      rentStroke,
      houseStroke,
      hotspots,
      circ,
      pathD,
      areaD,
      labels
    };
  }, [leads]);

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400 font-bold">
        Gathering data for insights...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full overflow-hidden">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Market Insights</h1>
        <p className="text-slate-500 text-sm font-semibold">Real estate market trends and lead behavior analysis based on live data.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <span className="material-symbols-outlined text-[20px]">star</span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Most Popular</p>
          </div>
          <p className="text-slate-900 tracking-tight text-2xl font-bold leading-tight truncate">{analyticsData.mostPopularType}</p>
          <p className="text-slate-400 text-xs font-bold uppercase">November - December</p>
        </div>

        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Top Locality</p>
          </div>
          <p className="text-slate-900 tracking-tight text-2xl font-bold leading-tight truncate">{analyticsData.topLocality}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-slate-400 text-[10px] font-bold uppercase">Active Hotspot</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Lead Volume</p>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-slate-900 tracking-tight text-2xl font-bold leading-tight">{analyticsData.totalLeads}</p>
            <p className="text-green-600 text-sm font-bold mb-1 uppercase">Total Inquiries</p>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase">Current Dataset</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Donut Chart: Property Type Demand */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center">
          <div className="w-full mb-6">
            <h3 className="text-slate-900 text-lg font-bold">Property Type Demand</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase">Distribution analysis</p>
          </div>
          <div className="relative w-40 h-40">
            <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#f1f5f9" strokeWidth="12"></circle>
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#4338ca" strokeWidth="12" strokeDasharray={`${analyticsData.aptStroke} ${analyticsData.circ}`} strokeDashoffset="0"></circle>
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#14b8a6" strokeWidth="12" strokeDasharray={`${analyticsData.rentStroke} ${analyticsData.circ}`} strokeDashoffset={`-${analyticsData.aptStroke}`}></circle>
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#f59e0b" strokeWidth="12" strokeDasharray={`${analyticsData.houseStroke} ${analyticsData.circ}`} strokeDashoffset={`-${analyticsData.aptStroke + analyticsData.rentStroke}`}></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">{analyticsData.totalLeads}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Leads</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8 w-full border-t border-slate-50 pt-4">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Apt</p>
              <p className="text-sm text-indigo-600 font-bold">{analyticsData.aptPct}%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Rent</p>
              <p className="text-sm text-teal-600 font-bold">{analyticsData.rentPct}%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">House</p>
              <p className="text-sm text-amber-600 font-bold">{analyticsData.housePct}%</p>
            </div>
          </div>
        </div>

        {/* Bar Chart: Location Hotspots */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="w-full mb-6">
            <h3 className="text-slate-900 text-lg font-bold">Location Hotspots</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase">Most popular areas</p>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-5">
            {analyticsData.hotspots.map((h, i) => (
              <div key={h.name} className="w-full group cursor-pointer">
                <div className="flex justify-between text-[11px] mb-1.5 font-bold">
                  <span className="text-slate-700 group-hover:text-indigo-600 transition-colors truncate pr-4">{h.name}</span>
                  <span className="text-slate-400 whitespace-nowrap">{h.count} leads</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${h.pct}%`, opacity: 1 - (i * 0.15) }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsive Line Chart: November - December Timeline */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-slate-900 text-lg font-bold">Growth Timeline</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase">Volume (Nov - Dec)</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-900">
              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              <span>Daily Volume</span>
            </div>
          </div>
          <div className="relative w-full flex-1 min-h-[220px]">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pl-10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-slate-50 w-full"></div>
              ))}
            </div>
            
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[9px] font-bold text-slate-400 pr-2 border-r border-slate-50">
              <span>High</span>
              <span>Med</span>
              <span>Low</span>
              <span>0</span>
            </div>

            {/* Chart Area */}
            <div className="absolute left-10 right-0 top-0 bottom-8">
              <svg className="w-full h-full" viewBox="0 0 1000 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4338ca" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#4338ca" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={analyticsData.areaD} fill="url(#areaGradient)" vectorEffect="non-scaling-stroke" />
                <path d={analyticsData.pathD} fill="none" stroke="#4338ca" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* X-Axis Dynamic Labels */}
            <div className="absolute left-10 right-0 bottom-0 h-8">
              {analyticsData.labels.map((l, i) => (
                <div 
                  key={i} 
                  className="absolute transform -translate-x-1/2 flex flex-col items-center" 
                  style={{ left: `${l.pos}%` }}
                >
                  <div className="w-px h-1 bg-slate-200 mb-1"></div>
                  <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-tighter">
                    {l.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;