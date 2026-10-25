
'use strict';
const cp=require('node:child_process');
const git=args=>cp.execFileSync('git',args,{encoding:'utf8',maxBuffer:30*1024*1024});
const commits=git(['rev-list','--all']).trim().split(/\r?\n/).filter(Boolean);if(!commits.length)throw Error('No history to audit.');
for(const commit of commits){for(const f of git(['ls-tree','-r','--name-only',commit]).trim().split(/\r?\n/).filter(Boolean)){if(/(?:^|\/)(?:data|backups|userData|node_modules|dist|secrets)\/|(?:\.pfx|\.p12|\.key|\.db|\.sqlite|\.log)$|(?:^|\/)\.env|financial-data|week-by-week-.*\.json/.test(f))throw Error('Forbidden historical file: '+f);const content=git(['show',commit+':'+f]);if(/(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(content))throw Error('Possible historical secret: '+f);}}
console.log('PASS: every file in all '+commits.length+' reachable commits audited for forbidden data paths and secrets.');
