import { PUBLICATION_REPOSITORY } from "src/core/constants";
import { Article } from "./publication.entity";

export const publicationsProviders = [{
    provide: PUBLICATION_REPOSITORY,
    useValue: Article,
}];