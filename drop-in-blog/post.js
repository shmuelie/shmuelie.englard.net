import{orError,get,rootUrl,isError}from"./request-helper.js";export async function getPost(r){var o;const t=orError(await get(new URL(`${rootUrl}/posts/${r}`)),{});return isError(t)?t:null!==(o=t.post)&&void 0!==o?o:null}
//# sourceMappingURL=post.js.map
