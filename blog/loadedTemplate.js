import{html,when}from"https://unpkg.com/@microsoft/fast-element@1.13.0";import{postTemplateRenderer}from"./postTemplate.js";import{postsTemplate}from"./postsTemplate.js";export const loadedTemplate=html`
${when((e=>null===e.post),postsTemplate,postTemplateRenderer)}
`;
//# sourceMappingURL=loadedTemplate.js.map
