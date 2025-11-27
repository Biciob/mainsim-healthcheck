import React from 'react';

interface InputFieldProps {
  label: string;
  description?: string; // Nuova prop per la spiegazione
  name: string;
  value: number | string;
  onChange: (name: string, value: number | string) => void;
  type?: "number" | "text" | "select";
  options?: string[];
  placeholder?: string; // Ora usato per esempi (es. "45")
  unit?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  description,
  name, 
  value, 
  onChange, 
  type = "number", 
  options, 
  placeholder,
  unit 
}) => {
  return (
    <div className="flex flex-col mb-2">
      <label className="text-sm font-bold text-[#3f4142] mb-0.5">
        {label}
      </label>
      
      {description && (
        <p className="text-xs text-gray-500 mb-2 font-light">
          {description}
        </p>
      )}

      {type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="bg-[#f7f7f7] border border-gray-300 text-[#3f4142] text-sm rounded-lg focus:ring-[#3f4142] focus:border-[#3f4142] block w-full p-2.5 transition-colors hover:bg-white"
        >
          <option value="">Seleziona...</option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(name, type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
            className="bg-[#f7f7f7] border border-gray-300 text-[#3f4142] text-sm rounded-lg focus:ring-[#3f4142] focus:border-[#3f4142] block w-full p-2.5 placeholder-gray-400 transition-colors hover:bg-white"
            placeholder={placeholder}
          />
          {unit && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 text-sm">{unit}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};