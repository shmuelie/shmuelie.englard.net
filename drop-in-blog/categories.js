import{orError,get,rootUrl,isError}from"./request-helper.js";export async function getCategories(){var r;const o=orError(await get(new URL(`${rootUrl}/categories`)),{categories:[]});return isError(o)?o:null!==(r=o.categories)&&void 0!==r?r:[]}
//# sourceMappingURL=categories.js.map
