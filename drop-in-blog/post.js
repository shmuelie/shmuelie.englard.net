import{orError,get,isError}from"./request-helper.js";export async function getPost(r,o,t){var s;const e=orError(await get(r,o,`posts/${t}`),{});return isError(e)?e:null!==(s=e.post)&&void 0!==s?s:null}
//# sourceMappingURL=post.js.map
