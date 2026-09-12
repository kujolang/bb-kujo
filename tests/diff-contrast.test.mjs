import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { rgb, blend, hex, contrast } from '../scripts/diff-contrast.mjs';
const css=await readFile(new URL('../themes/tokens.css',import.meta.url),'utf8');
for(const mode of ['dark','light']) test(`${mode} syntax remains AA on colored diff and merge surfaces`,async()=>{
 const suffix=mode==='light'?'-light':'';
 const p=JSON.parse(await readFile(new URL(`../themes/palette${suffix}.json`,import.meta.url),'utf8'));
 const code=JSON.parse(await readFile(new URL(`../themes/kujo-code${suffix}.json`,import.meta.url),'utf8'));
 const section=css.split(mode==='dark'?':root.dark {':':root:not(.dark) {')[1].split('}')[0];
 const backgrounds=[];
 for(const [role,key] of [['addition','success'],['deletion','danger']]) for(const emphasis of ['', '-emphasis']) {
  const value=section.match(new RegExp(`--diffs-bg-${role}${emphasis}-override: color-mix\\(in srgb, var\\(--kujo-${key}\\) ([\\d.]+)%`));
  assert.ok(value,`${mode}/${role}${emphasis} must declare a color mix`);
  backgrounds.push([`Pierre ${role}${emphasis}`,blend(p[key],p.canvas,Number(value[1])/100)]);
 }
 const over=(value,bg)=>blend(value,hex(bg),parseInt(value.slice(7)||'ff',16)/255);
 for(const role of ['inserted','removed']) {
  const line=over(code.colors[`diffEditor.${role}LineBackground`],rgb(p.canvas));
  backgrounds.push([`Monaco ${role} line`,line]);
  backgrounds.push([`Monaco ${role} text`,over(code.colors[`diffEditor.${role}TextBackground`],line)]);
 }
 for(const role of ['current','incoming']) for(const surface of ['Header','Content'])
  backgrounds.push([`merge ${role}${surface}`,over(code.colors[`merge.${role}${surface}Background`],rgb(p.canvas))]);
 const failures=[];
 for(const token of code.tokenColors) for(const [name,bg] of backgrounds){
  const ratio=contrast(rgb(token.settings.foreground),bg);
  if(ratio<4.5) failures.push(`${token.name||token.scope[0]} on ${name}: ${ratio.toFixed(2)}:1`);
 }
 assert.deepEqual(failures,[]);
});
