import { DIET_PRODUCT_REPOSITORY } from "src/core/constants";
import { DietProduct } from "./dietproduct.entity";

export const dietProductsProviders = [{
    provide: DIET_PRODUCT_REPOSITORY,
    useValue: DietProduct,
}];