import{orError,get,isError}from"./request-helper.js";export async function searchPosts(r,o,s){var t;const e=orError(await get(r,o,"search",s),{posts:[]});return isError(e)?e:null!==(t=e.posts)&&void 0!==t?t:[]}
//# sourceMappingURL=search.js.map
