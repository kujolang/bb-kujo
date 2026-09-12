import { chromium } from 'playwright';
import { mkdir,writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.BB_SERVER_URL;
const threadId=process.env.BB_QA_THREAD_ID;
if(!base||!threadId) throw new Error('Set BB_SERVER_URL and BB_QA_THREAD_ID to an isolated bb test instance/thread.');
const browser=await chromium.launch({channel:process.env.KUJO_BROWSER||'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push((e.stack || e.message).split('\n').slice(0,16).join('\n')));
 await page.addInitScript(()=>localStorage.setItem('bb.theme','dark'));
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.waitForSelector('.bb-kujo-signal',{state:'attached'});
 await page.evaluate(async({threadId,path})=>{
  const r=await fetch(`/api/v1/threads/${threadId}/open`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({file:{source:'workspace',path,lineNumber:1}})});
  if(!r.ok) throw new Error(await r.text());
 },{threadId,path:process.env.BB_QA_FILE||'src/effects.ts'});
 await page.locator('.monaco-editor .view-lines').first().waitFor({timeout:30000});
 await page.waitForTimeout(4000);
 await page.getByRole('button',{name:'Show in files',exact:true}).click();
 await mkdir('screenshots',{recursive:true});
 await page.screenshot({path:'screenshots/editor-files.png'});
 await page.locator('.monaco-editor .view-lines').first().click({position:{x:150,y:12}});
 await page.keyboard.press(process.platform==='darwin'?'Meta+ArrowDown':'Control+End');
 await page.waitForTimeout(500);
 await page.keyboard.insertText('// KUJOtyping');await page.waitForTimeout(1000);
 const text=()=>page.locator('.monaco-editor').first().innerText().then(t=>t.replaceAll('\u00a0',' '));
 assert.ok((await text()).includes('KUJOtyping'));
 await page.keyboard.press('ControlOrMeta+z');await page.waitForTimeout(1000);
 assert.ok(!(await text()).includes('KUJOtyping'));
 await page.getByRole('button',{name:/Show diff panel/}).click();await page.waitForTimeout(1000);
 const expand=page.getByRole('button',{name:'Expand all files',exact:true});
 if(await expand.isVisible()) {await expand.click();await page.waitForTimeout(1500);}
 await page.screenshot({path:'screenshots/diff.png'});
 await page.getByRole('button',{name:/Open new tab/}).click();
 await page.getByText('Start terminal',{exact:true}).click();
 await page.locator('.xterm-helper-textarea').waitFor({state:'attached'});
 await page.locator('.xterm-helper-textarea').focus();
 await page.keyboard.insertText("printf '\\033[32mKujo terminal ready\\033[0m\\n'");
 await page.keyboard.press('Enter');await page.waitForTimeout(1000);
 await page.screenshot({path:'screenshots/terminal.png'});
 const output=await page.evaluate(async id=>{
  const {sessions}=await(await fetch(`/api/v1/terminals?threadId=${id}`)).json();
  const session=sessions.filter(s=>s.status==='running').sort((a,b)=>b.createdAt-a.createdAt)[0];
  const data=await(await fetch(`/api/v1/terminals/${session.id}/output`)).json();
  return data.chunks.map(c=>atob(c.dataBase64)).join('');
 },threadId);
 assert.ok(output.includes('\x1b[32mKujo terminal ready\x1b[0m'));
 await mkdir('artifacts',{recursive:true});
 await writeFile('artifacts/workspace-qa.json',JSON.stringify({date:new Date().toISOString(),browser:browser.version(),editorTyping:true,editorUndo:true,terminalInputOutput:true,errors},null,2)+'\n');
 assert.deepEqual(errors,[]);
 console.log('Editor typing/undo, terminal input/output and workspace screenshots passed.');
} finally {await browser.close();}
