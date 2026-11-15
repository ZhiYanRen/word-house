import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
test('imported word list and script are intact',async()=>{
 const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
 const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
 const list=JSON.parse(script.match(/const words=(\[.*?\]);/s)[1]);
 assert.equal(list.length,127);assert.equal(new Set(list.map(w=>w[0])).size,127);
 assert(list.every(w=>w.length===3&&w.every(s=>typeof s==='string'&&s.length)));
 assert(!/https?:\/\//.test(html),'no external runtime resources');
 assert.match(html,/prefers-reduced-motion/);
});
test('home screen paths stay within Pages project',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../public/manifest.webmanifest',import.meta.url),'utf8'));
 assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');
 for(const icon of manifest.icons)assert(icon.src.startsWith('./assets/'));
});
