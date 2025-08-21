
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddProjectDataWizard } from './AddProjectDataWizard';
import { Project } from '@/types/project';

interface AddProjectDataProps {
  projects: Project[];
}

export const AddProjectData = ({ projects }: AddProjectDataProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveProjectData = (data: any) => {
    console.log('Saving project data:', data);
    // Implementation would handle saving the data
  };

  return (
    <>
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add project data</h3>
        
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add project data
        </Button>
      </Card>

      <AddProjectDataWizard
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProjectData}
        projects={projects}
      />
    </>
  );
};
