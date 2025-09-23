import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddProjectDataWizard } from './AddProjectDataWizard';
import { Project } from '@/types/project';

import { WizardData } from './AddProjectDataWizard';

interface AddProjectDataProps {
	projects: Project[];
}

export const AddProjectData = ({ projects }: AddProjectDataProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleSaveProjectData = (data: WizardData) => {
		console.log('Saving project data:', data);
		// Implementation would handle saving the data
	};

	return (
		<>
			<Button variant="outline" className="text-lg font-semibold text-gray-900 p-9 mt-6 mb-6 w-full justify-start" onClick={() => setIsModalOpen(true)}>
				<Plus className="h-10 w-10 mr-2" />
				Add Project Data
			</Button>

			<AddProjectDataWizard isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveProjectData} projects={projects} />
		</>
	);
};
