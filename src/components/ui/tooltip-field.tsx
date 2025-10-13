import React from 'react';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface TooltipFieldProps {
	label: string;
	tooltip?: string;
	required?: boolean;
	children: React.ReactNode;
}

export const TooltipField: React.FC<TooltipFieldProps> = ({ label, tooltip, required = false, children }) => {
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<Label className="text-sm font-medium text-pink-300 pl-6">
					{label} {required && <span className="text-destructive text-pink-300">*</span>}
				</Label>
				{tooltip && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Info className="h-3 w-3 text-pink-300" />
							</TooltipTrigger>
							<TooltipContent className="max-w-xs">
								<p>{tooltip}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
			{children}
		</div>
	);
};
