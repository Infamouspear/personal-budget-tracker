
'use strict';
const {build,Platform,Arch}=require('electron-builder'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');process.chdir(root);const release=process.argv[2]==='release',pkg=require('../package.json'),cfg=require('../release-config.json');const version=!release&&process.env.BUDGET_TEST_VERSION||pkg.version;
if(!/^\d+\.\d+\.\d+$/.test(version))throw Error('Use stable semantic versioning (major.minor.patch).');
if(release&&(!cfg.updatesEnabled||!cfg.publisherName||!cfg.owner||!cfg.repo||!process.env.CSC_LINK||!process.env.CSC_KEY_PASSWORD))throw Error('Signed release requires configured owner/repo/publisher, enabled updates, CSC_LINK and CSC_KEY_PASSWORD. No unsigned release will be published.');
execFileSync(process.execPath,['scripts/test.cjs'],{stdio:'inherit'});
const config={appId:'com.weekbyweek.budget',productName:'Week by Week Budget',asar:true,forceCodeSigning:release,compression:'normal',directories:{output:version===pkg.version?'dist':'artifacts/upgrade-build'},files:['app/*.js','app/index.html','app/style.css','desktop/*.cjs','release-config.json','package.json'],extraMetadata:{version},afterPack:path.join(root,'scripts/fuses.cjs'),win:{target:['nsis'],verifyUpdateCodeSignature:true,...(cfg.publisherName?{publisherName:cfg.publisherName}:{})},nsis:{oneClick:false,perMachine:false,allowToChangeInstallationDirectory:true,deleteAppDataOnUninstall:false,createDesktopShortcut:true,createStartMenuShortcut:true,runAfterFinish:false,artifactName:'Week-by-Week-Budget-Setup-${version}.${ext}'},...(release?{publish:[{provider:'github',owner:cfg.owner,repo:cfg.repo,private:cfg.private,releaseType:'draft'}]}:{})};
// Test artifacts cannot enable unsigned updates even if release configuration has been populated.
if(!release){config.extraMetadata.desktopTestBuild=true;config.win.signExecutable=false;}
build({targets:Platform.WINDOWS.createTarget(['nsis'],Arch.x64),config,publish:'never'}).then(paths=>{console.log('Windows artifacts built:');for(const p of paths)console.log(p);}).catch(e=>{console.error(e.message);process.exitCode=1;});
