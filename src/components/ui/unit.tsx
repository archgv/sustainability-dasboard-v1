import React from 'react';

interface UnitProps {
	children: React.ReactNode; // e.g. "m²", "kWh/m²/yr"
	className?: string; // allow custom styling if needed
}

export const Unit: React.FC<UnitProps> = ({ children, className }) => {
	return <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none ${className || ''}`}>{children}</div>;
};
