type DevEarlyGuardsProps = {
  buildId?: string | null;
};

/**
 * Synchronous dev-only guards in <head> - must run before React/webpack chunks
 * so stale HMR modules cannot POST deleted Server Action IDs.
 */
export function DevEarlyGuards({ buildId }: DevEarlyGuardsProps) {
  if (process.env.NODE_ENV !== "development") return null;

  const id = buildId ?? "";

  return (
    <>
      {id ? <meta name="iff-dev-build-id" content={id} /> : null}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{
var BUILD_KEY="iff-dev-build-id",RELOAD_TS_KEY="iff-stale-reload-ts",id=${JSON.stringify(id)};
function shouldReload(msg){return/server action.*not found|failed to find server action|unrecognizedactionerror|cannot read properties of undefined \\(reading 'call'\\)|chunkloaderror|loading chunk \\d+ failed/i.test(msg||"")}
function reloadOnce(reason){
var now=Date.now(),last=Number(sessionStorage.getItem(RELOAD_TS_KEY)||0);
if(now-last<2500)return;
sessionStorage.setItem(RELOAD_TS_KEY,String(now));
sessionStorage.removeItem("iff-stale-server-action-reload");
function doReload(){
var u=new URL(window.location.href);
u.searchParams.set("_iff",String(now));
location.replace(u.toString())
}
if("caches"in window){caches.keys().then(function(keys){return Promise.all(keys.map(function(k){return caches.delete(k)}))}).finally(doReload)}
else{doReload()}
}
if(id){
var prev=sessionStorage.getItem(BUILD_KEY);
sessionStorage.setItem(BUILD_KEY,id);
if(prev&&prev!==id){reloadOnce("build");return}
}
function requestHasNextAction(init){
if(!init||!init.headers)return false;
var h=init.headers;
if(typeof h.get==="function")return h.has("next-action")||h.has("Next-Action");
if(Array.isArray(h))return h.some(function(p){return p&&(p[0]==="next-action"||p[0]==="Next-Action")});
return h["next-action"]||h["Next-Action"]
}
var origFetch=window.fetch.bind(window);
window.fetch=function(input,init){
var isAction=requestHasNextAction(init);
return origFetch(input,init).then(function(res){
if(isAction&&(res.status===404||res.status===410||res.status===500)){
reloadOnce("action-status");
return res
}
if(res.headers.get("x-iff-stale-action")==="1"){
reloadOnce("stale-header");
return res
}
if(!res.ok){
return res.clone().text().then(function(body){
if(shouldReload(body))reloadOnce("action-body");
return res
}).catch(function(){return res})
}
return res
})
};
window.addEventListener("error",function(e){
if(shouldReload(e.message)||(e.error&&shouldReload(e.error.message)))reloadOnce("error")
});
window.addEventListener("unhandledrejection",function(e){
var r=e.reason,m=r instanceof Error?r.message:typeof r==="string"?r:r&&r.message?String(r.message):"";
if(shouldReload(m))reloadOnce("rejection")
});
}catch(e){}})();`,
        }}
      />
    </>
  );
}
