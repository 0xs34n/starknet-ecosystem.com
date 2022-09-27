import type { Project } from "../../data/ecosystem";

const fetchEcosystemProjects = (size: number): Promise<Project[]> =>
  fetch(`http://api.starknet-db.com/projects?size=${size}`)
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`${response.statusText} while fetching projects`);
      }
      return response.json();
    })
    .then((response) => response.content);

export const EcosystemApi = {
  fetchEcosystemProjects,
};
