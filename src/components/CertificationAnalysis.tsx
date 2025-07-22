import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/types/project';
interface CertificationAnalysisProps {
  projects: Project[];
  primaryProject?: string;
}
const certificationRatings = {
  breeam: ['Outstanding', 'Excellent', 'Very Good', 'Good', 'Pass'],
  leed: ['Outstanding', 'Platinum', 'Gold', 'Silver', 'Certified'],
  well: ['Outstanding', 'Platinum', 'Gold', 'Silver', 'Bronze'],
  nabers: ['6 Star', '5.5 Star', '5 Star', '4.5 Star', '4 Star', '3.5 Star', '3 Star'],
  passivhaus: ['Certified'],
  enerphit: ['Certified'],
  uknzcbs: ['Net Zero', 'Near Zero', 'Low Carbon']
};
export const CertificationAnalysis = ({
  projects,
  primaryProject = ''
}: CertificationAnalysisProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<string>('breeam');
  const getCertificationData = (certification: string) => {
    const ratings = certificationRatings[certification as keyof typeof certificationRatings] || [];
    const data: {
      [key: string]: Project[];
    } = {};

    // Initialize all ratings with empty arrays
    ratings.forEach(rating => {
      data[rating] = [];
    });
    projects.forEach(project => {
      let projectRating = '';
      switch (certification) {
        case 'breeam':
          projectRating = project.breeam;
          break;
        case 'leed':
          projectRating = project.leed;
          break;
        case 'well':
          projectRating = project.well;
          break;
        case 'nabers':
          projectRating = project.nabers;
          break;
        case 'passivhaus':
          if (project.passivhaus) projectRating = 'Certified';
          break;
        case 'enerphit':
          if (project.certifications?.includes('EnerPHit')) projectRating = 'Certified';
          break;
        case 'uknzcbs':
          const uknzcbsCert = project.certifications?.find(cert => cert.includes('UKNZCBS'));
          if (uknzcbsCert) {
            if (uknzcbsCert.includes('Net Zero')) projectRating = 'Net Zero';else if (uknzcbsCert.includes('Near Zero')) projectRating = 'Near Zero';else if (uknzcbsCert.includes('Low Carbon')) projectRating = 'Low Carbon';
          }
          break;
      }
      if (projectRating && projectRating !== 'N/A' && data[projectRating]) {
        data[projectRating].push(project);
      }
    });
    return data;
  };
  const certificationData = getCertificationData(selectedCertification);
  const maxCount = Math.max(...Object.values(certificationData).map(projects => projects.length), 4);
  const getRatingColor = (rating: string) => {
    const colors = {
      'Outstanding': 'bg-green-100 text-green-800',
      'Excellent': 'bg-blue-100 text-blue-800',
      'Very Good': 'bg-purple-100 text-purple-800',
      'Good': 'bg-yellow-100 text-yellow-800',
      'Pass': 'bg-gray-100 text-gray-800',
      'Platinum': 'bg-slate-100 text-slate-800',
      'Gold': 'bg-yellow-100 text-yellow-800',
      'Silver': 'bg-gray-100 text-gray-800',
      'Bronze': 'bg-orange-100 text-orange-800',
      'Certified': 'bg-green-100 text-green-800',
      'Net Zero': 'bg-green-100 text-green-800',
      'Near Zero': 'bg-blue-100 text-blue-800',
      'Low Carbon': 'bg-yellow-100 text-yellow-800'
    };
    return colors[rating as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  const getBarColor = (rating: string) => {
    const colors = {
      'Outstanding': 'bg-green-500',
      'Excellent': 'bg-blue-500',
      'Very Good': 'bg-purple-500',
      'Good': 'bg-yellow-500',
      'Pass': 'bg-gray-500',
      'Platinum': 'bg-slate-500',
      'Gold': 'bg-yellow-500',
      'Silver': 'bg-gray-500',
      'Bronze': 'bg-orange-500',
      'Certified': 'bg-green-500',
      'Net Zero': 'bg-green-500',
      'Near Zero': 'bg-blue-500',
      'Low Carbon': 'bg-yellow-500'
    };
    return colors[rating as keyof typeof colors] || 'bg-gray-500';
  };
  const getDisplayName = (project: Project) => {
    const baseId = project.id.split('-')[0];
    const projectNumber = `250${parseInt(baseId) + 116}`;
    return `${projectNumber}_${project.name}`;
  };
  return <Card className="p-6">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h2 className="text-xl font-semibold text-gray-900">Certification Analysis</h2>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </div>
      
      {isExpanded && <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Select Certification:
            </label>
            <Select value={selectedCertification} onValueChange={setSelectedCertification}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breeam">BREEAM</SelectItem>
                <SelectItem value="leed">LEED</SelectItem>
                <SelectItem value="well">WELL</SelectItem>
                <SelectItem value="nabers">NABERS</SelectItem>
                <SelectItem value="passivhaus">Passivhaus</SelectItem>
                <SelectItem value="enerphit">EnerPHit</SelectItem>
                <SelectItem value="uknzcbs">UKNZCBS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {Object.entries(certificationData).map(([rating, projectsWithRating]) => {
          const count = projectsWithRating.length;
          const baseWidth = 25; // Base width percentage for empty bars
          const barWidth = count === 0 ? baseWidth : Math.max(baseWidth, count / maxCount * 100);
          return <div key={rating} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getRatingColor(rating)}>
                        {rating}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{count}</span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full rounded-full h-6 bg-gray-50">
                      {count > 0 && <div className={`${getBarColor(rating)} h-6 rounded-full transition-all duration-300`} style={{
                  width: `${barWidth}%`
                }} />}
                    </div>
                    
                    {count > 0 && <div className="mt-2 space-y-1">
                        {projectsWithRating.map(project => <div key={project.id} className="text-sm text-gray-600 pl-2">
                            {getDisplayName(project)}
                          </div>)}
                      </div>}
                  </div>
                </div>;
        })}
          </div>
        </div>}
    </Card>;
};