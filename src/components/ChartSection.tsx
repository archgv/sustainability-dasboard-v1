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

interface ChartSectionProps {
  projects: Project[];
  chartType: ChartType;
  selectedKPI1: string;
  selectedKPI2: string;
  embodiedCarbonBreakdown: EmbodiedCarbonBreakdown;
  valueType: ValueType;
  isComparingToSelf?: boolean;
  selectedRibaStages?: string[];
}

// Custom color palette based on your specifications
const chartColors = {
  primary: '#2D9B4D',      // Updated to green as requested
  secondary: '#48DE9D',    // Bright green
  tertiary: '#FF8EE5',     // Updated bright pink as requested
  quaternary: '#5dc5ed',   // Light blue
  accent1: '#E9E8D3',      // Updated light green fill as requested
  accent2: '#c9e1ea',      // Light blue/grey
  dark: '#272727',         // Updated dark gray as requested
  darkGreen: '#004033',    // Dark green
  benchmark: '#e74c3c',    // Red for benchmark lines
  // Additional complementary colors
  warning: '#f39c12',      // Orange
  info: '#3498db',         // Medium blue
  success: '#2D9B4D',      // Updated to use new green
  muted: '#272727'         // Updated to use new dark gray
};

// Color arrays for different chart types
const seriesColors = [
  chartColors.primary,
  chartColors.secondary,
  chartColors.tertiary,
  chartColors.quaternary,
  chartColors.warning,
  chartColors.info,
  chartColors.success,
  chartColors.muted,
  chartColors.darkGreen
];

// Utility function to generate nice, regular tick intervals
const generateNiceTicks = (maxValue: number, tickCount: number = 5): number[] => {
  if (maxValue <= 0) return [0];
  
  // Calculate step size
  const roughStep = maxValue / (tickCount - 1);
  
  // Round step to nice numbers (1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, etc.)
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalizedStep = roughStep / magnitude;
  
  let niceStep;
  if (normalizedStep <= 1) niceStep = 1;
  else if (normalizedStep <= 2) niceStep = 2;
  else if (normalizedStep <= 5) niceStep = 5;
  else niceStep = 10;
  
  const finalStep = niceStep * magnitude;
  
  // Generate ticks
  const ticks = [];
  for (let i = 0; i <= Math.ceil(maxValue / finalStep); i++) {
    ticks.push(i * finalStep);
  }
  
  return ticks;
};

export const ChartSection = ({ 
  projects, 
  chartType, 
  selectedKPI1, 
  selectedKPI2, 
  embodiedCarbonBreakdown,
  valueType,
  isComparingToSelf = false,
  selectedRibaStages = []
}: ChartSectionProps) => {
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  
  const kpi1Config = availableKPIs.find(kpi => kpi.key === selectedKPI1);
  const kpi2Config = availableKPIs.find(kpi => kpi.key === selectedKPI2);

  // Benchmark data for Total Embodied Carbon
  const totalEmbodiedCarbonBenchmarks = {
    'Residential': {
      'Business as usual': 1200,
      'RIBA 2025': 800,
      'RIBA 2030': 625
    },
    'Workplace': {
      'Business as usual': 1400,
      'RIBA 2025': 970,
      'RIBA 2030': 750
    },
    'Education': {
      'Business as usual': 1400,
      'RIBA 2025': 675,
      'RIBA 2030': 540
    }
  };

  // UKNZCBS benchmark data by sector
  const uknzcbsBenchmarks = {
    'Workplace': { 2025: 580, 2026: 550, 2027: 525, 2028: 495, 2029: 465, 2030: 435, 2031: 405, 2032: 380, 2033: 350, 2034: 315, 2035: 285, 2036: 260, 2037: 240, 2038: 220, 2039: 200, 2040: 185, 2041: 165, 2042: 150, 2043: 135, 2044: 120, 2045: 105, 2046: 95, 2047: 80, 2048: 70, 2049: 60, 2050: 45 },
    'Residential': { 2025: 570, 2026: 540, 2027: 515, 2028: 485, 2029: 460, 2030: 425, 2031: 400, 2032: 375, 2033: 340, 2034: 310, 2035: 280, 2036: 255, 2037: 235, 2038: 215, 2039: 200, 2040: 180, 2041: 165, 2042: 150, 2043: 135, 2044: 120, 2045: 105, 2046: 90, 2047: 80, 2048: 70, 2049: 55, 2050: 45 },
    'CCC': { 2025: 855, 2026: 810, 2027: 770, 2028: 725, 2029: 685, 2030: 640, 2031: 595, 2032: 560, 2033: 510, 2034: 465, 2035: 420, 2036: 380, 2037: 350, 2038: 325, 2039: 295, 2040: 270, 2041: 245, 2042: 220, 2043: 200, 2044: 175, 2045: 155, 2046: 135, 2047: 120, 2048: 100, 2049: 85, 2050: 70 },
    'Healthcare': { 2025: 790, 2026: 750, 2027: 710, 2028: 670, 2029: 635, 2030: 590, 2031: 550, 2032: 515, 2033: 475, 2034: 430, 2035: 390, 2036: 350, 2037: 325, 2038: 300, 2039: 275, 2040: 250, 2041: 225, 2042: 205, 2043: 185, 2044: 165, 2045: 145, 2046: 125, 2047: 110, 2048: 95, 2049: 80, 2050: 65 },
    'Education': { 2025: 640, 2026: 610, 2027: 575, 2028: 545, 2029: 515, 2030: 480, 2031: 445, 2032: 420, 2033: 385, 2034: 350, 2035: 315, 2036: 285, 2037: 265, 2038: 240, 2039: 225, 2040: 205, 2041: 185, 2042: 165, 2043: 150, 2044: 135, 2045: 115, 2046: 105, 2047: 90, 2048: 75, 2049: 65, 2050: 50 },
    'Infrastructure': { 2025: 565, 2026: 525, 2027: 490, 2028: 450, 2029: 420, 2030: 380, 2031: 355, 2032: 335, 2033: 305, 2034: 280, 2035: 250, 2036: 225, 2037: 210, 2038: 195, 2039: 175, 2040: 160, 2041: 145, 2042: 135, 2043: 120, 2044: 105, 2045: 95, 2046: 80, 2047: 70, 2048: 60, 2049: 50, 2050: 40 }
  };

  // Upfront Carbon benchmark data - different from total embodied carbon
  // Sub-sector mapping to sector benchmarks for upfront carbon
  const upfrontCarbonSubSectorMapping = {
    'Culture & entertainment (Performance)': 'CCC',
    'Culture & entertainment (General)': 'CCC', 
    'Higher education': 'Education',
    'Schools': 'Education',
    'Healthcare': 'Healthcare',
    'Single family homes': 'Residential',
    'Flats': 'Residential',
    'Hotels': 'Residential',
    'Commercial residential': 'Residential',
    'Science & technology': 'Workplace',
    'Workplace (Whole building)': 'Workplace',
    'Workplace (Shell & core)': 'Workplace'
  };

  // Upfront Carbon benchmarks for New Building and Retrofit by sector
  const upfrontCarbonBenchmarks = {
    'CCC': {
      'New building': { 2025: 620, 2026: 590, 2027: 560, 2028: 530, 2029: 500, 2030: 470, 2031: 440, 2032: 415, 2033: 385, 2034: 355, 2035: 325, 2036: 295, 2037: 270, 2038: 250, 2039: 230, 2040: 210, 2041: 190, 2042: 175, 2043: 160, 2044: 145, 2045: 130, 2046: 115, 2047: 100, 2048: 85, 2049: 70, 2050: 55 },
      'Retrofit': { 2025: 310, 2026: 295, 2027: 280, 2028: 265, 2029: 250, 2030: 235, 2031: 220, 2032: 207, 2033: 192, 2034: 177, 2035: 162, 2036: 147, 2037: 135, 2038: 125, 2039: 115, 2040: 105, 2041: 95, 2042: 87, 2043: 80, 2044: 72, 2045: 65, 2046: 57, 2047: 50, 2048: 42, 2049: 35, 2050: 27 }
    },
    'Education': {
      'New building': { 2025: 465, 2026: 440, 2027: 420, 2028: 395, 2029: 375, 2030: 350, 2031: 325, 2032: 305, 2033: 280, 2034: 255, 2035: 230, 2036: 210, 2037: 195, 2038: 180, 2039: 165, 2040: 150, 2041: 135, 2042: 120, 2043: 110, 2044: 100, 2045: 90, 2046: 80, 2047: 70, 2048: 60, 2049: 50, 2050: 40 },
      'Retrofit': { 2025: 232, 2026: 220, 2027: 210, 2028: 197, 2029: 187, 2030: 175, 2031: 162, 2032: 152, 2033: 140, 2034: 127, 2035: 115, 2036: 105, 2037: 97, 2038: 90, 2039: 82, 2040: 75, 2041: 67, 2042: 60, 2043: 55, 2044: 50, 2045: 45, 2046: 40, 2047: 35, 2048: 30, 2049: 25, 2050: 20 }
    },
    'Healthcare': {
      'New building': { 2025: 575, 2026: 545, 2027: 515, 2028: 485, 2029: 460, 2030: 430, 2031: 400, 2032: 375, 2033: 345, 2034: 315, 2035: 285, 2036: 255, 2037: 235, 2038: 220, 2039: 200, 2040: 185, 2041: 165, 2042: 150, 2043: 135, 2044: 120, 2045: 105, 2046: 90, 2047: 80, 2048: 70, 2049: 60, 2050: 50 },
      'Retrofit': { 2025: 287, 2026: 272, 2027: 257, 2028: 242, 2029: 230, 2030: 215, 2031: 200, 2032: 187, 2033: 172, 2034: 157, 2035: 142, 2036: 127, 2037: 117, 2038: 110, 2039: 100, 2040: 92, 2041: 82, 2042: 75, 2043: 67, 2044: 60, 2045: 52, 2046: 45, 2047: 40, 2048: 35, 2049: 30, 2050: 25 }
    },
    'Residential': {
      'New building': { 2025: 415, 2026: 395, 2027: 375, 2028: 355, 2029: 335, 2030: 310, 2031: 290, 2032: 270, 2033: 245, 2034: 225, 2035: 205, 2036: 185, 2037: 170, 2038: 155, 2039: 145, 2040: 130, 2041: 120, 2042: 110, 2043: 100, 2044: 90, 2045: 80, 2046: 70, 2047: 60, 2048: 50, 2049: 40, 2050: 35 },
      'Retrofit': { 2025: 207, 2026: 197, 2027: 187, 2028: 177, 2029: 167, 2030: 155, 2031: 145, 2032: 135, 2033: 122, 2034: 112, 2035: 102, 2036: 92, 2037: 85, 2038: 77, 2039: 72, 2040: 65, 2041: 60, 2042: 55, 2043: 50, 2044: 45, 2045: 40, 2046: 35, 2047: 30, 2048: 25, 2049: 20, 2050: 17 }
    },
    'Workplace': {
      'New building': { 2025: 420, 2026: 400, 2027: 380, 2028: 360, 2029: 340, 2030: 315, 2031: 295, 2032: 275, 2033: 250, 2034: 230, 2035: 210, 2036: 190, 2037: 175, 2038: 160, 2039: 145, 2040: 135, 2041: 120, 2042: 110, 2043: 100, 2044: 90, 2045: 80, 2046: 70, 2047: 60, 2048: 50, 2049: 45, 2050: 35 },
      'Retrofit': { 2025: 210, 2026: 200, 2027: 190, 2028: 180, 2029: 170, 2030: 157, 2031: 147, 2032: 137, 2033: 125, 2034: 115, 2035: 105, 2036: 95, 2037: 87, 2038: 80, 2039: 72, 2040: 67, 2041: 60, 2042: 55, 2043: 50, 2044: 45, 2045: 40, 2046: 35, 2047: 30, 2048: 25, 2049: 22, 2050: 17 }
    },
    'Infrastructure': {
      'New building': { 2025: 410, 2026: 385, 2027: 360, 2028: 335, 2029: 315, 2030: 290, 2031: 270, 2032: 250, 2033: 225, 2034: 205, 2035: 185, 2036: 165, 2037: 150, 2038: 140, 2039: 125, 2040: 115, 2041: 105, 2042: 95, 2043: 85, 2044: 75, 2045: 70, 2046: 60, 2047: 50, 2048: 45, 2049: 35, 2050: 30 },
      'Retrofit': { 2025: 205, 2026: 192, 2027: 180, 2028: 167, 2029: 157, 2030: 145, 2031: 135, 2032: 125, 2033: 112, 2034: 102, 2035: 92, 2036: 82, 2037: 75, 2038: 70, 2039: 62, 2040: 57, 2041: 52, 2042: 47, 2043: 42, 2044: 37, 2045: 35, 2046: 30, 2047: 25, 2048: 22, 2049: 17, 2050: 15 }
    }
  };


  // Mock building area data for demonstration
  const getProjectArea = (projectId: string): number => {
    const areas: Record<string, number> = {
      '1': 15000, // Green Office Tower
      '2': 8500,  // Sustainable Housing Complex
      '3': 22000, // Innovation Campus
      '4': 12000, // Community Health Center
      '5': 18000  // Urban Retail Hub
    };
    return areas[projectId] || 10000;
  };

  const transformDataForValueType = (data: any[]) => {
    if (valueType === 'per-sqm') {
      return data; // Data is already per sqm in our KPIs
    }
    
    // For total values, multiply by building area
    return data.map(item => ({
      ...item,
      [selectedKPI1]: item[selectedKPI1] * getProjectArea(item.id.split('-')[0]), // Handle RIBA stage variants
      [selectedKPI2]: selectedKPI2 ? item[selectedKPI2] * getProjectArea(item.id.split('-')[0]) : undefined
    }));
  };

  const handleExportCSV = () => {
    const chartTitle = getChartTitle();
    let csvContent = `${chartTitle}\n\n`;
    
    if (chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon' && embodiedCarbonBreakdown !== 'none') {
      const breakdownData = getEmbodiedCarbonStackedData();
      
      // CSV headers
      const headers = ['Project Name'];
      const categories = embodiedCarbonBreakdown === 'lifecycle' 
        ? getLifecycleStageCategories()
        : getBuildingElementCategories();
      categories.forEach(cat => headers.push(`${cat.label} (${getUnitLabel(kpi1Config?.unit || '', valueType, true)})`));
      
      csvContent += headers.join(',') + '\n';
      
      // CSV data rows
      breakdownData.forEach(item => {
        const row = [item.name];
        categories.forEach(cat => {
          // Make biogenic carbon negative in CSV export
          const value = cat.key === 'biogenicCarbon' ? -Math.abs(item[cat.key] || 0) : (item[cat.key] || 0);
          row.push(value.toString());
        });
        csvContent += row.join(',') + '\n';
      });
    } else {
      const transformedProjects = transformDataForValueType(projects);
      
      // CSV headers
      const headers = ['Project Name', `${kpi1Config?.label || selectedKPI1} (${getUnitLabel(kpi1Config?.unit || '', valueType, true)})`];
      
      // For Total Embodied Carbon charts, include biogenic carbon column
      if (chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon') {
        headers.push(`Biogenic (${getUnitLabel(kpi1Config?.unit || '', valueType, true)})`);
      }
      
      if (chartType === 'compare-bubble') {
        headers.push(`${kpi2Config?.label || selectedKPI2} (${getUnitLabel(kpi2Config?.unit || '', valueType, true)})`);
        headers.push('Building Area (m²)');
      }
      if (chartType === 'single-timeline') {
        headers.push('Completion Year');
      }
      csvContent += headers.join(',') + '\n';
      
      // CSV data rows
      transformedProjects.forEach(project => {
        const baseId = project.id.split('-')[0];
        const displayName = isComparingToSelf && project.ribaStage 
          ? `${project.name} (RIBA ${project.ribaStage.replace('stage-', '')})`
          : project.name;
        
        const row = [
          `"${displayName}"`,
          project[selectedKPI1 as keyof Project]?.toString() || '0'
        ];
        
        // For Total Embodied Carbon charts, add biogenic carbon as negative value
        if (chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon') {
          const biogenicValue = project.biogenicCarbon || 0;
          const finalBiogenicValue = valueType === 'total' 
            ? -Math.abs(biogenicValue * getProjectArea(baseId))
            : -Math.abs(biogenicValue);
          row.push(finalBiogenicValue.toString());
        }
        
        if (chartType === 'compare-bubble') {
          row.push(project[selectedKPI2 as keyof Project]?.toString() || '0');
          row.push(getProjectArea(baseId).toString());
        }
        if (chartType === 'single-timeline') {
          row.push(new Date(project.completionDate).getFullYear().toString());
        }
        
        csvContent += row.join(',') + '\n';
      });
    }
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart-data-${selectedKPI1}-${valueType}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    // Find the chart SVG element - use specific selector to avoid conflicts
    const chartContainer = document.querySelector('[data-chart="chart-container"]');
    if (!chartContainer) {
      console.error('Chart container not found');
      return;
    }

    const svgElement = chartContainer.querySelector('svg');
    if (!svgElement) {
      console.error('SVG element not found');
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
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
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
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `chart-${selectedKPI1}-${valueType}-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
      
      URL.revokeObjectURL(svgUrl);
    };
    
    img.src = svgUrl;
  };

  const getUnitLabel = (baseUnit: string, valueType: ValueType, forCSV: boolean = false): string => {
    // For CSV exports, use plain text to avoid encoding issues
    let unit = forCSV ? baseUnit.replace(/CO2/g, 'CO2').replace(/₂/g, '2') : baseUnit.replace(/CO2/g, 'CO₂');
    
    if (valueType === 'total') {
      return unit.replace('/m²', '').replace('/year', '/year total');
    }
    return unit;
  };

  const getChartTitle = () => {
    const valueTypeLabel = valueType === 'per-sqm' ? 'per sqm' : 'total';
    
    if (chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon' && embodiedCarbonBreakdown !== 'none') {
      const breakdownType = embodiedCarbonBreakdown === 'lifecycle' ? 'Lifecycle Stage' : 'Building Element';
      return `Embodied Carbon by ${breakdownType} (${valueTypeLabel}) - Stacked Column Chart`;
    }
    
    switch (chartType) {
      case 'compare-bubble':
        return `${kpi1Config?.label} vs ${kpi2Config?.label} (${valueTypeLabel}) - Bubble Chart`;
      case 'single-bar':
        return `${kpi1Config?.label} by Project (${valueTypeLabel}) - Bar Chart`;
      case 'single-timeline':
        return `${kpi1Config?.label} Over Time (${valueTypeLabel}) - Timeline`;
      default:
        return 'Chart';
    }
  };

  const getLifecycleStageCategories = () => [
    { key: 'biogenicCarbon', label: 'Biogenic carbon (A1-A3)', color: chartColors.tertiary },
    { key: 'upfrontEmbodied', label: 'Upfront embodied carbon (A1-A5)', color: chartColors.primary },
    { key: 'inUseEmbodied', label: 'In-use embodied carbon (B1-B5)', color: chartColors.secondary },
    { key: 'endOfLife', label: 'End of life (C1-C4)', color: chartColors.warning },
    { key: 'benefitsLoads', label: 'Benefits and loads (D1)', color: chartColors.quaternary },
    { key: 'facilitatingWorks', label: 'Facilitating works', color: chartColors.accent2 }
  ];

  const getBuildingElementCategories = () => [
    { key: 'substructure', label: 'Substructure', color: chartColors.primary },
    { key: 'superstructureFrame', label: 'Superstructure - Frame', color: chartColors.secondary },
    { key: 'superstructureExternal', label: 'Superstructure - External envelope', color: chartColors.tertiary },
    { key: 'superstructureInternal', label: 'Superstructure - Internal assemblies', color: chartColors.quaternary },
    { key: 'finishes', label: 'Finishes', color: chartColors.warning },
    { key: 'ffe', label: 'FF&E', color: chartColors.info },
    { key: 'mep', label: 'MEP', color: chartColors.success },
    { key: 'externalWorks', label: 'External works', color: chartColors.darkGreen },
    { key: 'contingency', label: 'Contingency', color: chartColors.muted }
  ];

  const getEmbodiedCarbonStackedData = () => {
    if (embodiedCarbonBreakdown === 'none' || projects.length === 0) return [];
    
    const categories = embodiedCarbonBreakdown === 'lifecycle' 
      ? getLifecycleStageCategories()
      : getBuildingElementCategories();
    
    return projects.map(project => {
      const baseId = project.id.split('-')[0];
      const displayName = isComparingToSelf && project.ribaStage 
        ? `${project.name} (RIBA ${project.ribaStage.replace('stage-', '')})`
        : project.name;
      
      const projectData: any = { name: displayName };
      
      // Mock breakdown data - in real app this would come from project.embodiedCarbonBreakdown
      categories.forEach((category, index) => {
        // Generate mock values based on total embodied carbon
        const baseValue = project.totalEmbodiedCarbon || 45;
        const multiplier = embodiedCarbonBreakdown === 'lifecycle' 
          ? [0.4, 0.15, 0.25, 0.1, 0.05, 0.05][index] // Lifecycle distribution
          : [0.15, 0.2, 0.15, 0.1, 0.05, 0.05, 0.15, 0.1, 0.05][index]; // Building element distribution
        
        const categoryValue = baseValue * (multiplier || 0.1);
        const finalValue = valueType === 'total' ? categoryValue * getProjectArea(baseId) : categoryValue;
        // Make biogenic carbon negative in the data
        const adjustedValue = category.key === 'biogenicCarbon' ? -Math.abs(finalValue) : finalValue;
        projectData[category.key] = Math.round(adjustedValue * 100) / 100;
      });
      
      return projectData;
    });
  };

  const renderChart = () => {
    // Handle embodied carbon breakdown with stacked columns
    if (chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon' && embodiedCarbonBreakdown !== 'none') {
      const stackedData = getEmbodiedCarbonStackedData();
      
      if (stackedData.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No breakdown data available for selected projects</div>;
      }
      
      const categories = embodiedCarbonBreakdown === 'lifecycle' 
        ? getLifecycleStageCategories()
        : getBuildingElementCategories();
      
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stackedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} horizontal={true} verticalPoints={[]} />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fill: chartColors.dark }}
            />
            <YAxis 
              label={{ value: valueType === 'per-sqm' ? 'kgCO₂e/m²' : 'kgCO₂e total', angle: -90, position: 'insideLeft' }}
              tick={{ fill: chartColors.dark }}
              tickFormatter={(value) => formatNumber(value)}
              ticks={(() => {
                const maxValue = Math.max(...stackedData.flatMap(item => 
                  categories.map(cat => Math.abs(item[cat.key] || 0))
                ));
                return generateNiceTicks(maxValue * 1.1);
              })()}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                const category = categories.find(cat => cat.key === name);
                // Make biogenic carbon negative in tooltip
                const displayValue = name === 'biogenicCarbon' ? -Math.abs(value) : value;
                return [`${formatNumber(displayValue)} ${valueType === 'per-sqm' ? 'kgCO₂e/m²' : 'kgCO₂e total'}`, category?.label || name];
              }}
              labelFormatter={(label) => `Project: ${label}`}
              contentStyle={{ backgroundColor: 'white', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                const category = categories.find(cat => cat.key === value);
                return category?.label || value;
              }}
            />
            {categories.map((category) => (
              <Bar 
                key={category.key}
                dataKey={category.key}
                stackId="embodiedCarbon"
                fill={category.color}
                name={category.label}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    const transformedProjects = transformDataForValueType(projects);

    // Ensure primary project appears first (leftmost) in bar charts
    const sortedProjects = [...transformedProjects].sort((a, b) => {
      // For comparison charts, ensure the primary project (first in original array) appears first
      const aIndex = projects.findIndex(p => p.id === a.id);
      const bIndex = projects.findIndex(p => p.id === b.id);
      return aIndex - bIndex;
    });

    // Transform biogenic carbon values to negative for bubble chart display - use sorted projects
    const bubbleChartData = sortedProjects.map(project => ({
      ...project,
      [selectedKPI1]: selectedKPI1 === 'biogenicCarbon' ? -Math.abs(project[selectedKPI1] || 0) : project[selectedKPI1],
      [selectedKPI2]: selectedKPI2 === 'biogenicCarbon' ? -Math.abs(project[selectedKPI2] || 0) : project[selectedKPI2]
    }));

    switch (chartType) {
      case 'compare-bubble':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} horizontal={true} verticalPoints={[]} />
              <XAxis 
                type="number" 
                dataKey={selectedKPI1}
                name={kpi1Config?.label || selectedKPI1}
                label={{ value: `${kpi1Config?.label || selectedKPI1} (${getUnitLabel(kpi1Config?.unit || '', valueType)})`, position: 'insideBottom', offset: -5 }}
                tick={{ fill: chartColors.dark }}
                tickFormatter={(value) => formatNumber(value)}
                ticks={(() => {
                  const maxValue = Math.max(...bubbleChartData.map(p => Math.abs(p[selectedKPI1] || 0)));
                  return generateNiceTicks(maxValue * 1.1);
                })()}
              />
              <YAxis 
                type="number" 
                dataKey={selectedKPI2}
                name={kpi2Config?.label || selectedKPI2}
                label={{ value: `${kpi2Config?.label || selectedKPI2} (${getUnitLabel(kpi2Config?.unit || '', valueType)})`, angle: -90, position: 'insideLeft' }}
                tick={{ fill: chartColors.dark }}
                tickFormatter={(value) => formatNumber(value)}
                ticks={(() => {
                  const maxValue = Math.max(...bubbleChartData.map(p => Math.abs(p[selectedKPI2] || 0)));
                  return generateNiceTicks(maxValue * 1.1);
                })()}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: 'white', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const baseId = data.id.split('-')[0];
                    const area = getProjectArea(baseId);
                    const displayName = isComparingToSelf && data.ribaStage 
                      ? `${data.name} (RIBA ${data.ribaStage.replace('stage-', '')})`
                      : data.name;
                    
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg" style={{ backgroundColor: 'white', borderColor: chartColors.primary }}>
                        <p className="font-semibold" style={{ color: chartColors.dark }}>{displayName}</p>
                        <p className="text-sm" style={{ color: chartColors.darkGreen }}>{sectorConfig[getSector(data.typology) as keyof typeof sectorConfig]?.name || data.typology}</p>
                        <p className="text-sm" style={{ color: chartColors.dark }}>Area: {formatNumber(area)} m²</p>
                        <p className="text-sm" style={{ color: chartColors.dark }}>
                          {kpi1Config?.label}: {formatNumber(data[selectedKPI1])} {getUnitLabel(kpi1Config?.unit || '', valueType)}
                        </p>
                        <p className="text-sm" style={{ color: chartColors.dark }}>
                          {kpi2Config?.label}: {formatNumber(data[selectedKPI2])} {getUnitLabel(kpi2Config?.unit || '', valueType)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                name="Projects" 
                data={bubbleChartData}
                fill={chartColors.primary}
                fillOpacity={0.8}
                shape={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (!payload) return null;
                  
                  const baseId = payload.id.split('-')[0];
                  const area = getProjectArea(baseId);
                  const bubbleSize = valueType === 'per-sqm' ? Math.sqrt(area / 500) : 8;
                  const sectorColor = getSectorColor(payload.typology);
                  const shape = getSectorShape(payload.typology);
                  
                  return (
                    <CustomShape
                      cx={cx}
                      cy={cy}
                      fill={sectorColor}
                      shape={shape}
                      size={Math.max(8, Math.min(20, bubbleSize))}
                    />
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

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
                <text
                  key={index}
                  x={0}
                  y={index * 16}
                  textAnchor="end"
                  fill={chartColors.dark}
                  fontSize="12"
                  transform="rotate(-45)"
                >
                  {line}
                </text>
              ))}
            </g>
          );
        };
        
        // Add biogenic data as negative values for totalEmbodiedCarbon - use sorted projects
        const chartData = sortedProjects.map(project => ({
          ...project,
          biogenic: selectedKPI1 === 'totalEmbodiedCarbon' ? -Math.abs(project.biogenicCarbon || 0) * (valueType === 'total' ? getProjectArea(project.id.split('-')[0]) : 1) : 0
        }));

        // Get benchmark data for the primary project's sector
        const getBenchmarkLines = () => {
          if (!showBenchmarks || valueType !== 'per-sqm' || transformedProjects.length === 0) {
            return [];
          }
          
          // Get the sector of the first project (primary project)
          const primaryProject = transformedProjects[0];
          const primarySector = getSector(primaryProject.typology);
          const benchmarkColor = getSectorBenchmarkColor(primaryProject.typology);
          
          // Handle Total Embodied Carbon benchmarks
          if (selectedKPI1 === 'totalEmbodiedCarbon') {
            const sectorBenchmarks = totalEmbodiedCarbonBenchmarks[primarySector as keyof typeof totalEmbodiedCarbonBenchmarks];
            
            if (!sectorBenchmarks) return [];
            
            return Object.entries(sectorBenchmarks).map(([name, value]) => ({
              name,
              value,
              color: benchmarkColor
            }));
          }
          
          // Handle Upfront Carbon benchmarks
          if (selectedKPI1 === 'upfrontEmbodied') {
            const sectorBenchmarks = upfrontCarbonBenchmarks[primarySector as keyof typeof upfrontCarbonBenchmarks];
            
            if (!sectorBenchmarks) return [];
            
            // Get current year to show appropriate benchmark
            const currentYear = new Date().getFullYear();
            const benchmarkLines = [];
            
            // Add New Building benchmark
            if (sectorBenchmarks['New building'] && sectorBenchmarks['New building'][currentYear as keyof typeof sectorBenchmarks['New building']]) {
              benchmarkLines.push({
                name: 'New building',
                value: sectorBenchmarks['New building'][currentYear as keyof typeof sectorBenchmarks['New building']],
                color: benchmarkColor
              });
            }
            
            // Add Retrofit benchmark
            if (sectorBenchmarks['Retrofit'] && sectorBenchmarks['Retrofit'][currentYear as keyof typeof sectorBenchmarks['Retrofit']]) {
              benchmarkLines.push({
                name: 'Retrofit',
                value: sectorBenchmarks['Retrofit'][currentYear as keyof typeof sectorBenchmarks['Retrofit']],
                color: benchmarkColor
              });
            }
            
            return benchmarkLines;
          }
          
          return [];
        };

        const benchmarkLines = getBenchmarkLines();

        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} horizontal={true} verticalPoints={[]} />
              <XAxis 
                dataKey={(item) => {
                  const baseId = item.id.split('-')[0];
                  const displayName = isComparingToSelf && item.ribaStage 
                    ? `${item.name} (RIBA ${item.ribaStage.replace('stage-', '')})`
                    : item.name;
                  return displayName;
                }}
                height={80}
                interval={0}
                tick={<MultiLineTickComponent />}
                axisLine={{ stroke: chartColors.dark, strokeWidth: 1 }}
                tickLine={false}
              />
              <YAxis 
                label={{ value: `${kpi1Config?.label || selectedKPI1} (${getUnitLabel(kpi1Config?.unit || '', valueType)})`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                tick={{ fill: chartColors.dark }}
                tickFormatter={(value) => formatNumber(value)}
                domain={selectedKPI1 === 'totalEmbodiedCarbon' ? 
                  [0, 1600] : 
                  [0, 'dataMax']
                }
                ticks={selectedKPI1 === 'totalEmbodiedCarbon' ? 
                  [0, 400, 800, 1200, 1600] : 
                  (() => {
                    const maxValue = Math.max(...chartData.map(p => Math.abs(p[selectedKPI1] || 0)));
                    return generateNiceTicks(maxValue * 1.1);
                  })()
                }
              />
               <Tooltip 
                formatter={(value: number, name: string) => [
                  `${formatNumber(value)} ${getUnitLabel(kpi1Config?.unit || '', valueType)}`,
                  name === 'biogenic' ? 'Biogenic Carbon' : (kpi1Config?.label || selectedKPI1)
                ]}
                labelFormatter={(label) => `Project: ${label}`}
                contentStyle={{ backgroundColor: 'white', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const mainData = payload.find(p => p.dataKey === selectedKPI1);
                    const biogenicData = payload.find(p => p.dataKey === 'biogenic');
                    
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg" style={{ backgroundColor: 'white', borderColor: chartColors.primary }}>
                        <p className="font-semibold" style={{ color: chartColors.dark }}>Project: {label}</p>
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
               <Bar 
                dataKey={selectedKPI1}
                fill={chartColors.primary}
                name={kpi1Config?.label || selectedKPI1}
                radius={[4, 4, 0, 0]}
               >
                 {sortedProjects.map((project, index) => {
                   const sectorColor = getSectorColor(project.typology);
                   return <Cell key={index} fill={sectorColor} />;
                 })}
               </Bar>
                {selectedKPI1 === 'totalEmbodiedCarbon' && (
                  <Bar 
                    dataKey="biogenic"
                    fill="white"
                    name="biogenic"
                    radius={[0, 0, 4, 4]}
                  >
                    {sortedProjects.map((project, index) => {
                      const sectorColor = getSectorColor(project.typology);
                      return <Cell key={index} fill="white" stroke={sectorColor} strokeWidth={2} />;
                    })}
                  </Bar>
                )}
                {selectedKPI1 === 'totalEmbodiedCarbon' && (
                  <ReferenceLine y={0} stroke="#A8A8A3" strokeWidth={2} />
                )}
                
                {/* Benchmark lines */}
                {benchmarkLines.map((benchmark, index) => (
                  <ReferenceLine 
                    key={benchmark.name}
                    y={benchmark.value} 
                    stroke={benchmark.color} 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ 
                      value: benchmark.name, 
                      position: "insideTopRight",
                      offset: 10,
                      style: { fill: benchmark.color, fontSize: '12px', fontWeight: 'bold' }
                    }}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'single-timeline':
        const timelineData = transformedProjects
          .map(project => {
            const baseId = project.id.split('-')[0];
            const displayName = isComparingToSelf && project.ribaStage 
              ? `${project.name} (RIBA ${project.ribaStage.replace('stage-', '')})`
              : project.name;
            
            // Extract year only from completion date
            const completionYear = new Date(project.completionDate).getFullYear();
            
            return {
              ...project,
              displayName,
              completionYear,
              date: new Date(project.completionDate).getTime()
            };
          })
          .sort((a, b) => a.date - b.date);

        // Get benchmark data for timeline - for Total Embodied Carbon and Upfront Carbon with per sqm
        const shouldShowBenchmarks = valueType === 'per-sqm' && (selectedKPI1 === 'totalEmbodiedCarbon' || selectedKPI1 === 'upfrontEmbodied') && timelineData.length > 0;

        // Create benchmark data if applicable
        const createTimelineBenchmarkData = () => {
          if (!shouldShowBenchmarks) return [];
          
          // Find the PRIMARY project (selected as main project, not comparison)
          const primaryProject = projects[0];
          if (!primaryProject) return [];
          
          const primarySector = getSector(primaryProject.typology);
          
          // Handle Total Embodied Carbon benchmarks
          if (selectedKPI1 === 'totalEmbodiedCarbon') {
            const sectorBenchmarks = totalEmbodiedCarbonBenchmarks[primarySector as keyof typeof totalEmbodiedCarbonBenchmarks];
            
            // CRITICAL: Only return benchmarks if the PRIMARY project's sector has benchmarks defined
            if (!sectorBenchmarks) {
              return [];
            }
            
            // Create benchmark points for RIBA 2025 and RIBA 2030 only
            const ribaBenchmarks = [];
            if (sectorBenchmarks['RIBA 2025']) {
              ribaBenchmarks.push({
                completionYear: 2025,
                benchmarkValue: sectorBenchmarks['RIBA 2025'],
                benchmarkName: 'RIBA 2025',
                sector: primarySector
              });
            }
            if (sectorBenchmarks['RIBA 2030']) {
              ribaBenchmarks.push({
                completionYear: 2030,
                benchmarkValue: sectorBenchmarks['RIBA 2030'],
                benchmarkName: 'RIBA 2030',
                sector: primarySector
              });
            }
            
            return ribaBenchmarks;
          }
          
          // Handle Upfront Carbon benchmarks
          if (selectedKPI1 === 'upfrontEmbodied') {
            const sectorBenchmarks = upfrontCarbonBenchmarks[primarySector as keyof typeof upfrontCarbonBenchmarks];
            
            if (!sectorBenchmarks) return [];
            
            // Create benchmark points for all years from 2025 to 2050
            const benchmarkPoints = [];
            
            // Add New Building benchmarks
            if (sectorBenchmarks['New building']) {
              for (let year = 2025; year <= 2050; year++) {
                const yearlyBenchmark = sectorBenchmarks['New building'][year as keyof typeof sectorBenchmarks['New building']];
                if (yearlyBenchmark) {
                  benchmarkPoints.push({
                    completionYear: year,
                    benchmarkValue: yearlyBenchmark,
                    benchmarkName: 'New building',
                    sector: primarySector,
                    benchmarkType: 'newBuilding'
                  });
                }
              }
            }
            
            // Add Retrofit benchmarks
            if (sectorBenchmarks['Retrofit']) {
              for (let year = 2025; year <= 2050; year++) {
                const yearlyBenchmark = sectorBenchmarks['Retrofit'][year as keyof typeof sectorBenchmarks['Retrofit']];
                if (yearlyBenchmark) {
                  benchmarkPoints.push({
                    completionYear: year,
                    benchmarkValue: yearlyBenchmark,
                    benchmarkName: 'Retrofit',
                    sector: primarySector,
                    benchmarkType: 'retrofit'
                  });
                }
              }
            }
            
            return benchmarkPoints;
          }
          
          return [];
        };

        const timelineBenchmarkData = createTimelineBenchmarkData();
        // Always use primary project's sector for benchmark color
        const primaryProject = projects.find(p => !p.id.includes('-')) || projects[0];
        const benchmarkColor = primaryProject ? getSectorBenchmarkColor(primaryProject.typology) : '#1E9F5A';

        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} horizontal={true} verticalPoints={[]} />
              <XAxis 
                dataKey="completionYear"
                type="number"
                scale="linear"
                domain={[2020, 2030]}
                ticks={[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]}
                tickFormatter={(value) => value.toString()}
                label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                tick={{ fill: chartColors.dark }}
              />
              <YAxis 
                label={{ value: `${kpi1Config?.label || selectedKPI1} (${getUnitLabel(kpi1Config?.unit || '', valueType)})`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                tick={{ fill: chartColors.dark }}
                tickFormatter={(value) => formatNumber(value)}
                ticks={(() => {
                  const maxValue = Math.max(
                    ...timelineData.map(p => Math.abs(p[selectedKPI1] || 0)),
                    ...(shouldShowBenchmarks ? timelineBenchmarkData.map(b => b.benchmarkValue) : [])
                  );
                  return generateNiceTicks(maxValue * 1.1);
                })()}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${formatNumber(value)} ${getUnitLabel(kpi1Config?.unit || '', valueType)}`,
                  name.includes('benchmark') ? `UKNZCBS ${name.split('_')[1]}` : kpi1Config?.label || selectedKPI1
                ]}
                labelFormatter={(label) => `Year: ${label}`}
                contentStyle={{ backgroundColor: 'white', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const projectData = payload.find(p => p.dataKey === selectedKPI1);
                    const benchmarkData = payload.filter(p => p.dataKey && p.dataKey.toString().includes('benchmark'));
                    
                    return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg" style={{ backgroundColor: 'white', borderColor: chartColors.primary }}>
                        <p className="font-semibold" style={{ color: chartColors.dark }}>Year: {label}</p>
                        {projectData && (
                          <>
                            <p className="text-sm" style={{ color: chartColors.dark }}>Project: {projectData.payload.displayName}</p>
                            <p className="text-sm" style={{ color: chartColors.dark }}>
                              {kpi1Config?.label}: {formatNumber(projectData.value)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
                            </p>
                          </>
                        )}
                        {benchmarkData.map((item, idx) => (
                          <p key={idx} className="text-sm" style={{ color: chartColors.benchmark }}>
                            UKNZCBS {item.dataKey?.toString().split('_')[1]}: {formatNumber(item.value)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              {/* Project data as scatter points */}
              <Line 
                type="monotone"
                dataKey={selectedKPI1}
                stroke="transparent"
                strokeWidth={0}
                dot={false}
                name={kpi1Config?.label || selectedKPI1}
                legendType="none"
              />
              
              {/* Render dots with sector colors */}
              {timelineData.map((project, index) => {
                const sectorColor = getSectorColor(project.typology);
                return (
                  <Line
                    key={`dot-${index}`}
                    type="monotone"
                    dataKey={selectedKPI1}
                    data={[project]}
                    stroke="transparent"
                    strokeWidth={0}
                    dot={{ fill: sectorColor, strokeWidth: 2, r: 6 }}
                    legendType="none"
                  />
                );
              })}
              
                {/* Benchmark points/lines */}
                {shouldShowBenchmarks && timelineBenchmarkData.length > 0 && selectedKPI1 === 'totalEmbodiedCarbon' && (
                  <>
                    {/* RIBA benchmarks as dots for Total Embodied Carbon */}
                    {timelineBenchmarkData.map((benchmark) => (
                      <ReferenceDot
                        key={`riba-${benchmark.completionYear}`}
                        x={benchmark.completionYear}
                        y={benchmark.benchmarkValue}
                        r={8}
                        fill="white"
                        stroke={benchmarkColor}
                        strokeWidth={3}
                        label={{
                          value: benchmark.benchmarkName,
                          position: 'top',
                          offset: 15,
                          style: { 
                            fill: benchmarkColor, 
                            fontSize: '12px', 
                            fontWeight: 'bold',
                            textAnchor: 'middle'
                          }
                        }}
                      />
                    ))}
                  </>
                )}
                
                {/* Upfront Carbon benchmark lines */}
                {shouldShowBenchmarks && timelineBenchmarkData.length > 0 && selectedKPI1 === 'upfrontEmbodied' && (
                  <>
                    {/* New Building benchmark line */}
                    <Line
                      type="monotone"
                      dataKey="newBuildingBenchmark"
                      data={timelineBenchmarkData.filter(b => b.benchmarkType === 'newBuilding').map(b => ({
                        completionYear: b.completionYear,
                        newBuildingBenchmark: b.benchmarkValue
                      }))}
                      stroke={benchmarkColor}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="New building"
                      connectNulls={true}
                    />
                    {/* Retrofit benchmark line */}
                    <Line
                      type="monotone"
                      dataKey="retrofitBenchmark"
                      data={timelineBenchmarkData.filter(b => b.benchmarkType === 'retrofit').map(b => ({
                        completionYear: b.completionYear,
                        retrofitBenchmark: b.benchmarkValue
                      }))}
                      stroke={benchmarkColor}
                      strokeWidth={2}
                      strokeDasharray="10 5"
                      dot={false}
                      name="Retrofit"
                      connectNulls={true}
                    />
                  </>
                )}
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Select a chart type to view data</div>;
    }
  };

  // Check if there are benchmarks available for the current sector
  const hasBenchmarks = () => {
    if (projects.length === 0) return false;
    const primaryProject = projects[0];
    const primarySector = getSector(primaryProject.typology);
    
    if (selectedKPI1 === 'totalEmbodiedCarbon') {
      return !!totalEmbodiedCarbonBenchmarks[primarySector as keyof typeof totalEmbodiedCarbonBenchmarks];
    }
    
    if (selectedKPI1 === 'upfrontEmbodied') {
      return !!upfrontCarbonBenchmarks[primarySector as keyof typeof upfrontCarbonBenchmarks];
    }
    
    return false;
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold" style={{ color: chartColors.dark }}>{getChartTitle()}</h2>
        <div className="flex items-center space-x-2">
          {/* Show benchmark toggle for Total Embodied Carbon and Upfront Carbon with per-sqm values */}
          {(selectedKPI1 === 'totalEmbodiedCarbon' || selectedKPI1 === 'upfrontEmbodied') && valueType === 'per-sqm' && (chartType === 'single-bar' || chartType === 'single-timeline') && (
            <Button 
              variant={showBenchmarks ? "default" : "outline"} 
              size="sm" 
              onClick={() => setShowBenchmarks(!showBenchmarks)}
              disabled={!hasBenchmarks()}
              className="flex items-center gap-2"
            >
              {showBenchmarks ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              Show Benchmarks
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPNG} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            PNG
          </Button>
        </div>
      </div>
      
      <div className="h-96" data-chart="chart-container">
        {renderChart()}
      </div>
    </Card>
  );
};
