import { Project } from '../Key/project';
import { ValueType, getProjectArea } from '../Key/KeyChart';

export const transformDataForValueType = (
	data: Project[],
	valueType: ValueType,
	selectedKPI1: string,
	selectedKPI2: string
): Project[] => {
	if (valueType === 'average') {
		return data;
	}

	// For total values, multiply by building area
	return data.map((item) => ({
		...item,
		[selectedKPI1]: item[selectedKPI1] * getProjectArea(item.id.split('-')[0]), // Handle RIBA stage variants
		[selectedKPI2]: selectedKPI2 ? item[selectedKPI2] * getProjectArea(item.id.split('-')[0]) : undefined,
	}));
};