import*as e from"lit";import*as t from"rxjs";import*as r from"mqtt";var n={65:function(e,t,r){var n,o;n=function(){var e=function(){},t="undefined",r=typeof window!==t&&typeof window.navigator!==t&&/Trident\/|MSIE /.test(window.navigator.userAgent),n=["trace","debug","info","warn","error"],o={},i=null;function s(e,t){var r=e[t];if("function"==typeof r.bind)return r.bind(e);try{return Function.prototype.bind.call(r,e)}catch(t){return function(){return Function.prototype.apply.apply(r,[e,arguments])}}}function c(){console.log&&(console.log.apply?console.log.apply(console,arguments):Function.prototype.apply.apply(console.log,[console,arguments])),console.trace&&console.trace()}function u(){for(var r=this.getLevel(),o=0;o<n.length;o++){var i=n[o];this[i]=o<r?e:this.methodFactory(i,r,this.name)}if(this.log=this.debug,typeof console===t&&r<this.levels.SILENT)return"No console available for logging"}function a(e){return function(){typeof console!==t&&(u.call(this),this[e].apply(this,arguments))}}function l(n,o,i){return function(n){return"debug"===n&&(n="log"),typeof console!==t&&("trace"===n&&r?c:void 0!==console[n]?s(console,n):void 0!==console.log?s(console,"log"):e)}(n)||a.apply(this,arguments)}function d(e,r){var s,c,a,d=this,p="loglevel";function f(){var e;if(typeof window!==t&&p){try{e=window.localStorage[p]}catch(e){}if(typeof e===t)try{var r=window.document.cookie,n=encodeURIComponent(p),o=r.indexOf(n+"=");-1!==o&&(e=/^([^;]+)/.exec(r.slice(o+n.length+1))[1])}catch(e){}return void 0===d.levels[e]&&(e=void 0),e}}function h(e){var t=e;if("string"==typeof t&&void 0!==d.levels[t.toUpperCase()]&&(t=d.levels[t.toUpperCase()]),"number"==typeof t&&t>=0&&t<=d.levels.SILENT)return t;throw new TypeError("log.setLevel() called with invalid level: "+e)}"string"==typeof e?p+=":"+e:"symbol"==typeof e&&(p=void 0),d.name=e,d.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},d.methodFactory=r||l,d.getLevel=function(){return null!=a?a:null!=c?c:s},d.setLevel=function(e,r){return a=h(e),!1!==r&&function(e){var r=(n[e]||"silent").toUpperCase();if(typeof window!==t&&p){try{return void(window.localStorage[p]=r)}catch(e){}try{window.document.cookie=encodeURIComponent(p)+"="+r+";"}catch(e){}}}(a),u.call(d)},d.setDefaultLevel=function(e){c=h(e),f()||d.setLevel(e,!1)},d.resetLevel=function(){a=null,function(){if(typeof window!==t&&p){try{window.localStorage.removeItem(p)}catch(e){}try{window.document.cookie=encodeURIComponent(p)+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC"}catch(e){}}}(),u.call(d)},d.enableAll=function(e){d.setLevel(d.levels.TRACE,e)},d.disableAll=function(e){d.setLevel(d.levels.SILENT,e)},d.rebuild=function(){if(i!==d&&(s=h(i.getLevel())),u.call(d),i===d)for(var e in o)o[e].rebuild()},s=h(i?i.getLevel():"WARN");var v=f();null!=v&&(a=h(v)),u.call(d)}(i=new d).getLogger=function(e){if("symbol"!=typeof e&&"string"!=typeof e||""===e)throw new TypeError("You must supply a name when creating a logger.");var t=o[e];return t||(t=o[e]=new d(e,i.methodFactory)),t};var p=typeof window!==t?window.log:void 0;return i.noConflict=function(){return typeof window!==t&&window.log===i&&(window.log=p),i},i.getLoggers=function(){return o},i.default=i,i},void 0===(o=n.call(t,r,t,e))||(e.exports=o)}},o={};function i(e){var t=o[e];if(void 0!==t)return t.exports;var r=o[e]={exports:{}};return n[e].call(r.exports,r,r.exports,i),r.exports}i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var s={};i.d(s,{NB:()=>c,zX:()=>y,rX:()=>w,O:()=>h,Rx:()=>A,oN:()=>g,CN:()=>Le,eE:()=>f,Zk:()=>C,Ay:()=>Re});class c{constructor(e,t=e,r=""){this.id=e,this.name=t,this.type=r,this.nodes=new Map}addNode(e){this.nodes.set(e.id,e)}removeNode(e){this.nodes.delete(e.id)}getNode(e){return this.nodes.get(e)}getAllNodes(){return Array.from(this.nodes.values())}}const u=(l={LitElement:()=>e.LitElement,css:()=>e.css,html:()=>e.html,render:()=>e.render},d={},i.d(d,l),d),a=(e,t)=>"method"===t.kind&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(r){r.createProperty(t.key,e)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(r){r.createProperty(t.key,e)}};var l,d,p;null===(p=window.HTMLSlotElement)||void 0===p||p.prototype.assignedElements;class f{constructor(){this.bindings=new Map}bindProperty(e,t,r){const n=`${e.name}-${r}`;this.bindings.set(n,t),this.updateElement(e,t,r)}updateElement(e,t,r){t.setAttribute(r,e.getValue().toString())}}class h extends HTMLElement{constructor(e){super(),this.node=e,this.bindingManager=new f}connectedCallback(){this.render()}render(){const e=u.html`
      <div class="homie-node">
        <h2>${this.node.name}</h2>
        ${this.node.getAllProperties().map((e=>u.html`
          <div class="property">
            <span>${e.name}: </span>
            <span>${e.getValue()}</span>
          </div>
        `))}
      </div>
    `;(0,u.render)(e,this),this.node.getAllProperties().forEach((e=>{const t=this.querySelector(`.property:has(span:contains('${e.name}'))`);t instanceof HTMLElement&&this.bindingManager.bindProperty(e,t,"data-value")}))}}customElements.define("homie-node",h);var v=function(e,t,r,n){var o,i=arguments.length,s=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,n);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(s=(i<3?o(s):i>3?o(t,r,s):o(t,r))||s);return i>3&&s&&Object.defineProperty(t,r,s),s};let y=class extends u.LitElement{render(){var e;return u.html`
      <div class="homie-device">
        ${null===(e=this.device)||void 0===e?void 0:e.getAllNodes().map((e=>u.html`
          <homie-node .node=${e}></homie-node>
        `))}
      </div>
    `}};var b,m;y.styles=u.css`
    :host {
      display: block;
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }
  `,v([(m={type:Object},(e,t)=>void 0!==t?((e,t,r)=>{t.constructor.createProperty(r,e)})(m,e,t):a(m,e)),function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}("design:type",c)],y.prototype,"device",void 0),y=v([(b="homie-device",e=>"function"==typeof e?((e,t)=>(customElements.define(e,t),t))(b,e):((e,t)=>{const{kind:r,elements:n}=t;return{kind:r,elements:n,finisher(t){customElements.define(e,t)}}})(b,e))],y);class w{constructor(e,t=e,r=""){this.id=e,this.name=t,this.type=r,this.properties=new Map}addProperty(e){this.properties.set(e.id,e)}getProperty(e){return this.properties.get(e)}getAllProperties(){return Array.from(this.properties.values())}}class g{constructor(e,t=e,r,n){this.id=e,this.name=t,this.value=r,this.dataType=n}setValue(e){this.value=e}getValue(){return this.value}}const x=(e=>{var t={};return i.d(t,e),t})({Subject:()=>t.Subject}),S=(e=>{var t={};return i.d(t,e),t})({default:()=>r.default});var E=i(65),P=i.n(E);P().setLevel(P().levels.INFO);const I=(e,...t)=>P().debug(`[${(new Date).toISOString()}] ${e}`,...t),_=(e,...t)=>P().info(`[${(new Date).toISOString()}] ${e}`,...t),O=(e,...t)=>P().error(`[${(new Date).toISOString()}] ${e}`,...t);var T;!function(e){e.Device="device",e.Node="node",e.Property="property"}(T||(T={}));class U{constructor(e,t={},r){this.client=S.default.connect(e),this.homiePrefix=t.homiePrefix||"homie",this.messageCallback=r,this.client.on("connect",(()=>_("Connected to MQTT broker"))),this.client.on("message",((e,t)=>this.handleMessage(e,t)))}subscribe(e){const t=this.getSubscriptionTopic(e);this.client.subscribe(t)}publish(e,t){this.client.publish(this.homiePrefix+"/"+e,t)}getSubscriptionTopic(e){return e.startsWith(this.homiePrefix)?e:`${this.homiePrefix}/${e}`}handleMessage(e,t){const r=e.split("/");if(r[0]!==this.homiePrefix||r.length<3)return;const[,n,o,i]=r,s=t.toString();"$state"===o?this.handleDeviceState(n,s):void 0===i?this.handleNodeState(n,o,s):this.handlePropertyState(n,o,i,s)}handleDeviceState(e,t){const r={id:e,nodes:{}},n={type:T.Device,device:r};this.messageCallback(n)}handleNodeState(e,t,r){const n={id:e,nodes:{}},o={id:t,properties:{}},i={type:T.Node,device:n,node:o};this.messageCallback(i)}handlePropertyState(e,t,r,n){const o={id:e,nodes:{}},i={id:t,properties:{}},s={id:r,value:n},c={type:T.Property,device:o,node:i,property:s};this.messageCallback(c)}disconnect(){this.client&&!this.client.disconnected&&this.client.end()}}class A{constructor(e){this.messageHandler=e,this.devices={},this.onCreate=new x.Subject,this.onUpdate=new x.Subject,this.onDelete=new x.Subject,console.log("HomieObserver constructor called")}subscribe(e){this.messageHandler.subscribe(e)}publish(e,t){this.messageHandler.publish(e,t)}get created$(){return this.onCreate.asObservable()}get updated$(){return this.onUpdate.asObservable()}get deleted$(){return this.onDelete.asObservable()}processEvent(e){switch(console.log("HomieObserver processing event:",e),e.type){case T.Device:this.processDeviceEvent(e);break;case T.Node:this.processNodeEvent(e);break;case T.Property:this.processPropertyEvent(e)}}processDeviceEvent(e){const{device:t}=e;this.devices[t.id]?this.onUpdate.next(e):(this.devices[t.id]=t,this.onCreate.next(e))}processNodeEvent(e){const{device:t,node:r}=e;this.devices[t.id]||(this.devices[t.id]=t,this.onCreate.next({type:T.Device,device:t})),this.devices[t.id].nodes[r.id]?this.onUpdate.next(e):(this.devices[t.id].nodes[r.id]=r,this.onCreate.next(e))}processPropertyEvent(e){I("Processing property event",{event:e});const{device:t,node:r,property:n}=e;this.devices[t.id]||(this.devices[t.id]=t,this.onCreate.next({type:T.Device,device:t}),I("Emitted create event for device",{deviceId:t.id})),this.devices[t.id].nodes[r.id]||(this.devices[t.id].nodes[r.id]=r,this.onCreate.next({type:T.Node,device:t,node:r}),I("Emitted create event for node",{deviceId:t.id,nodeId:r.id}));const o=this.devices[t.id].nodes[r.id].properties[n.id];o?o.value!==n.value&&(this.devices[t.id].nodes[r.id].properties[n.id]=n,this.onUpdate.next(e),I("Emitted update event for property",{deviceId:t.id,nodeId:r.id,propertyId:n.id})):(this.devices[t.id].nodes[r.id].properties[n.id]=n,this.onCreate.next(e),this.onUpdate.next(e),I("Emitted create and update events for new property",{deviceId:t.id,nodeId:r.id,propertyId:n.id}))}}function C(e,t={}){let r;const n=new U(e,t,(e=>{r&&r.processEvent(e)}));return r=new A(n),r}function $(e){return"function"==typeof e}function k(e){return function(t){if(function(e){return $(null==e?void 0:e.lift)}(t))return t.lift((function(t){try{return e(t,this)}catch(e){this.error(e)}}));throw new TypeError("Unable to lift unknown Observable type")}}var j=function(e,t){return j=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])},j(e,t)};function N(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function r(){this.constructor=e}j(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}function H(e,t){var r,n,o,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]},s=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return s.next=c(0),s.throw=c(1),s.return=c(2),"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function c(c){return function(u){return function(c){if(r)throw new TypeError("Generator is already executing.");for(;s&&(s=0,c[0]&&(i=0)),i;)try{if(r=1,n&&(o=2&c[0]?n.return:c[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,c[1])).done)return o;switch(n=0,o&&(c=[2&c[0],o.value]),c[0]){case 0:case 1:o=c;break;case 4:return i.label++,{value:c[1],done:!1};case 5:i.label++,n=c[1],c=[0];continue;case 7:c=i.ops.pop(),i.trys.pop();continue;default:if(!((o=(o=i.trys).length>0&&o[o.length-1])||6!==c[0]&&2!==c[0])){i=0;continue}if(3===c[0]&&(!o||c[1]>o[0]&&c[1]<o[3])){i.label=c[1];break}if(6===c[0]&&i.label<o[1]){i.label=o[1],o=c;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(c);break}o[2]&&i.ops.pop(),i.trys.pop();continue}c=t.call(e,i)}catch(e){c=[6,e],n=0}finally{r=o=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,u])}}}function L(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function R(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,o,i=r.call(e),s=[];try{for(;(void 0===t||t-- >0)&&!(n=i.next()).done;)s.push(n.value)}catch(e){o={error:e}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(o)throw o.error}}return s}function D(e,t,r){if(r||2===arguments.length)for(var n,o=0,i=t.length;o<i;o++)!n&&o in t||(n||(n=Array.prototype.slice.call(t,0,o)),n[o]=t[o]);return e.concat(n||Array.prototype.slice.call(t))}function M(e){return this instanceof M?(this.v=e,this):new M(e)}function B(e){var t=e((function(e){Error.call(e),e.stack=(new Error).stack}));return t.prototype=Object.create(Error.prototype),t.prototype.constructor=t,t}Object.create,Object.create,"function"==typeof SuppressedError&&SuppressedError;var z=B((function(e){return function(t){e(this),this.message=t?t.length+" errors occurred during unsubscription:\n"+t.map((function(e,t){return t+1+") "+e.toString()})).join("\n  "):"",this.name="UnsubscriptionError",this.errors=t}}));function F(e,t){if(e){var r=e.indexOf(t);0<=r&&e.splice(r,1)}}var G=function(){function e(e){this.initialTeardown=e,this.closed=!1,this._parentage=null,this._finalizers=null}var t;return e.prototype.unsubscribe=function(){var e,t,r,n,o;if(!this.closed){this.closed=!0;var i=this._parentage;if(i)if(this._parentage=null,Array.isArray(i))try{for(var s=L(i),c=s.next();!c.done;c=s.next())c.value.remove(this)}catch(t){e={error:t}}finally{try{c&&!c.done&&(t=s.return)&&t.call(s)}finally{if(e)throw e.error}}else i.remove(this);var u=this.initialTeardown;if($(u))try{u()}catch(e){o=e instanceof z?e.errors:[e]}var a=this._finalizers;if(a){this._finalizers=null;try{for(var l=L(a),d=l.next();!d.done;d=l.next()){var p=d.value;try{V(p)}catch(e){o=null!=o?o:[],e instanceof z?o=D(D([],R(o)),R(e.errors)):o.push(e)}}}catch(e){r={error:e}}finally{try{d&&!d.done&&(n=l.return)&&n.call(l)}finally{if(r)throw r.error}}}if(o)throw new z(o)}},e.prototype.add=function(t){var r;if(t&&t!==this)if(this.closed)V(t);else{if(t instanceof e){if(t.closed||t._hasParent(this))return;t._addParent(this)}(this._finalizers=null!==(r=this._finalizers)&&void 0!==r?r:[]).push(t)}},e.prototype._hasParent=function(e){var t=this._parentage;return t===e||Array.isArray(t)&&t.includes(e)},e.prototype._addParent=function(e){var t=this._parentage;this._parentage=Array.isArray(t)?(t.push(e),t):t?[t,e]:e},e.prototype._removeParent=function(e){var t=this._parentage;t===e?this._parentage=null:Array.isArray(t)&&F(t,e)},e.prototype.remove=function(t){var r=this._finalizers;r&&F(r,t),t instanceof e&&t._removeParent(this)},e.EMPTY=((t=new e).closed=!0,t),e}(),q=G.EMPTY;function Y(e){return e instanceof G||e&&"closed"in e&&$(e.remove)&&$(e.add)&&$(e.unsubscribe)}function V(e){$(e)?e():e.unsubscribe()}var X=null,W=null,Z=void 0,J=!1,K=!1,Q={setTimeout:function(e,t){for(var r=[],n=2;n<arguments.length;n++)r[n-2]=arguments[n];var o=Q.delegate;return(null==o?void 0:o.setTimeout)?o.setTimeout.apply(o,D([e,t],R(r))):setTimeout.apply(void 0,D([e,t],R(r)))},clearTimeout:function(e){var t=Q.delegate;return((null==t?void 0:t.clearTimeout)||clearTimeout)(e)},delegate:void 0};function ee(e){Q.setTimeout((function(){if(!X)throw e;X(e)}))}function te(){}var re=ne("C",void 0,void 0);function ne(e,t,r){return{kind:e,value:t,error:r}}var oe=null;function ie(e){if(J){var t=!oe;if(t&&(oe={errorThrown:!1,error:null}),e(),t){var r=oe,n=r.errorThrown,o=r.error;if(oe=null,n)throw o}}else e()}var se=function(e){function t(t){var r=e.call(this)||this;return r.isStopped=!1,t?(r.destination=t,Y(t)&&t.add(r)):r.destination=fe,r}return N(t,e),t.create=function(e,t,r){return new le(e,t,r)},t.prototype.next=function(e){this.isStopped?pe(function(e){return ne("N",e,void 0)}(e),this):this._next(e)},t.prototype.error=function(e){this.isStopped?pe(ne("E",void 0,e),this):(this.isStopped=!0,this._error(e))},t.prototype.complete=function(){this.isStopped?pe(re,this):(this.isStopped=!0,this._complete())},t.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,e.prototype.unsubscribe.call(this),this.destination=null)},t.prototype._next=function(e){this.destination.next(e)},t.prototype._error=function(e){try{this.destination.error(e)}finally{this.unsubscribe()}},t.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},t}(G),ce=Function.prototype.bind;function ue(e,t){return ce.call(e,t)}var ae=function(){function e(e){this.partialObserver=e}return e.prototype.next=function(e){var t=this.partialObserver;if(t.next)try{t.next(e)}catch(e){de(e)}},e.prototype.error=function(e){var t=this.partialObserver;if(t.error)try{t.error(e)}catch(e){de(e)}else de(e)},e.prototype.complete=function(){var e=this.partialObserver;if(e.complete)try{e.complete()}catch(e){de(e)}},e}(),le=function(e){function t(t,r,n){var o,i,s=e.call(this)||this;return $(t)||!t?o={next:null!=t?t:void 0,error:null!=r?r:void 0,complete:null!=n?n:void 0}:s&&K?((i=Object.create(t)).unsubscribe=function(){return s.unsubscribe()},o={next:t.next&&ue(t.next,i),error:t.error&&ue(t.error,i),complete:t.complete&&ue(t.complete,i)}):o=t,s.destination=new ae(o),s}return N(t,e),t}(se);function de(e){var t;J?(t=e,J&&oe&&(oe.errorThrown=!0,oe.error=t)):ee(e)}function pe(e,t){var r=W;r&&Q.setTimeout((function(){return r(e,t)}))}var fe={closed:!0,next:te,error:function(e){throw e},complete:te};function he(e,t,r,n,o){return new ve(e,t,r,n,o)}var ve=function(e){function t(t,r,n,o,i,s){var c=e.call(this,t)||this;return c.onFinalize=i,c.shouldUnsubscribe=s,c._next=r?function(e){try{r(e)}catch(e){t.error(e)}}:e.prototype._next,c._error=o?function(e){try{o(e)}catch(e){t.error(e)}finally{this.unsubscribe()}}:e.prototype._error,c._complete=n?function(){try{n()}catch(e){t.error(e)}finally{this.unsubscribe()}}:e.prototype._complete,c}return N(t,e),t.prototype.unsubscribe=function(){var t;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){var r=this.closed;e.prototype.unsubscribe.call(this),!r&&(null===(t=this.onFinalize)||void 0===t||t.call(this))}},t}(se);function ye(e){return e}function be(e,t,r){var n=$(e)||t||r?{next:e,error:t,complete:r}:e;return n?k((function(e,t){var r;null===(r=n.subscribe)||void 0===r||r.call(n);var o=!0;e.subscribe(he(t,(function(e){var r;null===(r=n.next)||void 0===r||r.call(n,e),t.next(e)}),(function(){var e;o=!1,null===(e=n.complete)||void 0===e||e.call(n),t.complete()}),(function(e){var r;o=!1,null===(r=n.error)||void 0===r||r.call(n,e),t.error(e)}),(function(){var e,t;o&&(null===(e=n.unsubscribe)||void 0===e||e.call(n)),null===(t=n.finalize)||void 0===t||t.call(n)})))})):ye}function me(e,t){return k((function(r,n){var o=0;r.subscribe(he(n,(function(r){return e.call(t,r,o++)&&n.next(r)})))}))}function we(e,t){return k((function(r,n){var o=0;r.subscribe(he(n,(function(r){n.next(e.call(t,r,o++))})))}))}var ge=function(e){function t(t,r){return e.call(this)||this}return N(t,e),t.prototype.schedule=function(e,t){return void 0===t&&(t=0),this},t}(G),xe={setInterval:function(e,t){for(var r=[],n=2;n<arguments.length;n++)r[n-2]=arguments[n];var o=xe.delegate;return(null==o?void 0:o.setInterval)?o.setInterval.apply(o,D([e,t],R(r))):setInterval.apply(void 0,D([e,t],R(r)))},clearInterval:function(e){var t=xe.delegate;return((null==t?void 0:t.clearInterval)||clearInterval)(e)},delegate:void 0},Se=function(e){function t(t,r){var n=e.call(this,t,r)||this;return n.scheduler=t,n.work=r,n.pending=!1,n}return N(t,e),t.prototype.schedule=function(e,t){var r;if(void 0===t&&(t=0),this.closed)return this;this.state=e;var n=this.id,o=this.scheduler;return null!=n&&(this.id=this.recycleAsyncId(o,n,t)),this.pending=!0,this.delay=t,this.id=null!==(r=this.id)&&void 0!==r?r:this.requestAsyncId(o,this.id,t),this},t.prototype.requestAsyncId=function(e,t,r){return void 0===r&&(r=0),xe.setInterval(e.flush.bind(e,this),r)},t.prototype.recycleAsyncId=function(e,t,r){if(void 0===r&&(r=0),null!=r&&this.delay===r&&!1===this.pending)return t;null!=t&&xe.clearInterval(t)},t.prototype.execute=function(e,t){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;var r=this._execute(e,t);if(r)return r;!1===this.pending&&null!=this.id&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))},t.prototype._execute=function(e,t){var r,n=!1;try{this.work(e)}catch(e){n=!0,r=e||new Error("Scheduled action threw falsy error")}if(n)return this.unsubscribe(),r},t.prototype.unsubscribe=function(){if(!this.closed){var t=this.id,r=this.scheduler,n=r.actions;this.work=this.state=this.scheduler=null,this.pending=!1,F(n,this),null!=t&&(this.id=this.recycleAsyncId(r,t,null)),this.delay=null,e.prototype.unsubscribe.call(this)}},t}(ge),Ee={now:function(){return(Ee.delegate||Date).now()},delegate:void 0},Pe=function(){function e(t,r){void 0===r&&(r=e.now),this.schedulerActionCtor=t,this.now=r}return e.prototype.schedule=function(e,t,r){return void 0===t&&(t=0),new this.schedulerActionCtor(this,e).schedule(r,t)},e.now=Ee.now,e}(),Ie=new(function(e){function t(t,r){void 0===r&&(r=Pe.now);var n=e.call(this,t,r)||this;return n.actions=[],n._active=!1,n}return N(t,e),t.prototype.flush=function(e){var t=this.actions;if(this._active)t.push(e);else{var r;this._active=!0;do{if(r=e.execute(e.state,e.delay))break}while(e=t.shift());if(this._active=!1,r){for(;e=t.shift();)e.unsubscribe();throw r}}},t}(Pe))(Se);function _e(e,t,r,n,o){void 0===n&&(n=0),void 0===o&&(o=!1);var i=t.schedule((function(){r(),o?e.add(this.schedule(null,n)):this.unsubscribe()}),n);if(e.add(i),!o)return i}var Oe="function"==typeof Symbol&&Symbol.observable||"@@observable";var Te=function(){function e(e){e&&(this._subscribe=e)}return e.prototype.lift=function(t){var r=new e;return r.source=this,r.operator=t,r},e.prototype.subscribe=function(e,t,r){var n,o=this,i=(n=e)&&n instanceof se||function(e){return e&&$(e.next)&&$(e.error)&&$(e.complete)}(n)&&Y(n)?e:new le(e,t,r);return ie((function(){var e=o,t=e.operator,r=e.source;i.add(t?t.call(i,r):r?o._subscribe(i):o._trySubscribe(i))})),i},e.prototype._trySubscribe=function(e){try{return this._subscribe(e)}catch(t){e.error(t)}},e.prototype.forEach=function(e,t){var r=this;return new(t=Ue(t))((function(t,n){var o=new le({next:function(t){try{e(t)}catch(e){n(e),o.unsubscribe()}},error:n,complete:t});r.subscribe(o)}))},e.prototype._subscribe=function(e){var t;return null===(t=this.source)||void 0===t?void 0:t.subscribe(e)},e.prototype[Oe]=function(){return this},e.prototype.pipe=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return(0===(r=e).length?ye:1===r.length?r[0]:function(e){return r.reduce((function(e,t){return t(e)}),e)})(this);var r},e.prototype.toPromise=function(e){var t=this;return new(e=Ue(e))((function(e,r){var n;t.subscribe((function(e){return n=e}),(function(e){return r(e)}),(function(){return e(n)}))}))},e.create=function(t){return new e(t)},e}();function Ue(e){var t;return null!==(t=null!=e?e:Z)&&void 0!==t?t:Promise}var Ae="function"==typeof Symbol&&Symbol.iterator?Symbol.iterator:"@@iterator";function Ce(e){if(e instanceof Te)return e;if(null!=e){if(function(e){return $(e[Oe])}(e))return i=e,new Te((function(e){var t=i[Oe]();if($(t.subscribe))return t.subscribe(e);throw new TypeError("Provided object does not correctly implement Symbol.observable")}));if(function(e){return e&&"number"==typeof e.length&&"function"!=typeof e}(e))return o=e,new Te((function(e){for(var t=0;t<o.length&&!e.closed;t++)e.next(o[t]);e.complete()}));if($(null==(n=e)?void 0:n.then))return r=e,new Te((function(e){r.then((function(t){e.closed||(e.next(t),e.complete())}),(function(t){return e.error(t)})).then(null,ee)}));if(function(e){return Symbol.asyncIterator&&$(null==e?void 0:e[Symbol.asyncIterator])}(e))return $e(e);if(function(e){return $(null==e?void 0:e[Ae])}(e))return t=e,new Te((function(e){var r,n;try{for(var o=L(t),i=o.next();!i.done;i=o.next()){var s=i.value;if(e.next(s),e.closed)return}}catch(e){r={error:e}}finally{try{i&&!i.done&&(n=o.return)&&n.call(o)}finally{if(r)throw r.error}}e.complete()}));if(function(e){return $(null==e?void 0:e.getReader)}(e))return $e(function(e){return function(e,t,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,o=r.apply(e,t||[]),i=[];return n=Object.create(("function"==typeof AsyncIterator?AsyncIterator:Object).prototype),s("next"),s("throw"),s("return",(function(e){return function(t){return Promise.resolve(t).then(e,a)}})),n[Symbol.asyncIterator]=function(){return this},n;function s(e,t){o[e]&&(n[e]=function(t){return new Promise((function(r,n){i.push([e,t,r,n])>1||c(e,t)}))},t&&(n[e]=t(n[e])))}function c(e,t){try{(r=o[e](t)).value instanceof M?Promise.resolve(r.value.v).then(u,a):l(i[0][2],r)}catch(e){l(i[0][3],e)}var r}function u(e){c("next",e)}function a(e){c("throw",e)}function l(e,t){e(t),i.shift(),i.length&&c(i[0][0],i[0][1])}}(this,arguments,(function(){var t,r,n;return H(this,(function(o){switch(o.label){case 0:t=e.getReader(),o.label=1;case 1:o.trys.push([1,,9,10]),o.label=2;case 2:return[4,M(t.read())];case 3:return r=o.sent(),n=r.value,r.done?[4,M(void 0)]:[3,5];case 4:return[2,o.sent()];case 5:return[4,M(n)];case 6:return[4,o.sent()];case 7:return o.sent(),[3,2];case 8:return[3,10];case 9:return t.releaseLock(),[7];case 10:return[2]}}))}))}(e))}var t,r,n,o,i;throw function(e){return new TypeError("You provided "+(null!==e&&"object"==typeof e?"an invalid object":"'"+e+"'")+" where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.")}(e)}function $e(e){return new Te((function(t){(function(e,t){var r,n,o,i,s,c,u,a;return s=this,c=void 0,a=function(){var s,c;return H(this,(function(u){switch(u.label){case 0:u.trys.push([0,5,6,11]),r=function(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t,r=e[Symbol.asyncIterator];return r?r.call(e):(e=L(e),t={},n("next"),n("throw"),n("return"),t[Symbol.asyncIterator]=function(){return this},t);function n(r){t[r]=e[r]&&function(t){return new Promise((function(n,o){!function(e,t,r,n){Promise.resolve(n).then((function(t){e({value:t,done:r})}),t)}(n,o,(t=e[r](t)).done,t.value)}))}}}(e),u.label=1;case 1:return[4,r.next()];case 2:if((n=u.sent()).done)return[3,4];if(s=n.value,t.next(s),t.closed)return[2];u.label=3;case 3:return[3,1];case 4:return[3,11];case 5:return c=u.sent(),o={error:c},[3,11];case 6:return u.trys.push([6,,9,10]),n&&!n.done&&(i=r.return)?[4,i.call(r)]:[3,8];case 7:u.sent(),u.label=8;case 8:return[3,10];case 9:if(o)throw o.error;return[7];case 10:return[7];case 11:return t.complete(),[2]}}))},new((u=void 0)||(u=Promise))((function(e,t){function r(e){try{o(a.next(e))}catch(e){t(e)}}function n(e){try{o(a.throw(e))}catch(e){t(e)}}function o(t){var o;t.done?e(t.value):(o=t.value,o instanceof u?o:new u((function(e){e(o)}))).then(r,n)}o((a=a.apply(s,c||[])).next())}))})(e,t).catch((function(e){return t.error(e)}))}))}var ke=B((function(e){return function(){e(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"}})),je=function(e){function t(){var t=e.call(this)||this;return t.closed=!1,t.currentObservers=null,t.observers=[],t.isStopped=!1,t.hasError=!1,t.thrownError=null,t}return N(t,e),t.prototype.lift=function(e){var t=new Ne(this,this);return t.operator=e,t},t.prototype._throwIfClosed=function(){if(this.closed)throw new ke},t.prototype.next=function(e){var t=this;ie((function(){var r,n;if(t._throwIfClosed(),!t.isStopped){t.currentObservers||(t.currentObservers=Array.from(t.observers));try{for(var o=L(t.currentObservers),i=o.next();!i.done;i=o.next())i.value.next(e)}catch(e){r={error:e}}finally{try{i&&!i.done&&(n=o.return)&&n.call(o)}finally{if(r)throw r.error}}}}))},t.prototype.error=function(e){var t=this;ie((function(){if(t._throwIfClosed(),!t.isStopped){t.hasError=t.isStopped=!0,t.thrownError=e;for(var r=t.observers;r.length;)r.shift().error(e)}}))},t.prototype.complete=function(){var e=this;ie((function(){if(e._throwIfClosed(),!e.isStopped){e.isStopped=!0;for(var t=e.observers;t.length;)t.shift().complete()}}))},t.prototype.unsubscribe=function(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null},Object.defineProperty(t.prototype,"observed",{get:function(){var e;return(null===(e=this.observers)||void 0===e?void 0:e.length)>0},enumerable:!1,configurable:!0}),t.prototype._trySubscribe=function(t){return this._throwIfClosed(),e.prototype._trySubscribe.call(this,t)},t.prototype._subscribe=function(e){return this._throwIfClosed(),this._checkFinalizedStatuses(e),this._innerSubscribe(e)},t.prototype._innerSubscribe=function(e){var t=this,r=this,n=r.hasError,o=r.isStopped,i=r.observers;return n||o?q:(this.currentObservers=null,i.push(e),new G((function(){t.currentObservers=null,F(i,e)})))},t.prototype._checkFinalizedStatuses=function(e){var t=this,r=t.hasError,n=t.thrownError,o=t.isStopped;r?e.error(n):o&&e.complete()},t.prototype.asObservable=function(){var e=new Te;return e.source=this,e},t.create=function(e,t){return new Ne(e,t)},t}(Te),Ne=function(e){function t(t,r){var n=e.call(this)||this;return n.destination=t,n.source=r,n}return N(t,e),t.prototype.next=function(e){var t,r;null===(r=null===(t=this.destination)||void 0===t?void 0:t.next)||void 0===r||r.call(t,e)},t.prototype.error=function(e){var t,r;null===(r=null===(t=this.destination)||void 0===t?void 0:t.error)||void 0===r||r.call(t,e)},t.prototype.complete=function(){var e,t;null===(t=null===(e=this.destination)||void 0===e?void 0:e.complete)||void 0===t||t.call(e)},t.prototype._subscribe=function(e){var t,r;return null!==(r=null===(t=this.source)||void 0===t?void 0:t.subscribe(e))&&void 0!==r?r:q},t}(je);function He(e,t){for(var r=[],n=2;n<arguments.length;n++)r[n-2]=arguments[n];if(!0!==t){if(!1!==t){var o=new le({next:function(){o.unsubscribe(),e()}});return Ce(t.apply(void 0,D([],R(r)))).subscribe(o)}}else e()}class Le{constructor(e,t=100){this.homieObserver=e,this.bufferTimeMs=t,this.propertyUpdates$=new x.Subject,this.propertyGroups=[],_("HomiePropertyBuffer constructor called"),this.setupPropertyUpdateStream(),this.bufferedUpdates$=this.setupBufferedUpdatesStream()}addPropertyGroup(e){this.propertyGroups.push(e)}getPropertyPriority(e,t){const r=this.propertyGroups.find((r=>r.properties.includes(`${e}/${t}`)));return r?r.priority:0}setupPropertyUpdateStream(){_("Setting up property update stream"),this.homieObserver.updated$.pipe(be((e=>I("Received event in setupPropertyUpdateStream",{event:e}))),me((e=>e.type===T.Property)),we((e=>{if(e.type===T.Property){I("Processing property event",{event:e});const t={deviceId:e.device.id,nodeId:e.node.id,propertyId:e.property.id,value:e.property.value,priority:this.getPropertyPriority(e.node.id,e.property.id)};return I("Created BufferedPropertyUpdate",{update:t}),t}throw new Error("Unexpected event type")})),be((e=>{I("Emitting update to propertyUpdates$",{update:e}),this.propertyUpdates$.next(e)}))).subscribe({next:()=>I("Subscription in setupPropertyUpdateStream emitted a value"),error:e=>O("Error in setupPropertyUpdateStream",{error:e}),complete:()=>_("Subscription in setupPropertyUpdateStream completed")})}setupBufferedUpdatesStream(){return _("Setting up buffered updates stream"),this.propertyUpdates$.pipe(be((()=>I("propertyUpdates$ emitted a value"))),function(e){for(var t,r,n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];var i,s,c,u=null!==(t=(c=(s=i=n)[s.length-1])&&$(c.schedule)?i.pop():void 0)&&void 0!==t?t:Ie,a=null!==(r=n[0])&&void 0!==r?r:null,l=n[1]||1/0;return k((function(t,r){var n=[],o=!1,i=function(e){var t=e.buffer;e.subs.unsubscribe(),F(n,e),r.next(t),o&&s()},s=function(){if(n){var t=new G;r.add(t);var o={buffer:[],subs:t};n.push(o),_e(t,u,(function(){return i(o)}),e)}};null!==a&&a>=0?_e(r,u,s,a,!0):o=!0,s();var c=he(r,(function(e){var t,r,o=n.slice();try{for(var s=L(o),c=s.next();!c.done;c=s.next()){var u=c.value,a=u.buffer;a.push(e),l<=a.length&&i(u)}}catch(e){t={error:e}}finally{try{c&&!c.done&&(r=s.return)&&r.call(s)}finally{if(t)throw t.error}}}),(function(){for(;null==n?void 0:n.length;)r.next(n.shift().buffer);null==c||c.unsubscribe(),r.complete(),r.unsubscribe()}),void 0,(function(){return n=null}));t.subscribe(c)}))}(this.bufferTimeMs),be((e=>I("Buffered updates",{updates:e}))),me((e=>e.length>0)),we((e=>(e.sort(((e,t)=>{if(e.priority!==t.priority)return t.priority-e.priority;const r=this.propertyGroups.find((t=>t.properties.includes(`${e.nodeId}/${e.propertyId}`))),n=this.propertyGroups.find((e=>e.properties.includes(`${t.nodeId}/${t.propertyId}`)));return r&&n&&r===n?r.properties.indexOf(`${e.nodeId}/${e.propertyId}`)-n.properties.indexOf(`${t.nodeId}/${t.propertyId}`):0})),I("Sorted updates",{updates:e}),e))),function(e){void 0===e&&(e={});var t=e.connector,r=void 0===t?function(){return new je}:t,n=e.resetOnError,o=void 0===n||n,i=e.resetOnComplete,s=void 0===i||i,c=e.resetOnRefCountZero,u=void 0===c||c;return function(e){var t,n,i,c=0,a=!1,l=!1,d=function(){null==n||n.unsubscribe(),n=void 0},p=function(){d(),t=i=void 0,a=l=!1},f=function(){var e=t;p(),null==e||e.unsubscribe()};return k((function(e,h){c++,l||a||d();var v=i=null!=i?i:r();h.add((function(){0!=--c||l||a||(n=He(f,u))})),v.subscribe(h),!t&&c>0&&(t=new le({next:function(e){return v.next(e)},error:function(e){l=!0,d(),n=He(p,o,e),v.error(e)},complete:function(){a=!0,d(),n=He(p,s),v.complete()}}),Ce(e).subscribe(t))}))(e)}}())}getBufferedUpdates(){return _("Getting buffered updates"),this.bufferedUpdates$}processBufferedUpdates(e){_("Setting up buffered updates processor"),this.getBufferedUpdates().subscribe({next:t=>{I("Processing buffered updates",{updates:t}),e(t)},error:e=>O("Error in processBufferedUpdates",{error:e}),complete:()=>_("processBufferedUpdates subscription completed")})}}const Re={HomieDevice:c,HomieDeviceElement:y,HomieNode:w,HomieNodeComponent:h,HomieProperty:g,HomiePropertyBuffer:Le,PropertyBindingManager:f,HomieObserver:A,createMqttHomieObserver:C};var De=s.NB,Me=s.zX,Be=s.rX,ze=s.O,Fe=s.Rx,Ge=s.oN,qe=s.CN,Ye=s.eE,Ve=s.Zk,Xe=s.Ay;export{De as HomieDevice,Me as HomieDeviceElement,Be as HomieNode,ze as HomieNodeComponent,Fe as HomieObserver,Ge as HomieProperty,qe as HomiePropertyBuffer,Ye as PropertyBindingManager,Ve as createMqttHomieObserver,Xe as default};