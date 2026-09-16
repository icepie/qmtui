function (module) {
      "use strict";
      const key = "__qqmusic_settings__";
      const load = () => { try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch (_) { return {}; } };
      const save = value => localStorage.setItem(key, JSON.stringify(value));
      const parts = path => Array.isArray(path) ? path : String(path || "").split(".").filter(Boolean);
      const get = path => parts(path).reduce((value, part) => value == null ? undefined : value[part], load());
      const set = (path, value) => { const root=load(); let target=root; const p=parts(path); for(let i=0;i<p.length-1;i++) target=target[p[i]]||(target[p[i]]={}); if(p.length) target[p[p.length-1]]=value; else Object.assign(root,value); save(root); };
      const unset = path => { const root=load(); let target=root; const p=parts(path); for(let i=0;i<p.length-1;i++) target=target?.[p[i]]; if(target&&p.length) delete target[p[p.length-1]]; save(root); };
      module.exports={configure:()=>{},getSync:get,get:async path=>get(path),hasSync:path=>get(path)!==undefined,has:async path=>get(path)!==undefined,setSync:set,set:async(path,value)=>set(path,value),unsetSync:unset,unset:async path=>unset(path),getAllSync:load,getAll:async()=>load(),setAllSync:save,setAll:async value=>save(value)};
    }