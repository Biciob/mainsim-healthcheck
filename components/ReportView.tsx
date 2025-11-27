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
  let colorStyle = { background: '#fef2f2', color: '#991b1b', borderColor: '#fecaca' };
  
  if (score === 3) colorStyle = { background: '#fffbeb', color: '#92400e', borderColor: '#fde68a' };
  if (score === 4) colorStyle = { background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' };
  if (score === 5) colorStyle = { background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' };

  return (
    <span className="score-mini-badge" style={colorStyle}>
      {score}/5
    </span>
  );
};

const EvaluationIcon: React.FC<{ level: string }> = ({ level }) => {
  switch (level) {
    case 'Eccellente': return <CheckCircle size={20} color="var(--success-color)" />;
    case 'Buono': return <CheckCircle size={20} color="var(--blue-color)" />;
    case 'Attenzione': return <AlertTriangle size={20} color="var(--warning-color)" />;
    case 'Critico': return <AlertOctagon size={20} color="var(--danger-color)" />;
    default: return <Minus size={20} color="#9ca3af" />;
  }
};

export const ReportView: React.FC<ReportViewProps> = ({ data, onReset }) => {
  const chartData = [{
    name: 'Maturity',
    value: data.overallScore,
    fill: '#3f4142',
  }];

  return (
    <div className="report-container">
      {/* Header Actions */}
      <div className="flex-between mb-6 no-print">
        <button 
          onClick={onReset}
          className="btn-ghost"
        >
          ← Nuova Analisi
        </button>
        <button 
          onClick={() => window.print()}
          className="btn-secondary"
        >
          Esporta PDF
        </button>
      </div>

      {/* Executive Summary Card */}
      <div className="exec-summary-card">
        <div className="exec-header">
          <div className="flex-between">
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Executive Summary</h2>
              <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>mainsim CMMS HealthCheck</p>
            </div>
            <div className="exec-badge">
              <Award size={32} color="#facc15" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.75, letterSpacing: '0.05em' }}>Livello Maturità</span>
                <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>{data.overallMaturityLevel}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="exec-body">
          <div>
            <p style={{ lineHeight: 1.8, fontSize: '1.125rem', whiteSpace: 'pre-line' }}>
              {data.executiveSummary}
            </p>
          </div>
          <div className="score-chart-container">
             <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={chartData} startAngle={180} endAngle={0} barSize={20}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="score-value">
              <span className="score-number">{data.overallScore}</span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Analysis Table */}
      <div className="table-container print-break-inside-avoid">
        <div className="section-header">
          <TrendingUp size={24} color="var(--primary-color)" />
          <h3 className="section-title">Analisi KPI & Benchmark</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="kpi-table">
            <thead>
              <tr>
                <th>Indicatore</th>
                <th>Valore</th>
                <th>Valutazione</th>
                <th>Rating</th>
                <th style={{ width: '40%' }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {data.kpiAnalyses.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{item.kpi}</td>
                  <td><span className="kpi-value">{item.value}</span></td>
                  <td>
                    <div className={`eval-badge ${item.evaluation}`}>
                      <EvaluationIcon level={item.evaluation} />
                      <span>{item.evaluation}</span>
                    </div>
                  </td>
                  <td>
                    <ScoreBadge score={item.score} />
                  </td>
                  <td style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2 print-break-inside-avoid" style={{ marginBottom: '2rem' }}>
        {/* Quick Wins */}
        <div className="input-section" style={{ height: '100%', marginBottom: 0 }}>
          <div className="section-header">
            <ListTodo size={24} color="var(--success-color)" />
            <h3 className="section-title">Quick Wins (30 gg)</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {data.quickWins.map((win, idx) => (
              <li key={idx} className="quick-win-item">
                <div style={{ background: 'white', padding: '0.25rem', borderRadius: '50%', border: '1px solid #eee' }}>
                  <CheckCircle size={16} color="var(--success-color)" />
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{win}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="input-section" style={{ height: '100%', marginBottom: 0 }}>
          <div className="section-header">
            <CheckCircle size={24} color="var(--primary-color)" />
            <h3 className="section-title">Raccomandazioni Operative</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {data.recommendations.slice(0, 4).map((rec, idx) => (
              <div key={idx} style={{ borderLeft: '4px solid var(--primary-color)', paddingLeft: '1.25rem' }}>
                <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>{rec.category}</span>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{rec.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 90 Day Strategy */}
      <div className="input-section print-break-inside-avoid">
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <Calendar size={24} color="var(--primary-color)" />
          <h3 className="section-title">Strategia di 90 Giorni</h3>
        </div>
        <div style={{ position: 'relative' }}>
           {/* Connecting Line (Desktop) */}
           <div style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem', height: '2px', background: '#f3f4f6', zIndex: 0 }} className="hidden-mobile" />
           
           <div className="strategy-grid">
             {data.strategy90Days.map((step, idx) => (
               <div key={idx} className="strategy-step">
                  <div className="step-number">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>{step.phase}</h4>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1rem' }}>{step.action}</p>
                    <div className="step-card">
                      {step.details}
                    </div>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};