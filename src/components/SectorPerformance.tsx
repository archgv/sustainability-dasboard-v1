import { useState } from 'react';
import { ChevronDown, Download, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { formatNumber } from '@/lib/utils';
import { getSector, getSectorColor, sectorConfig } from '@/utils/projectUtils';

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

export const SectorPerformance = ({ projects }: SectorPerformanceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState('totalEmbodiedCarbon');
  const [valueType, setValueType] = useState('per-sqm');

  // Force per-sqm for biodiversity metrics
  const effectiveValueType = ['biodiversityNetGain', 'urbanGreeningFactor'].includes(selectedKPI) ? 'per-sqm' : valueType;
  const [yearFilter, setYearFilter] = useState('all');

  const kpiOptions = [
    { value: 'operationalEnergyTotal', label: 'Operational energy: Total', unit: 'kWh/m²/yr', totalUnit: 'MWh/yr' },
    { value: 'operationalEnergyPartL', label: 'Operational energy Part L', unit: 'kWh/m²/yr', totalUnit: 'MWh/yr' },
    { value: 'operationalEnergyGas', label: 'Operational energy: Gas', unit: 'kWh/m²/yr', totalUnit: 'MWh/yr' },
    { value: 'spaceHeatingDemand', label: 'Space heating demand', unit: 'kWh/m²/yr', totalUnit: 'MWh/yr' },
    { value: 'renewableEnergyGeneration', label: 'Renewable energy generation', unit: 'kWh/m²/yr', totalUnit: 'MWh/yr' },
    { value: 'upfrontCarbon', label: 'Upfront Carbon', unit: 'kgCO₂e/m²', totalUnit: 'tCO₂e' },
    { value: 'totalEmbodiedCarbon', label: 'Total Embodied Carbon', unit: 'kgCO₂e/m²', totalUnit: 'tCO₂e' },
    { value: 'biodiversityNetGain', label: 'Biodiversity net gain', unit: '%', totalUnit: '%' },
    { value: 'urbanGreeningFactor', label: 'Urban greening factor', unit: 'score', totalUnit: 'score' }
  ];

  const currentKPI = kpiOptions.find(kpi => kpi.value === selectedKPI);
  const allSectors = ['Residential', 'Education', 'Healthcare', 'Infrastructure', 'CCC', 'Commercial'];


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
    if (effectiveValueType === 'total' && gia > 0) {
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
    const baseValue = stats ? getAverage(stats.totalValue, stats.count) : 0;
    
    // For Total Embodied Carbon, also calculate biogenic data for negative columns
    let biogenicValue = 0;
    if (selectedKPI === 'totalEmbodiedCarbon' && stats) {
      const biogenicStats = filteredProjects.reduce((acc: any, project: any) => {
        const projectSector = getSector(project.typology);
        if (projectSector === sector) {
          const value = project.biogenicCarbon || 0;
          const gia = project.gia || 0;
          if (effectiveValueType === 'total' && gia > 0) {
            let totalValue = value * gia;
            totalValue = totalValue / 1000; // Convert kg to tonnes
            acc.totalValue += totalValue;
          } else {
            acc.totalValue += value;
          }
          acc.count += 1;
        }
        return acc;
      }, { totalValue: 0, count: 0 });
      
      biogenicValue = biogenicStats.count > 0 ? Math.round(biogenicStats.totalValue / biogenicStats.count) : 0;
    }
    
    return {
      sector: sector,
      value: baseValue,
      biogenicValue: -Math.abs(biogenicValue), // Make it negative
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
    const csvContent = ['Sector Performance Analysis', `KPI: ${currentKPI?.label} (${getDisplayUnit()})`, `Value Type: ${effectiveValueType}`, `Year Filter: ${yearFilter}`, '', 'Sector,Projects,Average,Min,Max,Range'].join('\n') + '\n';
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
    const blob = new Blob([fullCsvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sector-performance-${selectedKPI}-${effectiveValueType}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    console.log('Downloading PNG for sector performance analysis');

    // Create a canvas element with dimensions for full layout
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    // Set canvas dimensions for full layout
    canvas.width = 800;
    canvas.height = 1000;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let yPosition = 30;

    // Load and draw logo
    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.onload = () => {
      // Draw logo at top left
      const logoWidth = 80;
      const logoHeight = (logo.height / logo.width) * logoWidth;
      ctx.drawImage(logo, 20, yPosition, logoWidth, logoHeight);

      // Set font and color for title
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#272727';
      ctx.textAlign = 'center';

      yPosition = Math.max(yPosition + logoHeight + 20, 80);

      // Draw title with Average/Cumulative prefix
      const prefix = effectiveValueType === 'total' ? 'Cumulative' : 'Average';
      const title = `${prefix} ${currentKPI?.label.toLowerCase()} by sector (${getDisplayUnit()})`;
      ctx.fillText(title, canvas.width / 2, yPosition);
      yPosition += 60;

      // Draw chart
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

      // Modify SVG to use Arial font for axis labels
      let svgData = new XMLSerializer().serializeToString(svgElement);
      // Replace any font families with Arial
      svgData = svgData.replace(/font-family="[^"]*"/g, 'font-family="Arial, sans-serif"');
      svgData = svgData.replace(/font-family: [^;]*;/g, 'font-family: Arial, sans-serif;');
      // Also ensure text elements use Arial
      svgData = svgData.replace(/<text([^>]*)>/g, '<text$1 font-family="Arial, sans-serif">');
      
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        // Draw chart
        const chartHeight = 320;
        const chartWidth = 700;
        const chartX = (canvas.width - chartWidth) / 2;
        ctx.drawImage(img, chartX, yPosition, chartWidth, chartHeight);
        yPosition += chartHeight + 30;

        // Draw date range
        ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'left';
        const dateRangeText = yearFilter === 'all' ? 'Date range: All years' : `Date range: From ${yearFilter.replace('from-', '')}`;
        ctx.fillText(dateRangeText, 50, yPosition);
        yPosition += 40;

        // Draw table title
        ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('Summary Statistics', 50, yPosition);
        yPosition += 30;

        // Draw table
        const tableHeaders = effectiveValueType === 'per-sqm' 
          ? ['Sector', 'No. of projects', `Average (${getDisplayUnit()})`, 'Min', 'Max', 'Range']
          : ['Sector', 'No. of projects', `Cumulative total (${getDisplayUnit()})`, 'Min', 'Max', `Cumulative total Area (m²)`];
        
        const colWidths = [120, 100, 140, 80, 80, 120];
        const rowHeight = 25;
        let startX = 50;

        // Draw table headers
        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#E9E8D3';
        ctx.fillRect(startX, yPosition, colWidths.reduce((a, b) => a + b, 0), rowHeight);
        
        ctx.fillStyle = '#272727';
        ctx.strokeStyle = '#272727';
        ctx.lineWidth = 1;
        ctx.strokeRect(startX, yPosition, colWidths.reduce((a, b) => a + b, 0), rowHeight);

        let currentX = startX;
        tableHeaders.forEach((header, i) => {
          ctx.strokeRect(currentX, yPosition, colWidths[i], rowHeight);
          ctx.textAlign = i === 0 ? 'left' : 'center';
          const textX = i === 0 ? currentX + 5 : currentX + colWidths[i] / 2;
          ctx.fillText(header, textX, yPosition + 16);
          currentX += colWidths[i];
        });
        yPosition += rowHeight;

        // Draw table rows
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        allSectors.forEach(sector => {
          const stats = sectorStats[sector];
          const avg = stats ? getAverage(stats.totalValue, stats.count) : 0;
          const min = stats && stats.minValue !== Infinity ? Math.round(stats.minValue) : 0;
          const max = stats && stats.maxValue !== -Infinity ? Math.round(stats.maxValue) : 0;
          const range = max - min;
          const count = stats ? stats.count : 0;
          const totalArea = stats ? Math.round(stats.totalGIA) : 0;

          const rowData = effectiveValueType === 'per-sqm'
            ? [sector, count.toString(), formatNumber(avg), formatNumber(min), formatNumber(max), formatNumber(range)]
            : [sector, count.toString(), formatNumber(stats ? stats.totalValue : 0), formatNumber(min), formatNumber(max), formatNumber(totalArea)];

          ctx.strokeRect(startX, yPosition, colWidths.reduce((a, b) => a + b, 0), rowHeight);
          
          currentX = startX;
          rowData.forEach((data, i) => {
            ctx.strokeRect(currentX, yPosition, colWidths[i], rowHeight);
            ctx.textAlign = i === 0 ? 'left' : 'center';
            const textX = i === 0 ? currentX + 5 : currentX + colWidths[i] / 2;
            ctx.fillText(data, textX, yPosition + 16);
            currentX += colWidths[i];
          });
          yPosition += rowHeight;
        });

        // Convert canvas to PNG and download
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sector-performance-${selectedKPI}-${effectiveValueType}-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    };
    logo.src = '/lovable-uploads/4ce0bfd4-e09c-45a3-bb7c-0a84df6eca91.png';
  };

  const getDisplayUnit = () => {
    if (effectiveValueType === 'total') {
      return currentKPI?.totalUnit || '';
    }
    return currentKPI?.unit || '';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h2 className="text-xl font-semibold" style={{ color: chartColors.dark }}>Sector Performance Analysis</h2>
        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} style={{ color: chartColors.primary }} />
      </div>
      
      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium" style={{ color: chartColors.dark }}>KPI:</label>
              <Select value={selectedKPI} onValueChange={setSelectedKPI}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {kpiOptions.map(kpi => (
                    <SelectItem key={kpi.value} value={kpi.value}>
                      {kpi.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Only show value type selector for non-biodiversity KPIs */}
            {!['biodiversityNetGain', 'urbanGreeningFactor'].includes(selectedKPI) && (
              <div className="flex items-center space-x-2">
                <div style={{ backgroundColor: chartColors.accent1 }} className="flex rounded-md p-1 bg-slate-100">
                  <button
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${valueType === 'per-sqm' ? 'bg-white shadow-sm' : 'hover:opacity-80'}`}
                    style={{
                      color: valueType === 'per-sqm' ? chartColors.dark : chartColors.darkGreen,
                      backgroundColor: valueType === 'per-sqm' ? 'white' : 'transparent'
                    }}
                    onClick={() => setValueType('per-sqm')}
                  >
                    Average per m²
                  </button>
                  <button
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${valueType === 'total' ? 'bg-white shadow-sm' : 'hover:opacity-80'}`}
                    style={{
                      color: valueType === 'total' ? chartColors.dark : chartColors.darkGreen,
                      backgroundColor: valueType === 'total' ? 'white' : 'transparent'
                    }}
                    onClick={() => setValueType('total')}
                  >
                    Cumulative total
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  {getYearOptions().map(year => (
                    <SelectItem key={year} value={`from-${year}`}>
                      From {year}
                    </SelectItem>
                  ))}
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
            <h3 className="text-lg font-semibold mb-4" style={{ color: chartColors.dark }}>
              {currentKPI?.label} by Sector ({getDisplayUnit()})
            </h3>
            <div className="h-80" data-chart="sector-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} />
                  <XAxis 
                    dataKey="sector" 
                    tick={{ fill: chartColors.dark, dy: 20 }} 
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    label={{
                      value: `${currentKPI?.label} (${getDisplayUnit()})`,
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                    tick={{ fill: chartColors.dark }}
                    tickFormatter={(value) => formatNumber(value)}
                    domain={selectedKPI === 'totalEmbodiedCarbon' ? 
                      [-200, 800] : 
                      ['dataMin', 'dataMax']
                    }
                    ticks={selectedKPI === 'totalEmbodiedCarbon' ? 
                      [-200, 0, 200, 400, 600, 800] : 
                      undefined
                    }
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      if (selectedKPI === 'totalEmbodiedCarbon') {
                        const data = props.payload;
                        const wholeLifeCarbon = formatNumber(Number(data.value));
                        const biogenic = formatNumber(Number(data.biogenicValue));
                        return [
                          `${wholeLifeCarbon} ${getDisplayUnit()}`,
                          effectiveValueType === 'total' ? 'Average Whole Life Carbon' : 'Average Whole Life Carbon'
                        ];
                      }
                      return [`${formatNumber(Number(value))} ${getDisplayUnit()}`, effectiveValueType === 'total' ? 'Cumulative total' : 'Average'];
                    }}
                    labelFormatter={label => `Sector: ${label}`}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length && selectedKPI === 'totalEmbodiedCarbon') {
                        const data = payload[0].payload;
                        return (
                          <div style={{
                            backgroundColor: 'white',
                            border: `1px solid ${chartColors.primary}`,
                            borderRadius: '8px',
                            padding: '8px'
                          }}>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{`Sector: ${label}`}</p>
                            <p style={{ margin: 0, color: chartColors.primary }}>
                              {`Average Whole Life Carbon: ${formatNumber(data.value)} ${getDisplayUnit()}`}
                            </p>
                            <p style={{ margin: 0, color: chartColors.dark }}>
                              {`Average biogenic: ${formatNumber(data.biogenicValue)} ${getDisplayUnit()}`}
                            </p>
                          </div>
                        );
                      }
                      if (active && payload && payload.length) {
                        return (
                          <div style={{
                            backgroundColor: 'white',
                            border: `1px solid ${chartColors.primary}`,
                            borderRadius: '8px',
                            padding: '8px'
                          }}>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{`Sector: ${label}`}</p>
                            <p style={{ margin: 0, color: chartColors.primary }}>
                              {`${effectiveValueType === 'total' ? 'Cumulative total' : 'Average'}: ${formatNumber(Number(payload[0].value))} ${getDisplayUnit()}`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" stackId="stack">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={sectorConfig[entry.sector as keyof typeof sectorConfig]?.color || chartColors.primary} />
                    ))}
                  </Bar>
                  {/* Show biogenic data as negative bars underneath for Total Embodied Carbon */}
                  {selectedKPI === 'totalEmbodiedCarbon' && (
                    <Bar dataKey="biogenicValue" stackId="stack">
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`biogenic-cell-${index}`} 
                          fill="white"
                          stroke={sectorConfig[entry.sector as keyof typeof sectorConfig]?.color || chartColors.primary}
                          strokeWidth={2}
                        />
                      ))}
                    </Bar>
                  )}
                  <ReferenceLine y={0} stroke={chartColors.dark} strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Statistics Table */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4" style={{ color: chartColors.dark }}>Summary Statistics</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border" style={{ borderColor: chartColors.dark }}>
                <thead>
                  <tr style={{ backgroundColor: chartColors.accent1 }}>
                    <th className="border px-4 py-2 text-left" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>Sector</th>
                    <th className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>No. of projects</th>
                    {effectiveValueType === 'per-sqm' ? (
                      <>
                        <th className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>Average ({getDisplayUnit()})</th>
                        <th className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>Min</th>
                        <th className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>Max</th>
                        <th className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>Range</th>
                      </>
                    ) : (
                      <>
                        <th className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>Cumulative total ({getDisplayUnit()})</th>
                        <th className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>Min</th>
                        <th className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>Max</th>
                        <th className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>Cumulative total Area (m²)</th>
                      </>
                    )}
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
                    const totalArea = stats ? Math.round(stats.totalGIA) : 0;
                    return (
                      <tr key={sector}>
                        <td className="border px-4 py-2 font-medium" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>{sector}</td>
                        <td className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>{count}</td>
                        {effectiveValueType === 'per-sqm' ? (
                          <>
                            <td className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>
                              {formatNumber(avg)}
                            </td>
                            <td className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>{formatNumber(min)}</td>
                            <td className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>{formatNumber(max)}</td>
                            <td className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>{formatNumber(range)}</td>
                          </>
                        ) : (
                          <>
                            <td className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>
                              {formatNumber(stats ? stats.totalValue : 0)}
                            </td>
                            <td className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>{formatNumber(min)}</td>
                            <td className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>{formatNumber(max)}</td>
                            <td className="border px-4 py-2 text-center" style={{ borderColor: chartColors.dark, color: chartColors.dark }}>{formatNumber(totalArea)}</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};