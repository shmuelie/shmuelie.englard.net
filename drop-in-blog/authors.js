import{orError,get,rootUrl,isError}from"./request-helper.js";export async function getAuthors(){var r;const o=orError(await get(new URL(`${rootUrl}/authors`)),{authors:[]});return isError(o)?o:null!==(r=o.authors)&&void 0!==r?r:[]}
//# sourceMappingURL=authors.js.map
