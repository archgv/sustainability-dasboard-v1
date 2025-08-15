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
  const [selectedSubSector, setSelectedSubSector] = useState<string>('');
  const [selectedBarChartBenchmark, setSelectedBarChartBenchmark] = useState<string>('');
  
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

  // UKNZCBS benchmark data by sector with sub-sectors and build types
  const uknzcbsBenchmarks = {
    'CCC': {
      'Culture & entertainment (General)': {
        'New building': { 2025: 570, 2026: 540, 2027: 515, 2028: 485, 2029: 460, 2030: 425, 2031: 400, 2032: 375, 2033: 340, 2034: 310, 2035: 280, 2036: 255, 2037: 235, 2038: 215, 2039: 200, 2040: 180, 2041: 165, 2042: 150, 2043: 135, 2044: 120, 2045: 105, 2046: 90, 2047: 80, 2048: 70, 2049: 55, 2050: 45 },
        'Retrofit': { 2025: 450, 2026: 425, 2027: 405, 2028: 385, 2029: 365, 2030: 335, 2031: 315, 2032: 295, 2033: 270, 2034: 245, 2035: 220, 2036: 200, 2037: 185, 2038: 170, 2039: 160, 2040: 145, 2041: 130, 2042: 120, 2043: 110, 2044: 95, 2045: 85, 2046: 75, 2047: 65, 2048: 55, 2049: 45, 2050: 40 }
      },
      'Culture & entertainment (Performance)': {
        'New building': { 2025: 855, 2026: 810, 2027: 770, 2028: 725, 2029: 685, 2030: 640, 2031: 595, 2032: 560, 2033: 510, 2034: 465, 2035: 420, 2036: 380, 2037: 350, 2038: 325, 2039: 295, 2040: 270, 2041: 245, 2042: 220, 2043: 200, 2044: 175, 2045: 155, 2046: 135, 2047: 120, 2048: 100, 2049: 85, 2050: 70 },
        'Retrofit': { 2025: 605, 2026: 570, 2027: 545, 2028: 510, 2029: 485, 2030: 450, 2031: 420, 2032: 395, 2033: 360, 2034: 330, 2035: 295, 2036: 270, 2037: 250, 2038: 230, 2039: 210, 2040: 190, 2041: 175, 2042: 155, 2043: 145, 2044: 125, 2045: 110, 2046: 95, 2047: 85, 2048: 75, 2049: 60, 2050: 50 }
      }
    },
    'Education': {
      'Schools': {
        'New building': { 2025: 530, 2026: 505, 2027: 480, 2028: 450, 2029: 425, 2030: 395, 2031: 370, 2032: 350, 2033: 320, 2034: 290, 2035: 260, 2036: 235, 2037: 220, 2038: 200, 2039: 185, 2040: 170, 2041: 155, 2042: 140, 2043: 125, 2044: 110, 2045: 100, 2046: 85, 2047: 75, 2048: 65, 2049: 55, 2050: 45 },
        'Retrofit': { 2025: 380, 2026: 365, 2027: 345, 2028: 325, 2029: 305, 2030: 285, 2031: 265, 2032: 255, 2033: 230, 2034: 210, 2035: 190, 2036: 170, 2037: 160, 2038: 145, 2039: 135, 2040: 125, 2041: 115, 2042: 105, 2043: 90, 2044: 80, 2045: 75, 2046: 65, 2047: 55, 2048: 50, 2049: 40, 2050: 35 }
      },
      'Higher education': {
        'New building': { 2025: 640, 2026: 610, 2027: 575, 2028: 545, 2029: 515, 2030: 480, 2031: 445, 2032: 420, 2033: 385, 2034: 350, 2035: 315, 2036: 285, 2037: 265, 2038: 240, 2039: 225, 2040: 205, 2041: 185, 2042: 165, 2043: 150, 2044: 135, 2045: 115, 2046: 105, 2047: 90, 2048: 75, 2049: 65, 2050: 50 },
        'Retrofit': { 2025: 475, 2026: 455, 2027: 425, 2028: 405, 2029: 385, 2030: 355, 2031: 330, 2032: 315, 2033: 285, 2034: 260, 2035: 235, 2036: 215, 2037: 200, 2038: 180, 2039: 170, 2040: 155, 2041: 140, 2042: 125, 2043: 115, 2044: 100, 2045: 85, 2046: 80, 2047: 70, 2048: 60, 2049: 50, 2050: 40 }
      }
    },
    'Healthcare': {
      'Healthcare': {
        'New building': { 2025: 790, 2026: 750, 2027: 710, 2028: 670, 2029: 635, 2030: 590, 2031: 550, 2032: 515, 2033: 475, 2034: 430, 2035: 390, 2036: 350, 2037: 325, 2038: 300, 2039: 275, 2040: 250, 2041: 225, 2042: 205, 2043: 185, 2044: 165, 2045: 145, 2046: 125, 2047: 110, 2048: 95, 2049: 80, 2050: 65 },
        'Retrofit': { 2025: 615, 2026: 585, 2027: 555, 2028: 525, 2029: 495, 2030: 460, 2031: 430, 2032: 405, 2033: 370, 2034: 335, 2035: 305, 2036: 275, 2037: 255, 2038: 235, 2039: 215, 2040: 195, 2041: 180, 2042: 160, 2043: 145, 2044: 130, 2045: 115, 2046: 100, 2047: 90, 2048: 75, 2049: 65, 2050: 55 }
      }
    },
    'Residential': {
      'Single family homes': {
        'New building': { 2025: 430, 2026: 400, 2027: 375, 2028: 345, 2029: 320, 2030: 290, 2031: 270, 2032: 255, 2033: 235, 2034: 210, 2035: 190, 2036: 175, 2037: 160, 2038: 150, 2039: 135, 2040: 125, 2041: 110, 2042: 100, 2043: 90, 2044: 80, 2045: 70, 2046: 65, 2047: 55, 2048: 45, 2049: 40, 2050: 30 },
        'Retrofit': { 2025: 270, 2026: 255, 2027: 235, 2028: 220, 2029: 205, 2030: 185, 2031: 170, 2032: 160, 2033: 150, 2034: 135, 2035: 120, 2036: 110, 2037: 105, 2038: 95, 2039: 85, 2040: 80, 2041: 70, 2042: 65, 2043: 60, 2044: 55, 2045: 45, 2046: 45, 2047: 35, 2048: 30, 2049: 30, 2050: 20 }
      },
      'Flats': {
        'New building': { 2025: 565, 2026: 525, 2027: 490, 2028: 450, 2029: 420, 2030: 380, 2031: 355, 2032: 335, 2033: 305, 2034: 280, 2035: 250, 2036: 225, 2037: 210, 2038: 195, 2039: 175, 2040: 160, 2041: 145, 2042: 135, 2043: 120, 2044: 105, 2045: 95, 2046: 80, 2047: 70, 2048: 60, 2049: 50, 2050: 40 },
        'Retrofit': { 2025: 425, 2026: 395, 2027: 370, 2028: 340, 2029: 315, 2030: 285, 2031: 270, 2032: 255, 2033: 230, 2034: 210, 2035: 190, 2036: 170, 2037: 160, 2038: 150, 2039: 135, 2040: 120, 2041: 110, 2042: 105, 2043: 90, 2044: 80, 2045: 75, 2046: 60, 2047: 55, 2048: 45, 2049: 40, 2050: 30 }
      },
      'Commercial residential': {
        'New building': { 2025: 580, 2026: 550, 2027: 525, 2028: 495, 2029: 465, 2030: 435, 2031: 405, 2032: 380, 2033: 350, 2034: 315, 2035: 285, 2036: 260, 2037: 240, 2038: 220, 2039: 200, 2040: 185, 2041: 165, 2042: 150, 2043: 135, 2044: 120, 2045: 105, 2046: 95, 2047: 80, 2048: 70, 2049: 60, 2050: 45 },
        'Retrofit': { 2025: 460, 2026: 435, 2027: 415, 2028: 390, 2029: 370, 2030: 345, 2031: 320, 2032: 300, 2033: 280, 2034: 250, 2035: 225, 2036: 205, 2037: 190, 2038: 175, 2039: 160, 2040: 150, 2041: 130, 2042: 120, 2043: 110, 2044: 95, 2045: 85, 2046: 75, 2047: 65, 2048: 60, 2049: 50, 2050: 40 }
      },
      'Hotels': {
        'New building': { 2025: 670, 2026: 635, 2027: 605, 2028: 570, 2029: 540, 2030: 500, 2031: 470, 2032: 440, 2033: 400, 2034: 365, 2035: 330, 2036: 300, 2037: 275, 2038: 255, 2039: 235, 2040: 215, 2041: 195, 2042: 175, 2043: 155, 2044: 140, 2045: 125, 2046: 105, 2047: 95, 2048: 80, 2049: 65, 2050: 55 },
        'Retrofit': { 2025: 520, 2026: 490, 2027: 470, 2028: 440, 2029: 420, 2030: 390, 2031: 365, 2032: 340, 2033: 310, 2034: 285, 2035: 255, 2036: 235, 2037: 215, 2038: 200, 2039: 185, 2040: 170, 2041: 155, 2042: 135, 2043: 120, 2044: 110, 2045: 100, 2046: 85, 2047: 75, 2048: 65, 2049: 55, 2050: 45 }
      }
    },
    'Workplace': {
      'Workplace (Whole building)': {
        'New building': { 2025: 735, 2026: 700, 2027: 660, 2028: 625, 2029: 590, 2030: 550, 2031: 515, 2032: 480, 2033: 440, 2034: 400, 2035: 360, 2036: 325, 2037: 300, 2038: 280, 2039: 255, 2040: 235, 2041: 210, 2042: 190, 2043: 170, 2044: 150, 2045: 135, 2046: 120, 2047: 100, 2048: 85, 2049: 70, 2050: 60 },
        'Retrofit': { 2025: 600, 2026: 575, 2027: 540, 2028: 510, 2029: 485, 2030: 450, 2031: 420, 2032: 395, 2033: 360, 2034: 330, 2035: 295, 2036: 265, 2037: 245, 2038: 230, 2039: 210, 2040: 195, 2041: 175, 2042: 155, 2043: 140, 2044: 125, 2045: 110, 2046: 100, 2047: 85, 2048: 70, 2049: 60, 2050: 50 }
      },
      'Workplace (Shell & core)': {
        'New building': { 2025: 475, 2026: 450, 2027: 425, 2028: 400, 2029: 380, 2030: 355, 2031: 330, 2032: 310, 2033: 285, 2034: 255, 2035: 230, 2036: 210, 2037: 190, 2038: 180, 2039: 165, 2040: 150, 2041: 135, 2042: 120, 2043: 110, 2044: 95, 2045: 85, 2046: 75, 2047: 60, 2048: 55, 2049: 45, 2050: 35 }
      },
      'Science & technology': {
        'New building': { 2025: 755, 2026: 715, 2027: 680, 2028: 640, 2029: 605, 2030: 565, 2031: 525, 2032: 495, 2033: 450, 2034: 410, 2035: 370, 2036: 335, 2037: 310, 2038: 285, 2039: 260, 2040: 240, 2041: 215, 2042: 195, 2043: 175, 2044: 155, 2045: 140, 2046: 120, 2047: 105, 2048: 90, 2049: 75, 2050: 60 },
        'Retrofit': { 2025: 605, 2026: 575, 2027: 545, 2028: 515, 2029: 485, 2030: 455, 2031: 420, 2032: 395, 2033: 360, 2034: 330, 2035: 300, 2036: 270, 2037: 250, 2038: 230, 2039: 210, 2040: 195, 2041: 175, 2042: 160, 2043: 140, 2044: 125, 2045: 115, 2046: 100, 2047: 85, 2048: 75, 2049: 60, 2050: 50 }
      }
    }
  };

  // UKNZCBS Operational Energy benchmark data by sector with sub-sectors and build types
  const uknzcbsOperationalEnergyBenchmarks = {
    'CCC': {
      'Culture & entertainment (Performance)': {
        'New building': { 2025: 80, 2026: 79, 2027: 77, 2028: 75, 2029: 74, 2030: 72, 2031: 70, 2032: 69, 2033: 67, 2034: 65, 2035: 64, 2036: 62, 2037: 60, 2038: 59, 2039: 57, 2040: 55, 2050: 55 },
        'Retrofit': { 2025: 130, 2026: 128, 2027: 125, 2028: 122, 2029: 120, 2030: 117, 2031: 114, 2032: 112, 2033: 109, 2034: 106, 2035: 104, 2036: 101, 2037: 98, 2038: 96, 2039: 93, 2040: 90, 2050: 90 }
      },
      'Culture & entertainment (Collection)': {
        'New building': { 2025: 60, 2026: 59, 2027: 58, 2028: 56, 2029: 55, 2030: 54, 2031: 52, 2032: 51, 2033: 50, 2034: 48, 2035: 47, 2036: 46, 2037: 44, 2038: 43, 2039: 42, 2040: 40, 2050: 40 },
        'Retrofit': { 2025: 100, 2026: 98, 2027: 96, 2028: 93, 2029: 91, 2030: 89, 2031: 86, 2032: 84, 2033: 82, 2034: 79, 2035: 77, 2036: 75, 2037: 72, 2038: 70, 2039: 68, 2040: 65, 2050: 65 }
      }
    },
    'Healthcare': {
      'Acute trust': {
        'Retrofit': { 2025: 258, 2026: 259, 2027: 259, 2028: 259, 2029: 259, 2030: 259, 2031: 259, 2032: 259, 2033: 259, 2034: 259, 2035: 259, 2036: 259, 2037: 259, 2038: 259, 2039: 259, 2040: 258, 2050: 258 }
      },
      'Community trust': {
        'Retrofit': { 2025: 162, 2026: 163, 2027: 163, 2028: 163, 2029: 163, 2030: 163, 2031: 163, 2032: 163, 2033: 163, 2034: 163, 2035: 163, 2036: 163, 2037: 163, 2038: 163, 2039: 163, 2040: 162, 2050: 162 }
      },
      'Mental health & learning trust': {
        'Retrofit': { 2025: 166, 2026: 167, 2027: 167, 2028: 167, 2029: 167, 2030: 167, 2031: 167, 2032: 167, 2033: 167, 2034: 167, 2035: 167, 2036: 167, 2037: 167, 2038: 167, 2039: 167, 2040: 166, 2050: 166 }
      }
    },
    'Education': {
      'Primary school': {
        'New building': { 2025: 45, 2026: 45, 2027: 44, 2028: 43, 2029: 43, 2030: 42, 2031: 41, 2032: 41, 2033: 40, 2034: 39, 2035: 39, 2036: 38, 2037: 37, 2038: 37, 2039: 36, 2040: 35, 2050: 35 },
        'Retrofit': { 2025: 85, 2026: 84, 2027: 83, 2028: 81, 2029: 80, 2030: 79, 2031: 77, 2032: 76, 2033: 75, 2034: 73, 2035: 72, 2036: 71, 2037: 69, 2038: 68, 2039: 67, 2040: 65, 2050: 65 }
      },
      'Secondary school': {
        'New building': { 2025: 60, 2026: 59, 2027: 58, 2028: 57, 2029: 56, 2030: 55, 2031: 54, 2032: 53, 2033: 52, 2034: 51, 2035: 50, 2036: 49, 2037: 48, 2038: 47, 2039: 46, 2040: 45, 2050: 45 },
        'Retrofit': { 2025: 95, 2026: 94, 2027: 92, 2028: 90, 2029: 89, 2030: 87, 2031: 85, 2032: 84, 2033: 82, 2034: 80, 2035: 79, 2036: 77, 2037: 75, 2038: 74, 2039: 72, 2040: 70, 2050: 70 }
      },
      'Higher education': {
        'New building': { 2025: 100, 2026: 98, 2027: 95, 2028: 92, 2029: 90, 2030: 87, 2031: 84, 2032: 82, 2033: 79, 2034: 76, 2035: 74, 2036: 71, 2037: 68, 2038: 66, 2039: 63, 2040: 60, 2050: 60 },
        'Retrofit': { 2025: 130, 2026: 127, 2027: 123, 2028: 119, 2029: 116, 2030: 112, 2031: 108, 2032: 105, 2033: 101, 2034: 97, 2035: 94, 2036: 90, 2037: 86, 2038: 83, 2039: 79, 2040: 75, 2050: 75 }
      }
    },
    'Residential': {
      'Single family homes': {
        'New building': { 2025: 45, 2026: 45, 2027: 44, 2028: 43, 2029: 43, 2030: 42, 2031: 41, 2032: 41, 2033: 40, 2034: 39, 2035: 39, 2036: 38, 2037: 37, 2038: 37, 2039: 36, 2040: 35, 2050: 35 },
        'Retrofit': { 2025: 75, 2026: 74, 2027: 73, 2028: 72, 2029: 71, 2030: 70, 2031: 69, 2032: 68, 2033: 66, 2034: 65, 2035: 64, 2036: 63, 2037: 62, 2038: 61, 2039: 60, 2040: 58, 2050: 58 }
      },
      'Flats': {
        'New building': { 2025: 40, 2026: 40, 2027: 40, 2028: 39, 2029: 39, 2030: 39, 2031: 38, 2032: 38, 2033: 38, 2034: 37, 2035: 37, 2036: 37, 2037: 36, 2038: 36, 2039: 36, 2040: 35, 2050: 35 },
        'Retrofit': { 2025: 65, 2026: 65, 2027: 64, 2028: 64, 2029: 63, 2030: 63, 2031: 62, 2032: 62, 2033: 61, 2034: 61, 2035: 60, 2036: 60, 2037: 59, 2038: 59, 2039: 58, 2040: 57, 2050: 57 }
      },
      'Student residence': {
        'New building': { 2025: 75, 2026: 74, 2027: 72, 2028: 70, 2029: 69, 2030: 67, 2031: 65, 2032: 64, 2033: 62, 2034: 60, 2035: 59, 2036: 57, 2037: 55, 2038: 54, 2039: 52, 2040: 50, 2050: 50 },
        'Retrofit': { 2025: 110, 2026: 108, 2027: 106, 2028: 103, 2029: 101, 2030: 99, 2031: 96, 2032: 94, 2033: 92, 2034: 89, 2035: 87, 2036: 85, 2037: 82, 2038: 80, 2039: 78, 2040: 75, 2050: 75 }
      },
      'Hotels': {
        'New building': { 2025: 125, 2026: 122, 2027: 119, 2028: 116, 2029: 113, 2030: 110, 2031: 107, 2032: 104, 2033: 101, 2034: 98, 2035: 95, 2036: 92, 2037: 89, 2038: 86, 2039: 83, 2040: 80, 2050: 80 },
        'Retrofit': { 2025: 180, 2026: 176, 2027: 172, 2028: 168, 2029: 164, 2030: 160, 2031: 156, 2032: 152, 2033: 148, 2034: 144, 2035: 140, 2036: 136, 2037: 132, 2038: 128, 2039: 124, 2040: 120, 2050: 120 }
      }
    },
    'Workplace': {
      'Workplace': {
        'New building': { 2025: 85, 2026: 83, 2027: 80, 2028: 77, 2029: 75, 2030: 72, 2031: 69, 2032: 67, 2033: 64, 2034: 61, 2035: 59, 2036: 56, 2037: 53, 2038: 51, 2039: 48, 2040: 45, 2050: 45 },
        'Retrofit': { 2025: 100, 2026: 97, 2027: 94, 2028: 91, 2029: 88, 2030: 85, 2031: 82, 2032: 79, 2033: 76, 2034: 73, 2035: 70, 2036: 67, 2037: 64, 2038: 61, 2039: 58, 2040: 55, 2050: 55 }
      },
      'Science & technology': {
        'New building': { 2025: 305, 2026: 297, 2027: 289, 2028: 280, 2029: 272, 2030: 264, 2031: 255, 2032: 247, 2033: 239, 2034: 230, 2035: 222, 2036: 214, 2037: 205, 2038: 197, 2039: 189, 2040: 180, 2050: 180 },
        'Retrofit': { 2025: 360, 2026: 351, 2027: 341, 2028: 331, 2029: 322, 2030: 312, 2031: 302, 2032: 293, 2033: 283, 2034: 273, 2035: 264, 2036: 254, 2037: 244, 2038: 235, 2039: 225, 2040: 215, 2050: 215 }
      }
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
          
          const newBuildValue = subSectorData['New building']?.[benchmarkYear as keyof typeof subSectorData['New building']];
          const retrofitValue = subSectorData['Retrofit']?.[benchmarkYear as keyof typeof subSectorData['Retrofit']];
          
          const benchmarkLines = [];
          if (newBuildValue !== undefined) {
            benchmarkLines.push({
              name: `New building (PC ${benchmarkYear})`,
              value: newBuildValue,
              color: benchmarkColor,
              year: benchmarkYear
            });
          }
          if (retrofitValue !== undefined) {
            benchmarkLines.push({
              name: `Retrofit (PC ${benchmarkYear})`,
              value: retrofitValue,
              color: benchmarkColor,
              year: benchmarkYear
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
            color: benchmarkColor
          }));
        };

        const benchmarkLines = getBenchmarkLines();
        const barChartBenchmarkLines = getBarChartBenchmarkLines();

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
                       position: "insideTopRight",
                       offset: 10,
                       style: { fill: benchmark.color, fontSize: '12px', fontWeight: 'bold' }
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
                     strokeDasharray={benchmark.name.includes('New building') ? "5 5" : "10 5"}
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
                    <line
                      x1="0"
                      y1="1"
                      x2="24"
                      y2="1"
                      stroke={item.color}
                      strokeWidth="2"
                      strokeDasharray={item.name.includes('New building') ? "5 5" : "10 5"}
                    />
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
                      <line
                        x1="0"
                        y1="1"
                        x2="24"
                        y2="1"
                        stroke={item.color}
                        strokeWidth="2"
                        strokeDasharray={item.name.includes('New building') ? "5 5" : "10 5"}
                      />
                    </svg>
                    <span className="text-sm" style={{ color: chartColors.dark }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
                     selectedKPI1 === 'upfrontCarbon' ? [0, 1000] :
                     (() => {
                       const maxDataValue = Math.max(...chartData.map(p => Math.abs(p[selectedKPI1] || 0)));
                       const maxBenchmarkValue = barChartBenchmarkLines.length > 0 ? 
                         Math.max(...barChartBenchmarkLines.map(b => b.value)) : 0;
                       const maxValue = Math.max(maxDataValue, maxBenchmarkValue, 1000);
                       return [0, Math.max(maxValue * 1.1, 1000)];
                     })()
                   }
                   ticks={selectedKPI1 === 'totalEmbodiedCarbon' ? 
                     [0, 400, 800, 1200, 1600] : 
                     selectedKPI1 === 'upfrontCarbon' ? [0, 200, 400, 600, 800, 1000] :
                     (() => {
                       const maxDataValue = Math.max(...chartData.map(p => Math.abs(p[selectedKPI1] || 0)));
                       const maxBenchmarkValue = barChartBenchmarkLines.length > 0 ? 
                         Math.max(...barChartBenchmarkLines.map(b => b.value)) : 0;
                       const maxValue = Math.max(maxDataValue, maxBenchmarkValue, 1000);
                       return generateNiceTicks(Math.max(maxValue * 1.1, 1000));
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
                          {barChartBenchmarkLines.length > 0 && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs font-medium" style={{ color: chartColors.dark }}>Benchmarks:</p>
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
                        position: "insideTopRight",
                        offset: 10,
                        style: { fill: benchmark.color, fontSize: '12px', fontWeight: 'bold' }
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
                      strokeDasharray={benchmark.name.includes('New building') ? "5 5" : "10 5"}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
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

        // Get UKNZCBS benchmark data for timeline - ONLY for Upfront Carbon and Operational Energy with per sqm
        const shouldShowUpfrontBenchmark = valueType === 'per-sqm' && selectedKPI1 === 'upfrontCarbon' && timelineData.length > 0;
        const shouldShowOperationalEnergyBenchmark = valueType === 'per-sqm' && selectedKPI1 === 'operationalEnergyTotal' && timelineData.length > 0;

        // Helper function to get sub-sectors for a given sector
        const getSubSectorsForSector = (sector: string): string[] => {
          const sectorSubSectors = uknzcbsBenchmarks[sector as keyof typeof uknzcbsBenchmarks];
          return sectorSubSectors ? Object.keys(sectorSubSectors) : [];
        };

        // Get the primary project's sector and available sub-sectors
        const primaryProject = projects[0];
        const primarySector = primaryProject ? getSector(primaryProject.typology) : '';
        const availableSubSectors = getSubSectorsForSector(primarySector);
        
        // Set default sub-sector if not already selected
        if (!selectedSubSector && availableSubSectors.length > 0) {
          setSelectedSubSector(availableSubSectors[0]);
        }

        // Create UKNZCBS benchmark data for upfront carbon
        const createUpfrontBenchmarkData = () => {
          if (!shouldShowUpfrontBenchmark || !primaryProject || !selectedSubSector) {
            return { newBuildData: [], retrofitData: [] };
          }
          
          const sectorData = uknzcbsBenchmarks[primarySector as keyof typeof uknzcbsBenchmarks];
          if (!sectorData) {
            return { newBuildData: [], retrofitData: [] };
          }
          
          const subSectorData = sectorData[selectedSubSector as keyof typeof sectorData];
          if (!subSectorData) {
            return { newBuildData: [], retrofitData: [] };
          }

          // Create benchmark lines from 2025 to 2050
          const years = Array.from({ length: 26 }, (_, i) => 2025 + i);
          
          const newBuildData = years.map(year => ({
            completionYear: year,
            benchmarkValue: subSectorData['New building'][year as keyof typeof subSectorData['New building']],
            benchmarkType: 'New building'
          })).filter(item => item.benchmarkValue !== undefined);

          const retrofitData = subSectorData['Retrofit'] ? years.map(year => ({
            completionYear: year,
            benchmarkValue: subSectorData['Retrofit'][year as keyof typeof subSectorData['Retrofit']],
            benchmarkType: 'Retrofit'
          })).filter(item => item.benchmarkValue !== undefined) : [];

          return { newBuildData, retrofitData };
        };

        const upfrontBenchmarkData = createUpfrontBenchmarkData();

        // Create operational energy benchmark data for timeline
        const createOperationalEnergyBenchmarkData = () => {
          if (!shouldShowOperationalEnergyBenchmark || !primaryProject || !selectedSubSector) {
            return { newBuildData: [], retrofitData: [] };
          }
          
          const sectorData = uknzcbsOperationalEnergyBenchmarks[primarySector as keyof typeof uknzcbsOperationalEnergyBenchmarks];
          if (!sectorData) {
            return { newBuildData: [], retrofitData: [] };
          }

          const subSectorData = sectorData[selectedSubSector as keyof typeof sectorData];
          if (!subSectorData) {
            return { newBuildData: [], retrofitData: [] };
          }

          // Only include years from 2025 onwards for operational energy benchmarks
          const benchmarkYears = Array.from({ length: 26 }, (_, i) => 2025 + i);
          
          const newBuildData = benchmarkYears.map(year => {
            const newBuildValues = subSectorData['New building'];
            const value = newBuildValues?.[year as keyof typeof newBuildValues];
            
            return {
              completionYear: year,
              benchmarkValue: value || 0
            };
          });

          const retrofitData = benchmarkYears.map(year => {
            const retrofitValues = subSectorData['Retrofit'];
            const value = retrofitValues?.[year as keyof typeof retrofitValues];
            
            return {
              completionYear: year,
              benchmarkValue: value || 0
            };
          });

          return { newBuildData, retrofitData };
        };

        const operationalEnergyBenchmarkData = createOperationalEnergyBenchmarkData();
        const benchmarkColor = primaryProject ? getSectorBenchmarkColor(primaryProject.typology) : '#1E9F5A';

        // Determine graph range based on project data
        const projectYears = timelineData.map(p => p.completionYear);
        const minProjectYear = Math.min(...projectYears);
        const maxProjectYear = Math.max(...projectYears);
        
        // Set X-axis domain to start at 2020 (or earlier project year) and extend to 2050
        const xAxisDomain = [Math.min(2020, minProjectYear), 2050];
        const xAxisTicks = [2020, 2022, 2024, 2026, 2028, 2030, 2032, 2034, 2036, 2038, 2040, 2042, 2044, 2046, 2048, 2050];

        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 40, right: 30, left: 60, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} horizontal={true} verticalPoints={[]} />
              <XAxis 
                dataKey="completionYear"
                type="number"
                scale="linear"
                domain={xAxisDomain}
                ticks={xAxisTicks}
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
                    ...(shouldShowUpfrontBenchmark && upfrontBenchmarkData.newBuildData ? upfrontBenchmarkData.newBuildData.map(b => b.benchmarkValue) : []),
                    ...(shouldShowUpfrontBenchmark && upfrontBenchmarkData.retrofitData ? upfrontBenchmarkData.retrofitData.map(b => b.benchmarkValue) : []),
                    ...(shouldShowOperationalEnergyBenchmark && operationalEnergyBenchmarkData.newBuildData ? operationalEnergyBenchmarkData.newBuildData.map(b => b.benchmarkValue || 0) : []),
                    ...(shouldShowOperationalEnergyBenchmark && operationalEnergyBenchmarkData.retrofitData ? operationalEnergyBenchmarkData.retrofitData.map(b => b.benchmarkValue || 0) : [])
                  );
                  return generateNiceTicks(maxValue * 1.1);
                })()}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const projectData = payload.find(p => p.dataKey === selectedKPI1);
                    const year = parseInt(label as string);
                    
                    // Find benchmark values for this year
                    let newBuildBenchmark = null;
                    let retrofitBenchmark = null;
                    
                    if (shouldShowUpfrontBenchmark) {
                      newBuildBenchmark = upfrontBenchmarkData.newBuildData.find(d => d.completionYear === year)?.benchmarkValue;
                      retrofitBenchmark = upfrontBenchmarkData.retrofitData.find(d => d.completionYear === year)?.benchmarkValue;
                    } else if (shouldShowOperationalEnergyBenchmark) {
                      newBuildBenchmark = operationalEnergyBenchmarkData.newBuildData.find(d => d.completionYear === year)?.benchmarkValue;
                      retrofitBenchmark = operationalEnergyBenchmarkData.retrofitData.find(d => d.completionYear === year)?.benchmarkValue;
                    }
                    
                    return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg" style={{ backgroundColor: 'white', borderColor: chartColors.primary }}>
                        <p className="font-semibold" style={{ color: chartColors.dark }}>Year: {label}</p>
                        {projectData && (
                          <>
                            <p className="text-sm" style={{ color: chartColors.dark }}>Project: {projectData.payload.displayName}</p>
                            <p className="text-sm" style={{ color: chartColors.dark }}>
                              {kpi1Config?.label}: {formatNumber(projectData.value as number)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
                            </p>
                          </>
                        )}
                        {(newBuildBenchmark || retrofitBenchmark) && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            {newBuildBenchmark && (
                              <p className="text-sm" style={{ color: benchmarkColor }}>
                                New Build: {formatNumber(newBuildBenchmark)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
                              </p>
                            )}
                            {retrofitBenchmark && (
                              <p className="text-sm" style={{ color: benchmarkColor }}>
                                Retrofit: {formatNumber(retrofitBenchmark)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
                              </p>
                            )}
                          </div>
                        )}
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
              
              {/* UKNZCBS upfront carbon benchmark lines */}
              {shouldShowUpfrontBenchmark && upfrontBenchmarkData.newBuildData.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="benchmarkValue"
                  data={upfrontBenchmarkData.newBuildData}
                  stroke={benchmarkColor}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="New building benchmark"
                  connectNulls={false}
                />
              )}
              
              {shouldShowUpfrontBenchmark && upfrontBenchmarkData.retrofitData.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="benchmarkValue"
                  data={upfrontBenchmarkData.retrofitData}
                  stroke={benchmarkColor}
                  strokeWidth={2}
                  strokeDasharray="10 5"
                  dot={false}
                  name="Retrofit benchmark"
                  connectNulls={false}
                />
              )}

              {/* UKNZCBS operational energy benchmark lines */}
              {shouldShowOperationalEnergyBenchmark && operationalEnergyBenchmarkData.newBuildData.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="benchmarkValue"
                  data={operationalEnergyBenchmarkData.newBuildData}
                  stroke={benchmarkColor}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="New building benchmark"
                  connectNulls={false}
                />
              )}
              
              {shouldShowOperationalEnergyBenchmark && operationalEnergyBenchmarkData.retrofitData.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="benchmarkValue"
                  data={operationalEnergyBenchmarkData.retrofitData}
                  stroke={benchmarkColor}
                  strokeWidth={2}
                  strokeDasharray="10 5"
                  dot={false}
                  name="Retrofit benchmark"
                  connectNulls={false}
                />
              )}

              
              {/* Legend for benchmark lines */}
              {((shouldShowUpfrontBenchmark && (upfrontBenchmarkData.newBuildData.length > 0 || upfrontBenchmarkData.retrofitData.length > 0)) ||
                (shouldShowOperationalEnergyBenchmark && (operationalEnergyBenchmarkData.newBuildData.length > 0 || operationalEnergyBenchmarkData.retrofitData.length > 0))) && (
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  content={(props) => {
                    const legendItems = [];
                    // Add upfront carbon benchmark items
                    if (shouldShowUpfrontBenchmark && upfrontBenchmarkData.newBuildData.length > 0) {
                      legendItems.push({
                        value: 'New Build',
                        type: 'line',
                        color: benchmarkColor,
                        strokeDasharray: '5 5'
                      });
                    }
                    if (shouldShowUpfrontBenchmark && upfrontBenchmarkData.retrofitData.length > 0) {
                      legendItems.push({
                        value: 'Retrofit',
                        type: 'line', 
                        color: benchmarkColor,
                        strokeDasharray: '10 5'
                      });
                    }
                    // Add operational energy benchmark items
                    if (shouldShowOperationalEnergyBenchmark && operationalEnergyBenchmarkData.newBuildData.length > 0) {
                      legendItems.push({
                        value: 'New Build',
                        type: 'line',
                        color: benchmarkColor,
                        strokeDasharray: '5 5'
                      });
                    }
                    if (shouldShowOperationalEnergyBenchmark && operationalEnergyBenchmarkData.retrofitData.length > 0) {
                      legendItems.push({
                        value: 'Retrofit',
                        type: 'line', 
                        color: benchmarkColor,
                        strokeDasharray: '10 5'
                      });
                    }
                    
                    return (
                      <div className="flex justify-center items-center gap-6 mt-4">
                        {legendItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <svg width="24" height="2" className="inline-block">
                              <line
                                x1="0"
                                y1="1"
                                x2="24"
                                y2="1"
                                stroke={item.color}
                                strokeWidth="2"
                                strokeDasharray={item.strokeDasharray}
                              />
                            </svg>
                            <span className="text-sm" style={{ color: chartColors.dark }}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
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
    return !!totalEmbodiedCarbonBenchmarks[primarySector as keyof typeof totalEmbodiedCarbonBenchmarks];
  };

  // Get sub-sectors for the primary project's sector
  const getAvailableSubSectors = (): string[] => {
    if (projects.length === 0) return [];
    const primaryProject = projects[0];
    const primarySector = getSector(primaryProject.typology);
    
    // Check both upfront carbon and operational energy benchmarks
    if (selectedKPI1 === 'upfrontCarbon') {
      const sectorData = uknzcbsBenchmarks[primarySector as keyof typeof uknzcbsBenchmarks];
      return sectorData ? Object.keys(sectorData) : [];
    } else if (selectedKPI1 === 'operationalEnergyTotal') {
      const sectorData = uknzcbsOperationalEnergyBenchmarks[primarySector as keyof typeof uknzcbsOperationalEnergyBenchmarks];
      return sectorData ? Object.keys(sectorData) : [];
    }
    
    return [];
  };

  const availableSubSectors = getAvailableSubSectors();
  const showSubSectorToggle = (selectedKPI1 === 'upfrontCarbon' || selectedKPI1 === 'operationalEnergyTotal') && valueType === 'per-sqm' && chartType === 'single-timeline' && availableSubSectors.length > 1;
  const showBarChartSubSectorToggle = selectedKPI1 === 'upfrontCarbon' && valueType === 'per-sqm' && chartType === 'single-bar' && availableSubSectors.length > 0;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold" style={{ color: chartColors.dark }}>{getChartTitle()}</h2>
        <div className="flex items-center space-x-2">
          {/* Show benchmark toggle only for Total Embodied Carbon with per-sqm values */}
          {selectedKPI1 === 'totalEmbodiedCarbon' && valueType === 'per-sqm' && chartType === 'single-bar' && (
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
      
      {/* Sub-sector toggle for upfront carbon timeline */}
      {showSubSectorToggle && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2" style={{ color: chartColors.dark }}>UKNZCBS benchmarks</p>
          <div className="flex flex-wrap gap-2">
            {availableSubSectors.map((subSector) => (
              <Button
                key={subSector}
                variant={selectedSubSector === subSector ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubSector(subSector)}
                className="text-xs"
              >
                {subSector}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Sub-sector toggle for upfront carbon bar chart */}
      {showBarChartSubSectorToggle && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2" style={{ color: chartColors.dark }}>UKNZCBS benchmarks</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedBarChartBenchmark === '' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBarChartBenchmark('')}
              className="text-xs"
            >
              None
            </Button>
            {availableSubSectors.map((subSector) => (
              <Button
                key={subSector}
                variant={selectedBarChartBenchmark === subSector ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBarChartBenchmark(subSector)}
                className="text-xs"
              >
                {subSector}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="h-[480px]" data-chart="chart-container">
        {renderChart()}
      </div>
    </Card>
  );
};
