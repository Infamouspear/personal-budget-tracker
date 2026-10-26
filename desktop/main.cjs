
'use strict';
const {app,BrowserWindow,ipcMain,protocol,net,dialog,session}=require('electron'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {BudgetStore}=require('./store.cjs'),{Updates}=require('./updates.cjs'),config=require('../release-config.json');
protocol.registerSchemesAsPrivileged([{scheme:'budget',privileges:{standard:true,secure:true,supportFetchAPI:true}}]);
app.setName('Week by Week Budget');
const metadata=require('../package.json');
const testRoot=metadata.desktopTestBuild&&(process.env.BUDGET_TEST_ROOT||metadata.desktopTestDataRoot);
if(metadata.desktopTestBuild&&!testRoot)throw Error('Test builds require an isolated profile. Production financial data will not be opened.');
const stableData=testRoot?path.resolve(testRoot):path.join(app.getPath('appData'),'WeekByWeekBudget');app.setPath('userData',stableData);
if(!app.requestSingleInstanceLock()){app.quit();}else{
let win,store,updates,notifications;
const allowedURL=url=>{try{const u=new URL(url);return u.protocol==='budget:'&&u.hostname==='app'&&u.pathname==='/index.html';}catch{return false;}};
const trusted=e=>!!win&&e.sender===win.webContents&&e.senderFrame===win.webContents.mainFrame&&allowedURL(e.senderFrame.url);
function requireTrusted(e){if(!trusted(e))throw Error('This operation is unavailable outside the local budget window.');}
app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus();}});
app.whenReady().then(()=>{
 try{store=new BudgetStore(path.join(stableData,'records'));}catch(e){dialog.showErrorBox('Budget data needs recovery',e.message+'\n\nData folder: '+path.join(stableData,'records'));app.quit();return;}
 if(testRoot&&process.env.BUDGET_TEST_IMPORT){const fixture=require('node:fs').readFileSync(process.env.BUDGET_TEST_IMPORT,'utf8');store.set('week-by-week-v01',fixture);}
 const assets=new Set(['index.html','app.js','engine.js','style.css','desktop-ui.js']);
 protocol.handle('budget',async request=>{const u=new URL(request.url),asset=u.pathname.slice(1);if(u.hostname!=='app'||request.method!=='GET'||!assets.has(asset))return new Response('Not found',{status:404});const response=await net.fetch(pathToFileURL(path.join(__dirname,'../app',asset)).href);const headers=new Headers(response.headers);headers.set('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; font-src 'self'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'");headers.set('X-Content-Type-Options','nosniff');return new Response(response.body,{status:response.status,headers});});
 session.defaultSession.setPermissionRequestHandler((_wc,_p,cb)=>cb(false));session.defaultSession.setPermissionCheckHandler(()=>false);
 win=new BrowserWindow({width:1180,height:860,minWidth:650,minHeight:500,title:'Week by Week Budget',show:false,webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,spellcheck:false,devTools:!app.isPackaged}});
 win.removeMenu();win.webContents.setWindowOpenHandler(()=>({action:'deny'}));win.webContents.on('will-navigate',(event,url)=>{if(!allowedURL(url))event.preventDefault();});win.webContents.on('will-attach-webview',event=>event.preventDefault());win.once('ready-to-show',()=>win.show());
 const {autoUpdater}=require('electron-updater');autoUpdater.logger=null;autoUpdater.installDirectory=path.dirname(app.getPath('exe'));updates=new Updates({updater:autoUpdater,config,packaged:app.isPackaged,version:app.getVersion(),store,notify:s=>{if(win&&!win.isDestroyed())win.webContents.send('budget:update-status',s);}});const outcome=store.updateOutcome(app.getVersion());if(outcome)updates.set(outcome);
 const {UpdateNotifications}=require('./notifications.cjs');notifications=new UpdateNotifications({updates,file:path.join(stableData,'update-preferences.json'),notify:n=>{if(win&&!win.isDestroyed())win.webContents.send('budget:update-notification',n);}});if(!testRoot)notifications.start();app.once('before-quit',()=>notifications.stop());
 ipcMain.handle('budget:update-notice',e=>{requireTrusted(e);return notifications.status();});ipcMain.handle('budget:remind-update',e=>{requireTrusted(e);return notifications.remind();});
 ipcMain.on('budget:storage',(e,p)=>{try{requireTrusted(e);if(!p||!['get','set'].includes(p.op))throw Error('Invalid storage operation.');e.returnValue={ok:true,value:p.op==='get'?store.get(p.key):store.set(p.key,p.value)};}catch(error){e.returnValue={ok:false,error:error.message};}});
 ipcMain.handle('budget:about',e=>{requireTrusted(e);return {version:app.getVersion(),dataDirectory:store.directory,privateReleases:config.private,configured:updates.enabled(),verification:config.updatePublicKey?'Ed25519 release signatures'+(config.publisherName?' + Windows Authenticode':' (Windows may show unknown publisher)'):'Windows Authenticode',status:updates.state};});
 for(const [channel,method]of [['check','check'],['download','download'],['install','install'],['authorize','authorize']])ipcMain.handle('budget:'+channel,(e,arg)=>{requireTrusted(e);return updates[method](arg);});
 win.loadURL('budget://app/index.html');
 if(testRoot){win.webContents.once('did-finish-load',async()=>{try{const result=await win.webContents.executeJavaScript(`({title:document.title,history:document.getElementById('history').innerText,accounts:document.getElementById('accounts').innerText,node:typeof require,bridge:typeof desktopBudget.getItem,aboutVisible:!document.getElementById('aboutUpdates').hidden})`);require('node:fs').writeFileSync(path.join(stableData,'smoke-result.json'),JSON.stringify({version:app.getVersion(),preferences:{sandbox:win.webContents.getLastWebPreferences().sandbox,contextIsolation:win.webContents.getLastWebPreferences().contextIsolation,nodeIntegration:win.webContents.getLastWebPreferences().nodeIntegration},...result},null,2));app.quit();}catch(e){require('node:fs').writeFileSync(path.join(stableData,'smoke-error.txt'),e.message);app.exit(1);}});}
});
app.on('window-all-closed',()=>app.quit());
}
