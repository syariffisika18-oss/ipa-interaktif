import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE="http://127.0.0.1:4173";
const OUT="qa-artifacts";
fs.mkdirSync(OUT,{recursive:true});
const results=[];

function fail(msg){throw new Error(msg)}
async function click(page,selector,index=0){
  const loc=page.locator(selector).nth(index);
  await loc.waitFor({state:"attached",timeout:8000});
  await loc.evaluate(el=>el.click());
  await page.waitForTimeout(25);
}
async function clickIfEnabled(page,selector){
  const loc=page.locator(selector);
  if(await loc.count()===0)return false;
  const enabled=await loc.evaluate(el=>!el.disabled);
  if(enabled){await loc.evaluate(el=>el.click());await page.waitForTimeout(25);return true}
  return false;
}
async function footerState(page,selector){
  const loc=page.locator(selector);
  await loc.waitFor({state:"attached",timeout:8000});
  return await loc.evaluate(el=>({
    hidden:getComputedStyle(el).display==="none"||el.classList.contains("is-context-hidden")||el.getAttribute("aria-hidden")==="true",
    cls:el.className,
    aria:el.getAttribute("aria-hidden"),
    display:getComputedStyle(el).display
  }));
}
async function expectFooter(page,selector,visible,label){
  await page.waitForTimeout(60);
  const s=await footerState(page,selector);
  if(visible===s.hidden)fail(label+" | expected footer "+(visible?"visible":"hidden")+" but got "+JSON.stringify(s));
}
async function goto(page,url){
  await page.goto(BASE+url,{waitUntil:"networkidle",timeout:30000});
  await page.waitForTimeout(100);
}
async function stage(page,selector){await click(page,selector)}
async function loopToLast(page,nextSelector,max=50){
  for(let i=0;i<max;i++){
    const loc=page.locator(nextSelector);
    if(await loc.count()===0)break;
    if(await loc.evaluate(el=>el.disabled))break;
    await loc.evaluate(el=>el.click());
    await page.waitForTimeout(20);
  }
}
async function answerCellCases(page){
  const total=await page.locator("#caseTabs [data-case]").count();
  for(let i=0;i<total;i++){
    await click(page,'#caseTabs [data-case="'+i+'"]');
    await click(page,"#caseOrganOpts [data-case-organ]",0);
    await click(page,"#lockCaseOrgan");
    await clickIfEnabled(page,"#lockCaseOrgan");
    await click(page,"#caseReasonOpts [data-case-reason]",0);
    await click(page,"#lockCaseReason");
    await clickIfEnabled(page,"#lockCaseReason");
    if(i===1)await expectFooter(page,".bottom-nav",false,"Sel Elaborate 2/5 must remain hidden");
  }
}
async function answerCellEval(page){
  const total=Number((await page.locator("#evalProgress").innerText()).match(/\/\s*(\d+)/)?.[1]||10);
  for(let i=0;i<total;i++){
    await click(page,"#evalOptions button",0);
    await click(page,"#lockEval");
    if(i===total-1)await expectFooter(page,".bottom-nav",false,"Sel Evaluate before final result");
    await click(page,"#nextEval");
  }
}
async function testSel(page){
  await goto(page,"/kelas-8/sel/");
  await expectFooter(page,".bottom-nav",false,"Sel initial");
  await stage(page,'[data-stage="2"]');
  await expectFooter(page,".bottom-nav",false,"Sel Explore before prediction");
  await click(page,"#magnificationOptions button",0);
  await click(page,"#lockMagnification");
  await expectFooter(page,".bottom-nav",true,"Sel Explore after prediction");
  await stage(page,'[data-stage="3"]');
  await click(page,'#cellExplainTabs [data-cell-page="3"]');
  await expectFooter(page,".bottom-nav",false,"Sel Explain before all compare cards");
  const compareCount=await page.locator("#compareButtons [data-compare]").count();
  for(let i=0;i<compareCount;i++)await click(page,"#compareButtons [data-compare]",i);
  await expectFooter(page,".bottom-nav",true,"Sel Explain after 9/9 compare");
  await stage(page,'[data-stage="4"]');
  await expectFooter(page,".bottom-nav",false,"Sel Elaborate initial");
  await answerCellCases(page);
  await expectFooter(page,".bottom-nav",true,"Sel Elaborate after all 5 cases");
  await stage(page,'[data-stage="5"]');
  await expectFooter(page,".bottom-nav",false,"Sel Evaluate initial");
  await answerCellEval(page);
  await expectFooter(page,".bottom-nav",true,"Sel Evaluate after final result");
}
async function completeDigestOrientation(page){
  const keys=await page.locator(".nutrient-slot").evaluateAll(xs=>xs.map(x=>x.dataset.correctNutrient));
  for(const key of keys){
    await page.locator('.relation-card[data-card-type="food"][data-correct-nutrient="'+key+'"]').evaluate(el=>el.click());
    await page.locator('.nutrient-slot[data-correct-nutrient="'+key+'"]').locator("..").locator('.food-slot').evaluate(el=>el.click());
    await page.locator('.relation-card[data-card-type="function"][data-correct-nutrient="'+key+'"]').evaluate(el=>el.click());
    await page.locator('.nutrient-slot[data-correct-nutrient="'+key+'"]').locator("..").locator('.function-slot').evaluate(el=>el.click());
  }
  await click(page,"#checkNutrientGame");
}
async function finalizeTwice(page,optionSelector,lockSelector){
  await click(page,optionSelector,0);
  await click(page,lockSelector);
  await clickIfEnabled(page,lockSelector);
}
async function finishHotsCases(page){
  const n=await page.locator("#hotsCaseTabs [data-hots-case]").count();
  for(let i=0;i<n;i++){
    await click(page,'#hotsCaseTabs [data-hots-case="'+i+'"]');
    const ev=page.locator("#hotsCasePanel [data-hots-evidence]");
    const evn=await ev.count();
    for(let k=0;k<Math.min(2,evn);k++)await ev.nth(k).evaluate(el=>el.click());
    await click(page,'#hotsCasePanel [data-hots-submit="evidence"]');
    await clickIfEnabled(page,'#hotsCasePanel [data-hots-submit="evidence"]');
    await click(page,"#hotsCasePanel [data-hots-mechanism]",0);
    await click(page,'#hotsCasePanel [data-hots-submit="mechanism"]');
    await clickIfEnabled(page,'#hotsCasePanel [data-hots-submit="mechanism"]');
    await click(page,"#hotsCasePanel [data-hots-transfer]",0);
    await click(page,'#hotsCasePanel [data-hots-submit="transfer"]');
    await clickIfEnabled(page,'#hotsCasePanel [data-hots-submit="transfer"]');
  }
}
async function testDigest(page){
  await goto(page,"/kelas-8/sistem-pencernaan/");
  await expectFooter(page,".bottom-nav",false,"Digest Orientasi initial");
  await completeDigestOrientation(page);
  await expectFooter(page,".bottom-nav",true,"Digest Orientasi 7/7");
  await stage(page,'[data-stage="1"]');
  await expectFooter(page,".bottom-nav",false,"Digest Engage before prediction");
  await click(page,"#predictionOptions [data-prediction]",0);
  await expectFooter(page,".bottom-nav",true,"Digest Engage after prediction");
  await stage(page,'[data-stage="2"]');
  await expectFooter(page,".bottom-nav",false,"Digest Explore initial");
  const organs=await page.locator("#organRoute [data-organ]").count();
  for(let i=0;i<organs;i++)await click(page,"#organRoute [data-organ]",i);
  await click(page,"#checkPrediction");
  await expectFooter(page,".bottom-nav",true,"Digest Explore after all organs + check prediction");
  await stage(page,'[data-stage="3"]');
  await expectFooter(page,".bottom-nav",false,"Digest Explain initial");
  await click(page,'.explain-page-tab',1);
  const models=await page.locator("#modelTabs [data-model]").count();
  for(let i=0;i<models;i++)await click(page,"#modelTabs [data-model]",i);
  await click(page,'.explain-page-tab',2);
  const nutrients=await page.locator("#nutrientTabs [data-nutrient]").count();
  for(let i=0;i<nutrients;i++)await click(page,"#nutrientTabs [data-nutrient]",i);
  console.log("DEBUG digest explain",await page.evaluate(()=>({hook:window.IPA_STAGE_COMPLETE_CHECK?.(3),pages:[...document.querySelectorAll(".explain-page-tab")].map(b=>({a:b.classList.contains("is-active"),v:b.classList.contains("is-viewed"),t:b.textContent.trim()})),models:[...document.querySelectorAll("#modelTabs [data-model]")].map(b=>({v:b.classList.contains("is-viewed"),t:b.textContent.trim()})),nutrients:[...document.querySelectorAll("#nutrientTabs [data-nutrient]")].map(b=>({v:b.classList.contains("is-viewed"),t:b.textContent.trim()})),activeStage:document.querySelector(".stage-tab.is-active")?.dataset.stage,footer:document.querySelector(".bottom-nav")?.className})));
  await expectFooter(page,".bottom-nav",true,"Digest Explain fully viewed");
  await stage(page,'[data-stage="4"]');
  await expectFooter(page,".bottom-nav",false,"Digest Elaborate initial");
  await click(page,'.elab-tab[data-elab="0"]');
  const rows=await page.locator("#pathwayChallenge [data-pathway-row]").count();
  for(let i=0;i<rows;i++)await page.locator("#pathwayChallenge [data-pathway-row]").nth(i).locator("[data-pathway-opt]").first().evaluate(el=>el.click());
  await click(page,"#checkPathwayChallenge");
  await clickIfEnabled(page,"#checkPathwayChallenge");
  await finalizeTwice(page,"#absorptionOptions [data-absorb]","#checkAbsorption");
  await click(page,'.elab-tab[data-elab="1"]');
  await finishHotsCases(page);
  await expectFooter(page,".bottom-nav",false,"Digest Elaborate before Uji Model finalization");
  await click(page,'.elab-tab[data-elab="2"]');
  await finalizeTwice(page,"#modelErrorOptions [data-model-error]","#checkModelError");
  await finalizeTwice(page,"#modelCorrectionOptions [data-correction]","#checkModelCorrection");
  await finalizeTwice(page,"#bileOptions [data-bile]","#checkBilePrediction");
  await expectFooter(page,".bottom-nav",true,"Digest Elaborate all work complete");
  await stage(page,'[data-stage="5"]');
  await expectFooter(page,".bottom-nav",false,"Digest Evaluate initial");
  const total=Number((await page.locator("#evalProgress").innerText()).match(/dari\s+(\d+)/)?.[1]||20);
  for(let i=0;i<total;i++){
    await click(page,"#evalOptions button",0);
    if(i===total-1)await expectFooter(page,".bottom-nav",false,"Digest Evaluate before final completion click");
    await click(page,"#evalNext");
  }
  await expectFooter(page,".bottom-nav",true,"Digest Evaluate completed");
}
async function answerElectricElaborate(page){
  const qs=page.locator("[data-elab-question]");
  const n=await qs.count();
  for(let i=0;i<n;i++){
    const q=qs.nth(i);
    const correctA=q.locator('[data-elab-answer][data-correct="true"]').first();
    await correctA.evaluate(el=>el.click());
    const correctR=q.locator('[data-elab-reason][data-correct="true"]').first();
    await correctR.evaluate(el=>el.click());
    await page.waitForTimeout(20);
  }
  await page.locator("#fadeRt").fill("18");
  await page.locator("#fadeI").fill("0.67");
  await click(page,"#checkFading");
}
async function testElectric(page){
  await goto(page,"/kelas-9/listrik-dinamis/");
  await expectFooter(page,".u-bottom-nav",false,"Electric Orientasi initial");
  const diags=page.locator("[data-diagnostic]");
  for(let i=0;i<await diags.count();i++)await diags.nth(i).locator("button").first().evaluate(el=>el.click());
  await expectFooter(page,".u-bottom-nav",true,"Electric Orientasi answered");
  await stage(page,'[data-u-stage="1"]');
  await expectFooter(page,".u-bottom-nav",false,"Electric Engage initial");
  await click(page,'[data-prediction="lain-tetap"]');
  await expectFooter(page,".u-bottom-nav",true,"Electric Engage predicted");
  await stage(page,'[data-u-stage="2"]');
  await expectFooter(page,".u-bottom-nav",false,"Electric Explore initial");
  await click(page,"#startPredictionTest");
  await click(page,"#removeBtn");
  await click(page,'[data-prediction-compare="sesuai"]');
  await click(page,'[data-prediction-evidence="lain-tetap"]');
  await click(page,"#checkPredictionResult");
  await loopToLast(page,'[data-nav-for="concrete"] .stage-next');
  console.log("DEBUG electric explore",await page.evaluate(()=>({hook:window.LISTRIK_CONTENT_COMPLETE?.(2),status:document.getElementById("predictionStatus")?.textContent,slides:[...document.querySelectorAll('[data-stage-group="concrete"] .stage-slide')].map(x=>x.className),activeStage:document.querySelector(".u-stage-tab.active")?.dataset.uStage,refresh:typeof window.refreshLearningFooter,footer:document.querySelector(".u-bottom-nav")?.className})));
  await expectFooter(page,".u-bottom-nav",true,"Electric Explore prediction checked + last slide");
  await stage(page,'[data-u-stage="3"]');
  await expectFooter(page,".u-bottom-nav",false,"Electric Explain initial");
  await loopToLast(page,'[data-nav-for="explain"] .stage-next');
  await expectFooter(page,".u-bottom-nav",true,"Electric Explain last slide");
  await stage(page,'[data-u-stage="4"]');
  await expectFooter(page,".u-bottom-nav",false,"Electric Elaborate initial");
  await answerElectricElaborate(page);
  await loopToLast(page,'[data-nav-for="elaborate"] .stage-next');
  await expectFooter(page,".u-bottom-nav",true,"Electric Elaborate all questions + last slide");
  await stage(page,'[data-u-stage="5"]');
  await expectFooter(page,".u-bottom-nav",false,"Electric Evaluate initial");
  const total=Number((await page.locator("#quizCount").innerText()).split("/")[1]||1);
  for(let i=0;i<total;i++){
    await click(page,"#quizBox .option",0);
    if(i<total-1)await click(page,'[data-nav-for="quiz"] .stage-next');
  }
  await expectFooter(page,".u-bottom-nav",true,"Electric Evaluate all questions");
}
function parseMathTitle(title){
  let m=title.match(/Kalikan\s+([\d.,]+)\s*[×x]\s*([\d.,]+)/i);
  if(m)return Number(m[1].replace(",","."))*Number(m[2].replace(",","."));
  m=title.match(/([\d.,]+)\s*[−-]\s*([\d.,]+)/);
  if(m)return Number(m[1].replace(",","."))-Number(m[2].replace(",","."));
  m=title.match(/Bagi\s+([\d.,]+)\s+dengan\s+([\d.,]+)/i);
  if(m)return Math.floor(Number(m[1].replace(",","."))/Number(m[2].replace(",",".")));
  return null;
}
async function finishDivisionPractice(page,prefix){
  const isEval=prefix==="eval";
  const countId=isEval?"#evalCount":"#practiceCount";
  const stepTitle=isEval?"#evalStepTitle":"#practiceStepTitle";
  const stepNext=isEval?"#evalStepNext":"#practiceStepNext";
  const nextProblem=isEval?"#evalNextProblem":"#practiceNextProblem";
  for(let guard=0;guard<300;guard++){
    const nextProb=page.locator(nextProblem);
    const nextProbVisible=await nextProb.isVisible().catch(()=>false);
    if(nextProbVisible){
      const txt=(await nextProb.innerText()).trim();
      if(isEval && /Selesaikan evaluasi/i.test(txt)){await nextProb.evaluate(el=>el.click());return}
      if(!isEval && /Ulangi latihan/i.test(txt))return;
      await nextProb.evaluate(el=>el.click());await page.waitForTimeout(15);continue;
    }
    const action=page.locator(isEval?"#evalActionBtn":"#practiceActionBtn");
    if(await action.count() && await action.isVisible()){await action.evaluate(el=>el.click())}
    else if(!isEval && await page.locator("#practiceMultiples .multiple-grid button").count()){
      const buttons=page.locator("#practiceMultiples .multiple-grid button");
      const vals=await buttons.evaluateAll(xs=>xs.map(x=>Number(x.dataset.value)));
      const head=await page.locator("#practiceMultiples .multiple-head span").innerText();
      const target=Number(head.match(/≤\s*(\d+)/)?.[1]);
      let best=-Infinity,idx=0;
      vals.forEach((v,i)=>{if(v<=target&&v>best){best=v;idx=i}});
      await buttons.nth(idx).evaluate(el=>el.click());
    }else{
      const input=page.locator(isEval?"#evalStepAnswer":"#practiceStepAnswer");
      if(await input.count()){
        const title=await page.locator(stepTitle).innerText();
        const value=parseMathTitle(title);
        if(value===null)fail("Cannot parse division step title: "+title);
        await input.fill(String(value).replace(".",","));
        await click(page,isEval?"#evalStepCheck":"#practiceStepCheck");
      }else fail("No recognized division control at "+await page.locator(countId).innerText());
    }
    const next=page.locator(stepNext);
    if(await next.count() && !(await next.evaluate(el=>el.disabled)) && await next.isVisible()){
      await next.evaluate(el=>el.click());await page.waitForTimeout(15);
    }
  }
  fail("Division loop guard exceeded");
}
async function testDivision(page){
  await goto(page,"/materi-pendukung/pembagian-bersusun/");
  await expectFooter(page,".bottom-nav",false,"Division diagnostic initial");
  await click(page,"#diagChoices button",0);
  await expectFooter(page,".bottom-nav",true,"Division diagnostic answered");
  await stage(page,'[data-stage="1"]');
  await expectFooter(page,".bottom-nav",true,"Division static stage 2");
  await stage(page,'[data-stage="2"]');
  await expectFooter(page,".bottom-nav",false,"Division multiples initial");
  const btns=page.locator("#multipleGrid .multiple-item");
  const vals=await btns.evaluateAll(xs=>xs.map(x=>Number(x.dataset.value)));
  let idx=0,best=-Infinity;vals.forEach((v,i)=>{if(v<=240&&v>best){best=v;idx=i}});
  await btns.nth(idx).evaluate(el=>el.click());
  await expectFooter(page,".bottom-nav",true,"Division multiples correct");
  await stage(page,'[data-stage="3"]');
  await expectFooter(page,".bottom-nav",false,"Division process initial");
  const total=Number(await page.locator("#processTotal").innerText());
  for(let i=1;i<total;i++)await click(page,"#processNext");
  await expectFooter(page,".bottom-nav",true,"Division process final step");
  await stage(page,'[data-stage="4"]');
  await expectFooter(page,".bottom-nav",false,"Division practice initial");
  await finishDivisionPractice(page,"practice");
  await expectFooter(page,".bottom-nav",true,"Division practice all problems");
  await stage(page,'[data-stage="5"]');
  await expectFooter(page,".bottom-nav",false,"Division evaluation initial");
  await finishDivisionPractice(page,"eval");
  await expectFooter(page,".bottom-nav",true,"Division evaluation mastery");
}
async function testTemplate(page){
  await goto(page,"/template-universal/");
  await expectFooter(page,".bottom-nav",false,"Template orientation initial");
  await click(page,"[data-demo-feedback]");
  await expectFooter(page,".bottom-nav",true,"Template orientation interaction");
  await stage(page,'[data-stage="1"]');await expectFooter(page,".bottom-nav",false,"Template engage initial");
  await click(page,".engage-panel .choice",0);await expectFooter(page,".bottom-nav",true,"Template engage choice");
  await stage(page,'[data-stage="2"]');await expectFooter(page,".bottom-nav",false,"Template explore initial");
  await page.locator("#demoSlider").evaluate(el=>{el.value=String(Number(el.value)+1);el.dispatchEvent(new Event("input",{bubbles:true}))});
  await expectFooter(page,".bottom-nav",true,"Template explore input");
  await stage(page,'[data-stage="3"]');await expectFooter(page,".bottom-nav",true,"Template explain single page");
  await stage(page,'[data-stage="4"]');await expectFooter(page,".bottom-nav",true,"Template elaborate default strategy");
  await stage(page,'[data-stage="5"]');await expectFooter(page,".bottom-nav",false,"Template evaluate initial");
  await click(page,"[data-answer]",0);await expectFooter(page,".bottom-nav",true,"Template evaluate answered");
  await stage(page,'[data-stage="6"]');await expectFooter(page,".bottom-nav",true,"Template reflect single page");
}

const suites=[
  ["sel",testSel],
  ["digest",testDigest],
  ["electric",testElectric],
  ["division",testDivision],
  ["template",testTemplate]
];
const viewports=[
  ["desktop",{width:1280,height:900}],
  ["mobile",{width:390,height:844}]
];

const browser=await chromium.launch({headless:true});
for(const [vpName,viewport] of viewports){
  for(const [suiteName,suite] of suites){
    const context=await browser.newContext({viewport});
    const page=await context.newPage();
    const pageErrors=[];
    page.on("pageerror",e=>pageErrors.push(String(e)));
    const name=vpName+"-"+suiteName;
    const started=Date.now();
    try{
      await suite(page);
      if(pageErrors.length)fail("Page errors: "+pageErrors.join(" | "));
      results.push({name,status:"PASS",ms:Date.now()-started});
      console.log("PASS",name);
    }catch(error){
      const shot=path.join(OUT,name+".png");
      try{await page.screenshot({path:shot,fullPage:true})}catch{}
      results.push({name,status:"FAIL",ms:Date.now()-started,error:String(error?.stack||error),screenshot:shot,pageErrors});
      console.error("FAIL",name,error);
    }finally{
      await context.close();
    }
  }
}
await browser.close();
fs.writeFileSync(path.join(OUT,"qa-results.json"),JSON.stringify(results,null,2));
const failed=results.filter(x=>x.status==="FAIL");
console.log(JSON.stringify({total:results.length,passed:results.length-failed.length,failed:failed.length},null,2));
if(failed.length)process.exitCode=1;
