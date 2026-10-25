
'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
for(const dir of ['app','tests'])for(const f of fs.readdirSync(path.join(__dirname,'..',dir)).filter(f=>f.endsWith('tests.cjs'))){const p=spawnSync(process.execPath,[path.join(__dirname,'..',dir,f)],{stdio:'inherit'});if(p.status!==0)process.exit(p.status||1);}
const scan=spawnSync(process.execPath,[path.join(__dirname,'audit-source.cjs')],{stdio:'inherit'});process.exit(scan.status||0);
