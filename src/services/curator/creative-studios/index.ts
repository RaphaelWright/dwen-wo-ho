import { campusesService } from "./campuses";
import { programmesService } from "./programmes";
import { tagsService } from "./tags";

export const creativeStudiosService = {
  createCampus: campusesService.createCampus,
  createProgramme: programmesService.createProgramme,
  createTag: tagsService.createTag,
};
