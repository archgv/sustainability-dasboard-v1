// Utility function to generate nice, regular tick intervals
export const generateNiceTicks = (maxValue: number, tickCount: number = 5): number[] => {
	if (maxValue <= 0) return [0];

	// Calculate step size
	const roughStep = maxValue / (tickCount - 1);

	// Round step to nice numbers (1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, etc.)
	const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
	const normalizedStep = roughStep / magnitude;

	let niceStep;
	if (normalizedStep <= 1) niceStep = 1;
	else if (normalizedStep <= 2) niceStep = 2;
	else if (normalizedStep <= 5) niceStep = 5;
	else niceStep = 10;

	const finalStep = niceStep * magnitude;

	// Generate ticks
	const ticks = [];
	for (let i = 0; i <= Math.ceil(maxValue / finalStep); i++) {
		ticks.push(i * finalStep);
	}

	return ticks;
};