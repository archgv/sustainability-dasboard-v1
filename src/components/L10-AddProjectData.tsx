import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddProjectDataWizard } from './L11-AddProjectDataWizard';
import { Project } from '@/components/Utils/project';

import { WizardData } from './L11-AddProjectDataWizard';
import { sampleProjects } from '@/data/sampleData';

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
			<Card className="p-2">
				<Button className="rounded-full w-full h-[50px] border-0 shadow-inner bg-gray-50" variant="outline" onClick={() => setIsModalOpen(true)}>
					<Plus className="h-24 w-24 mr-2" />
					<h2>Add Project Data</h2>
				</Button>

				<AddProjectDataWizard isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveProjectData} projects={projects} />
			</Card>

			<div className="text-center mt-2">
				<div className="text-sm text-gray-500">Total Projects</div>
				<div className="text-2xl font-bold text-green-600">{sampleProjects.length}</div>
			</div>
		</>
	);
};
