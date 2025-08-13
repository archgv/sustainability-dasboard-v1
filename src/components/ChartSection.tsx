import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Eye, EyeOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, ReferenceLine } from 'recharts';
import { Project } from '@/types/project';
import html2canvas from 'html2canvas';

interface ChartSectionProps {
  projects: Project[];
  chartType: string;
  selectedKPI1: string;
  selectedKPI2: string;
  valueType: string;
}

// Total Embodied Carbon Benchmarks (fixed values by sector)
const totalEmbodiedCarbonBenchmarks = {
  'CCC': 550,
  'Education': 425,
  'Healthcare': 600,
  'Residential': 425,
  'Workplace': 500,
};

// Upfront Carbon Benchmarks (2025-2050 by sector, sub-sector, and type)
const upfrontCarbonBenchmarks = {
  Residential: {
    "Commercial residential": {
      2025: { "New building": 580, Retrofit: 460 },
      2026: { "New building": 550, Retrofit: 435 },
      2027: { "New building": 525, Retrofit: 415 },
      2028: { "New building": 495, Retrofit: 390 },
      2029: { "New building": 465, Retrofit: 370 },
      2030: { "New building": 435, Retrofit: 345 },
      2031: { "New building": 405, Retrofit: 320 },
      2032: { "New building": 380, Retrofit: 300 },
      2033: { "New building": 350, Retrofit: 280 },
      2034: { "New building": 315, Retrofit: 250 },
      2035: { "New building": 285, Retrofit: 225 },
      2036: { "New building": 260, Retrofit: 205 },
      2037: { "New building": 240, Retrofit: 190 },
      2038: { "New building": 220, Retrofit: 175 },
      2039: { "New building": 200, Retrofit: 160 },
      2040: { "New building": 185, Retrofit: 150 },
      2041: { "New building": 165, Retrofit: 130 },
      2042: { "New building": 150, Retrofit: 120 },
      2043: { "New building": 135, Retrofit: 110 },
      2044: { "New building": 120, Retrofit: 95 },
      2045: { "New building": 105, Retrofit: 85 },
      2046: { "New building": 95, Retrofit: 75 },
      2047: { "New building": 80, Retrofit: 65 },
      2048: { "New building": 70, Retrofit: 60 },
      2049: { "New building": 60, Retrofit: 50 },
      2050: { "New building": 45, Retrofit: 40 }
    },
    Flats: {
      2025: { "New building": 565, Retrofit: 425 },
      2026: { "New building": 525, Retrofit: 395 },
      2027: { "New building": 490, Retrofit: 370 },
      2028: { "New building": 450, Retrofit: 340 },
      2029: { "New building": 420, Retrofit: 315 },
      2030: { "New building": 380, Retrofit: 285 },
      2031: { "New building": 355, Retrofit: 270 },
      2032: { "New building": 335, Retrofit: 255 },
      2033: { "New building": 305, Retrofit: 230 },
      2034: { "New building": 280, Retrofit: 210 },
      2035: { "New building": 250, Retrofit: 190 },
      2036: { "New building": 225, Retrofit: 170 },
      2037: { "New building": 210, Retrofit: 160 },
      2038: { "New building": 195, Retrofit: 150 },
      2039: { "New building": 175, Retrofit: 135 },
      2040: { "New building": 160, Retrofit: 120 },
      2041: { "New building": 145, Retrofit: 110 },
      2042: { "New building": 135, Retrofit: 105 },
      2043: { "New building": 120, Retrofit: 90 },
      2044: { "New building": 105, Retrofit: 80 },
      2045: { "New building": 95, Retrofit: 75 },
      2046: { "New building": 80, Retrofit: 60 },
      2047: { "New building": 70, Retrofit: 55 },
      2048: { "New building": 60, Retrofit: 45 },
      2049: { "New building": 50, Retrofit: 40 },
      2050: { "New building": 40, Retrofit: 30 }
    },
    Hotels: {
      2025: { "New building": 670, Retrofit: 520 },
      2026: { "New building": 635, Retrofit: 490 },
      2027: { "New building": 605, Retrofit: 470 },
      2028: { "New building": 570, Retrofit: 440 },
      2029: { "New building": 540, Retrofit: 420 },
      2030: { "New building": 500, Retrofit: 390 },
      2031: { "New building": 470, Retrofit: 365 },
      2032: { "New building": 440, Retrofit: 340 },
      2033: { "New building": 400, Retrofit: 310 },
      2034: { "New building": 365, Retrofit: 285 },
      2035: { "New building": 330, Retrofit: 255 },
      2036: { "New building": 300, Retrofit: 235 },
      2037: { "New building": 275, Retrofit: 215 },
      2038: { "New building": 255, Retrofit: 200 },
      2039: { "New building": 235, Retrofit: 185 },
      2040: { "New building": 215, Retrofit: 170 },
      2041: { "New building": 195, Retrofit: 155 },
      2042: { "New building": 175, Retrofit: 135 },
      2043: { "New building": 155, Retrofit: 120 },
      2044: { "New building": 140, Retrofit: 110 },
      2045: { "New building": 125, Retrofit: 100 },
      2046: { "New building": 105, Retrofit: 85 },
      2047: { "New building": 95, Retrofit: 75 },
      2048: { "New building": 80, Retrofit: 65 },
      2049: { "New building": 65, Retrofit: 55 },
      2050: { "New building": 55, Retrofit: 45 }
    },
    "Single family homes": {
      2025: { "New building": 430, Retrofit: 270 },
      2026: { "New building": 400, Retrofit: 255 },
      2027: { "New building": 375, Retrofit: 235 },
      2028: { "New building": 345, Retrofit: 220 },
      2029: { "New building": 320, Retrofit: 205 },
      2030: { "New building": 290, Retrofit: 185 },
      2031: { "New building": 270, Retrofit: 170 },
      2032: { "New building": 255, Retrofit: 160 },
      2033: { "New building": 235, Retrofit: 150 },
      2034: { "New building": 210, Retrofit: 135 },
      2035: { "New building": 190, Retrofit: 120 },
      2036: { "New building": 175, Retrofit: 110 },
      2037: { "New building": 160, Retrofit: 105 },
      2038: { "New building": 150, Retrofit: 95 },
      2039: { "New building": 135, Retrofit: 85 },
      2040: { "New building": 125, Retrofit: 80 },
      2041: { "New building": 110, Retrofit: 70 },
      2042: { "New building": 100, Retrofit: 65 },
      2043: { "New building": 90, Retrofit: 60 },
      2044: { "New building": 80, Retrofit: 55 },
      2045: { "New building": 70, Retrofit: 45 },
      2046: { "New building": 65, Retrofit: 45 },
      2047: { "New building": 55, Retrofit: 35 },
      2048: { "New building": 45, Retrofit: 30 },
      2049: { "New building": 40, Retrofit: 30 },
      2050: { "New building": 30, Retrofit: 20 }
    }
  },
  CCC: {
    "Culture and entertainment (General)": {
      2025: { "New building": 570, Retrofit: 450 },
      2026: { "New building": 540, Retrofit: 425 },
      2027: { "New building": 515, Retrofit: 405 },
      2028: { "New building": 485, Retrofit: 385 },
      2029: { "New building": 460, Retrofit: 365 },
      2030: { "New building": 425, Retrofit: 335 },
      2031: { "New building": 400, Retrofit: 315 },
      2032: { "New building": 375, Retrofit: 295 },
      2033: { "New building": 340, Retrofit: 270 },
      2034: { "New building": 310, Retrofit: 245 },
      2035: { "New building": 280, Retrofit: 220 },
      2036: { "New building": 255, Retrofit: 200 },
      2037: { "New building": 235, Retrofit: 185 },
      2038: { "New building": 215, Retrofit: 170 },
      2039: { "New building": 200, Retrofit: 160 },
      2040: { "New building": 180, Retrofit: 145 },
      2041: { "New building": 165, Retrofit: 130 },
      2042: { "New building": 150, Retrofit: 120 },
      2043: { "New building": 135, Retrofit: 110 },
      2044: { "New building": 120, Retrofit: 95 },
      2045: { "New building": 105, Retrofit: 85 },
      2046: { "New building": 90, Retrofit: 75 },
      2047: { "New building": 80, Retrofit: 65 },
      2048: { "New building": 70, Retrofit: 55 },
      2049: { "New building": 55, Retrofit: 45 },
      2050: { "New building": 45, Retrofit: 40 }
    },
    "Culture and entertainment (Performance)": {
      2025: { "New building": 855, Retrofit: 605 },
      2026: { "New building": 810, Retrofit: 570 },
      2027: { "New building": 770, Retrofit: 545 },
      2028: { "New building": 725, Retrofit: 510 },
      2029: { "New building": 685, Retrofit: 485 },
      2030: { "New building": 640, Retrofit: 450 },
      2031: { "New building": 595, Retrofit: 420 },
      2032: { "New building": 560, Retrofit: 395 },
      2033: { "New building": 510, Retrofit: 360 },
      2034: { "New building": 465, Retrofit: 330 },
      2035: { "New building": 420, Retrofit: 295 },
      2036: { "New building": 380, Retrofit: 270 },
      2037: { "New building": 350, Retrofit: 250 },
      2038: { "New building": 325, Retrofit: 230 },
      2039: { "New building": 295, Retrofit: 210 },
      2040: { "New building": 270, Retrofit: 190 },
      2041: { "New building": 245, Retrofit: 175 },
      2042: { "New building": 220, Retrofit: 155 },
      2043: { "New building": 200, Retrofit: 145 },
      2044: { "New building": 175, Retrofit: 125 },
      2045: { "New building": 155, Retrofit: 110 },
      2046: { "New building": 135, Retrofit: 95 },
      2047: { "New building": 120, Retrofit: 85 },
      2048: { "New building": 100, Retrofit: 75 },
      2049: { "New building": 85, Retrofit: 60 },
      2050: { "New building": 70, Retrofit: 50 }
    }
  },
  Healthcare: {
    Healthcare: {
      2025: { "New building": 790, Retrofit: 615 },
      2026: { "New building": 750, Retrofit: 585 },
      2027: { "New building": 710, Retrofit: 555 },
      2028: { "New building": 670, Retrofit: 525 },
      2029: { "New building": 635, Retrofit: 495 },
      2030: { "New building": 590, Retrofit: 460 },
      2031: { "New building": 550, Retrofit: 430 },
      2032: { "New building": 515, Retrofit: 405 },
      2033: { "New building": 475, Retrofit: 370 },
      2034: { "New building": 430, Retrofit: 335 },
      2035: { "New building": 390, Retrofit: 305 },
      2036: { "New building": 350, Retrofit: 275 },
      2037: { "New building": 325, Retrofit: 255 },
      2038: { "New building": 300, Retrofit: 235 },
      2039: { "New building": 275, Retrofit: 215 },
      2040: { "New building": 250, Retrofit: 195 },
      2041: { "New building": 225, Retrofit: 180 },
      2042: { "New building": 205, Retrofit: 160 },
      2043: { "New building": 185, Retrofit: 145 },
      2044: { "New building": 165, Retrofit: 130 },
      2045: { "New building": 145, Retrofit: 115 },
      2046: { "New building": 125, Retrofit: 100 },
      2047: { "New building": 110, Retrofit: 90 },
      2048: { "New building": 95, Retrofit: 75 },
      2049: { "New building": 80, Retrofit: 65 },
      2050: { "New building": 65, Retrofit: 55 }
    }
  },
  Education: {
    "Higher education": {
      2025: { "New building": 640, Retrofit: 475 },
      2026: { "New building": 610, Retrofit: 455 },
      2027: { "New building": 575, Retrofit: 425 },
      2028: { "New building": 545, Retrofit: 405 },
      2029: { "New building": 515, Retrofit: 385 },
      2030: { "New building": 480, Retrofit: 355 },
      2031: { "New building": 445, Retrofit: 330 },
      2032: { "New building": 420, Retrofit: 315 },
      2033: { "New building": 385, Retrofit: 285 },
      2034: { "New building": 350, Retrofit: 260 },
      2035: { "New building": 315, Retrofit: 235 },
      2036: { "New building": 285, Retrofit: 215 },
      2037: { "New building": 265, Retrofit: 200 },
      2038: { "New building": 240, Retrofit: 180 },
      2039: { "New building": 225, Retrofit: 170 },
      2040: { "New building": 205, Retrofit: 155 },
      2041: { "New building": 185, Retrofit: 140 },
      2042: { "New building": 165, Retrofit: 125 },
      2043: { "New building": 150, Retrofit: 115 },
      2044: { "New building": 135, Retrofit: 100 },
      2045: { "New building": 115, Retrofit: 85 },
      2046: { "New building": 105, Retrofit: 80 },
      2047: { "New building": 90, Retrofit: 70 },
      2048: { "New building": 75, Retrofit: 60 },
      2049: { "New building": 65, Retrofit: 50 },
      2050: { "New building": 50, Retrofit: 40 }
    },
    Schools: {
      2025: { "New building": 530, Retrofit: 380 },
      2026: { "New building": 505, Retrofit: 365 },
      2027: { "New building": 480, Retrofit: 345 },
      2028: { "New building": 450, Retrofit: 325 },
      2029: { "New building": 425, Retrofit: 305 },
      2030: { "New building": 395, Retrofit: 285 },
      2031: { "New building": 370, Retrofit: 265 },
      2032: { "New building": 350, Retrofit: 255 },
      2033: { "New building": 320, Retrofit: 230 },
      2034: { "New building": 290, Retrofit: 210 },
      2035: { "New building": 260, Retrofit: 190 },
      2036: { "New building": 235, Retrofit: 170 },
      2037: { "New building": 220, Retrofit: 160 },
      2038: { "New building": 200, Retrofit: 145 },
      2039: { "New building": 185, Retrofit: 135 },
      2040: { "New building": 170, Retrofit: 125 },
      2041: { "New building": 155, Retrofit: 115 },
      2042: { "New building": 140, Retrofit: 105 },
      2043: { "New building": 125, Retrofit: 90 },
      2044: { "New building": 110, Retrofit: 80 },
      2045: { "New building": 100, Retrofit: 75 },
      2046: { "New building": 85, Retrofit: 65 },
      2047: { "New building": 75, Retrofit: 55 },
      2048: { "New building": 65, Retrofit: 50 },
      2049: { "New building": 55, Retrofit: 40 },
      2050: { "New building": 45, Retrofit: 35 }
    }
  },
  Workplace: {
    "Science and technology": {
      2025: { "New building": 755, Retrofit: 605 },
      2026: { "New building": 715, Retrofit: 575 },
      2027: { "New building": 680, Retrofit: 545 },
      2028: { "New building": 640, Retrofit: 515 },
      2029: { "New building": 605, Retrofit: 485 },
      2030: { "New building": 565, Retrofit: 455 },
      2031: { "New building": 525, Retrofit: 420 },
      2032: { "New building": 495, Retrofit: 395 },
      2033: { "New building": 450, Retrofit: 360 },
      2034: { "New building": 410, Retrofit: 330 },
      2035: { "New building": 370, Retrofit: 300 },
      2036: { "New building": 335, Retrofit: 270 },
      2037: { "New building": 310, Retrofit: 250 },
      2038: { "New building": 285, Retrofit: 230 },
      2039: { "New building": 260, Retrofit: 210 },
      2040: { "New building": 240, Retrofit: 195 },
      2041: { "New building": 215, Retrofit: 175 },
      2042: { "New building": 195, Retrofit: 160 },
      2043: { "New building": 175, Retrofit: 140 },
      2044: { "New building": 155, Retrofit: 125 },
      2045: { "New building": 140, Retrofit: 115 },
      2046: { "New building": 120, Retrofit: 100 },
      2047: { "New building": 105, Retrofit: 85 },
      2048: { "New building": 90, Retrofit: 75 },
      2049: { "New building": 75, Retrofit: 60 },
      2050: { "New building": 60, Retrofit: 50 }
    },
    "Workplace (Shell and core)": {
      2025: { "New building": 475 },
      2026: { "New building": 450 },
      2027: { "New building": 425 },
      2028: { "New building": 400 },
      2029: { "New building": 380 },
      2030: { "New building": 355 },
      2031: { "New building": 330 },
      2032: { "New building": 310 },
      2033: { "New building": 285 },
      2034: { "New building": 255 },
      2035: { "New building": 230 },
      2036: { "New building": 210 },
      2037: { "New building": 190 },
      2038: { "New building": 180 },
      2039: { "New building": 165 },
      2040: { "New building": 150 },
      2041: { "New building": 135 },
      2042: { "New building": 120 },
      2043: { "New building": 110 },
      2044: { "New building": 95 },
      2045: { "New building": 85 },
      2046: { "New building": 75 },
      2047: { "New building": 60 },
      2048: { "New building": 55 },
      2049: { "New building": 45 },
      2050: { "New building": 35 }
    },
    "Workplace (Whole building)": {
      2025: { "New building": 735, Retrofit: 600 },
      2026: { "New building": 700, Retrofit: 575 },
      2027: { "New building": 660, Retrofit: 540 },
      2028: { "New building": 625, Retrofit: 510 },
      2029: { "New building": 590, Retrofit: 485 },
      2030: { "New building": 550, Retrofit: 450 },
      2031: { "New building": 515, Retrofit: 420 },
      2032: { "New building": 480, Retrofit: 395 },
      2033: { "New building": 440, Retrofit: 360 },
      2034: { "New building": 400, Retrofit: 330 },
      2035: { "New building": 360, Retrofit: 295 },
      2036: { "New building": 325, Retrofit: 265 },
      2037: { "New building": 300, Retrofit: 245 },
      2038: { "New building": 280, Retrofit: 230 },
      2039: { "New building": 255, Retrofit: 210 },
      2040: { "New building": 235, Retrofit: 195 },
      2041: { "New building": 210, Retrofit: 175 },
      2042: { "New building": 190, Retrofit: 155 },
      2043: { "New building": 170, Retrofit: 140 },
      2044: { "New building": 150, Retrofit: 125 },
      2045: { "New building": 135, Retrofit: 110 },
      2046: { "New building": 120, Retrofit: 100 },
      2047: { "New building": 100, Retrofit: 85 },
      2048: { "New building": 85, Retrofit: 70 },
      2049: { "New building": 70, Retrofit: 60 },
      2050: { "New building": 60, Retrofit: 50 }
    }
  }
};

// Sub-sector to sector mapping for upfront carbon
const upfrontCarbonSubSectorMapping = {
  'Culture and entertainment (Performance)': 'CCC',
  'Culture and entertainment (General)': 'CCC',
  'Higher education': 'Education',
  'Schools': 'Education',
  'Healthcare': 'Healthcare',
  'Single family homes': 'Residential',
  'Flats': 'Residential',
  'Hotels': 'Residential',
  'Commercial residential': 'Residential',
  'Science and technology': 'Workplace',
  'Workplace (Whole building)': 'Workplace',
  'Workplace (Shell and core)': 'Workplace'
};

// Chart colors configuration
const chartColors = {
  primary: '#3B82F6',
  secondary: '#EF4444',
  accent: '#10B981',
  dark: '#1F2937',
  light: '#F3F4F6'
};

export const ChartSection: React.FC<ChartSectionProps> = ({
  projects,
  chartType,
  selectedKPI1,
  selectedKPI2,
  valueType
}) => {
  const [showBenchmarks, setShowBenchmarks] = useState(false);

  const getKPIDisplayName = (kpi: string) => {
    const displayNames: { [key: string]: string } = {
      upfrontCarbon: 'Upfront Carbon',
      upfrontEmbodied: 'Upfront Embodied Carbon',
      totalEmbodiedCarbon: 'Total Embodied Carbon',
      biogenicCarbon: 'Biogenic Carbon',
      refrigerants: 'Refrigerants',
      operationalEnergyTotal: 'Operational Energy Total',
      operationalEnergyPartL: 'Operational Energy Part L',
      operationalEnergyGas: 'Operational Energy Gas',
      operationalEnergy: 'Operational Energy',
      gasUsage: 'Gas Usage',
      spaceHeatingDemand: 'Space Heating Demand',
      renewableEnergyGeneration: 'Renewable Energy Generation',
      existingBuildingEnergy: 'Existing Building Energy',
      operationalWaterUse: 'Operational Water Use',
      socialValue: 'Social Value',
      pmv: 'PMV',
      ppd: 'PPD',
      daylightFactor: 'Daylight Factor',
      biodiversityNetGain: 'Biodiversity Net Gain',
      habitatUnits: 'Habitat Units',
      urbanGreeningFactor: 'Urban Greening Factor',
      ozoneDepletion: 'Ozone Depletion',
      reusedRecycledMaterial: 'Reused/Recycled Material',
      carbonIntensity: 'Carbon Intensity',
      eui: 'EUI',
      shd: 'SHD',
      wlc: 'WLC'
    };
    return displayNames[kpi] || kpi;
  };

  const getSector = (typology: string): string => {
    const sectorMapping = {
      'office': 'Workplace',
      'residential': 'Residential',
      'educational': 'Education',
      'healthcare': 'Healthcare',
      'retail': 'Workplace',
      'mixed-use': 'Workplace',
      'industrial': 'Workplace',
    };
    return sectorMapping[typology as keyof typeof sectorMapping] || 'Workplace';
  };

  // Function to get upfront carbon benchmark values
  const getUpfrontCarbonBenchmark = (project: Project, year: number, type: 'New building' | 'Retrofit') => {
    const primarySector = getSector(project.typology);
    const subSector = getSubSectorFromTypology(project.typology);
    
    const sectorData = upfrontCarbonBenchmarks[primarySector as keyof typeof upfrontCarbonBenchmarks];
    if (!sectorData || !(sectorData as any)[subSector]) return null;
    
    const yearData = (sectorData as any)[subSector][year];
    if (!yearData) return null;
    
    return yearData[type];
  };

  const getSectorColor = (sector: string) => {
    const colors = {
      'CCC': '#8B5CF6',
      'Education': '#10B981',
      'Healthcare': '#EF4444',
      'Residential': '#F59E0B',
      'Workplace': '#3B82F6',
    };
    return colors[sector as keyof typeof colors] || '#6B7280';
  };

  const getSubSectorFromTypology = (typology: string): string => {
    const mapping = {
      'office': 'Workplace (Whole building)',
      'residential': 'Flats',
      'educational': 'Higher education',
      'healthcare': 'Healthcare',
      'retail': 'Workplace (Whole building)',
      'mixed-use': 'Workplace (Whole building)',
      'industrial': 'Workplace (Whole building)',
    };
    return mapping[typology as keyof typeof mapping] || 'Workplace (Whole building)';
  };

  const getChartTitle = () => {
    const kpiName = getKPIDisplayName(selectedKPI1);
    
    if (chartType === 'single-bar') {
      return `${kpiName} - Single KPI Across Projects`;
    } else if (chartType === 'single-timeline') {
      return `${kpiName} - Single KPI Over Time`;
    } else if (chartType === 'comparison') {
      return `KPI Comparison - ${getKPIDisplayName(selectedKPI1)} vs ${getKPIDisplayName(selectedKPI2)}`;
    }
    return 'Chart';
  };

  const handleExportCSV = () => {
    let csvData = [];
    
    if (chartType === 'comparison' && selectedKPI1 && selectedKPI2) {
      csvData = projects.map(project => ({
        'Project Name': project.name,
        [getKPIDisplayName(selectedKPI1)]: project[selectedKPI1 as keyof Project] as number,
        [getKPIDisplayName(selectedKPI2)]: project[selectedKPI2 as keyof Project] as number
      }));
    } else if (selectedKPI1) {
      csvData = projects.map(project => ({
        'Project Name': project.name,
        [getKPIDisplayName(selectedKPI1)]: project[selectedKPI1 as keyof Project] as number
      }));
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [Object.keys(csvData[0] || {}).join(",")]
        .concat(csvData.map(row => Object.values(row).join(",")))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "chart_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPNG = async () => {
    const chartElement = document.querySelector('[data-chart="chart-container"]') as HTMLElement;
    if (chartElement) {
      try {
        const canvas = await html2canvas(chartElement);
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error('Error exporting chart:', error);
      }
    }
  };

  const renderChart = () => {
    if (!selectedKPI1 || projects.length === 0) {
      return <div>No data available</div>;
    }

    const kpiName = getKPIDisplayName(selectedKPI1);
    
    switch (chartType) {
      case 'single-bar':
        const chartData = projects.map(project => {
          const baseValue = project[selectedKPI1 as keyof Project] as number;
          const value = valueType === 'per-sqm' ? (baseValue / project.gia) * 1000 : baseValue;
          
          return {
            name: project.name,
            value: value,
            sector: getSector(project.typology),
            projectType: project.projectType,
            completionYear: new Date(project.completionDate).getFullYear()
          };
        });

        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={120}
                fontSize={12}
              />
              <YAxis 
                label={{ value: valueType === 'per-sqm' ? `${kpiName} (per m² GIA)` : kpiName, angle: -90, position: 'insideLeft' }}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: any) => [
                  typeof value === 'number' ? value.toFixed(2) : value, 
                  valueType === 'per-sqm' ? `${kpiName} (per m² GIA)` : kpiName
                ]}
                labelFormatter={(label) => `Project: ${label}`}
              />
              <Bar 
                dataKey="value" 
                fill={chartColors.primary}
                name={valueType === 'per-sqm' ? `${kpiName} (per m² GIA)` : kpiName}
              />
              
              {/* Add benchmarks for total embodied carbon and upfront carbon with per-sqm values */}
              {showBenchmarks && valueType === 'per-sqm' && (
                <>
                  {selectedKPI1 === 'totalEmbodiedCarbon' && (() => {
                    const primaryProject = projects[0];
                    const primarySector = getSector(primaryProject.typology);
                    const benchmark = totalEmbodiedCarbonBenchmarks[primarySector as keyof typeof totalEmbodiedCarbonBenchmarks];
                    
                    if (benchmark) {
                      return (
                        <ReferenceLine 
                          y={benchmark} 
                          stroke={chartColors.accent} 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          label={{ value: `${primarySector} Benchmark: ${benchmark}`, position: "top" }}
                        />
                      );
                    }
                    return null;
                  })()}
                  
                  {selectedKPI1 === 'upfrontEmbodied' && (() => {
                    const primaryProject = projects[0];
                    const currentYear = new Date().getFullYear();
                    
                    const newBuildingBenchmark = getUpfrontCarbonBenchmark(primaryProject, currentYear, 'New building');
                    const retrofitBenchmark = getUpfrontCarbonBenchmark(primaryProject, currentYear, 'Retrofit');
                    
                    const referenceLinesJSX = [];
                    
                    if (newBuildingBenchmark) {
                      referenceLinesJSX.push(
                        <ReferenceLine 
                          key="new-building"
                          y={newBuildingBenchmark} 
                          stroke={chartColors.accent} 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          label={{ value: `New building: ${newBuildingBenchmark}`, position: "top" }}
                        />
                      );
                    }
                    
                    if (retrofitBenchmark) {
                      referenceLinesJSX.push(
                        <ReferenceLine 
                          key="retrofit"
                          y={retrofitBenchmark} 
                          stroke={chartColors.secondary} 
                          strokeWidth={2}
                          strokeDasharray="8 3"
                          label={{ value: `Retrofit: ${retrofitBenchmark}`, position: "top" }}
                        />
                      );
                    }
                    
                    return referenceLinesJSX;
                  })()}
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'single-timeline':
        // Group projects by completion year and calculate averages
        const timelineData = projects.reduce((acc, project) => {
          const year = new Date(project.completionDate).getFullYear();
          const baseValue = project[selectedKPI1 as keyof Project] as number;
          const value = valueType === 'per-sqm' ? (baseValue / project.gia) * 1000 : baseValue;
          
          if (!acc[year]) {
            acc[year] = { year, values: [], totalValue: 0, count: 0 };
          }
          acc[year].values.push(value);
          acc[year].totalValue += value;
          acc[year].count += 1;
          
          return acc;
        }, {} as any);

        const sortedTimelineData = Object.values(timelineData)
          .map((item: any) => ({
            year: item.year,
            value: item.totalValue / item.count, // Average value
            count: item.count
          }))
          .sort((a, b) => a.year - b.year);

        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sortedTimelineData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                fontSize={12}
              />
              <YAxis 
                label={{ value: valueType === 'per-sqm' ? `${kpiName} (per m² GIA)` : kpiName, angle: -90, position: 'insideLeft' }}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: any) => [
                  typeof value === 'number' ? value.toFixed(2) : value, 
                  valueType === 'per-sqm' ? `${kpiName} (per m² GIA)` : kpiName
                ]}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={chartColors.primary} 
                strokeWidth={3}
                dot={{ r: 6, fill: chartColors.primary }}
                name={valueType === 'per-sqm' ? `${kpiName} (per m² GIA)` : kpiName}
              />
              
              {/* Add benchmarks for upfront carbon with per-sqm values */}
              {showBenchmarks && valueType === 'per-sqm' && selectedKPI1 === 'upfrontEmbodied' && (() => {
                const primaryProject = projects[0];
                
                // Create benchmark lines for New building and Retrofit
                const benchmarkYears = Array.from(new Set(sortedTimelineData.map(d => d.year)))
                  .filter(year => year >= 2025 && year <= 2050);
                
                const newBuildingBenchmarkData = benchmarkYears.map(year => {
                  const benchmark = getUpfrontCarbonBenchmark(primaryProject, year, 'New building');
                  return { year, value: benchmark };
                }).filter(d => d.value !== null);
                
                const retrofitBenchmarkData = benchmarkYears.map(year => {
                  const benchmark = getUpfrontCarbonBenchmark(primaryProject, year, 'Retrofit');
                  return { year, value: benchmark };
                }).filter(d => d.value !== null);
                
                return (
                  <>
                    {newBuildingBenchmarkData.length > 0 && (
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        data={newBuildingBenchmarkData}
                        stroke={chartColors.accent} 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="New building benchmark"
                      />
                    )}
                    {retrofitBenchmarkData.length > 0 && (
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        data={retrofitBenchmarkData}
                        stroke={chartColors.secondary} 
                        strokeWidth={2}
                        strokeDasharray="8 3"
                        dot={false}
                        name="Retrofit benchmark"
                      />
                    )}
                  </>
                );
              })()}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'comparison':
        if (!selectedKPI2) {
          return <div>Please select a second KPI for comparison</div>;
        }

        const comparisonData = projects.map(project => {
          const baseValue1 = project[selectedKPI1 as keyof Project] as number;
          const baseValue2 = project[selectedKPI2 as keyof Project] as number;
          const value1 = valueType === 'per-sqm' ? (baseValue1 / project.gia) * 1000 : baseValue1;
          const value2 = valueType === 'per-sqm' ? (baseValue2 / project.gia) * 1000 : baseValue2;
          
          return {
            name: project.name,
            [selectedKPI1]: value1,
            [selectedKPI2]: value2,
            sector: getSector(project.typology)
          };
        });

        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={comparisonData} margin={{ top: 20, right: 30, left: 60, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={selectedKPI1}
                type="number"
                label={{ 
                  value: valueType === 'per-sqm' ? `${getKPIDisplayName(selectedKPI1)} (per m² GIA)` : getKPIDisplayName(selectedKPI1), 
                  position: 'insideBottom', 
                  offset: -10 
                }}
                fontSize={12}
              />
              <YAxis 
                dataKey={selectedKPI2}
                type="number"
                label={{ 
                  value: valueType === 'per-sqm' ? `${getKPIDisplayName(selectedKPI2)} (per m² GIA)` : getKPIDisplayName(selectedKPI2), 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  typeof value === 'number' ? value.toFixed(2) : value, 
                  valueType === 'per-sqm' ? `${getKPIDisplayName(name)} (per m² GIA)` : getKPIDisplayName(name)
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `Project: ${payload[0].payload.name}`;
                  }
                  return '';
                }}
              />
              <Scatter 
                dataKey={selectedKPI2}
                fill={chartColors.primary}
                name="Projects"
              />
            </ScatterChart>
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
      // Check if benchmarks exist for the primary project's sector
      const subSector = getSubSectorFromTypology(primaryProject.typology);
      const sectorData = upfrontCarbonBenchmarks[primarySector as keyof typeof upfrontCarbonBenchmarks];
      
      if (sectorData && sectorData[subSector]) {
        return true;
      }
      return false;
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