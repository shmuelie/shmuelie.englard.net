import { Category } from "./Category.js";
import { Response } from "./Response.js";


export type CategoriesResponse = Response<{
    readonly categoryies?: Category[];
}>;
