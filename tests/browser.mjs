import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_URL||'http://127.0.0.1:4176/';
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
await mkdir('work/qa',{recursive:true});const reports=[];
try{
 for(const [width,height] of [[1440,900],[1194,834],[834,1194],[375,812],[812,375]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);assert.equal(await page.locator('[data-word]').count(),127);
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const button of await page.locator('.tabs button').all()){const box=await button.boundingBox();assert(box.width>=44&&box.height>=44);}
  await page.getByRole('button',{name:/错词再练/}).click();assert(await page.getByText('还没有错词').isVisible());
  await page.getByRole('button',{name:'中文默写',exact:true}).click();
  await page.getByRole('button',{name:'检查答案',exact:true}).click();assert(await page.getByText('先写一个答案吧', {exact:false}).isVisible());
  await page.locator('#answer').fill('wrong answer');await page.keyboard.press('Enter');assert(await page.getByText('再记一遍：',{exact:false}).isVisible());
  assert.equal(await page.locator('#wrongCount').textContent(),'1');
  await page.reload();assert.equal(await page.locator('#wrongCount').textContent(),'1');
  await page.getByRole('button',{name:/错词再练/}).click();
  const answer=await page.evaluate(()=>queue[0][0]);
  await page.locator('#answer').fill(answer);await page.keyboard.press('Enter');assert(await page.getByText('✓ 写对啦！',{exact:false}).isVisible());
  assert.equal(await page.locator('#wrongCount').textContent(),'0');
  await page.getByRole('button',{name:'查看本轮成绩'}).click();assert(await page.getByText('这一轮练完啦！').isVisible());
  await page.getByRole('button',{name:/练习错词/}).click();assert(await page.getByText('还没有错词').isVisible());
  await page.getByRole('button',{name:'开始听写',exact:true}).click();assert(await page.getByRole('button',{name:'▶ 播放单词'}).isVisible());
  await page.getByRole('button',{name:'慢一点听'}).click();
  await page.getByRole('button',{name:'还不会，学一下'}).click();assert.equal(await page.locator('#wrongCount').textContent(),'1');
  await page.setViewportSize({width:height,height:width});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.getByRole('button',{name:'认一认',exact:true}).click();
  assert.equal(await page.locator('.panel').evaluate(e=>getComputedStyle(e).animationName),'none');
  await page.setViewportSize({width,height});await page.screenshot({path:`work/qa/learn-${width}.png`});
  assert.deepEqual(errors,[]);reports.push({width,height,checks:['127 words','logo','no overflow','44px touch','empty mistakes','blank answer','wrong answer','persistence','correct answer','score','listening controls','rotation','reduced motion']});await context.close();
 }
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}});Object.defineProperty(window,'speechSynthesis',{value:undefined});});
 const page=await blocked.newPage();await page.goto(base);assert(await page.locator('#audioStatus').getByText('当前浏览器无法保存错词',{exact:false}).isVisible());
 await page.getByRole('button',{name:'听写练习',exact:true}).click();await page.getByRole('button',{name:'▶ 播放单词'}).click();assert(await page.getByText('这个浏览器暂时不能发音',{exact:false}).isVisible());
 await page.getByRole('button',{name:'中文默写',exact:true}).click();await page.getByRole('button',{name:'还不会，学一下'}).click();assert.equal(await page.locator('#wrongCount').textContent(),'1');await blocked.close();
 const standalone=await browser.newContext();await standalone.addInitScript(()=>{const original=window.matchMedia.bind(window);window.matchMedia=q=>q==='(display-mode: standalone)'?{matches:true,media:q}:original(q);});const home=await standalone.newPage();await home.goto(base);assert.equal(await home.locator('link[rel="apple-touch-icon"]').count(),1);const manifest=await (await home.request.get(new URL('./manifest.webmanifest',base).href)).json();assert.equal(manifest.display,'standalone');await standalone.close();
 await writeFile('work/qa/report.json',JSON.stringify({physicalDevice:false,actualAudio:false,standalone:'simulated display only',reports,failureChecks:['blocked storage','unavailable speech']},null,2));console.log(`PASS ${reports.length} viewports, exercise flow and failure recovery`);
}finally{await browser.close();}
