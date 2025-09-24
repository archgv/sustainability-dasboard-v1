import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Eye, EyeOff } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend, Cell, ReferenceLine, ReferenceDot } from 'recharts';
import { Project, availableKPIs } from '@/types/project';
import { ChartType, EmbodiedCarbonBreakdown, ValueType } from './ChartTypeSelector';
import { addProjectNumberToName, getSector, getSectorColor, getSectorShape, sectorConfig, getSectorBenchmarkColor } from '@/utils/projectUtils';
import { formatNumber } from '@/lib/utils';
import { useState } from 'react';
import { CustomShape } from './CustomShapes';


			case 'single-bar':
				const MultiLineTickComponent = (props: any) => {
					const { x, y, payload } = props;
					const words = payload.value.split(' ');
					const lines = [];
					let currentLine = '';

					// Split text into lines of max 2-3 words
					for (let i = 0; i < words.length; i++) {
						const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
						if (testLine.length > 15 && currentLine) {
							lines.push(currentLine);
							currentLine = words[i];
						} else {
							currentLine = testLine;
						}
					}
					if (currentLine) lines.push(currentLine);

					return (
						<g transform={`translate(${x},${y + 20})`}>
							{lines.map((line, index) => (
								<text key={index} x={0} y={index * 16} textAnchor="end" fill={chartColors.dark} fontSize="12" transform="rotate(-45)">
									{line}
								</text>
							))}
						</g>
					);
				};

				// Add biogenic data as negative values for totalEmbodiedCarbon - use sorted projects
				const chartData = sortedProjects.map((project) => ({
					...project,
					biogenic: selectedKPI1 === 'totalEmbodiedCarbon' ? -Math.abs(project.biogenicCarbon || 0) * (valueType === 'total' ? getProjectArea(project.id.split('-')[0]) : 1) : 0,
				}));

				// Get UKNZCBS benchmark data for the bar chart - always based on PRIMARY project only
				const getBarChartBenchmarkLines = () => {
					if (!selectedBarChartBenchmark || selectedKPI1 !== 'upfrontCarbon' || valueType !== 'per-sqm' || projects.length === 0) {
						return [];
					}

					// ALWAYS use the first project in the original array as the primary project
					const primaryProject = projects[0];
					const primarySector = getSector(primaryProject.typology);
					const benchmarkColor = getSectorBenchmarkColor(primaryProject.typology);

					// Get the PC date from the primary project to determine benchmark year
					const pcYear = (primaryProject as any).additionalData?.find((data: any) => data.label === 'PC Date (year)')?.value;
					let benchmarkYear = parseInt(pcYear) || 2025;
					if (benchmarkYear < 2025) benchmarkYear = 2025; // Use 2025 for years before 2025

					// Get benchmark values for this sector and sub-sector
					const sectorData = uknzcbsBenchmarks[primarySector as keyof typeof uknzcbsBenchmarks];
					if (!sectorData) return [];

					const subSectorData = sectorData[selectedBarChartBenchmark as keyof typeof sectorData];
					if (!subSectorData) return [];

					const newBuildValue = subSectorData['New building']?.[benchmarkYear as keyof (typeof subSectorData)['New building']];
					const retrofitValue = subSectorData['Retrofit']?.[benchmarkYear as keyof (typeof subSectorData)['Retrofit']];

					const benchmarkLines = [];
					if (newBuildValue !== undefined) {
						benchmarkLines.push({
							name: `New building (PC ${benchmarkYear})`,
							value: newBuildValue,
							color: benchmarkColor,
							year: benchmarkYear,
						});
					}
					if (retrofitValue !== undefined) {
						benchmarkLines.push({
							name: `Retrofit (PC ${benchmarkYear})`,
							value: retrofitValue,
							color: benchmarkColor,
							year: benchmarkYear,
						});
					}

					return benchmarkLines;
				};

				// Get benchmark data for the primary project's sector (only for Total Embodied Carbon with per-sqm)
				const getBenchmarkLines = () => {
					if (!showBenchmarks || selectedKPI1 !== 'totalEmbodiedCarbon' || valueType !== 'per-sqm' || projects.length === 0) {
						return [];
					}

					// ALWAYS use the first project in the original array as the primary project
					const primaryProject = projects[0];
					const primarySector = getSector(primaryProject.typology);
					const benchmarkColor = getSectorBenchmarkColor(primaryProject.typology);

					// Get benchmark values for this sector
					const sectorBenchmarks = totalEmbodiedCarbonBenchmarks[primarySector as keyof typeof totalEmbodiedCarbonBenchmarks];

					if (!sectorBenchmarks) return [];

					return Object.entries(sectorBenchmarks).map(([name, value]) => ({
						name,
						value,
						color: benchmarkColor,
					}));
				};

				const benchmarkLines = getBenchmarkLines();
				const barChartBenchmarkLines = getBarChartBenchmarkLines();

				return (
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={chartData} margin={{ top: 50, right: 30, left: 20, bottom: 80 }}>
							<CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} horizontal={true} verticalPoints={[]} />
							<XAxis
								dataKey={(item) => {
									const baseId = item.id.split('-')[0];
									const displayName = isComparingToSelf && item.ribaStage ? `${item.name} (RIBA ${item.ribaStage.replace('stage-', '')})` : item.name;
									return displayName;
								}}
								height={80}
								interval={0}
								tick={<MultiLineTickComponent />}
								axisLine={{ stroke: chartColors.dark, strokeWidth: 1 }}
								tickLine={false}
							/>
							<YAxis
								label={{
									value: `${kpi1Config?.label || selectedKPI1} (${getUnitLabel(kpi1Config?.unit || '', valueType)})`,
									angle: -90,
									position: 'insideLeft',
									style: { textAnchor: 'middle' },
								}}
								tick={{ fill: chartColors.dark }}
								tickFormatter={(value) => formatNumber(value)}
								domain={selectedKPI1 === 'totalEmbodiedCarbon' ? [0, 1600] : [0, 'dataMax']}
								ticks={
									selectedKPI1 === 'totalEmbodiedCarbon'
										? [0, 400, 800, 1200, 1600]
										: (() => {
												const maxValue = Math.max(...chartData.map((p) => Math.abs(p[selectedKPI1] || 0)));
												return generateNiceTicks(maxValue * 1.1);
										  })()
								}
							/>
							<Tooltip
								formatter={(value: number, name: string) => [
									`${formatNumber(value)} ${getUnitLabel(kpi1Config?.unit || '', valueType)}`,
									name === 'biogenic' ? 'Biogenic Carbon' : kpi1Config?.label || selectedKPI1,
								]}
								labelFormatter={(label) => `Project: ${label}`}
								contentStyle={{ backgroundColor: 'white', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
								content={({ active, payload, label }) => {
									if (active && payload && payload.length) {
										const mainData = payload.find((p) => p.dataKey === selectedKPI1);
										const biogenicData = payload.find((p) => p.dataKey === 'biogenic');

										return (
											<div className="bg-white p-3 border rounded-lg shadow-lg" style={{ backgroundColor: 'white', borderColor: chartColors.primary }}>
												<p className="font-semibold" style={{ color: chartColors.dark }}>
													Project: {label}
												</p>
												{mainData && (
													<p className="text-sm" style={{ color: chartColors.dark }}>
														{kpi1Config?.label}: {formatNumber(mainData.value)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
													</p>
												)}
												{biogenicData && (
													<p className="text-sm" style={{ color: chartColors.dark }}>
														Biogenic Carbon: {formatNumber(Math.abs(biogenicData.value))} {getUnitLabel(kpi1Config?.unit || '', valueType)}
													</p>
												)}
											</div>
										);
									}
									return null;
								}}
							/>
							<Bar dataKey={selectedKPI1} fill={chartColors.primary} name={kpi1Config?.label || selectedKPI1} radius={[4, 4, 0, 0]}>
								{sortedProjects.map((project, index) => {
									const sectorColor = getSectorColor(project.typology);
									return <Cell key={index} fill={sectorColor} />;
								})}
							</Bar>
							{selectedKPI1 === 'totalEmbodiedCarbon' && (
								<Bar dataKey="biogenic" fill="white" name="biogenic" radius={[0, 0, 4, 4]}>
									{sortedProjects.map((project, index) => {
										const sectorColor = getSectorColor(project.typology);
										return <Cell key={index} fill="white" stroke={sectorColor} strokeWidth={2} />;
									})}
								</Bar>
							)}
							{selectedKPI1 === 'totalEmbodiedCarbon' && <ReferenceLine y={0} stroke="#A8A8A3" strokeWidth={2} />}

							{/* Benchmark lines for Total Embodied Carbon */}
							{benchmarkLines.map((benchmark, index) => (
								<ReferenceLine
									key={benchmark.name}
									y={benchmark.value}
									stroke={benchmark.color}
									strokeWidth={2}
									strokeDasharray="5 5"
									label={{
										value: benchmark.name,
										position: 'insideTopRight',
										offset: 10,
										style: { fill: benchmark.color, fontSize: '12px', fontWeight: 'bold' },
									}}
								/>
							))}

							{/* UKNZCBS Benchmark lines for Upfront Carbon */}
							{barChartBenchmarkLines.map((benchmark, index) => (
								<ReferenceLine
									key={benchmark.name}
									y={benchmark.value}
									stroke={benchmark.color}
									strokeWidth={2}
									strokeDasharray={benchmark.name.includes('New building') ? '5 5' : '10 5'}
								/>
							))}
						</BarChart>
					</ResponsiveContainer>
				);

				// Add legend for UKNZCBS benchmarks as a separate component
				const BarChartLegend = () => {
					if (barChartBenchmarkLines.length === 0) return null;

					return (
						<div className="flex justify-center items-center gap-6 mt-4">
							{barChartBenchmarkLines.map((item, index) => (
								<div key={index} className="flex items-center gap-2">
									<svg width="24" height="2" className="inline-block">
										<line x1="0" y1="1" x2="24" y2="1" stroke={item.color} strokeWidth="2" strokeDasharray={item.name.includes('New building') ? '5 5' : '10 5'} />
									</svg>
									<span className="text-sm" style={{ color: chartColors.dark }}>
										{item.name}
									</span>
								</div>
							))}
						</div>
					);
				};

				return (
					<div>
						{/* Benchmark Legend - positioned after title, before chart */}
						{barChartBenchmarkLines.length > 0 && (
							<div className="flex justify-center items-center gap-6 mb-4">
								{barChartBenchmarkLines.map((item, index) => (
									<div key={index} className="flex items-center gap-2">
										<svg width="24" height="2" className="inline-block">
											<line x1="0" y1="1" x2="24" y2="1" stroke={item.color} strokeWidth="2" strokeDasharray={item.name.includes('New building') ? '5 5' : '10 5'} />
										</svg>
										<span className="text-sm" style={{ color: chartColors.dark }}>
											{item.name}
										</span>
									</div>
								))}
							</div>
						)}
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={chartData} margin={{ top: 50, right: 30, left: 20, bottom: 80 }}>
								<CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} horizontal={true} verticalPoints={[]} />
								<XAxis
									dataKey={(item) => {
										const baseId = item.id.split('-')[0];
										const displayName = isComparingToSelf && item.ribaStage ? `${item.name} (RIBA ${item.ribaStage.replace('stage-', '')})` : item.name;
										return displayName;
									}}
									height={80}
									interval={0}
									tick={<MultiLineTickComponent />}
									axisLine={{ stroke: chartColors.dark, strokeWidth: 1 }}
									tickLine={false}
								/>
								<YAxis
									label={{
										value: `${kpi1Config?.label || selectedKPI1} (${getUnitLabel(kpi1Config?.unit || '', valueType)})`,
										angle: -90,
										position: 'insideLeft',
										style: { textAnchor: 'middle' },
									}}
									tick={{ fill: chartColors.dark }}
									tickFormatter={(value) => formatNumber(value)}
									domain={
										selectedKPI1 === 'totalEmbodiedCarbon'
											? [0, 1600]
											: selectedKPI1 === 'upfrontCarbon'
											? [0, 1000]
											: (() => {
													const maxDataValue = Math.max(...chartData.map((p) => Math.abs(p[selectedKPI1] || 0)));
													const maxBenchmarkValue = barChartBenchmarkLines.length > 0 ? Math.max(...barChartBenchmarkLines.map((b) => b.value)) : 0;
													const maxValue = Math.max(maxDataValue, maxBenchmarkValue, 1000);
													return [0, Math.max(maxValue * 1.1, 1000)];
											  })()
									}
									ticks={
										selectedKPI1 === 'totalEmbodiedCarbon'
											? [0, 400, 800, 1200, 1600]
											: selectedKPI1 === 'upfrontCarbon'
											? [0, 200, 400, 600, 800, 1000]
											: (() => {
													const maxDataValue = Math.max(...chartData.map((p) => Math.abs(p[selectedKPI1] || 0)));
													const maxBenchmarkValue = barChartBenchmarkLines.length > 0 ? Math.max(...barChartBenchmarkLines.map((b) => b.value)) : 0;
													const maxValue = Math.max(maxDataValue, maxBenchmarkValue, 1000);
													return generateNiceTicks(Math.max(maxValue * 1.1, 1000));
											  })()
									}
								/>
								<Tooltip
									formatter={(value: number, name: string) => [
										`${formatNumber(value)} ${getUnitLabel(kpi1Config?.unit || '', valueType)}`,
										name === 'biogenic' ? 'Biogenic Carbon' : kpi1Config?.label || selectedKPI1,
									]}
									labelFormatter={(label) => `Project: ${label}`}
									contentStyle={{ backgroundColor: 'white', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
									content={({ active, payload, label }) => {
										if (active && payload && payload.length) {
											const mainData = payload.find((p) => p.dataKey === selectedKPI1);
											const biogenicData = payload.find((p) => p.dataKey === 'biogenic');

											return (
												<div className="bg-white p-3 border rounded-lg shadow-lg" style={{ backgroundColor: 'white', borderColor: chartColors.primary }}>
													<p className="font-semibold" style={{ color: chartColors.dark }}>
														Project: {label}
													</p>
													{mainData && (
														<p className="text-sm" style={{ color: chartColors.dark }}>
															{kpi1Config?.label}: {formatNumber(mainData.value)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
														</p>
													)}
													{biogenicData && (
														<p className="text-sm" style={{ color: chartColors.dark }}>
															Biogenic Carbon: {formatNumber(Math.abs(biogenicData.value))} {getUnitLabel(kpi1Config?.unit || '', valueType)}
														</p>
													)}
													{barChartBenchmarkLines.length > 0 && (
														<div className="mt-2 pt-2 border-t">
															<p className="text-xs font-medium" style={{ color: chartColors.dark }}>
																Benchmarks:
															</p>
															{barChartBenchmarkLines.map((benchmark, idx) => (
																<p key={idx} className="text-xs" style={{ color: chartColors.dark }}>
																	{benchmark.name}: {formatNumber(benchmark.value)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
																</p>
															))}
														</div>
													)}
												</div>
											);
										}
										return null;
									}}
								/>
								<Bar dataKey={selectedKPI1} fill={chartColors.primary} name={kpi1Config?.label || selectedKPI1} radius={[4, 4, 0, 0]}>
									{sortedProjects.map((project, index) => {
										const sectorColor = getSectorColor(project.typology);
										return <Cell key={index} fill={sectorColor} />;
									})}
								</Bar>
								{selectedKPI1 === 'totalEmbodiedCarbon' && (
									<Bar dataKey="biogenic" fill="white" name="biogenic" radius={[0, 0, 4, 4]}>
										{sortedProjects.map((project, index) => {
											const sectorColor = getSectorColor(project.typology);
											return <Cell key={index} fill="white" stroke={sectorColor} strokeWidth={2} />;
										})}
									</Bar>
								)}
								{selectedKPI1 === 'totalEmbodiedCarbon' && <ReferenceLine y={0} stroke="#A8A8A3" strokeWidth={2} />}

								{/* Benchmark lines for Total Embodied Carbon */}
								{benchmarkLines.map((benchmark, index) => (
									<ReferenceLine
										key={benchmark.name}
										y={benchmark.value}
										stroke={benchmark.color}
										strokeWidth={2}
										strokeDasharray="5 5"
										label={{
											value: benchmark.name,
											position: 'insideTopRight',
											offset: 10,
											style: { fill: benchmark.color, fontSize: '12px', fontWeight: 'bold' },
										}}
									/>
								))}

								{/* UKNZCBS Benchmark lines for Upfront Carbon */}
								{barChartBenchmarkLines.map((benchmark, index) => (
									<ReferenceLine
										key={benchmark.name}
										y={benchmark.value}
										stroke={benchmark.color}
										strokeWidth={2}
										strokeDasharray={benchmark.name.includes('New building') ? '5 5' : '10 5'}
									/>
								))}
							</BarChart>
						</ResponsiveContainer>
					</div>
				);

			