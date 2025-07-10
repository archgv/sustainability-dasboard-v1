
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Project } from '@/types/project';
import { useState } from 'react';

interface CertificationAnalysisProps {
  projects: Project[];
}

export const CertificationAnalysis = ({ projects }: CertificationAnalysisProps) => {
  const [selectedCertification, setSelectedCertification] = useState('breeam');

  const certificationTypes = [
    { value: 'breeam', label: 'BREEAM', field: 'breeam' as keyof Project },
    { value: 'well', label: 'WELL', field: 'well' as keyof Project },
    { value: 'leed', label: 'LEED', field: 'leed' as keyof Project },
    { value: 'nabers', label: 'NABERS', field: 'nabers' as keyof Project },
    { value: 'passivhaus', label: 'Passivhaus', field: 'passivhaus' as keyof Project },
    { value: 'enerphit', label: 'EnerPHit', field: 'enerphit' as keyof Project },
    { value: 'uknzcbs', label: 'UKNZCBS', field: 'uknzcbs' as keyof Project }
  ];

  const getCertificationStats = () => {
    const selectedCert = certificationTypes.find(cert => cert.value === selectedCertification);
    if (!selectedCert) return {};

    const stats: Record<string, { count: number; projects: string[] }> = {};

    projects.forEach(project => {
      let value: any;
      
      if (selectedCertification === 'passivhaus') {
        value = project.passivhaus ? 'Certified' : 'N/A';
      } else {
        value = project[selectedCert.field as keyof Project];
      }

      if (value && value !== 'N/A') {
        if (!stats[value]) {
          stats[value] = { count: 0, projects: [] };
        }
        stats[value].count++;
        stats[value].projects.push(project.name);
      }
    });

    return stats;
  };

  const stats = getCertificationStats();
  const selectedCertLabel = certificationTypes.find(cert => cert.value === selectedCertification)?.label || '';

  return (
    <Accordion type="single" collapsible className="w-full mt-6">
      <AccordionItem value="certification-analysis">
        <AccordionTrigger className="text-xl font-semibold text-gray-900 hover:no-underline">
          Certification Analysis
        </AccordionTrigger>
        <AccordionContent>
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Select value={selectedCertification} onValueChange={setSelectedCertification}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {certificationTypes.map((cert) => (
                    <SelectItem key={cert.value} value={cert.value}>
                      {cert.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">
                {selectedCertLabel} Certification Breakdown
              </h3>
              
              {Object.keys(stats).length === 0 ? (
                <p className="text-gray-500">No projects with {selectedCertLabel} certification found.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats).map(([rating, data]) => (
                    <div key={rating} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">{rating}</h4>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          {data.count} project{data.count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Projects: </span>
                        {data.projects.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                <p className="text-sm text-gray-600">
                  Total projects with {selectedCertLabel} certification: {' '}
                  <span className="font-medium">
                    {Object.values(stats).reduce((sum, data) => sum + data.count, 0)}
                  </span>
                  {' '}out of {projects.length} projects
                </p>
              </div>
            </div>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
