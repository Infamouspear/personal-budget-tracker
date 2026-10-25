
'use strict';
class Updates{
 constructor({updater,config,packaged,version,store,notify}){Object.assign(this,{updater,config,packaged,version,store,notify});this.state={phase:'idle',message:'Updates are checked only when you ask.',percent:0};this.token=null;updater.autoDownload=false;updater.autoInstallOnAppQuit=false;updater.allowDowngrade=false;updater.allowPrerelease=false;
 const set=(phase,message,extra={})=>this.set({phase,message,...extra});
 updater.on('checking-for-update',()=>set('checking','Checking GitHub Releases…'));
 updater.on('update-available',info=>set('available','Version '+info.version+' is available.',{availableVersion:info.version}));
 updater.on('update-not-available',()=>set('current','You have the latest published version.'));
 updater.on('download-progress',p=>set('downloading','Downloading update…',{percent:Math.max(0,Math.min(100,p.percent||0))}));
 updater.on('update-downloaded',info=>set('ready','Version '+info.version+' is downloaded and verified. Install when you are ready.',{percent:100,availableVersion:info.version}));
 updater.on('error',()=>set('error','Update failed or could not be verified. Your budget is unchanged. Check access and network, then try again.'));
 }
 set(s){this.state={...this.state,...s};this.notify(this.state);return this.state;}
 enabled(){return this.packaged&&this.config.updatesEnabled===true&&!!this.config.publisherName&&/^[A-Za-z0-9-]+$/.test(this.config.owner)&&/^[A-Za-z0-9_.-]+$/.test(this.config.repo);}
 authorize(token){if(typeof token!=='string'||token.length<10||token.length>512||/\s/.test(token))throw Error('Enter a valid read-only GitHub token.');if(['checking','downloading','ready'].includes(this.state.phase))throw Error('Finish or retry the current update before changing access.');this.token=token;return this.set({phase:'idle',message:'Private release access is available for this app session only.'});}
 async check(){if(!this.enabled())return this.set({phase:'disabled',message:'Secure updates are not configured for this build. A signed release, publisher name, and GitHub repository are required.'});if(['checking','downloading','ready'].includes(this.state.phase))return this.state;if(this.config.private&&!this.token)return this.set({phase:'auth',message:'Private releases require a read-only token for this session. It is never saved or included in backups.'});try{this.updater.setFeedURL({provider:'github',owner:this.config.owner,repo:this.config.repo,private:!!this.config.private,...(this.config.private?{token:this.token}:{})});this.set({phase:'checking',message:'Checking GitHub Releases…'});await this.updater.checkForUpdates();}catch{this.set({phase:'error',message:'Could not check releases. Verify network and repository access. Your budget is unchanged.'});}return this.state;}
 async download(){if(this.state.phase!=='available')throw Error('Check for an available update first.');try{this.set({phase:'downloading',message:'Downloading and verifying update…',percent:0});await this.updater.downloadUpdate();}catch{this.set({phase:'error',message:'Download interrupted or verification failed. Your budget is unchanged. Check again to retry.'});}return this.state;}
 install(){if(!this.enabled()||this.state.phase!=='ready')throw Error('No verified update is ready.');this.store.backup();this.set({phase:'installing',message:'A local recovery backup was saved. Restarting to install…'});this.updater.quitAndInstall(false,true);return this.state;}
}
module.exports={Updates};
