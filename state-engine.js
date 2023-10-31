import{register,unregister}from"https://unpkg.com/hashed-es6@1.0.2";const dataStateAttributeName="data-state";export class StateEngine{constructor(){this.updateHash=null,this.config={},this.boundHashUpdated=this.hashUpdated.bind(this),this.boundElementUpdated=this.elementUpdated.bind(this),this.tagConfigs={}}hashUpdated(t){setTimeout((()=>{for(const e of Object.keys(t)){const i=this.config[e];i&&i.element.setAttribute(i.attribute,t[e])}}),0)}elementUpdated(t){const e=t.target;e&&setTimeout((()=>{const t=this.getConfig(e);if(t)if(this.updateHash){const i=t.attribute;this.updateHash({[t.id]:e.getAttribute(i)})}else t.event&&e.removeEventListener(t.event,this.boundElementUpdated)}),0)}initialize(t){var e;this.reset();const i={};for(const s of t.querySelectorAll("*[data-state]")){const t=this.getConfig(s);t&&(this.config[t.id]=t,i[t.id]=null!==(e=s.getAttribute(t.attribute))&&void 0!==e?e:"",s.addEventListener(t.event,this.boundElementUpdated))}this.updateHash=register(i,this.boundHashUpdated)}reset(){this.updateHash&&unregister(this.updateHash);for(const t of Object.keys(this.config)){const e=this.config[t];e&&e.element.removeEventListener(e.event,this.boundElementUpdated)}}getConfig(t){var e,i,s,n,a;if(t.hasAttribute("data-state")){const d=JSON.parse(null!==(e=t.getAttribute("data-state"))&&void 0!==e?e:"{}"),o=t.id||d.id,r=this.tagConfigs[t.tagName],u=null!==(s=null!==(i=d.event)&&void 0!==i?i:null==r?void 0:r.event)&&void 0!==s?s:null,h=null!==(a=null!==(n=d.attribute)&&void 0!==n?n:null==r?void 0:r.attribute)&&void 0!==a?a:null;if(o&&u&&h)return{attribute:h,element:t,event:u,id:o}}return null}}
//# sourceMappingURL=state-engine.js.map
