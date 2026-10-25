
'use strict';
const fs=require('node:fs'),path=require('node:path'),V=require('../desktop/verification.cjs'),cfg=require('../release-config.json');
(async()=>{const dir=path.resolve(process.argv[2]||'dist'),envelope=JSON.parse(fs.readFileSync(path.join(dir,'release-manifest.json'))),version=envelope.manifest.version;const manifest=V.verifyManifest(envelope,cfg.updatePublicKey,version,'0.0.0');await V.verifyInstaller(path.join(dir,manifest.artifact.name),manifest);console.log('PASS: release manifest signature and exact installer content match the embedded update key.');})().catch(()=>{console.error('Release authentication verification failed. Do not publish.');process.exitCode=1;});
