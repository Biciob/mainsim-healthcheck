import React from 'react';

interface InputSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const InputSection: React.FC<InputSectionProps> = ({ title, children, icon }) => {
  return (
    <div className="input-section">
      <div className="section-header">
        {icon && <span style={{ color: 'var(--primary-color)' }}>{icon}</span>}
        <h3 className="section-title">{title}</h3>
      </div>
      <div className="grid-2">
        {children}
      </div>
    </div>
  );
};