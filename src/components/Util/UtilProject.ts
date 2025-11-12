import { Project } from "../Key/project";

export const getProjectViewStage = (project: Project) =>
  project["RIBA Stage"][project["View RIBA Stage"]];

export const getGIA = (project: Project) => {
  const updateGIA = getProjectViewStage(project)["Updated GIA"];
  return updateGIA ? updateGIA : project["GIA"];
};
