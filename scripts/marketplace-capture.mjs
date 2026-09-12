import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.BB_SERVER_URL;
const thread=process.env.BB_MARKETPLACE_THREAD_ID;
if(!base || !thread) throw new Error('Set BB_SERVER_URL and BB_MARKETPLACE_THREAD_ID to an isolated bb instance and a public-safe completed thread.');
const browser=await chromium.launch({channel:process.env.KUJO_BROWSER||'chrome',headless:true});
try {
 const context=await browser.newContext({viewport:{width:1440,height:960},deviceScaleFactor:2});
 await context.addInitScript(()=>localStorage.setItem('bb.theme','dark'));
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.locator('[data-kujo-icon]').first().waitFor();
 await page.getByText('New thread',{exact:true}).first().click();
 await page.waitForTimeout(8000);
 await page.locator('#root-compose-main-panel').click({position:{x:400,y:450}});
 await mkdir('submission/screenshots/bb-kujo',{recursive:true});
 const shot=name=>page.screenshot({path:`submission/screenshots/bb-kujo/${name}.png`});
 await shot('01-dark-workspace');
 await page.getByText('Theme Preview',{exact:true}).first().click();
 await page.getByRole('button',{name:'Light mode',exact:true}).click();
 await page.getByText('New thread',{exact:true}).first().click();
 await page.waitForFunction(()=>getComputedStyle(document.documentElement).getPropertyValue('--kujo-canvas').trim()==='#f9f9f9');
 await page.waitForTimeout(600);
 await page.locator('#root-compose-main-panel').click({position:{x:400,y:450}});
 await shot('02-light-workspace');
 await page.evaluate(async id=>{
  const r=await fetch(`/api/v1/threads/${id}/open`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({file:null})});
  if(!r.ok) throw new Error(await r.text());
 },thread);
 await page.evaluate(()=>{localStorage.setItem('bb.theme','dark');});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForTimeout(6000);
 await shot('03-thread');
 assert.deepEqual(errors,[]);
 await mkdir('artifacts',{recursive:true});
 await writeFile('artifacts/marketplace-capture.json',JSON.stringify({date:new Date().toISOString(),browser:browser.version(),viewport:{width:1440,height:960},deviceScaleFactor:2,thread,errors},null,2)+'\n');
} finally {await browser.close();}
