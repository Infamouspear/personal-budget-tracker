
'use strict';
window.addEventListener('DOMContentLoaded',()=>{const api=window.desktopBudget;if(!api)return;const el=id=>document.getElementById(id);el('aboutUpdates').hidden=false;
function status(s){el('updateStatus').textContent=s.message;el('updateProgress').hidden=s.phase!=='downloading';el('updateProgress').value=s.percent||0;el('checkUpdate').disabled=['checking','downloading','ready','installing'].includes(s.phase);el('downloadUpdate').disabled=s.phase!=='available';el('installUpdate').disabled=s.phase!=='ready';}
async function action(fn){try{status(await fn());}catch(e){el('updateStatus').textContent=e.message;}}
el('aboutUpdates').onclick=async()=>{try{const info=await api.about();el('installedVersion').textContent='Installed version '+info.version;el('desktopDataPath').textContent='Local financial data: '+info.dataDirectory;el('privateAccess').hidden=!info.privateReleases||!info.configured;status(info.status);el('updatesDialog').showModal();}catch(e){el('updateStatus').textContent=e.message;}};
el('checkUpdate').onclick=()=>action(()=>api.check());el('downloadUpdate').onclick=()=>action(()=>api.download());el('installUpdate').onclick=()=>{if(confirm('Install the verified update and restart now? A local recovery backup will be saved first.'))action(()=>api.install());};
el('authorizeRelease').onclick=()=>{const token=el('releaseToken').value;el('releaseToken').value='';action(()=>api.authorize(token));};el('closeUpdates').onclick=()=>el('updatesDialog').close();api.onStatus(status);
});
