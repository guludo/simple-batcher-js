!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Batcher=e():t.Batcher=e()}(self,(function(){return(()=>{"use strict";var t={d:(e,s)=>{for(var o in s)t.o(s,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:s[o]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{default:()=>s});const s=class{constructor(t){void 0===t&&(t={}),"function"==typeof t&&(t={dispatch:t}),this.timeout=t.timeout||10,this.maxRequests=t.maxRequests||100,t.dispatch&&(this.dispatch=t.dispatch),this._pending=[],this._timeoutId=null}async request(t){return new Promise(((e,s)=>{clearTimeout(this._timeoutId),this._pending.push({arg:t,resolve:e,reject:s}),this._pending.length===this.maxRequests?this._dispatch():this._timeoutId=setTimeout(this._dispatch.bind(this),this.timeout)}))}async _dispatch(){const t=this._pending;this._pending=[];const e=t.map((({arg:t})=>t));let s;try{s=await this.dispatch(e)}catch(e){for(let{reject:s}of t)s(e);return}for(let e=0;e<t.length;e++)t[e].resolve(s[e])}async dispatch(t){throw new Error("the dispatch function must be passed to the constructor or implemented by subclasses")}};return e})()}));