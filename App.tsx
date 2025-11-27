import React, { useState } from 'react';
import { Activity, ClipboardList, Database, Timer, HardDrive, BarChart3 } from 'lucide-react';
import { HealthCheckInputs, HealthCheckReport } from './types';
import { InputSection } from './components/InputSection';
import { InputField } from './components/InputField';
import { ReportView } from './components/ReportView';
import { generateHealthCheckReport } from './services/geminiService';

const initialInputs: HealthCheckInputs = {
  activeAssets: "",
  technicians: "",
  backlog: "",
  woCreated30Days: "",
  woClosed30Days: "",
  mttr: "",
  preventivePercentage: "",
  slaCompliance: "",
  dataCompleteness: "",
  checklistUsage: "",
  automationCount: "",
  avgLoginFrequency: ""
};

const App: React.FC = () => {
  const [inputs, setInputs] = useState<HealthCheckInputs>(initialInputs);
  const [report, setReport] = useState<HealthCheckReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: string, value: number | string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateHealthCheckReport(inputs);
      setReport(result);
    } catch (err: any) {
      setError(err.message || "Si è verificato un errore durante la generazione del report.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
            <div className="logo-box">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="app-title">mainsim CMMS HealthCheck</h1>
              <span className="app-subtitle">by mainsim</span>
            </div>
          </div>
          {!report && !loading && (
             <div className="app-subtitle">
               Audit automatico per la manutenzione
             </div>
          )}
        </div>
      </header>

      <main className="max-w-container" style={{ padding: '2rem 1rem' }}>
        
        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fca5a5', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Activity size={20} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
             <div style={{ position: 'relative' }}>
                <div className="spinner"></div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <Database size={24} />
                </div>
             </div>
             <div>
               <h2 className="section-title">Analisi in corso...</h2>
               <p className="form-description" style={{ marginTop: '0.5rem' }}>L'ingegnere virtuale sta analizzando i tuoi KPI.</p>
             </div>
          </div>
        ) : report ? (
          <ReportView data={report} onReset={handleReset} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Input Form Column */}
            <div style={{ gridColumn: 'span 2' }}>
              <div className="input-section">
                <p className="text-muted" style={{ lineHeight: '1.6' }}>
                  Compila i dati in tuo possesso. Se alcuni campi sono mancanti, il sistema utilizzerà <strong>best-practice di settore</strong> per completare l'analisi. I dati sono processati in modo sicuro e anonimo.
                </p>
              </div>

              <InputSection title="Profilo Generale" icon={<HardDrive size={20}/>}>
                <InputField 
                  label="Asset Attivi" 
                  description="Numero totale di asset/macchinari censiti a sistema"
                  name="activeAssets" 
                  value={inputs.activeAssets} 
                  onChange={handleInputChange} 
                  placeholder="150" 
                />
                <InputField 
                  label="Numero Tecnici" 
                  description="Utenti operativi che eseguono manutenzioni"
                  name="technicians" 
                  value={inputs.technicians} 
                  onChange={handleInputChange} 
                  placeholder="5" 
                />
              </InputSection>

              <InputSection title="Ordini di Lavoro (WO)" icon={<ClipboardList size={20}/>}>
                <InputField 
                  label="Backlog Attuale" 
                  description="Numero totale di WO aperti in attesa"
                  name="backlog" 
                  value={inputs.backlog} 
                  onChange={handleInputChange} 
                  placeholder="35" 
                />
                <InputField 
                  label="WO Creati (30gg)" 
                  description="Nuovi ordini di lavoro nell'ultimo mese"
                  name="woCreated30Days" 
                  value={inputs.woCreated30Days} 
                  onChange={handleInputChange} 
                  placeholder="120" 
                />
                <InputField 
                  label="WO Chiusi (30gg)" 
                  description="Ordini completati nell'ultimo mese"
                  name="woClosed30Days" 
                  value={inputs.woClosed30Days} 
                  onChange={handleInputChange} 
                  placeholder="110" 
                />
              </InputSection>

              <InputSection title="Performance & SLA" icon={<Timer size={20}/>}>
                <InputField 
                  label="MTTR (ore)" 
                  description="Tempo medio di risoluzione guasti"
                  name="mttr" 
                  value={inputs.mttr} 
                  onChange={handleInputChange} 
                  placeholder="4" 
                  unit="h" 
                />
                <InputField 
                  label="% Manutenzione Preventiva" 
                  description="Rapporto tra preventiva e correttiva"
                  name="preventivePercentage" 
                  value={inputs.preventivePercentage} 
                  onChange={handleInputChange} 
                  placeholder="60" 
                  unit="%" 
                />
                <InputField 
                  label="Rispetto SLA" 
                  description="Percentuale di WO chiusi entro i termini"
                  name="slaCompliance" 
                  value={inputs.slaCompliance} 
                  onChange={handleInputChange} 
                  placeholder="95" 
                  unit="%" 
                />
              </InputSection>

              <InputSection title="Adozione & Qualità Dati" icon={<BarChart3 size={20}/>}>
                <InputField 
                  label="Completezza Anagrafica" 
                  description="Stima % campi compilati per asset"
                  name="dataCompleteness" 
                  value={inputs.dataCompleteness} 
                  onChange={handleInputChange} 
                  placeholder="80" 
                  unit="%" 
                />
                <InputField 
                  label="Uso Checklist" 
                  description="% WO che includono una checklist"
                  name="checklistUsage" 
                  value={inputs.checklistUsage} 
                  onChange={handleInputChange} 
                  placeholder="45" 
                  unit="%" 
                />
                <InputField 
                  label="Automazioni Attive" 
                  description="Numero di regole automatiche attive"
                  name="automationCount" 
                  value={inputs.automationCount} 
                  onChange={handleInputChange} 
                  placeholder="3" 
                />
                <InputField 
                  label="Frequenza Login Utenti"
                  description="Quanto spesso accedono i tecnici" 
                  name="avgLoginFrequency" 
                  value={inputs.avgLoginFrequency} 
                  onChange={handleInputChange} 
                  type="select" 
                  options={["Giornaliera", "Settimanale", "Mensile", "Saltuaria"]} 
                />
              </InputSection>

              <div style={{ paddingTop: '1rem' }}>
                <button 
                  onClick={handleGenerate}
                  className="btn-primary"
                >
                  <Activity size={24} />
                  Avvia Health Check
                </button>
              </div>
            </div>

            {/* Sidebar / Info */}
            <div style={{ display: 'none' }} className="lg-block">
               {/* Hidden on small screens via CSS media query logic if I had a class, but inline: */}
            </div>
            {/* Re-implementing sidebar visibility logic with inline style hack or just keep it always visible on desktop via Grid */}
            <div className="sidebar-card" style={{ gridColumn: 'span 1' }}>
                <h3 className="section-title" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Come funziona?</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li className="step-list-item">
                    <span className="step-circle">1</span>
                    <span style={{ marginTop: '0.25rem' }}>Inserisci i KPI principali del tuo CMMS nei campi dedicati.</span>
                  </li>
                  <li className="step-list-item">
                    <span className="step-circle">2</span>
                    <span style={{ marginTop: '0.25rem' }}>L'algoritmo (AI) confronta i tuoi dati con i benchmark di settore.</span>
                  </li>
                  <li className="step-list-item">
                    <span className="step-circle">3</span>
                    <span style={{ marginTop: '0.25rem' }}>Ricevi un report operativo con punteggi, criticità e un piano d'azione.</span>
                  </li>
                </ul>
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Analizziamo</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {["Backlog", "MTTR", "Preventiva", "Qualità Dati", "Adozione"].map(tag => (
                      <span key={tag} style={{ background: '#f7f7f7', color: '#666', border: '1px solid #ddd', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 500 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;