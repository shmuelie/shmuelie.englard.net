import{orError,get,isError}from"./request-helper.js";export async function getAuthors(r,o){var t;const s=orError(await get(r,o,"authors"),{authors:[]});return isError(s)?s:null!==(t=s.authors)&&void 0!==t?t:[]}
//# sourceMappingURL=authors.js.map
