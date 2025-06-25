
import { Project } from '@/types/project';

export const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Green Office Tower',
    typology: 'office',
    location: 'Copenhagen, Denmark',
    completionDate: '2023-05-15',
    carbonIntensity: 25,
    operationalEnergy: 65,
    certifications: ['BREEAM Excellent', 'DGNB Gold']
  },
  {
    id: '2',
    name: 'Sustainable Housing Complex',
    typology: 'residential',
    location: 'Stockholm, Sweden',
    completionDate: '2022-11-20',
    carbonIntensity: 18,
    operationalEnergy: 45,
    certifications: ['Passive House', 'Nordic Swan']
  },
  {
    id: '3',
    name: 'Innovation Campus',
    typology: 'educational',
    location: 'Oslo, Norway',
    completionDate: '2023-08-30',
    carbonIntensity: 35,
    operationalEnergy: 85,
    certifications: ['LEED Platinum']
  },
  {
    id: '4',
    name: 'Community Health Center',
    typology: 'healthcare',
    location: 'Helsinki, Finland',
    completionDate: '2021-09-12',
    carbonIntensity: 42,
    operationalEnergy: 95,
    certifications: ['BREEAM Very Good']
  },
  {
    id: '5',
    name: 'Urban Retail Hub',
    typology: 'retail',
    location: 'Gothenburg, Sweden',
    completionDate: '2022-03-18',
    carbonIntensity: 55,
    operationalEnergy: 120,
    certifications: ['LEED Gold']
  },
  {
    id: '6',
    name: 'Mixed-Use Development',
    typology: 'mixed-use',
    location: 'Malmö, Sweden',
    completionDate: '2023-01-25',
    carbonIntensity: 38,
    operationalEnergy: 78,
    certifications: ['DGNB Silver', 'EU Taxonomy']
  },
  {
    id: '7',
    name: 'Corporate Headquarters',
    typology: 'office',
    location: 'Copenhagen, Denmark',
    completionDate: '2020-07-10',
    carbonIntensity: 62,
    operationalEnergy: 135,
    certifications: ['BREEAM Good']
  },
  {
    id: '8',
    name: 'Student Housing',
    typology: 'residential',
    location: 'Uppsala, Sweden',
    completionDate: '2023-06-05',
    carbonIntensity: 22,
    operationalEnergy: 52,
    certifications: ['Miljöbyggnad Silver']
  }
];
