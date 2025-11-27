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
    <div className="min-h-screen pb-12 bg-[#f7f7f7] text-[#3f4142]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3f4142] rounded-lg flex items-center justify-center text-white shadow-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#3f4142] tracking-tight leading-none">mainsim CMMS HealthCheck</h1>
              <span className="text-xs text-gray-500 font-medium">by mainsim</span>
            </div>
          </div>
          {!report && !loading && (
             <div className="hidden md:block text-xs text-gray-400">
               Audit automatico per la manutenzione
             </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-[#3f4142] rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Database className="w-6 h-6 text-[#3f4142]" />
                </div>
             </div>
             <div>
               <h2 className="text-xl font-bold text-[#3f4142]">Analisi in corso...</h2>
               <p className="text-gray-500 mt-2">L'ingegnere virtuale sta analizzando i tuoi KPI.</p>
             </div>
          </div>
        ) : report ? (
          <ReportView data={report} onReset={handleReset} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Input Form Column */}
            <div className="lg:col-span-2 space-y-2">
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
                <p className="text-sm text-[#3f4142] leading-relaxed">
                  Compila i dati in tuo possesso. Se alcuni campi sono mancanti, il sistema utilizzerà <strong>best-practice di settore</strong> per completare l'analisi. I dati sono processati in modo sicuro e anonimo.
                </p>
              </div>

              <InputSection title="Profilo Generale" icon={<HardDrive className="w-5 h-5"/>}>
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

              <InputSection title="Ordini di Lavoro (WO)" icon={<ClipboardList className="w-5 h-5"/>}>
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

              <InputSection title="Performance & SLA" icon={<Timer className="w-5 h-5"/>}>
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

              <InputSection title="Adozione & Qualità Dati" icon={<BarChart3 className="w-5 h-5"/>}>
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

              <div className="pt-4">
                <button 
                  onClick={handleGenerate}
                  className="w-full bg-[#3f4142] hover:bg-black text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-3"
                >
                  <Activity className="w-6 h-6" />
                  Avvia Health Check
                </button>
              </div>
            </div>

            {/* Sidebar / Info */}
            <div className="hidden lg:block space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                <h3 className="font-bold text-[#3f4142] mb-4 text-lg">Come funziona?</h3>
                <ul className="space-y-5 text-sm text-[#3f4142]">
                  <li className="flex gap-4">
                    <span className="bg-[#f7f7f7] text-[#3f4142] font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200">1</span>
                    <span className="mt-1">Inserisci i KPI principali del tuo CMMS nei campi dedicati.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="bg-[#f7f7f7] text-[#3f4142] font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200">2</span>
                    <span className="mt-1">L'algoritmo (AI) confronta i tuoi dati con i benchmark di settore.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="bg-[#f7f7f7] text-[#3f4142] font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200">3</span>
                    <span className="mt-1">Ricevi un report operativo con punteggi, criticità e un piano d'azione.</span>
                  </li>
                </ul>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-[#3f4142] mb-3 text-sm uppercase tracking-wide">Analizziamo</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Backlog", "MTTR", "Preventiva", "Qualità Dati", "Adozione"].map(tag => (
                      <span key={tag} className="bg-[#f7f7f7] text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
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
