(()=>{
    const S=MethodSchema,E=MethodEngine,Store=MethodStorage,$=s=>document.querySelector(s);
    let state={
        schemaVersion:S.version,
        step:0,
        answers:{},
        updatedAt:new Date().toISOString()
    },lastPlan=null;
    const loaded=Store.load();
    if(loaded&&loaded.schemaVersion===S.version)state=loaded;
function esc(x){
    return String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))
}
function save(){
    state.updatedAt=new Date().toISOString();
    const ok=Store.save(state);
    $('#saveStatus').textContent=ok?'Autoguardado local':'Sesión sin persistencia';
    $('#saveDetail').textContent=ok?'Puedes continuar después en este dispositivo.':'El navegador bloqueó el almacenamiento; exporta JSON para conservar el proyecto.'
}
function activeStepQs(i){
    return S.steps[i].questions.filter(q=>!q.appliesIf||q.appliesIf(state.answers))
}
function renderSteps(){
    const extra=['Revisión','Resultado'];
    $('#stepList').innerHTML=[...S.steps.map(s=>s.title),...extra].map((t,i)=>`<li class="${i===state.step?'active':''} ${i<state.step?'done':''}"><span>${i<state.step?'✓':String(i+1).padStart(2,'0')}</span>${t}</li>`).join('')
}
function render(){
    E.clean(state.answers);
    save();
    hideViews();
    $('#quizForm').hidden=false;
    const s=S.steps[state.step],pct=Math.round(state.step/(S.steps.length+1)*100);
    $('#stepLabel').textContent=`Paso ${state.step+1} de ${S.steps.length}`;
    $('#stepTitle').textContent=s.title;
    $('#percent').textContent=pct+'%';
    $('#progressBar').style.width=pct+'%';
    $('#progress').setAttribute('aria-valuenow',pct);
    $('#questions').innerHTML=activeStepQs(state.step).map(renderQ).join('');
    $('#backBtn').disabled=state.step===0;
    $('#nextBtn').textContent=state.step===S.steps.length-1?'Revisar respuestas →':'Siguiente →';
    document.querySelectorAll('input,textarea').forEach(el=>el.addEventListener('change',capture));
    renderSteps();
    focusHeading()
}
function renderQ(q){
    const req=q.required?'<span class="required" aria-hidden="true"> *</span>':'';
    if(['text','textarea','number'].includes(q.type)){
        const tag=q.type==='textarea'?'textarea':'input',type=q.type==='number'?' type="number"':'',val=esc(state.answers[q.id]||''),attrs=`id="${q.id}" name="${q.id}" class="text-input" ${type} ${q.min?`min="${q.min}"`:''} ${q.required?'aria-required="true"':''} ${q.help?`aria-describedby="${q.id}-help"`:''}`;
        return`<div class="question" id="field-${q.id}"><label for="${q.id}"><h3>${q.label}${req}</h3></label>${q.help?`<p class="help" id="${q.id}-help">${q.help}</p>`:''}${tag==='textarea'?`<textarea ${attrs} placeholder="${esc(q.placeholder||'')}">${val}</textarea>`:`<input ${attrs} value="${val}" placeholder="${esc(q.placeholder||'')}">`}<p class="field-error" id="${q.id}-error" hidden></p></div>`
    }
    return`<fieldset class="question" id="field-${q.id}" ${q.help?`aria-describedby="${q.id}-help"`:''}><legend>${q.label}${req}</legend>${q.help?`<p class="help" id="${q.id}-help">${q.help}</p>`:''}<div class="options">${q.options.map(([v,l])=>`<div class="option"><input type="radio" id="${q.id}-${v}" name="${q.id}" value="${v}" ${state.answers[q.id]===v?'checked':''}><label for="${q.id}-${v}">${l}</label></div>`).join('')}</div><p class="field-error" id="${q.id}-error" hidden></p></fieldset>`
}
function capture(e){
    state.answers[e.target.name]=e.target.value;
    E.clean(state.answers);
    save()
}
function captureText(){
    document.querySelectorAll('.text-input').forEach(e=>state.answers[e.name]=e.value.trim());
    E.clean(state.answers);
    save()
}
function validate(){
    captureText();
    const miss=E.missingForStep(S.steps[state.step],state.answers);
    document.querySelectorAll('.question').forEach(x=>x.classList.remove('invalid'));
    document.querySelectorAll('.field-error').forEach(x=>x.hidden=true);
    if(!miss.length){$('#errorSummary').hidden=true;
        return true}$('#errorSummary').innerHTML=`<b>Revisa ${miss.length} ${miss.length===1?'respuesta':'respuestas'}:</b><ul>${miss.map(q=>`<li><a href="#field-${q.id}">${q.label}</a></li>`).join('')}</ul>`;
        $('#errorSummary').hidden=false;
        miss.forEach(q=>{
            const f=$(`#field-${q.id}`),e=$(`#${q.id}-error`);
            f.classList.add('invalid');
            e.textContent='Selecciona o escribe una respuesta.';
            e.hidden=false;
            f.querySelector('input,textarea')?.setAttribute('aria-invalid','true')
        });
        $('#errorSummary').focus();
        return false
}
$('#quizForm').addEventListener('submit',e=>{
    e.preventDefault();
    if(!validate())return;
    if(state.step<S.steps.length-1){
        state.step++;render()
    }
    else showReview()
});
$('#backBtn').onclick=()=>{
    captureText();
    if(state.step){
        state.step--;
        render()
    }
};
function hideViews(){
    ['#quizForm','#review','#results'].forEach(x=>$(x).hidden=true);
    $('#globalMessage').hidden=true
}
function setTop(label,title,pct){
    $('#stepLabel').textContent=label;
    $('#stepTitle').textContent=title;
    $('#percent').textContent=pct+'%';
    $('#progressBar').style.width=pct+'%';
    $('#progress').setAttribute('aria-valuenow',pct);
    renderSteps();
    focusHeading()
}
function focusHeading(){
    setTimeout(()=>$('#stepTitle').focus({preventScroll:true}),0);
    window.scrollTo({
        top:$('#app').offsetTop-15,
        behavior:'smooth'
    })
}
function showReview(){
    captureText();
    hideViews();
    state.step=S.steps.length;
    save();
    $('#review').hidden=false;
    setTop('Verificación','Revisión',88);
    const c=E.completion(state.answers),cf=E.conflicts(state.answers);
    $('#reviewCompletion').textContent=c.percent+'%';
    $('#conflicts').innerHTML=cf.length?`<div class="notice ${cf.some(x=>x.level==='block')?'critical':''}"><b>Compatibilidad:</b><ul>${cf.map(x=>`<li>${x.text}</li>`).join('')}</ul></div>`:`<div class="notice"><b>Compatibilidad:</b> No se detectaron contradicciones lógicas con las reglas actuales.</div>`;
    $('#reviewSections').innerHTML=S.steps.map((s,i)=>`<article class="result-card"><button type="button" aria-expanded="true" aria-controls="review-${s.id}"><span>${s.title}</span><span>−</span></button><div class="content" id="review-${s.id}">${s.questions.filter(q=>(!q.appliesIf||q.appliesIf(state.answers))&&state.answers[q.id]).map(q=>`<div class="review-row"><b>${q.label}</b><span>${esc(q.options?S.labelFor(q.id,state.answers[q.id]):state.answers[q.id])}</span><button type="button" data-step="${i}">Cambiar</button></div>`).join('')}</div></article>`).join('');
    bindAccordions();
    document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{
        state.step=Number(b.dataset.step);
        render()
    });
    $('#generateBtn').disabled=cf.some(x=>x.level==='block')||c.percent<100
}
$('#reviewBackBtn').onclick=()=>{
    state.step=S.steps.length-1;
    render()};
    $('#generateBtn').onclick=showResults;
function showResults(){
    hideViews();
    state.step=S.steps.length+1;
    save();
    lastPlan=E.plan(state.answers);
    $('#results').hidden=false;
    setTop('Diagnóstico completo','Resultados',100);
    $('#resultTitle').textContent=state.answers.title||'Plan recomendado';
    $('#resultSubtitle').textContent=`${lastPlan.framework.approach} · ${lastPlan.framework.scope} · ${lastPlan.framework.design}`;
    $('#completionScore').textContent=lastPlan.completion.percent+'%';
    $('#statusNotice').className='notice '+(lastPlan.status==='Información insuficiente'?'critical':'');
    $('#statusNotice').innerHTML=`<b>${lastPlan.status}.</b> Esta salida es educativa y provisional. Distingue lo declarado, inferido y pendiente; valida con asesoría académica, literatura disciplinar y revisión ética.`;
    const p=lastPlan,L=x=>x.length?`<ul>${x.map(v=>`<li>${esc(v)}</li>`).join('')}</ul>`:'<p>No aplica o falta información.</p>';
    const cards=[
        ['Trazabilidad y compatibilidad',`<h4>Declarado</h4><p>Pregunta: ${esc(state.answers.researchQuestion)}</p><p>Resultado/fenómeno: ${esc(state.answers.primaryOutcome)}</p><h4>Estado de reglas</h4>${L(p.conflicts.map(x=>x.text))}`],
        ['Marco metodológico',`<span class="tag">${p.framework.approach}</span><span class="tag">${p.framework.scope}</span><h4>Diseño inferido</h4><p>${esc(p.framework.design)}</p>`],
        ['Muestra cuantitativa',L(p.sampling.quant)],
        ['Muestra cualitativa',L(p.sampling.qual)],
        ['Medición y calidad',L(p.measurement)],
        ['Análisis principal',`${L(p.analysis.primary)}<h4>Medidas a reportar</h4>${L(p.analysis.effect)}<h4>Supuestos y sensibilidad</h4>${L(p.analysis.assumptions)}`],
        ['Visualización',L(p.visualization)],
        ['Ética y gestión de datos',L(p.ethics)],
        ['Guías de reporte',`${L(p.guidelines)}<p>Las guías ayudan a reportar; no sustituyen la calidad del diseño.</p>`]
    ];
    $('#resultCards').innerHTML=cards.map((c,i)=>`<article class="result-card"><button type="button" aria-expanded="${i<2}" aria-controls="card-${i}"><span>${c[0]}</span><span>${i<2?'−':'+'}</span></button><div class="content" id="card-${i}" ${i<2?'':'hidden'}>${c[1]}</div></article>`).join('');
    bindAccordions()
}
function bindAccordions(){
    document.querySelectorAll('.result-card>button').forEach(b=>b.onclick=()=>{
        const c=document.getElementById(b.getAttribute('aria-controls'));
        c.hidden=!c.hidden;
        b.lastElementChild.textContent=c.hidden?'+':'−';
        b.setAttribute('aria-expanded',String(!c.hidden))
    })
}
$('#editBtn').onclick=()=>{
    state.step=0;render()};
    $('#newBtn').onclick=()=>{
        if(confirm('¿Borrar respuestas y comenzar un proyecto nuevo?')){
            Store.clear();
            state={
                schemaVersion:S.version,
                step:0,
                answers:{},
                updatedAt:new Date().toISOString()
            };
            render()
        }
    }
    ;$('#mdBtn').onclick=()=>MethodExport.markdown(state.answers,lastPlan||E.plan(state.answers));
    $('#jsonBtn').onclick=()=>MethodExport.json(state);
    $('#printBtn').onclick=()=>window.print();
    $('#importInput').onchange=async e=>{
        try{
            const data=JSON.parse(await e.target.files[0].text());
            if(data.schemaVersion!==S.version||!data.answers)throw Error();
            state=data;
            state.step=0;
            render();
            announce('Proyecto importado correctamente.')
        }
        catch{
            announce('No se pudo importar: archivo incompatible o dañado.',true)
        }
        e.target.value=''
    };
function announce(t,bad=false){
    $('#globalMessage').textContent=t;
    $('#globalMessage').className='notice '+(bad?'critical':'');
    $('#globalMessage').hidden=false
}
$('#themeBtn').onclick=()=>{
    document.body.classList.toggle('dark');
    try{
        localStorage.setItem('metodoguia-theme',document.body.classList.contains('dark')?'dark':'light')
    }
    catch{}
};
try{
    document.body.classList.toggle('dark',localStorage.getItem('metodoguia-theme')==='dark')
}
catch{}
$('#demoBtn').onclick=()=>{
    state={
        schemaVersion:S.version,
        step:0,
        updatedAt:new Date().toISOString(),
        answers:{
            title:'Factores asociados al desempeño académico',
            field:'education',
            projectLevel:'master',
            evidenceSource:'primary',
            unit:'estudiantes de secundaria pública',
            researchQuestion:'¿Qué factores se asocian con el desempeño académico de estudiantes agrupados en escuelas públicas?',
            purpose:'associate',
            evidenceNature:'numeric',
            estimand:'association',
            hypothesis:'confirmatory',
            intervention:'none',
            observationalDesign:'cross',
            time:'one',
            population:'groups',
            representation:'generalize',
            clustering:'clustered',
            populationN:'5000',
            outcome:'continuous',
            instrument:'survey',
            instrumentStatus:'adapt',
            primaryOutcome:'puntaje de desempeño académico',
            missing:'moderate',
            groups:'model',
            effectMeasure:'correlation',
            vizGoal:'relationship',
            software:'python',
            constraints:'time',
            humans:'yes',
            vulnerable:'yes',
            sensitive:'possibly',
            ethicsStatus:'planned'
        }
    };
    render();
    location.hash='app'
};
$('#year').textContent=new Date().getFullYear();
render();
})();
