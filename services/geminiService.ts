import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HealthCheckInputs, HealthCheckReport } from "../types";

// Schema definition remains static
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: { type: Type.STRING, description: "A professional executive summary of the CMMS health state." },
    overallMaturityLevel: { 
      type: Type.STRING, 
      enum: ["Livello 1 – Base", "Livello 2 – Intermedio", "Livello 3 – Avanzato", "Livello 4 – Best in class"] 
    },
    overallScore: { type: Type.INTEGER, description: "A calculated maturity score out of 100 based on the inputs." },
    kpiAnalyses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          kpi: { type: Type.STRING },
          value: { type: Type.STRING },
          evaluation: { type: Type.STRING, enum: ["Eccellente", "Buono", "Attenzione", "Critico"] },
          score: { type: Type.INTEGER, description: "Score from 1 to 5" },
          notes: { type: Type.STRING }
        },
        required: ["kpi", "value", "evaluation", "score", "notes"]
      }
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          suggestion: { type: Type.STRING }
        },
        required: ["category", "suggestion"]
      }
    },
    quickWins: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    strategy90Days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          action: { type: Type.STRING },
          details: { type: Type.STRING }
        },
        required: ["phase", "action", "details"]
      }
    }
  },
  required: ["executiveSummary", "overallMaturityLevel", "overallScore", "kpiAnalyses", "recommendations", "quickWins", "strategy90Days"]
};

export const generateHealthCheckReport = async (inputs: HealthCheckInputs): Promise<HealthCheckReport> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  if (!apiKey) {
    throw new Error("API Key mancante. Verifica la configurazione dell'ambiente.");
  }

  // Initialize inside the function to avoid immediate crash on load if key is missing
  const genAI = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Sei HealthCheck-Engineer, un esperto consulente CMMS specializzato in mainsim.
    Analizza i seguenti dati di input forniti da un cliente (se i valori sono vuoti, fai delle stime basate su standard di settore e segnalalo):
    
    ${JSON.stringify(inputs, null, 2)}

    Il tuo compito è generare un report JSON strutturato seguendo rigorosamente queste regole:
    1. **Tono**: Professionale, consulenziale, diretto.
    2. **Analisi KPI**: Per ogni metrica, fornisci un punteggio (1-5) e una valutazione critica.
    3. **Maturità**: Calcola un livello di maturità complessivo.
    4. **Raccomandazioni**: Fornisci consigli pratici e specifici per migliorare l'uso di mainsim.
    5. **Strategia**: Definisci un piano a 30/60/90 giorni (Stabilizzazione, Ottimizzazione, Automazione).

    Sii critico sui backlog elevati, bassa percentuale di preventiva o scarsa qualità dei dati.
  `;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as HealthCheckReport;
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Impossibile generare il report al momento. Riprova.");
  }
};
