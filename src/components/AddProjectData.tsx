
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';

export const AddProjectData = () => {
  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add project data</h3>
      
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start">
          <Plus className="h-4 w-4 mr-2" />
          Add new project
        </Button>
        
        <Button variant="outline" className="w-full justify-start">
          <Upload className="h-4 w-4 mr-2" />
          Import from CSV
        </Button>
      </div>
    </Card>
  );
};
