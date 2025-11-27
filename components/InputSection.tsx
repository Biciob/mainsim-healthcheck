import React from 'react';

interface InputSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const InputSection: React.FC<InputSectionProps> = ({ title, children, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
        {icon && <span className="text-[#3f4142]">{icon}</span>}
        <h3 className="font-bold text-lg text-[#3f4142]">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
};