import{DOM,FASTElementDefinition,html,HTMLDirective,Observable}from"https://unpkg.com/@microsoft/fast-element@1.13.0";const isFunction=e=>"function"==typeof e,isString=e=>"string"==typeof e;export class RenderBehavior{constructor(e,t,n){this.location=e,this.dataBinding=t,this.templateBinding=n,this.source=null,this.view=null,this.data=null,this.originalContext=void 0,this.childContext=void 0,this.dataBindingObserver=Observable.binding(t,this,!0),this.templateBindingObserver=Observable.binding(n,this,!0)}bind(e,t){this.source=e,this.originalContext=t,this.childContext=Object.create(t),this.childContext.parent=e,this.childContext.parentContext=this.originalContext,this.data=this.dataBindingObserver.observe(e,this.originalContext),this.template=this.templateBindingObserver.observe(e,this.originalContext),this.refreshView()}unbind(){this.source=null,this.data=null;const e=this.view;null!==e&&e.isComposed&&(e.unbind(),e.needsBindOnly=!0),this.dataBindingObserver.disconnect(),this.templateBindingObserver.disconnect()}handleChange(e){e===this.dataBinding?(this.data=this.dataBindingObserver.observe(this.source,this.originalContext),this.refreshView()):e===this.templateBinding&&(this.template=this.templateBindingObserver.observe(this.source,this.originalContext),this.refreshView())}refreshView(){let e=this.view;const t=this.template;null===e?this.view=e=t.create():e.$fastTemplate!==t&&(e.isComposed&&(e.remove(),e.unbind()),this.view=e=t.create()),e.isComposed?e.needsBindOnly&&(e.needsBindOnly=!1,e.bind(this.data,this.childContext)):(e.isComposed=!0,e.bind(this.data,this.childContext),e.insertBefore(this.location),e.$fastTemplate=t)}}export class RenderDirective extends HTMLDirective{constructor(e,t){super(),this.dataBinding=e,this.templateBinding=t,this.createPlaceholder=DOM.createBlockPlaceholder}createBehavior(e){return new RenderBehavior(e,this.dataBinding,this.templateBinding)}}function isElementRenderOptions(e){return!!e.element||!!e.tagName}const typeToInstructionLookup=new Map,defaultAttributes={":model":e=>e},brand=Symbol("RenderInstruction"),defaultViewName="default-view",nullTemplate=html`
    &nbsp;
`;function instructionToTemplate(e){return void 0===e?nullTemplate:e.template}function createElementTemplate(e,t,n){const i=t?[`<${e}`]:[`<${e}>`],r=[];if(t){const s=Object.getOwnPropertyNames(t);for(let e=0,n=s.length;e<n;++e){const n=s[e];0===e?i[0]=`${i[0]} ${n}="`:i.push(`" ${n}="`),r.push(t[n])}n&&isFunction(n.create)?(i.push('">'),r.push(n),i.push(`</${e}>`)):i.push(`">${null!=n?n:""}</${e}>`)}else n&&isFunction(n.create)?(r.push(n),i.push(`</${e}>`)):i[0]=`${i[0]}${n}</${e}>`;return html(i,...r)}function create(e){var t,n;const i=null!==(t=e.name)&&void 0!==t?t:defaultViewName;let r;if(isElementRenderOptions(e)){let t=e.tagName;if(!t){const n=FASTElementDefinition.forType(e.element);if(!n)throw new Error("Invalid element for model rendering.");t=n.name}r=createElementTemplate(t,null!==(n=e.attributes)&&void 0!==n?n:defaultAttributes,e.content)}else r=e.template;return{brand:brand,type:e.type,name:i,template:r}}function instanceOf(e){return e&&e.brand===brand}function register(e){let t=typeToInstructionLookup.get(e.type);void 0===t&&typeToInstructionLookup.set(e.type,t=Object.create(null));const n=instanceOf(e)?e:create(e);return t[n.name]=n}function getByType(e,t){const n=typeToInstructionLookup.get(e);if(void 0!==n)return n[null!=t?t:defaultViewName]}function getForInstance(e,t){if(e)return getByType(e.constructor,t)}export const RenderInstruction=Object.freeze({instanceOf:instanceOf,create:create,createElementTemplate:createElementTemplate,register:register,getByType:getByType,getForInstance:getForInstance});export function renderWith(e,t){return function(n){isFunction(e)?register({type:n,element:e,name:t}):isFunction(e.create)?register({type:n,template:e,name:t}):register({type:n,...e})}}export class NodeTemplate{constructor(e){this.node=e,e.$fastTemplate=this}bind(e,t){}unbind(){}insertBefore(e){e.parentNode.insertBefore(this.node,e)}remove(){this.node.parentNode.removeChild(this.node)}create(){return this}}export function render(e,t){let n,i;return n=void 0===e?e=>e:e instanceof Node?()=>e:e,i=void 0===t?(e,t)=>{var i;const r=n(e,t);return r instanceof Node?null!==(i=r.$fastTemplate)&&void 0!==i?i:new NodeTemplate(r):instructionToTemplate(getForInstance(r))}:isFunction(t)?(e,i)=>{var r;let s=t(e,i);return isString(s)?s=instructionToTemplate(getForInstance(n(e,i),s)):s instanceof Node&&(s=null!==(r=s.$fastTemplate)&&void 0!==r?r:new NodeTemplate(s)),s}:isString(t)?(e,i)=>{var r;const s=n(e,i);return s instanceof Node?null!==(r=s.$fastTemplate)&&void 0!==r?r:new NodeTemplate(s):instructionToTemplate(getForInstance(s,t))}:(e,n)=>t,new RenderDirective(n,i)}
//# sourceMappingURL=render.js.map