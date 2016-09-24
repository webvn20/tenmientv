/*!
 * Sheetrock v1.0.1
 * Quickly connect to, query, and lazy-load data from Google Sheets.
 * http://chriszarate.github.io/sheetrock/
 * License: MIT
 */
(function(e,r){"use strict";var t=r();if(typeof define==="function"&&define.amd){define("sheetrock",function(){t.environment.amd=true;return t})}else if(typeof module==="object"&&module.exports){t.environment.commonjs=true;t.environment.request=require("request");module.exports=t}else{e.sheetrock=t}})(this,function(){"use strict";var e={2014:{apiEndpoint:"https://docs.google.com/spreadsheets/d/%key%/gviz/tq?",keyFormat:new RegExp("spreadsheets/d/([^/#]+)","i"),gidFormat:new RegExp("gid=([^/&#]+)","i")},2010:{apiEndpoint:"https://spreadsheets.google.com/tq?key=%key%&",keyFormat:new RegExp("key=([^&#]+)","i"),gidFormat:new RegExp("gid=([^/&#]+)","i")}};var r={loaded:{},failed:{},labels:{},header:{},offset:{}};var t=0;var a=typeof window==="undefined"?{}:window;var n={document:a.document||{},dom:!!(a.document&&a.document.createElement),jquery:!!(a.jQuery&&a.jQuery.fn&&a.jQuery.fn.jquery),request:false};if(!Array.prototype.forEach){Array.prototype.forEach=function(e){var r;var t=this;var a=t.length;for(r=0;r<a;r=r+1){e(t[r],r)}}}if(!Array.prototype.map){Array.prototype.map=function(e){var r=this;var t=[];r.forEach(function(r,a){t[a]=e(r,a)});return t}}if(!Object.keys){Object.keys=function(e){var r;var t=[];for(r in e){if(e.hasOwnProperty(r)){t.push(r)}}return t}}var o=function(e,t,a){if(!(e instanceof Error)){e=new Error(e)}if(t&&t.request&&t.request.index){r.failed[t.request.index]=true}if(t&&t.user&&t.user.callback){t.user.callback(e,t,a||null)}else{throw e}};var i=function(e){return e.toString().replace(/^ +/,"").replace(/ +$/,"")};var u=function(e){return Math.max(0,parseInt(e,10)||0)};var s=function(e,r){var t=" "+e.className+" ";return t.indexOf(" "+r+" ")!==-1};var f=function(e){e=e||{};if(e.jquery&&e.length){e=e[0]}return e.nodeType&&e.nodeType===1?e:false};var l=function(){n.dom=!!(n.document&&n.document.createElement)};var c=function(r){var t={};var a=Object.keys(e);a.forEach(function(a){var n=e[a];if(n.keyFormat.test(r)&&n.gidFormat.test(r)){t.key=r.match(n.keyFormat)[1];t.gid=r.match(n.gidFormat)[1];t.apiEndpoint=n.apiEndpoint.replace("%key%",t.key)}});return t};var d=function(e){return e.key&&e.gid?e.key+"_"+e.gid+"_"+e.query:null};var v=function(e){var r;if(e&&e.f){r=e.f}else if(e&&e.v){r=e.v}else{r=""}if(r instanceof Array){r=e.f||r.join("")}return i(r)};var m=function(e,r,t){var a={cells:{},cellsArray:r,labels:t,num:e};r.forEach(function(e,r){a.cells[t[r]]=e});return a};var h=function(e,r){return"<"+r+">"+e+"</"+r+">"};var p=function(e){var r=e.num?"td":"th";var t=Object.keys(e.cells);var a="";t.forEach(function(t){a+=h(e.cells[t],r)});return h(a,"tr")};var y=function(e){r.loaded[e]=false;r.failed[e]=false;r.labels[e]=false;r.header[e]=0;r.offset[e]=0};var b=function(e,r){var t={};var a=Object.keys(e);r.query=r.sql||r.query;r.reset=r.resetStatus||r.reset;r.fetchSize=r.chunkSize||r.fetchSize;r.rowTemplate=r.rowHandler||r.rowTemplate;a.forEach(function(a){t[a]=r[a]||e[a]});return t};var g=function(e,r){r.target=f(r.target)||f(e);r.fetchSize=u(r.fetchSize);return r};var q=function(e,t){var a=g(e,t);var n=c(a.url);n.query=a.query;n.index=d(n);if(a.reset&&n.index){y(n.index);n.reset=true}a.offset=r.offset[n.index]||0;if(a.fetchSize&&n.index){n.query+=" limit "+(a.fetchSize+1);n.query+=" offset "+a.offset;r.offset[n.index]=a.offset+a.fetchSize}return{user:a,request:n}};var k=function(e){if(!e.user.target&&!e.user.callback){throw"No element targeted or callback provided."}if(!(e.request.key&&e.request.gid)){throw"No key/gid in the provided URL."}if(r.failed[e.request.index]){throw"A previous request for this resource failed."}if(r.loaded[e.request.index]){throw"No more rows to load!"}return e};var w=function(e,r){return e&&e.length===r.length?e:r};var E=function(e,t){var a=e.request.index;var n=r.labels[a];var o=e.user.fetchSize;var i=t.table.rows;var u=t.table.cols;var s={last:i.length-1,rowNumberOffset:r.header[a]||0};if(!e.user.offset){n=u.map(function(e,r){if(e.label){return e.label.replace(/\s/g,"")}else{s.last=s.last+1;s.rowNumberOffset=1;return v(i[0].c[r]).replace(/\s/g,"")||e.id}});r.offset[a]=r.offset[a]+s.rowNumberOffset;r.header[a]=s.rowNumberOffset;r.labels[a]=n}if(!o||i.length-s.rowNumberOffset<o){s.last=s.last+1;r.loaded[a]=true}s.labels=w(e.user.labels,n);return s};var x=function(e,r,t){var a=[];var n=r.labels;if(!e.offset&&!r.rowNumberOffset){a.push(m(0,n,n))}t.table.rows.forEach(function(t,o){if(t.c&&o<r.last){var i=u(e.offset+o+1-r.rowNumberOffset);a.push(m(i,t.c.map(v),n))}});return a};var j=function(e,r,t){if(e.tagName==="TABLE"){var a=n.document.createElement("thead");var o=n.document.createElement("tbody");a.innerHTML=r;o.innerHTML=t;e.appendChild(a);e.appendChild(o)}else{e.insertAdjacentHTML("beforeEnd",r+t)}};var N=function(e,r){var t=e.rowTemplate||p;var a=n.dom&&e.target;var o=a&&e.target.tagName==="TABLE";var i=a&&s(e.target,"sheetrock-header");var u="";var f="";r.forEach(function(e){if(e.num){f+=t(e)}else if(o||i){u+=t(e)}});if(a){j(e.target,u,f)}return o?h(u,"thead")+h(f,"tbody"):u+f};var O=function(e,r){var t={raw:r};try{var a=t.attributes=E(e,r);var n=t.rows=x(e.user,a,r);t.html=N(e.user,n)}catch(i){o("Unexpected API response format.",e,t);return}if(e.user.callback){e.user.callback(null,e,t)}};var S=function(e,r){if(typeof n.request!=="function"){throw"No HTTP transport available."}var t={headers:{"X-DataSource-Auth":"true"},url:e.request.url};var a=function(t,a,n){if(!t&&a.statusCode===200){try{n=JSON.parse(n.replace(/^\)\]\}\'\n/,""));r(e,n)}catch(i){o(i,e,{raw:n})}}else{o(t||"Request failed.",e)}};n.request(t,a)};var T=function(e,r){var i;var u;var s;var f=n.document.getElementsByTagName("head")[0];var l=n.document.createElement("script");var c="_sheetrock_callback_"+t;i=function(){if(l.removeEventListener){l.removeEventListener("error",s,false);l.removeEventListener("abort",s,false)}f.removeChild(l);delete a[c]};u=function(t){try{r(e,t)}catch(a){o(a,e,{raw:t})}finally{i()}};s=function(){o("Request failed.",e);i()};a[c]=u;e.request.url=e.request.url.replace("%callback%",c);if(l.addEventListener){l.addEventListener("error",s,false);l.addEventListener("abort",s,false)}l.type="text/javascript";l.src=e.request.url;f.appendChild(l);t=t+1};var A=function(e){var r=["gid="+encodeURIComponent(e.request.gid),"tq="+encodeURIComponent(e.request.query)];if(n.dom){r.push("tqx=responseHandler:%callback%")}return e.request.apiEndpoint+r.join("&")};var L=function(e,r){e.request.url=A(e);if(n.dom){T(e,r)}else{S(e,r)}};var z={url:"",query:"",target:null,fetchSize:0,labels:[],rowTemplate:null,callback:null,reset:false};var R=function(e,r){try{e=b(z,e||{});e=q(this,e);e=k(e);l();if(r){O(e,r)}else{L(e,O)}}catch(t){o(t,e)}return this};R.defaults=z;R.version="1.0.1";R.environment=n;if(n.jquery){a.jQuery.fn.sheetrock=R}return R});
//# sourceMappingURL=sheetrock.min.js.map