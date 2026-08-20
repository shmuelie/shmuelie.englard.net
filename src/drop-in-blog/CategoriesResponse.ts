import { Category } from "./Category";
import { Response } from "./Response";


export type CategoriesResponse = Response<{
    readonly categories?: Category[];
}>;
