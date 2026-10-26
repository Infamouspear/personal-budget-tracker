
'use strict';
window.addEventListener('DOMContentLoaded',()=>{const api=window.desktopBudget;if(!api)return;const el=id=>document.getElementById(id);el('aboutUpdates').hidden=false;
const banner=document.createElement('aside');banner.id='updateNotification';banner.className='update-notification';banner.hidden=true;banner.setAttribute('role','status');const summary=document.createElement('span'),view=document.createElement('button'),later=document.createElement('button');view.textContent='View Update';later.textContent='Remind Later';banner.append(summary,view,later);document.querySelector('main').prepend(banner);
const notes=document.createElement('pre');notes.id='updateReleaseNotes';notes.className='update-release-notes';notes.hidden=true;el('updateStatus').after(notes);
function notice(n){banner.hidden=!n?.showAlert;summary.textContent=n?'Version '+n.availableVersion+' is available.':'';el('aboutUpdates').textContent='Settings → About & Updates'+(n?' · Update '+n.availableVersion:'');}
view.onclick=()=>{banner.hidden=true;el('aboutUpdates').click();};later.onclick=async()=>{banner.hidden=true;try{notice(await api.remindUpdate());}catch{}};
api.onUpdateNotice(notice);api.updateNotice().then(notice).catch(()=>{});
function status(s){el('updateStatus').textContent=s.message;notes.textContent=s.releaseNotes||'';notes.hidden=!s.releaseNotes;el('updateProgress').hidden=s.phase!=='downloading';el('updateProgress').value=s.percent||0;el('checkUpdate').disabled=['checking','verifying','downloading','ready','installing'].includes(s.phase);el('downloadUpdate').disabled=s.phase!=='available';el('installUpdate').disabled=s.phase!=='ready';if(s.availableVersion)el('aboutUpdates').textContent='Settings → About & Updates · Update '+s.availableVersion;}
async function action(fn){try{status(await fn());}catch(e){el('updateStatus').textContent=e.message;}}
el('aboutUpdates').onclick=async()=>{try{const info=await api.about();el('installedVersion').textContent='Installed version '+info.version+' · '+info.verification;el('desktopDataPath').textContent='Local financial data: '+info.dataDirectory;el('privateAccess').hidden=!info.privateReleases||!info.configured;status(info.status);el('updatesDialog').showModal();}catch(e){el('updateStatus').textContent=e.message;}};
el('checkUpdate').onclick=()=>action(()=>api.check());el('downloadUpdate').onclick=()=>action(()=>api.download());el('installUpdate').onclick=()=>{if(confirm('Install the verified update and restart now? A local recovery backup will be saved first.'))action(()=>api.install());};
el('authorizeRelease').onclick=()=>{const token=el('releaseToken').value;el('releaseToken').value='';action(()=>api.authorize(token));};el('closeUpdates').onclick=()=>el('updatesDialog').close();api.onStatus(status);
});
