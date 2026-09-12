import { chromium } from 'playwright';
import { mkdir,writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const url=process.env.BB_SERVER_URL||'http://127.0.0.1:48896';
const api=(method,path,body)=>{
 const args=['-fsS','--max-time','60','-X',method,'-H','Content-Type: application/json'];
 if(body!==undefined) args.push('--data',JSON.stringify(body));
 args.push(url+'/api/v1'+path);
 return JSON.parse(execFileSync('curl',args,{encoding:'utf8',timeout:65000}));
};
const command=(area,action,id)=>{
 if(area==='theme') {const config=api('GET','/system/config');return api('PUT','/settings/appearance',{themeId:id,faviconColor:config.appearance.faviconColor});}
 return api('POST',action==='reload'?`/plugins/reload?id=${id}`:`/plugins/${id}/${action}`);
};
const browser=await chromium.launch({channel:process.env.KUJO_BROWSER||'chrome',headless:true});
try {
 const context=await browser.newContext({viewport:{width:1600,height:1000}});
 await context.addInitScript(()=>localStorage.setItem('bb.theme','dark'));
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForSelector('.bb-kujo-signal',{state:'attached'});
 await mkdir('screenshots',{recursive:true});await mkdir('artifacts',{recursive:true});
 const shot=async name=>{await page.waitForTimeout(800);await page.screenshot({path:`screenshots/${name}.png`});};
 await page.locator('[data-kujo-icon]').first().waitFor();
 const font=await page.locator('[data-sidebar=sidebar] button').first().evaluate(e=>getComputedStyle(e).fontFamily);
 assert.ok(font.includes('Kujo Departure Mono'));
 assert.ok(await page.evaluate(()=>document.fonts.check('12px \"Kujo Departure Mono\"')));
 await shot('home');
 await page.getByText('Theme Preview',{exact:true}).first().click();
 await page.getByRole('button',{name:'Dark mode',exact:true}).click();
 await page.waitForFunction(()=>getComputedStyle(document.documentElement).getPropertyValue('--kujo-canvas').trim()==='#060606');
 await page.getByRole('button',{name:'Menu',exact:true}).waitFor();
 await page.waitForTimeout(3500);
 await shot('preview-thread');
 for(const name of ['New thread','Split','Settings','Thread']) {
  await page.getByRole('tab',{name,exact:true}).click();await shot(`preview-${name.toLowerCase().replaceAll(' ','-')}`);
 }
 for(const name of ['Menu','Dialog','Popover','Toast']) {
  await page.getByRole('button',{name,exact:true}).click();await shot(name.toLowerCase());await page.keyboard.press('Escape');
  // Dialog cancel also handles custom focus-trap implementations.
  await page.waitForTimeout(500);
 }
 await page.getByRole('button',{name:'Tooltip',exact:true}).hover();await shot('tooltip');await page.mouse.move(5,5);
 await page.getByRole('textbox',{name:'Search threads',exact:true}).fill('kujo');
 await page.getByRole('switch',{name:'Notifications',exact:true}).click();
 await page.getByRole('checkbox',{name:'Include drafts',exact:true}).click();
 await page.keyboard.press('ControlOrMeta+Shift+P');await shot('command-palette');await page.keyboard.press('Escape');
 for(const width of [375,768,1024,2560]) {await page.setViewportSize({width,height:1000});await shot(`viewport-${width}`);}
 await page.setViewportSize({width:1600,height:1000});
 await page.getByRole('button',{name:'Light mode',exact:true}).click();await shot('light-fallback');assert.equal(await page.locator('[data-kujo-icon]').count(),0);
 assert.equal(await page.locator('.bb-kujo-signal').evaluate(e=>getComputedStyle(e).display),'none');
 await page.getByRole('button',{name:'Dark mode',exact:true}).click();
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.bb-kujo-signal > span').evaluate(e=>getComputedStyle(e).animationName),'none');await shot('reduced-motion');
 await page.emulateMedia({reducedMotion:'no-preference'});
 for(let i=0;i<5;i++){command('plugin','reload','bb-kujo');await page.waitForTimeout(1500);assert.equal(await page.locator('.bb-kujo-signal').count(),1);}
 command('theme','set','default');await page.waitForTimeout(1500);assert.equal(await page.locator('[data-kujo-icon]').count(),0);assert.equal(await page.locator('.bb-kujo-signal').evaluate(e=>getComputedStyle(e).display),'none');
 command('theme','set','plugin:bb-kujo:kujo');await page.waitForTimeout(1500);
 command('plugin','disable','bb-kujo');await page.waitForTimeout(1500);assert.equal(await page.locator('[data-kujo-icon]').count(),0);assert.equal(await page.locator('.bb-kujo-signal').count(),0);
 command('plugin','enable','bb-kujo');command('theme','set','plugin:bb-kujo:kujo');await page.waitForTimeout(1500);assert.equal(await page.locator('.bb-kujo-signal').count(),1);
 await writeFile('artifacts/host-qa.json',JSON.stringify({date:new Date().toISOString(),url,browser:browser.version(),errors,reloads:5,unload:true,themeSwitch:true,reducedMotion:true,technicalFont:font,tablerIcons:await page.locator('[data-kujo-icon]').count()},null,2)+'\n');
 console.log(JSON.stringify({errors,reloads:5,unload:true}));
} finally {await browser.close();}
