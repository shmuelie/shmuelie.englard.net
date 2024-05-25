import{orError,get,isError}from"./request-helper.js";export async function getCategories(r,e){var o;const t=orError(await get(r,e,"categories"),{categories:[]});return isError(t)?t:null!==(o=t.categories)&&void 0!==o?o:[]}
//# sourceMappingURL=categories.js.map
