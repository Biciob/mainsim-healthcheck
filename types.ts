export interface HealthCheckInputs {
  // General
  activeAssets: number | "";
  technicians: number | "";
  
  // Work Orders (WO)
  backlog: number | "";
  woCreated30Days: number | "";
  woClosed30Days: number | "";
  
  // Performance
  mttr: number | ""; // Hours
  preventivePercentage: number | ""; // 0-100
  slaCompliance: number | ""; // 0-100
  
  // Adoption & Quality
  dataCompleteness: number | ""; // 0-100% of asset fields filled
  checklistUsage: number | ""; // % of WOs with checklist
  automationCount: number | "";
  avgLoginFrequency: string; // e.g. "Daily", "Weekly"
}

export interface KPIAnalysis {
  kpi: string;
  value: string;
  evaluation: "Eccellente" | "Buono" | "Attenzione" | "Critico";
  score: number; // 1-5
  notes: string;
}

export interface Recommendation {
  category: string;
  suggestion: string;
}

export interface StrategyStep {
  phase: string;
  action: string;
  details: string;
}

export interface HealthCheckReport {
  executiveSummary: string;
  overallMaturityLevel: "Livello 1 – Base" | "Livello 2 – Intermedio" | "Livello 3 – Avanzato" | "Livello 4 – Best in class";
  overallScore: number; // 0-100 normalized or sum
  kpiAnalyses: KPIAnalysis[];
  recommendations: Recommendation[];
  quickWins: string[];
  strategy90Days: StrategyStep[];
}
