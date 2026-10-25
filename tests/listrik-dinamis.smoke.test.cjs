// Jalankan: node --test tests/listrik-dinamis.smoke.test.cjs
// Uji regresi ringan tanpa dependensi eksternal/browser.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = path.resolve(__dirname, '../kelas-9/listrik-dinamis');
const read = name => fs.readFileSync(path.join(dir,name), 'utf8');
const html = read('index.html');
const css = read('style.css');
const moduleCode = read('module.js');
const cpaCode = read('cpa.js');

test('JavaScript module dan simulasi lolos pemeriksaan sintaks', () => {
  assert.doesNotThrow(() => new vm.Script(moduleCode, {filename:'module.js'}));
  assert.doesNotThrow(() => new vm.Script(cpaCode, {filename:'cpa.js'}));
});

test('HTML punya identitas unik dan semua elemen yang diperlukan tersedia', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(new Set(ids).size, ids.length);
  const used = new Set([...moduleCode.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g),
    ...cpaCode.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g)].map(x=>x[1]));
  for(const id of used)assert.ok(ids.includes(id), 'ID tidak ditemukan: '+id);
});

test('Bank kuis memiliki 20 soal mandiri, kunci valid, dan pembahasan', () => {
  const start=cpaCode.indexOf('const quizData = [');
  const end=cpaCode.indexOf('function shuffleArray', start);
  assert.ok(start>=0&&end>start);
  const quiz=new Function(cpaCode.slice(start,end)+'return quizData;')();
  assert.equal(quiz.length,20);
  for(const [i,q] of quiz.entries()){
    assert.equal(q.a.length,4,'Pilihan '+(i+1));
    assert.ok(Number.isInteger(q.c)&&q.c>=0&&q.c<4,'Kunci '+(i+1));
    assert.ok(q.f.length>20,'Umpan balik '+(i+1));
    assert.doesNotMatch(q.q,/soal sebelumnya/i);
  }
});

test('Perhitungan listrik seri dan paralel sesuai sumber ideal dan hambatan tetap', () => {
  const start=cpaCode.indexOf('function metrics(){');
  const end=cpaCode.indexOf('function brightnessRatio(){',start);
  assert.ok(start>=0&&end>start);
  function evaluate(state){
    return new Function('const state='+JSON.stringify(state)+';'+cpaCode.slice(start,end)+'return metrics();')();
  }
  const model={type:'series',bulbs:2,V:6,R:10,on:true,removed:false};
  assert.equal(evaluate(model).Rt,20);
  assert.equal(evaluate(model).It,.3);
  const p=evaluate({...model,type:'parallel',bulbs:3});
  assert.ok(Math.abs(p.Rt-10/3)<1e-9);
  assert.ok(Math.abs(p.It-1.8)<1e-9);
  const missing=evaluate({...model,type:'parallel',bulbs:3,removed:true});
  assert.equal(missing.Rt,5);
  assert.ok(Math.abs(missing.It-1.2)<1e-9);
  assert.equal(evaluate({...model,removed:true}).It,0);
  assert.equal(evaluate({...model,on:false}).It,0);
});

test('Explore dan Evaluate punya bukti belajar serta kondisi navigasi yang konsisten', () => {
  assert.match(html,/id="observationRows"/);
  assert.match(html,/id="observationConclusion"/);
  assert.match(html,/id="learningEvidenceSummary"/);
  assert.match(cpaCode,/window\.isListrikExploreDataComplete/);
  assert.match(cpaCode,/const teacherMode=document\.body\.dataset\.learningMode==='guru'/);
  assert.match(cpaCode,/window\.getListrikQuizEvidence=quizEvidence/);
  assert.match(cpaCode,/saveQuiz\(\)/);
  assert.match(moduleCode,/quizCorrect:String\(snap\.quizCorrect\)/);
  assert.match(css,/\.explore-panel #concrete \.stage-slide:not\(\.active\)\{display:none!important\}/);
});
