import React from 'react';

interface InputFieldProps {
  label: string;
  description?: string;
  name: string;
  value: number | string;
  onChange: (name: string, value: number | string) => void;
  type?: "number" | "text" | "select";
  options?: string[];
  placeholder?: string;
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
    <div className="form-group">
      <label className="form-label">
        {label}
      </label>
      
      {description && (
        <p className="form-description">
          {description}
        </p>
      )}

      {type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="form-select"
        >
          <option value="">Seleziona...</option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <div className="input-wrapper">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(name, type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
            className="form-input"
            placeholder={placeholder}
          />
          {unit && (
            <div className="input-unit">
              <span>{unit}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};