import { Category } from "./Category";
import { Response } from "./Response";


export type CategoriesResponse = Response<{
    readonly categoryies?: Category[];
}>;
