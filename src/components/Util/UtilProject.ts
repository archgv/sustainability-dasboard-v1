import { Project } from "../Key/project";

export const getProjectCurrrentStage = (project: Project) =>
  project["RIBA Stage"][project["Current RIBA Stage"]];

export const getGIA = (project: Project) => {
  const updateGIA = getProjectCurrrentStage(project)["Updated GIA"];
  return updateGIA ? updateGIA : project["GIA"];
};
