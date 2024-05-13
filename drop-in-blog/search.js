import{orError,get,rootUrl,isError}from"./request-helper.js";export async function searchPosts(r){var o;const s=new URL(`${rootUrl}/search`),t=r;for(const o of Object.keys(r))s.searchParams.append(o,t[o]);const e=orError(await get(s),{posts:[]});return isError(e)?e:null!==(o=e.posts)&&void 0!==o?o:[]}
//# sourceMappingURL=search.js.map
