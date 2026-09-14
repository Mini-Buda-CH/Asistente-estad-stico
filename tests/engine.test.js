const fs=require('fs'),vm=require('vm'),assert=require('assert');
global.window=global;
vm.runInThisContext(fs.readFileSync(__dirname+'/../assets/schema.js','utf8'));
vm.runInThisContext(fs.readFileSync(__dirname+'/../assets/engine.js','utf8'));
const base={
    title:'Caso',
    field:'education',
    projectLevel:'master',
    evidenceSource:'primary',
    unit:'estudiantes',
    researchQuestion:'¿Cuál es el resultado?',
    purpose:'describe',
    evidenceNature:'numeric',
    estimand:'estimate',
    hypothesis:'no',
    intervention:'none',
    observationalDesign:'cross',
    time:'one',
    population:'complete',
    populationN:'1000',
    confidence:'95',
    margin:'5',
    expectedP:'50',
    responseRate:'90',
    representation:'generalize',
    clustering:'independent',
    outcome:'binary',
    instrument:'survey',
    instrumentStatus:'validated',
    primaryOutcome:'prevalencia',
    missing:'low',groups:'none',effectMeasure:'proportion',vizGoal:'compare',software:'r',constraints:'none',humans:'yes',vulnerable:'no',sensitive:'no',ethicsStatus:'planned'};
let p=MethodEngine.plan({...base});assert.equal(p.status,'Ruta suficientemente especificada');assert(p.analysis.primary.join(' ').includes('proporción'));assert(p.sampling.quant.join(' ').includes('proporción'));
p=MethodEngine.plan({...base,outcome:'timeevent',groups:'model',effectMeasure:'survival'});assert(p.analysis.primary.join(' ').includes('Kaplan'));
p=MethodEngine.plan({...base,clustering:'repeated',groups:'manyrep',outcome:'continuous',effectMeasure:'mean'});assert(p.analysis.primary.join(' ').includes('mixto'));
p=MethodEngine.plan({...base,evidenceNature:'qualitative',purpose:'understand',estimand:'themes',qualAim:'experience',qualSampling:'criterion',instrument:'interview',primaryOutcome:'experiencia',vizGoal:'themes',software:'qual',constraints:'time',humans:'yes',vulnerable:'no',sensitive:'possibly',ethicsStatus:'planned'});assert.equal(p.framework.design,'Fenomenológico');assert(p.sampling.qual.length>0);assert.equal(p.sampling.quant.length,0);
p=MethodEngine.plan({...base,evidenceNature:'qualitative',purpose:'understand',estimand:'difference',qualAim:'themes',qualSampling:'criterion'});assert(p.conflicts.some(x=>x.level==='block'));assert.equal(p.status,'Información insuficiente');
p=MethodEngine.plan({...base,evidenceNature:'mixed',purpose:'understand',estimand:'integration',mixedOrder:'parallel',qualAim:'themes',qualSampling:'variation'});assert(p.framework.design.includes('convergente'));assert(p.analysis.primary.join(' ').includes('Integrar'));
p=MethodEngine.plan({...base,clustering:'independent',groups:'manyrep'});assert(p.conflicts.some(x=>x.level==='block'));
console.log('7 casos metodológicos superados.');
