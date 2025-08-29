import { Card } from '@/components/ui/card';
import { Project } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { generateProjectNumber } from '@/utils/projectUtils';

interface CertificationAnalysisProps {
  projects: Project[];
  primaryProject?: string;
}

export const CertificationAnalysis = ({ projects, primaryProject }: CertificationAnalysisProps) => {
  
  const analyzeCertifications = () => {
    // Count projects with Passivhaus or EnePHit
    const passivhausCount = projects.filter(project => 
      project.passivhausOrEnePHit === 'Passivhaus' || project.passivhausOrEnePHit === 'EnePHit'
    ).length;

    // Count other certifications from various certification fields
    const certificationCounts: Record<string, number> = {};
    
    projects.forEach(project => {
      if (project.breeam && project.breeam !== 'N/A') {
        certificationCounts['BREEAM'] = (certificationCounts['BREEAM'] || 0) + 1;
      }
      if (project.leed && project.leed !== 'N/A') {
        certificationCounts['LEED'] = (certificationCounts['LEED'] || 0) + 1;
      }
      if (project.well && project.well !== 'N/A') {
        certificationCounts['WELL'] = (certificationCounts['WELL'] || 0) + 1;
      }
      if (project.fitwel && project.fitwel !== 'N/A') {
        certificationCounts['Fitwel'] = (certificationCounts['Fitwel'] || 0) + 1;
      }
      if (project.nabers && project.nabers !== 'N/A') {
        certificationCounts['NABERS'] = (certificationCounts['NABERS'] || 0) + 1;
      }
      if (project.uknzcbs && project.uknzcbs.includes('Yes')) {
        certificationCounts['UKNZCBS'] = (certificationCounts['UKNZCBS'] || 0) + 1;
      }
      if (project.otherCertification) {
        certificationCounts[project.otherCertification] = (certificationCounts[project.otherCertification] || 0) + 1;
      }
    });

    const certificationData = Object.entries(certificationCounts).map(([name, count]) => ({
      name,
      value: count,
      percentage: ((count / projects.length) * 100).toFixed(1)
    }));

    return {
      passivhausCount,
      passivhausPercentage: ((passivhausCount / projects.length) * 100).toFixed(1),
      certificationData,
      totalCertified: certificationData.reduce((sum, cert) => sum + cert.value, 0),
      totalProjects: projects.length
    };
  };

  const certificationStats = analyzeCertifications();
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0', '#ffb347'];

  const downloadCertificationReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Project,Passivhaus,BREEAM,LEED,WELL,Fitwel,NABERS,UKNZCBS,Other\n";
    
    projects.forEach((project, index) => {
      const row = [
        getProjectNumber(project, index),
        project.passivhausOrEnePHit || 'N/A',
        project.breeam || 'N/A',
        project.leed || 'N/A',
        project.well || 'N/A',
        project.fitwel || 'N/A',
        project.nabers || 'N/A',
        project.uknzcbs || 'N/A',
        project.otherCertification || 'N/A'
      ];
      csvContent += row.join(",") + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "certification_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getProjectNumber = (project: Project, index: number): string => {
    return `${generateProjectNumber(index)}_${project.projectName}`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Certification Analysis</h3>
        <button
          onClick={downloadCertificationReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistics */}
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Passivhaus/EnePHit</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-700">
                {certificationStats.passivhausCount}
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {certificationStats.passivhausPercentage}%
              </Badge>
            </div>
            <p className="text-sm text-green-600 mt-1">
              of {certificationStats.totalProjects} projects
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Total Certified Projects</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-700">
                {certificationStats.totalCertified}
              </span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {((certificationStats.totalCertified / certificationStats.totalProjects) * 100).toFixed(1)}%
              </Badge>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              with any certification
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Certification Breakdown</h4>
            {certificationStats.certificationData.map((cert, index) => (
              <div key={cert.name} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-700">{cert.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{cert.value}</span>
                  <Badge variant="outline" className="text-xs">
                    {cert.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <h4 className="font-medium text-gray-900 mb-4 text-center">
            Certification Distribution
          </h4>
          {certificationStats.certificationData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={certificationStats.certificationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {certificationStats.certificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No certification data available
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};