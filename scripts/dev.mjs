import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
// Serialized rebuilds; changes during a build trigger one follow-up, never parallel reloads.
let running=false, dirty=false, timer;
async function run(command,args) {
 await new Promise((resolve,reject)=>{ const p=spawn(command,args,{stdio:'inherit'}); p.on('error',reject); p.on('exit',code=>code===0?resolve():reject(new Error(`${command} exited ${code}`))); });
}
async function build() {
 if(running){dirty=true;return;} running=true;
 try { await run(process.execPath,['scripts/generate.mjs']); await run('bb',['plugin','build','.']); await run('bb',['plugin','reload','bb-kujo']); }
 catch(error){console.error(error.message);} finally{running=false;if(dirty){dirty=false;void build();}}
}
for(const path of ['src','themes','assets']) watch(path,{recursive:true},(_,name)=>{
 if(['kujo.css','tokens.css','kujo-code.json'].includes(String(name))) return;
 clearTimeout(timer);timer=setTimeout(build,150);
});
await build();
