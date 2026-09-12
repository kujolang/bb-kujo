import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
export const rgb=hex=>hex.slice(1,7).match(/../g).map(x=>parseInt(x,16));
export const blend=(foreground,background,alpha)=>rgb(foreground).map((v,i)=>v*alpha+rgb(background)[i]*(1-alpha));
export const hex=channels=>'#'+channels.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
export const contrast=(a,b)=>{
 const luminance=channels=>channels.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
};
// This is a focused rendering fixture, not a reconstructed bb screenshot.
if(process.argv[1]?.endsWith('/diff-contrast.mjs')) {
 const stage=process.argv[2]||'after';assert.ok(['before','after'].includes(stage));
 const browser=await chromium.launch({channel:process.env.KUJO_BROWSER||'chrome',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1200,height:540},deviceScaleFactor:2});
  await page.setContent('<html><head></head><body><main><h1>Kujo light // diff contrast fixture</h1><p>Shipped CSS tokens; comment color over inline change emphasis.</p><section><div class="label">REMOVED WORDS</div><code class="removed">// Avoid <mark>layout reads, animation loop</mark> or mutation observers.</code></section><section><div class="label">ADDED WORDS</div><code class="added">// Avoid <mark>forced layouts, timers</mark> or mutation observers.</code></section><p id="result"></p></main></body></html>');
  const css=await readFile(process.env.KUJO_QA_CSS||'themes/kujo.css','utf8');
  await page.addStyleTag({content:css});
  await page.addStyleTag({content:'body{margin:0;background:var(--kujo-canvas);color:var(--kujo-text);font:16px sans-serif}main{padding:36px}h1{font-size:24px}.label{font:12px monospace;margin:28px 0 10px}code{display:block;padding:20px;font:16px "Kujo Departure Mono";color:var(--kujo-text-faint)}mark{color:inherit}.removed{background:var(--diffs-bg-deletion-override)}.added{background:var(--diffs-bg-addition-override)}.removed mark{background:var(--diffs-bg-deletion-emphasis-override)}.added mark{background:var(--diffs-bg-addition-emphasis-override)}#result{margin-top:32px}'});
  await page.evaluate(()=>document.fonts.ready);
  const samples=await page.locator('mark').evaluateAll(nodes=>nodes.map(n=>({text:n.textContent,foreground:getComputedStyle(n).color,background:getComputedStyle(n).backgroundColor})));
  // Canvas resolves CSS color-mix into sRGB bytes without guessing its serialization.
  const colors=await page.evaluate(samples=>samples.map(s=>{const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');const read=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3);};return {...s,fg:read(s.foreground),bg:read(s.background)};}),samples);
  const report=colors.map(s=>({...s,ratio:contrast(s.fg,s.bg)}));
  await page.locator('#result').evaluate((n,report)=>n.textContent=report.map((s,i)=>`${i?'Added':'Removed'} comment: ${s.ratio.toFixed(2)}:1 ${s.ratio>=4.5?'PASS':'FAIL'} (AA requires 4.5:1)`).join(' · '),report);
  await mkdir('docs/bug-sweep',{recursive:true});
  await page.screenshot({path:`docs/bug-sweep/diff-${stage}.png`});
  await writeFile(`docs/bug-sweep/diff-${stage}.json`,JSON.stringify({kind:'Focused CSS fixture, not a bb app screenshot',browser:browser.version(),cssSha256:createHash('sha256').update(css).digest('hex'),samples:report},null,2)+'\n');
  if(stage==='after') for(const sample of report)assert.ok(sample.ratio>=4.5);
  console.log(report.map(s=>s.ratio));
 } finally {await browser.close();}
}
