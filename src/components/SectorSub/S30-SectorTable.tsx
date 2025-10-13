import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';
import { SectorKeys } from '@/components/Key/KeySector';
import { chartColors } from '../Key/KeyColor';
import { findUnit } from '../UtilChart/ChartConfig';
import { KPIOption } from '../Key/KeyKPI';
import { SectorStatsMap } from '../R10-Sector';

interface SectorTableProps {
	sectorStats: SectorStatsMap;
	currentKPI: KPIOption;
	valueType: 'average' | 'total';
}

export const SectorTable = ({ sectorStats, currentKPI, valueType }: SectorTableProps) => {
	const [isExpandedSub, setIsExpandedSub] = useState(false);

	const getAverage = (total: number, count: number) => {
		return count > 0 ? Math.round(total / count) : 0;
	};

	return (
		<Card className="shadow-inner">
			<div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpandedSub(!isExpandedSub)}>
				<h2>Summary Statistics</h2>
				<ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isExpandedSub ? 'transform rotate-180' : ''}`} style={{ color: chartColors.primary }} />
			</div>
			{isExpandedSub && (
				<Card className="rounded-[24px] p-2 mt-4">
					<div className="overflow-x-auto">
						<table className="w-full border-separate rounded-2xl overflow-hidden" style={{ borderSpacing: 0 }}>
							<thead>
								<tr className="divide-x-4 divide-white bg-pink-200">
									<th className="px-4 py-2 pl-8 text-left">Sector</th>
									<th className="px-4 py-2 text-center">Project Count</th>
									{valueType === 'average' ? (
										<>
											<th className="px-4 py-2 text-center">Average ({findUnit(currentKPI, valueType)})</th>
											<th className="px-4 py-2 text-center">Min</th>
											<th className="px-4 py-2 text-center">Max</th>
											<th className="px-4 py-2 text-center">Range</th>
										</>
									) : (
										<>
											<th className="px-4 py-2 text-center">Total ({findUnit(currentKPI, valueType)})</th>
											<th className="px-4 py-2 text-center">Min</th>
											<th className="px-4 py-2 text-center">Max</th>
											<th className="px-4 py-2 text-center">Total Area (m²)</th>
										</>
									)}
								</tr>
							</thead>
							<tbody className="bg-pink-50">
								{SectorKeys.map((sector) => {
									const stats = sectorStats[sector];
									const avg = stats ? getAverage(stats.totalValue, stats.count) : 0;
									const min = stats && stats.minValue !== Infinity ? Math.round(stats.minValue) : 0;
									const max = stats && stats.maxValue !== -Infinity ? Math.round(stats.maxValue) : 0;
									const range = max - min;
									const count = stats ? stats.count : 0;
									const totalArea = stats ? Math.round(stats.totalGIA) : 0;
									return (
										<tr key={sector} className="divide-y-2 divide-x-4 divide-white">
											<td className="px-4 py-2 pl-8 text-left font-medium">{sector}</td>
											<td className="px-4 py-2 text-center">{count}</td>
											{valueType === 'average' ? (
												<>
													<td className="px-4 py-2 text-center">{formatNumber(avg)}</td>
													<td className="px-4 py-2 text-center">{formatNumber(min)}</td>
													<td className="px-4 py-2 text-center">{formatNumber(max)}</td>
													<td className="px-4 py-2 text-center">{formatNumber(range)}</td>
												</>
											) : (
												<>
													<td className="px-4 py-2 text-center">{formatNumber(stats ? stats.totalValue : 0)}</td>
													<td className="px-4 py-2 text-center">{formatNumber(min)}</td>
													<td className="px-4 py-2 text-center">{formatNumber(max)}</td>
													<td className="px-4 py-2 text-center">{formatNumber(totalArea)}</td>
												</>
											)}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</Card>
			)}
		</Card>
	);
};
