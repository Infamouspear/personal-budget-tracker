
'use strict';
const {contextBridge,ipcRenderer}=require('electron');
function storage(op,key,value){const r=ipcRenderer.sendSync('budget:storage',{op,key,value});if(!r?.ok)throw Error(r?.error||'Budget storage unavailable.');return r.value;}
contextBridge.exposeInMainWorld('desktopBudget',Object.freeze({
 getItem:key=>storage('get',key),setItem:(key,value)=>storage('set',key,value),
 about:()=>ipcRenderer.invoke('budget:about'),check:()=>ipcRenderer.invoke('budget:check'),download:()=>ipcRenderer.invoke('budget:download'),install:()=>ipcRenderer.invoke('budget:install'),
 authorize:token=>ipcRenderer.invoke('budget:authorize',token),
 onStatus:callback=>{const listener=(_event,status)=>callback(status);ipcRenderer.on('budget:update-status',listener);return()=>ipcRenderer.removeListener('budget:update-status',listener);}
}));
