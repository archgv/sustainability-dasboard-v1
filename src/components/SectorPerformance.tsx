import { useState } from 'react';
import { ChevronDown, Download, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '@/lib/utils';
interface SectorPerformanceProps {
  projects: any[];
}

// Custom color palette matching ChartSection
const chartColors = {
  primary: '#2D9B4D',      // Updated to green as requested
  secondary: '#48DE9D',    // Bright green
  tertiary: '#FF8EE5',     // Updated bright pink as requested
  quaternary: '#5dc5ed',   // Light blue
  accent1: '#E9E8D3',      // Updated light green fill as requested
  accent2: '#c9e1ea',      // Light blue/grey
  dark: '#272727',         // Updated dark gray as requested
  darkGreen: '#004033',    // Dark green
  muted: '#272727'         // Updated to use new dark gray
};
export const SectorPerformance = ({
  projects
}: SectorPerformanceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState('totalEmbodiedCarbon');
  const [valueType, setValueType] = useState('per-sqm');
  const [yearFilter, setYearFilter] = useState('all');
  const kpiOptions = [{
    value: 'upfrontCarbon',
    label: 'Upfront Carbon',
    unit: 'kgCO₂e/m²',
    totalUnit: 'tCO₂e'
  }, {
    value: 'totalEmbodiedCarbon',
    label: 'Total Embodied Carbon',
    unit: 'kgCO₂e/m²',
    totalUnit: 'tCO₂e'
  }, {
    value: 'refrigerants',
    label: 'Refrigerants',
    unit: 'kgCO₂e/m²',
    totalUnit: 'tCO₂e'
  }, {
    value: 'operationalEnergy',
    label: 'Operational Energy',
    unit: 'kWh/m²/yr',
    totalUnit: 'MWh/yr'
  }, {
    value: 'gasUsage',
    label: 'Gas Usage',
    unit: 'kWh/m²/yr',
    totalUnit: 'MWh/yr'
  }, {
    value: 'biodiversityNetGain',
    label: 'Biodiversity Net Gain',
    unit: '%',
    totalUnit: '%'
  }, {
    value: 'habitatUnits',
    label: 'Habitat Units Gained',
    unit: 'units',
    totalUnit: 'units'
  }, {
    value: 'urbanGreeningFactor',
    label: 'Urban Greening Factor',
    unit: 'score',
    totalUnit: 'score'
  }];
  const currentKPI = kpiOptions.find(kpi => kpi.value === selectedKPI);
  const allSectors = ['Residential', 'Education', 'Healthcare', 'Infrastructure', 'CCC', 'Commercial'];

  // Map typologies to the correct sectors
  const getSector = (typology: string) => {
    const sectorMap: {
      [key: string]: string;
    } = {
      'residential': 'Residential',
      'educational': 'Education',
      'healthcare': 'Healthcare',
      'infrastructure': 'Infrastructure',
      'ccc': 'CCC',
      'office': 'Commercial',
      'retail': 'Commercial',
      'mixed-use': 'Commercial'
    };
    return sectorMap[typology] || 'Commercial';
  };

  // Filter projects by year if needed
  const filteredProjects = yearFilter === 'all' ? projects : projects.filter(project => {
    const projectYear = new Date(project.completionDate).getFullYear();
    const filterYear = parseInt(yearFilter.replace('from-', ''));
    return projectYear >= filterYear;
  });
  const sectorStats = filteredProjects.reduce((acc: any, project: any) => {
    const sector = getSector(project.typology);
    if (!acc[sector]) {
      acc[sector] = {
        count: 0,
        totalValue: 0,
        totalGIA: 0,
        minValue: Infinity,
        maxValue: -Infinity,
        values: []
      };
    }
    acc[sector].count++;
    const value = project[selectedKPI] || 0;
    const gia = project.gia || 0;
    if (valueType === 'total' && gia > 0) {
      let totalValue = value * gia;
      // Convert to appropriate units for totals
      if (selectedKPI === 'upfrontCarbon' || selectedKPI === 'totalEmbodiedCarbon' || selectedKPI === 'refrigerants') {
        totalValue = totalValue / 1000; // Convert kg to tonnes
      } else if (selectedKPI === 'operationalEnergy' || selectedKPI === 'gasUsage') {
        totalValue = totalValue / 1000; // Convert kWh to MWh
      }
      acc[sector].totalValue += totalValue;
      acc[sector].minValue = Math.min(acc[sector].minValue, totalValue);
      acc[sector].maxValue = Math.max(acc[sector].maxValue, totalValue);
      acc[sector].values.push(totalValue);
    } else {
      acc[sector].totalValue += value;
      acc[sector].minValue = Math.min(acc[sector].minValue, value);
      acc[sector].maxValue = Math.max(acc[sector].maxValue, value);
      acc[sector].values.push(value);
    }
    acc[sector].totalGIA += gia;
    return acc;
  }, {});
  const getAverage = (total: number, count: number) => {
    return count > 0 ? Math.round(total / count) : 0;
  };

  // Create chart data ensuring all sectors are included
  const chartData = allSectors.map(sector => {
    const stats = sectorStats[sector];
    return {
      sector: sector,
      value: stats ? getAverage(stats.totalValue, stats.count) : 0,
      count: stats ? stats.count : 0
    };
  });
  const getYearOptions = () => {
    const years = projects.map(p => new Date(p.completionDate).getFullYear());
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
    return uniqueYears;
  };
  const handleDownloadCSV = () => {
    console.log('Downloading CSV for sector performance analysis');
    const csvContent = ['Sector Performance Analysis', `KPI: ${currentKPI?.label} (${getDisplayUnit()})`, `Value Type: ${valueType}`, `Year Filter: ${yearFilter}`, '', 'Sector,Projects,Average,Min,Max,Range'].join('\n') + '\n';
    const csvData = allSectors.map(sector => {
      const stats = sectorStats[sector];
      const avg = stats ? getAverage(stats.totalValue, stats.count) : 0;
      const min = stats && stats.minValue !== Infinity ? Math.round(stats.minValue) : 0;
      const max = stats && stats.maxValue !== -Infinity ? Math.round(stats.maxValue) : 0;
      const range = max - min;
      const count = stats ? stats.count : 0;
      return `${sector},${count},${formatNumber(avg)},${formatNumber(min)},${formatNumber(max)},${formatNumber(range)}`;
    }).join('\n');
    const fullCsvContent = csvContent + csvData;
    const blob = new Blob([fullCsvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sector-performance-${selectedKPI}-${valueType}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleDownloadPNG = () => {
    console.log('Downloading PNG for sector performance analysis');

    // Find the chart SVG element within this component
    const chartContainer = document.querySelector('[data-chart="sector-chart"]');
    if (!chartContainer) {
      console.error('Sector chart container not found');
      return;
    }
    const svgElement = chartContainer.querySelector('svg');
    if (!svgElement) {
      console.error('Sector chart SVG element not found');
      return;
    }

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    // Set canvas dimensions
    const svgRect = svgElement.getBoundingClientRect();
    canvas.width = svgRect.width * 2; // Higher resolution
    canvas.height = svgRect.height * 2;
    ctx.scale(2, 2);

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8'
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create image and draw to canvas
    const img = new Image();
    img.onload = () => {
      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

      // Draw the SVG image
      ctx.drawImage(img, 0, 0, svgRect.width, svgRect.height);

      // Convert canvas to PNG and download
      canvas.toBlob(blob => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sector-performance-${selectedKPI}-${valueType}-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };
  const getDisplayUnit = () => {
    if (valueType === 'total') {
      return currentKPI?.totalUnit || '';
    }
    return currentKPI?.unit || '';
  };
  return <Card className="p-6">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h2 className="text-xl font-semibold" style={{
        color: chartColors.dark
      }}>Sector Performance Analysis</h2>
        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} style={{
        color: chartColors.primary
      }} />
      </div>
      
      {isExpanded && <div className="mt-6 space-y-6">
          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium" style={{
            color: chartColors.dark
          }}>KPI:</label>
              <Select value={selectedKPI} onValueChange={setSelectedKPI}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {kpiOptions.map(kpi => <SelectItem key={kpi.value} value={kpi.value}>
                      {kpi.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <div style={{
            backgroundColor: chartColors.accent1
          }} className="flex rounded-md p-1 bg-slate-100">
                <button className={`px-3 py-1 rounded text-sm font-medium transition-colors ${valueType === 'per-sqm' ? 'bg-white shadow-sm' : 'hover:opacity-80'}`} style={{
              color: valueType === 'per-sqm' ? chartColors.dark : chartColors.darkGreen,
              backgroundColor: valueType === 'per-sqm' ? 'white' : 'transparent'
            }} onClick={() => setValueType('per-sqm')}>
                  Per m²
                </button>
                <button className={`px-3 py-1 rounded text-sm font-medium transition-colors ${valueType === 'total' ? 'bg-white shadow-sm' : 'hover:opacity-80'}`} style={{
              color: valueType === 'total' ? chartColors.dark : chartColors.darkGreen,
              backgroundColor: valueType === 'total' ? 'white' : 'transparent'
            }} onClick={() => setValueType('total')}>
                  Total
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  {getYearOptions().map(year => <SelectItem key={year} value={`from-${year}`}>
                      From {year}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <Button variant="outline" size="sm" onClick={handleDownloadCSV} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPNG} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                PNG
              </Button>
            </div>
          </div>

          {/* Chart Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{
          color: chartColors.dark
        }}>
              {currentKPI?.label} by Sector ({getDisplayUnit()})
            </h3>
            <div className="h-80" data-chart="sector-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} />
                  <XAxis dataKey="sector" tick={{
                fill: chartColors.dark
              }} />
                  <YAxis label={{
                value: `${currentKPI?.label} (${getDisplayUnit()})`,
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }} tick={{
                fill: chartColors.dark
              }} 
              tickFormatter={(value) => formatNumber(value)} />
                  <Tooltip formatter={value => [`${formatNumber(Number(value))} ${getDisplayUnit()}`, 'Average']} labelFormatter={label => `Sector: ${label}`} contentStyle={{
                backgroundColor: 'white',
                border: `1px solid ${chartColors.primary}`,
                borderRadius: '8px'
              }} />
                  <Bar dataKey="value" fill={chartColors.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Statistics Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{
          color: chartColors.dark
        }}>Summary Statistics</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border" style={{
            borderColor: chartColors.primary
          }}>
                <thead>
                  <tr style={{
                backgroundColor: chartColors.accent1
              }}>
                    <th className="border px-4 py-2 text-left" style={{
                  borderColor: chartColors.primary,
                  color: chartColors.dark
                }}>Sector</th>
                    <th className="border px-4 py-2 text-center" style={{
                  borderColor: chartColors.primary,
                  color: chartColors.dark
                }}>Projects</th>
                    <th className="border px-4 py-2 text-center" style={{
                  borderColor: chartColors.primary,
                  color: chartColors.dark
                }}>Average</th>
                    <th className="border px-4 py-2 text-center" style={{
                  borderColor: chartColors.primary,
                  color: chartColors.dark
                }}>Min</th>
                    <th className="border px-4 py-2 text-center" style={{
                  borderColor: chartColors.primary,
                  color: chartColors.dark
                }}>Max</th>
                    <th className="border px-4 py-2 text-center" style={{
                  borderColor: chartColors.primary,
                  color: chartColors.dark
                }}>Range</th>
                  </tr>
                </thead>
                <tbody>
                  {allSectors.map(sector => {
                const stats = sectorStats[sector];
                const avg = stats ? getAverage(stats.totalValue, stats.count) : 0;
                const min = stats && stats.minValue !== Infinity ? Math.round(stats.minValue) : 0;
                const max = stats && stats.maxValue !== -Infinity ? Math.round(stats.maxValue) : 0;
                const range = max - min;
                const count = stats ? stats.count : 0;
                return <tr key={sector}>
                        <td className="border px-4 py-2 font-medium" style={{
                    borderColor: chartColors.primary,
                    color: chartColors.dark
                  }}>{sector}</td>
                        <td className="border px-4 py-2 text-center" style={{
                    borderColor: chartColors.primary,
                    color: chartColors.dark
                  }}>{count}</td>
                        <td className="border px-4 py-2 text-center" style={{
                    borderColor: chartColors.primary,
                    color: chartColors.dark
                  }}>
                          {formatNumber(avg)} {getDisplayUnit()}
                        </td>
                        <td className="border px-4 py-2 text-center" style={{
                    borderColor: chartColors.primary,
                    color: chartColors.dark
                  }}>{formatNumber(min)}</td>
                        <td className="border px-4 py-2 text-center" style={{
                    borderColor: chartColors.primary,
                    color: chartColors.dark
                  }}>{formatNumber(max)}</td>
                        <td className="border px-4 py-2 text-center" style={{
                    borderColor: chartColors.primary,
                    color: chartColors.dark
                  }}>{formatNumber(range)}</td>
                      </tr>;
              })}
                </tbody>
              </table>
            </div>
          </div>
        </div>}
    </Card>;
};