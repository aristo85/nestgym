import { PHOTO_REPOSITORY } from "src/core/constants";
import { Photo } from "./photo.entity";

export const photosProviders = [
  {
    provide: PHOTO_REPOSITORY,
    useValue: Photo,
  },
];
