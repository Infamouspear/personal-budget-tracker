
'use strict';
const fs=require('node:fs'),path=require('node:path'),B=require('../app/engine.js');
const KEY='week-by-week-v01',suffixes=['','-before-corrections','-before-entry-delete','-before-payday-delete','-before-setup','-before-restore'];
function validKey(k){return typeof k==='string'&&suffixes.some(s=>k===KEY+s);}
class BudgetStore{
 constructor(directory){this.directory=directory;this.file=path.join(directory,'financial-data.json');fs.mkdirSync(directory,{recursive:true});this.values={};if(fs.existsSync(this.file)){try{this.values=JSON.parse(fs.readFileSync(this.file,'utf8'));this.validate(this.values);}catch{throw Error('Saved financial data could not be read. It has not been overwritten. Recover financial-data.previous.json or import a known backup after preserving these files.');}}}
 validate(values){if(!values||Array.isArray(values)||typeof values!=='object')throw Error('Invalid local storage file.');for(const [k,v]of Object.entries(values)){if(!validKey(k)||typeof v!=='string'||Buffer.byteLength(v)>16*1024*1024)throw Error('Invalid budget storage value.');B.validate(B.migrate(JSON.parse(v)));}}
 get(k){if(!validKey(k))throw Error('Unknown storage key.');return this.values[k]??null;}
 set(k,v){if(!validKey(k))throw Error('Unknown storage key.');const next={...this.values,[k]:v};this.validate(next);this.write(next);this.values=next;}
 write(next){const temp=this.file+'.tmp';let fd;try{fd=fs.openSync(temp,'w',0o600);fs.writeFileSync(fd,JSON.stringify(next));fs.fsyncSync(fd);fs.closeSync(fd);fd=undefined;if(fs.existsSync(this.file))fs.copyFileSync(this.file,path.join(this.directory,'financial-data.previous.json'));fs.renameSync(temp,this.file);}catch(e){if(fd!==undefined)fs.closeSync(fd);throw Error('Could not save budget data. Existing records were kept. '+e.message);}}
 backup(){const dir=path.join(this.directory,'backups');fs.mkdirSync(dir,{recursive:true});const name=path.join(dir,'before-update-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json');fs.writeFileSync(name,JSON.stringify(this.values,null,2),{mode:0o600,flag:'wx'});return name;}
}
module.exports={BudgetStore,validKey};
