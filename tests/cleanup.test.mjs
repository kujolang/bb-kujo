import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onDispose } from '../src/cleanup.ts';
test('abort and returned disposer release once and remove abort listener',()=>{
 const controller=new AbortController(); let count=0;
 const dispose=onDispose(controller.signal,()=>count++);
 controller.abort(); dispose(); dispose(); assert.equal(count,1);
});
test('pre-aborted generation releases immediately',()=>{
 let count=0; const c=new AbortController(); c.abort();
 const dispose=onDispose(c.signal,()=>count++); dispose(); assert.equal(count,1);
});
