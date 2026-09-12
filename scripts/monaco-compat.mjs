// Explicit, version-locked compatibility repair for bb 0.43.0's bundled File Editor.
// This is a maintenance CLI. The Kujo plugin never imports or runs it.
import {readFile,writeFile,rename,stat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
const root=process.argv[2];
const mode=process.argv[3]||'--check';
if(!root||!['--check','--apply','--restore'].includes(mode)) throw new Error('Usage: node scripts/monaco-compat.mjs /path/to/builtin-plugins/monaco-editor [--check|--apply|--restore]');
const file=join(resolve(root),'dist/app.js');
const backup=file+'.kujo-original';
const originalHash='e11a0d305e104a607e4416b8e3ee5ba851906c4f2018de0f168c8fa0d1d615e2';
const old='l.current?.getModel()?.dispose(),l.current?.dispose(),l.current=null';
const fix='(()=>{const m=l.current?.getModel();l.current?.dispose();l.current=null;m?.dispose()})()';
const hash=s=>createHash('sha256').update(s).digest('hex');
const current=await readFile(file,'utf8');
const original=current.includes(fix)?current.replace(fix,old):current;
if(hash(original)!==originalHash) throw new Error('Unrecognized bb editor build. Nothing changed; review compatibility before applying.');
const patched=current!==original;
if(mode==='--check') console.log(patched?'Verified compatible editor: fix applied.':'Verified bb 0.43.0 editor: disposal fix available.');
else if((mode==='--apply'&&patched)||(mode==='--restore'&&!patched)) console.log('Already in the requested state.');
else {
 let next;
 if(mode==='--apply') {
  try { await writeFile(backup,original,{flag:'wx',mode:(await stat(file)).mode}); }
  catch(error) { if(error.code!=='EEXIST'||hash(await readFile(backup,'utf8'))!==originalHash) throw error; }
  next=original.replace(old,fix);
 } else {
  next=await readFile(backup,'utf8');
  if(hash(next)!==originalHash) throw new Error('Backup checksum mismatch. Nothing changed.');
 }
 const temp=file+'.kujo-next';
 await writeFile(temp,next,{flag:'wx',mode:(await stat(file)).mode});
 await rename(temp,file);
 console.log(mode==='--apply'?'Applied verified disposal-order repair. Reload monaco-editor.':'Restored original editor. Reload monaco-editor.');
}
