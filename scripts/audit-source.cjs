
'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');const root=path.resolve(__dirname,'..');
const allowed=f=>/^(app\/(?:[\w-]+\.js|[\w-]*tests\.cjs|index\.html|style\.css)|desktop\/[\w-]+\.cjs|scripts\/[\w-]+\.cjs|tests\/[\w-]+\.cjs|\.github\/workflows\/[\w-]+\.yml|package(?:-lock)?\.json|release-config\.json|\.gitignore|[A-Z][\w-]*\.md)$/.test(f);
let files;try{files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);}catch{files=[];const walk=d=>{for(const x of fs.readdirSync(path.join(root,d),{withFileTypes:true})){const f=d?d+'/'+x.name:x.name;if(['node_modules','dist','.git'].includes(x.name))continue;x.isDirectory()?walk(f):files.push(f);}};walk('');}
for(const f of files){if(!allowed(f))throw Error('Unexpected file in source set: '+f);const text=fs.readFileSync(path.join(root,f),'utf8');if(/(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(text))throw Error('Possible secret in '+f);if(/financial-data.*\.json$|week-by-week-.*\.json$|\.pfx$|\.env/.test(f))throw Error('Sensitive file cannot enter source: '+f);}
console.log('PASS: source allowlist and secret-pattern audit ('+files.length+' files).');
