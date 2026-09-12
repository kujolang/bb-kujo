import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.BB_SERVER_URL;
if(!base) throw new Error('Set BB_SERVER_URL to an isolated bb instance.');
const mode=process.env.BB_QA_APPEARANCE||'dark';
assert.ok(['dark','light'].includes(mode));
const prefix=mode==='light'?'light-':'';
const browser=await chromium.launch({channel:process.env.KUJO_BROWSER||'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 await page.addInitScript(mode=>localStorage.setItem('bb.theme',mode),mode);
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.locator('.bb-kujo-signal').waitFor({state:'attached'});
 await page.waitForTimeout(8000);
 await mkdir('screenshots',{recursive:true});
 const states=[];
 for(const [phase,time] of [['still',0],['signal',8830]]) {
  const n=await page.evaluate(time=>{const a=document.getAnimations().filter(a=>a.animationName==='kujo-background-signal');a.forEach(a=>{a.pause();a.currentTime=time;});return a.length;},time);
  assert.ok(n>0);await page.waitForTimeout(100);
  states.push(await page.locator('#root-compose-main-panel').evaluate(e=>({transform:getComputedStyle(e,'::after').transform,opacity:getComputedStyle(e,'::after').opacity})));
  await page.screenshot({path:`screenshots/${prefix}background-${phase}.png`});
 }
 assert.notDeepEqual(states[0],states[1]);
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('#root-compose-main-panel').evaluate(e=>getComputedStyle(e,'::after').animationName),'none');
 assert.notEqual(await page.locator('#root-compose-main-panel').evaluate(e=>getComputedStyle(e,'::before').backgroundImage),'none');
 await page.screenshot({path:`screenshots/${prefix}background-reduced-motion.png`});
 await mkdir('artifacts',{recursive:true});
 await writeFile(`artifacts/${prefix}signature-qa.json`,JSON.stringify({date:new Date().toISOString(),states,reducedMotion:true,brand:await page.locator('[data-sidebar=sidebar] > .shrink-0').first().evaluate(e=>getComputedStyle(e,'::before').content)},null,2)+'\n');
} finally {await browser.close();}
