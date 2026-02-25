import React from 'react';

interface ActionCardProps {
  title: string;
  children: React.ReactNode;
}

export const ActionCard: React.FC<ActionCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};