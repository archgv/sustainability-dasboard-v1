export const ProjectTypeKeys = [
  "New Build",
  "Retrofit",
  "Retrofit + Extension",
] as const;
export type ProjectTypeKey = (typeof ProjectTypeKeys)[number];
