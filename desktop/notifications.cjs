'use strict';
const fs=require('node:fs'),path=require('node:path');
const CHECK_INTERVAL=6*60*60*1000,REMIND_INTERVAL=24*60*60*1000;
class UpdateNotifications{
 constructor({updates,file,notify=()=>{},now=Date.now,setTimer=setTimeout,clearTimer=clearTimeout}){Object.assign(this,{updates,file,notify,now,setTimer,clearTimer});this.preferences={};this.notice=null;this.stopped=true;this.running=false;try{const p=JSON.parse(fs.readFileSync(file,'utf8'));if(typeof p.version==='string'&&Number.isFinite(p.remindUntil))this.preferences=p;}catch{}}
 save(){try{fs.mkdirSync(path.dirname(this.file),{recursive:true});const temp=this.file+'.tmp';fs.writeFileSync(temp,JSON.stringify(this.preferences),{mode:0o600});fs.renameSync(temp,this.file);}catch{/* Notification preferences must never interrupt budgeting. */}}
 status(){if(!this.notice)return null;return {...this.notice,showAlert:!(this.preferences.version===this.notice.availableVersion&&this.preferences.remindUntil>this.now())};}
 publish(){this.notify(this.status());}
 remind(){if(this.notice){this.preferences={version:this.notice.availableVersion,remindUntil:this.now()+REMIND_INTERVAL};this.save();this.publish();}return this.status();}
 async check(){if(this.running||['checking','verifying','downloading','ready','installing'].includes(this.updates.state.phase))return this.status();this.running=true;try{const result=await this.updates.check();if(result.phase==='available'&&require('./verification.cjs').newer(result.availableVersion,this.updates.version)&&!this.updates.availableInfo?.draft&&!this.updates.availableInfo?.prerelease){this.notice={availableVersion:result.availableVersion,releaseNotes:result.releaseNotes||''};this.publish();}else if(result.phase==='current'){this.notice=null;this.publish();}}catch{/* Offline/background failures are intentionally quiet. */}finally{this.running=false;}return this.status();}
 start(){if(!this.stopped)return;this.stopped=false;const tick=async()=>{await this.check();if(!this.stopped)this.timer=this.setTimer(tick,CHECK_INTERVAL);};this.timer=this.setTimer(tick,30000);this.timer?.unref?.();}
 stop(){this.stopped=true;this.clearTimer(this.timer);}
}
module.exports={UpdateNotifications,CHECK_INTERVAL,REMIND_INTERVAL};
