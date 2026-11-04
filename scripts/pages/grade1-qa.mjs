import assert from 'node:assert/strict';
import path from 'node:path';
import { root, read } from './common.mjs';
export async function grade1QA(page, base, viewport) {
 const catalog=read('src/grade1/catalog.json'),cases=[];
 await page.goto(base+'/');
 await page.getByRole('button',{name:/^Toán tư duy 1/}).click();
 await page.waitForURL('**/lop-1');
 await page.locator('.g1-stage').last().waitFor();
 assert.equal(await page.locator('.g1-stage').count(),14);
 assert.equal(await page.getByText('PREVIEW',{exact:true}).count(),0);
 assert.equal(await page.getByText('DEMO',{exact:true}).count(),0);
 const overview=await measure(page);
 await page.screenshot({path:path.join(root,'qa-results/grade1-stages-'+viewport.width+'x'+viewport.height+'.png')});
 for(const stage of catalog.stages){
  await page.getByRole('link',{name:'Mở chặng '+stage.id+': '+stage.titleVi,exact:true}).click();
  await page.waitForURL('**/lop-1#chang/'+stage.id);
  const lessons=stage.lessonIds.map(id=>catalog.lessons.find(l=>l.id===id));
  assert.deepEqual(await page.locator('.g1-lesson h3').allTextContents(),lessons.map(l=>l.titleVi));
  assert.deepEqual(await page.locator('.g1-lesson-en').allTextContents(),lessons.map(l=>l.titleEn));
  assert.deepEqual(await page.locator('.g1-lesson-code').allTextContents(),lessons.map(l=>l.displayCode));
  assert.deepEqual(await page.locator('.g1-lesson .g1-status').allTextContents(),lessons.map(()=> 'Sắp ra mắt'));
  assert.equal(await page.locator('.g1-lesson a,.g1-lesson button,iframe').count(),0);
  cases.push({stage:stage.id,lessonCount:lessons.length,...await measure(page)});
  if(stage.id==='07')await page.screenshot({path:path.join(root,'qa-results/grade1-lessons-'+viewport.width+'x'+viewport.height+'.png')});
  await page.getByRole('link',{name:'Quay lại các chặng',exact:true}).click();
  await page.waitForURL('**/lop-1');assert.equal(await page.locator('.g1-stage').count(),14);
 }
 await page.goto(base+'/lop-1/#chang/07');await page.locator('.g1-lesson').last().waitFor();assert.equal(await page.locator('.g1-lesson').count(),5);
 await page.reload();await page.locator('.g1-lesson').last().waitFor();assert.equal(await page.locator('.g1-lesson').count(),5);
 await page.getByRole('link',{name:'Quay lại các chặng',exact:true}).click();await page.goBack();await page.locator('.g1-lesson').last().waitFor();await page.goForward();await page.locator('.g1-stage').last().waitFor();
 await page.getByRole('button',{name:'Light Path - Trang chủ',exact:true}).click();await page.waitForURL(base+'/');
 assert.equal(await page.locator('.program-card').count(),7);
 return {viewport,status:'PASS',overview,stages:cases,sourceLessonCount:cases.reduce((sum,c)=>sum+c.lessonCount,0),htmlLinks:0};
}
async function measure(page){
 const result=await page.evaluate(()=>{const issues=[];for(const card of document.querySelectorAll('.g1-stage,.g1-lesson')){const b=card.getBoundingClientRect();for(const el of card.querySelectorAll('h3,p,.g1-icon,.g1-status,.g1-card-bottom')){const r=el.getBoundingClientRect();if(r.left<b.left-1||r.right>b.right+1||r.bottom>b.bottom+1)issues.push(el.textContent)}const h=card.querySelector('h3'),en=card.querySelector('.g1-stage-en,.g1-lesson-en');if(h&&en&&h.getBoundingClientRect().bottom>en.getBoundingClientRect().top+1)issues.push('overlap')}return{width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth+1,issues}});
 assert.equal(result.overflow,false,'Grade 1 horizontal overflow');assert.deepEqual(result.issues,[],'Grade 1 content clipping/overlap');return result;
}
