import React from 'react';
import { HealthCheckReport, KPIAnalysis } from '../types';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertOctagon, 
  Minus, 
  TrendingUp, 
  Award, 
  ListTodo, 
  Calendar 
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ReportViewProps {
  data: HealthCheckReport;
  onReset: () => void;
}

const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const colors = [
    'bg-red-50 text-red-800 border-red-100',
    'bg-red-50 text-red-800 border-red-100',
    'bg-orange-50 text-orange-800 border-orange-100',
    'bg-yellow-50 text-yellow-800 border-yellow-100',
    'bg-blue-50 text-blue-800 border-blue-100',
    'bg-green-50 text-green-800 border-green-100'
  ];
  return (
    <span className={`px-2.5 py-0.5 rounded border text-xs font-bold ${colors[score] || colors[0]}`}>
      {score}/5
    </span>
  );
};

const EvaluationIcon: React.FC<{ level: string }> = ({ level }) => {
  switch (level) {
    case 'Eccellente': return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'Buono': return <CheckCircle className="w-5 h-5 text-blue-600" />;
    case 'Attenzione': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'Critico': return <AlertOctagon className="w-5 h-5 text-red-500" />;
    default: return <Minus className="w-5 h-5 text-gray-400" />;
  }
};

export const ReportView: React.FC<ReportViewProps> = ({ data, onReset }) => {
  const chartData = [{
    name: 'Maturity',
    value: data.overallScore,
    fill: '#3f4142',
  }];

  return (
    <div className="space-y-8 animate-fade-in pb-12 text-[#3f4142]">
      {/* Header Actions */}
      <div className="flex justify-between items-center no-print">
        <button 
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-[#3f4142] underline"
        >
          ← Nuova Analisi
        </button>
        <button 
          onClick={() => window.print()}
          className="bg-[#3f4142] hover:bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          Esporta PDF
        </button>
      </div>

      {/* Executive Summary Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-[#3f4142] p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Executive Summary</h2>
              <p className="opacity-80 text-sm tracking-wide">mainsim CMMS HealthCheck</p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 px-5 py-3 rounded-xl backdrop-blur-sm border border-white/10">
              <Award className="w-8 h-8 text-yellow-400" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold opacity-75 tracking-wider">Livello Maturità</span>
                <span className="font-bold text-lg">{data.overallMaturityLevel}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          <div className="md:col-span-2">
            <p className="text-[#3f4142] leading-relaxed whitespace-pre-line text-lg">
              {data.executiveSummary}
            </p>
          </div>
          <div className="h-48 w-full flex flex-col items-center justify-center relative bg-[#f7f7f7] rounded-full p-4 border border-gray-100">
             <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={chartData} startAngle={180} endAngle={0} barSize={20}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
              <span className="text-4xl font-bold text-[#3f4142]">{data.overallScore}</span>
              <span className="block text-xs text-gray-500 uppercase font-medium mt-1">Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Analysis Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 print-break-inside-avoid">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <TrendingUp className="text-[#3f4142] w-6 h-6" />
          <h3 className="text-xl font-bold text-[#3f4142]">Analisi KPI & Benchmark</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-[#f7f7f7] border-y border-gray-200">
                <th className="px-6 py-4 rounded-l-lg">Indicatore</th>
                <th className="px-6 py-4">Valore</th>
                <th className="px-6 py-4">Valutazione</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 w-1/3 rounded-r-lg">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.kpiAnalyses.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#f7f7f7]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#3f4142]">{item.kpi}</td>
                  <td className="px-6 py-4 text-gray-700 font-mono text-sm bg-gray-50/50 rounded">{item.value}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <EvaluationIcon level={item.evaluation} />
                      <span className={`text-sm font-semibold ${
                        item.evaluation === 'Critico' ? 'text-red-700' : 
                        item.evaluation === 'Attenzione' ? 'text-yellow-700' :
                        item.evaluation === 'Buono' ? 'text-blue-700' : 'text-green-700'
                      }`}>{item.evaluation}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ScoreBadge score={item.score} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 leading-snug">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print-break-inside-avoid">
        {/* Quick Wins */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <ListTodo className="text-green-600 w-6 h-6" />
            <h3 className="text-lg font-bold text-[#3f4142]">Quick Wins (30 gg)</h3>
          </div>
          <ul className="space-y-4">
            {data.quickWins.map((win, idx) => (
              <li key={idx} className="flex items-start gap-4 bg-[#f7f7f7] p-4 rounded-xl border border-gray-100">
                <div className="mt-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-[#3f4142] font-medium leading-relaxed">{win}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="text-[#3f4142] w-6 h-6" />
            <h3 className="text-lg font-bold text-[#3f4142]">Raccomandazioni Operative</h3>
          </div>
          <div className="space-y-6">
            {data.recommendations.slice(0, 4).map((rec, idx) => (
              <div key={idx} className="border-l-4 border-[#3f4142] pl-5 py-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">{rec.category}</span>
                <p className="text-sm text-[#3f4142] leading-relaxed font-medium">{rec.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 90 Day Strategy */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 print-break-inside-avoid">
        <div className="flex items-center gap-3 mb-10">
          <Calendar className="text-[#3f4142] w-6 h-6" />
          <h3 className="text-xl font-bold text-[#3f4142]">Strategia di 90 Giorni</h3>
        </div>
        <div className="relative">
           {/* Connecting Line */}
           <div className="absolute top-8 left-4 right-4 h-0.5 bg-gray-100 hidden md:block" />
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {data.strategy90Days.map((step, idx) => (
               <div key={idx} className="relative bg-white pt-4 md:pt-8 z-10 group">
                  <div className="absolute top-0 left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-[#3f4142] text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-white group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <div className="mt-6 md:text-center">
                    <h4 className="text-lg font-bold text-[#3f4142] mb-1">{step.phase}</h4>
                    <p className="text-gray-500 font-medium text-xs uppercase tracking-widest mb-4">{step.action}</p>
                    <p className="text-sm text-[#3f4142] leading-relaxed bg-[#f7f7f7] p-4 rounded-xl border border-gray-100 shadow-sm">
                      {step.details}
                    </p>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};