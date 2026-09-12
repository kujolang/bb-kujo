import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.BB_SERVER_URL;
if(!base) throw new Error('Set BB_SERVER_URL to an isolated bb instance with Kujo and an authenticated Codex provider.');
const model=process.env.BB_VIDEO_MODEL||'5.5';
const out=process.env.BB_VIDEO_DIR||'artifacts/walkthrough';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1000},recordVideo:{dir:out,size:{width:1600,height:1000}},colorScheme:'dark'});
await context.addInitScript(()=>localStorage.setItem('bb.theme','dark'));
const page=await context.newPage();page.setDefaultTimeout(60000);
const events=[];const errors=[];const start=Date.now();
const mark=event=>{events.push({seconds:(Date.now()-start)/1000,event});console.log(event);};
page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto(base,{waitUntil:'domcontentloaded'});mark('Open bb');
 await page.getByRole('textbox',{name:/^Ask anything\./}).waitFor();
 await page.waitForFunction(()=>document.querySelector('[data-kujo-icon]'));
 await page.waitForTimeout(8000);
 await page.getByRole('button',{name:'New thread (⇧ ⌘ O)',exact:true}).click();mark('New chat');
 await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'Project: Work in a project',exact:true}).click();
 await page.getByRole('option',{name:'bb-kujo',exact:true}).click();await page.keyboard.press('Escape');mark('Select bb-kujo project');
 await page.waitForTimeout(1200);
 await page.getByRole('button',{name:'Provider, model and reasoning (⇧ ⌘ M)',exact:true}).click();
 await page.getByRole('button',{name:'Codex',exact:true}).click();
 await page.getByRole('option',{name:model,exact:true}).click();
 // The picker may close on model selection; Escape closes its reasoning section if retained.
 await page.keyboard.press('Escape');mark(`Select Codex ${model}`);
 await page.waitForTimeout(1500);
 const prompt='Describe the new bb-kujo theme in this workspace. Read README.md and themes/palette-light.json for context, then give a concise overview of its Kujo/SiteKit design, light and dark modes, Departure Mono, Tabler icons, and subtle background glitch effect. Use a short heading and 5 brief bullets, under 160 words. This is a read-only walkthrough: do not modify files, commit, push, or invoke any memory workflow.';
 const input=page.getByRole('textbox',{name:/^Ask anything\./});await input.click();await input.pressSequentially(prompt,{delay:24});
 await page.waitForTimeout(2000);mark('Submit real prompt');await page.keyboard.press('Enter');
 await page.waitForURL(/\/threads\//,{timeout:90000});mark('Thread opened');
 await writeFile(`${out}/thread-url.txt`,page.url()+'\n');
 // Observe real app state. Never substitute response text or accelerate the recording.
 for(let i=0;i<48;i++) {
  await page.waitForTimeout(5000);
  const snapshot=await page.locator('body').ariaSnapshot();
  await writeFile(`${out}/latest-state.txt`,snapshot);
  console.log(`Observe ${i}: ${snapshot.slice(-500).replaceAll('\n',' ')}`);
  assert.doesNotMatch(snapshot,/Command thread.start failed|failed to load configuration|Retry by sending a follow-up message/);
  if(/Stop|Interrupt/.test(snapshot)) mark(i===0?'Model working':'Model still working');
  if(i>2 && (snapshot.match(/button "Copy message"/g)||[]).length>=2 && /Ask for a follow-up/.test(snapshot) && !/button "(?:Stop|Interrupt)/.test(snapshot)) {mark('Response complete');break;}
  if(i===47) throw new Error('Timed out waiting for the real model response; inspect latest-state.txt.');
 }
 await page.waitForTimeout(5000);
 await page.screenshot({path:`${out}/response.png`});
 await writeFile(`${out}/response-state.txt`,await page.locator('body').ariaSnapshot());
 assert.deepEqual(errors,[]);
 mark('Recording complete');
} finally {
 await writeFile(`${out}/recording.json`,JSON.stringify({date:new Date().toISOString(),model,browser:browser.version(),viewport:{width:1600,height:1000},events,errors},null,2)+'\n');
 await context.close();
 await page.video().saveAs(`${out}/bb-kujo-walkthrough.webm`);
 await browser.close();
}
