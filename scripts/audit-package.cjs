
'use strict';
const asar=require('@electron/asar'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const archive=path.join(__dirname,'../dist/win-unpacked/resources/app.asar'),files=asar.listPackage(archive).map(f=>f.replace(/\\/g,'/'));
const metadata=JSON.parse(asar.extractFile(archive,'package.json'));assert.equal(metadata.version,require('../package.json').version);assert.equal(metadata.desktopTestBuild,undefined);assert.equal(metadata.desktopTestDataRoot,undefined);
for(const f of files){if(/(?:^|\/)(?:data|backups|userData|secrets|artifacts)\/|financial-data|\.pfx$|\.db$|\.sqlite$|\.env$|week-by-week-.*\.json$|tests\.cjs$/.test(f))throw Error('Unexpected data/test/secret in package: '+f);}
for(const f of files.filter(f=>/^\/(?:app|desktop)\/.+\.(?:js|cjs|html|css)$/.test(f))){const text=asar.extractFile(archive,f.slice(1)).toString('utf8');if(/gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|-----BEGIN .*PRIVATE KEY-----/.test(text))throw Error('Possible sensitive development content: '+f);}
for(const dir of ['app','desktop'])for(const f of fs.readdirSync(path.join(__dirname,'..',dir)).filter(f=>/\.(?:js|cjs|html|css)$/.test(f))){assert.deepEqual(asar.extractFile(archive,dir+'/'+f),fs.readFileSync(path.join(__dirname,'..',dir,f)));}
console.log('PASS: packaged app has no financial data, backups, tests, or detected secrets; packaged engine matches audited source.');
