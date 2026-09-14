window.MethodEngine=(()=>{
    const S=()=>window.MethodSchema;
const activeQuestions=a=>S().steps.flatMap(s=>s.questions.filter(q=>!q.appliesIf||q.appliesIf(a)));
function completion(a){
    const q=activeQuestions(a).filter(x=>x.required),done=q.filter(x=>String(a[x.id]??'').trim()).length;
    return{
        done,total:q.length,percent:q.length?Math.round(done/q.length*100):0
    }
}
function missingForStep(step,a){
    return step.questions.filter(q=>(!q.appliesIf||q.appliesIf(a))&&q.required&&!String(a[q.id]??'').trim())
}
function clean(a){
    let changed=true;
    while(changed){
        changed=false;
        const active=new Set(activeQuestions(a).map(q=>q.id));
        Object.keys(a).forEach(k=>{if(!active.has(k)&&k!=='title'){
            delete a[k];
            changed=true
        }})
    }
    return a
}
function conflicts(a){
    const x=[];
    if(a.evidenceNature==='qualitative'&&['difference','association','causal','prediction'].includes(a.estimand))x.push({
        level:'block',
        text:'El producto seleccionado requiere evidencia cuantitativa, pero el enfoque declarado es cualitativo.'
    });
    if(a.purpose==='cause'&&['none','na'].includes(a.intervention))x.push({
        level:'warn',
        text:'Un objetivo causal con diseño observacional necesita una estrategia explícita de identificación y control de confusión; no basta una asociación.'
    });
    if(a.purpose==='predict'&&a.estimand!=='prediction')x.push({
        level:'warn',
        text:'El propósito predictivo debería corresponder con predicciones para casos nuevos.'
        
        });
    if(a.evidenceNature==='mixed'&&a.mixedOrder==='unknown')x.push({
        level:'block',
        text:'Un estudio mixto necesita definir secuencia, prioridad e integración antes de recomendar una ruta completa.'
        });
    if(a.clustering==='independent'&&['twopair','manyrep'].includes(a.groups))x.push({
        level:'block',
        text:'Las mediciones pareadas o repetidas no son independientes. Corrige la estructura de dependencia.'
    });
    if(a.outcome==='timeevent'&&a.effectMeasure!=='survival'&&a.effectMeasure!=='unknown')x.push({
        level:'warn',
        text:'Un resultado de tiempo hasta evento suele requerir una medida de supervivencia compatible.'
    });
    if(a.purpose==='measure'&&!['survey','tests','observation'].includes(a.instrument))x.push({
        level:'warn',
        text:'La validación requiere identificar claramente el instrumento o procedimiento de medición.'
    });
    if(a.evidenceNature==='unknown'||a.estimand==='unknown'||a.outcome==='unknown'||a.groups==='unknown'||a.clustering==='unknown')x.push({
        level:'info',
        text:'Hay decisiones esenciales sin definir; la ruta estadística será provisional.'
    });
    return x
}
function approach(a){
    if(a.evidenceNature==='mixed')return'Mixto';
    if(a.evidenceNature==='qualitative')return'Cualitativo';
    if(a.evidenceNature==='numeric')return'Cuantitativo';
    return'Por definir'
}
function scope(a){
    return({
        explore:'Exploratorio',
        describe:'Descriptivo/estimativo',
        compare:'Comparativo',
        associate:'Analítico asociativo',
        cause:'Explicativo/causal',
        predict:'Predictivo',
        measure:'Desarrollo o evaluación de medición',
        understand:'Interpretativo/comprensivo'
    })[a.purpose]||'Por definir'
}
function qualitativeDesign(a){
    return({
        experience:'Fenomenológico',
        case:'Estudio de caso',
        process:'Teoría fundamentada',
        culture:'Etnográfico',
        themes:'Análisis temático o cualitativo descriptivo',
        discourse:'Análisis narrativo, de discurso o documental',
        unknown:'Diseño cualitativo por definir'
    })[a.qualAim]||'No aplica'
}
function quantitativeDesign(a){
    if(a.intervention==='random')return'Experimental aleatorizado';
    if(a.intervention==='nonrandom')return'Cuasiexperimental';
    if(a.intervention==='single')return'Preexperimental de un grupo; inferencia causal limitada';
    return({
        cross:'Observacional transversal',
        cohort:'Cohorte',
        casecontrol:'Casos y controles',
        ecological:'Ecológico',
        timeseries:'Serie temporal',
        diagnostic:'Exactitud diagnóstica',
        unknown:'Observacional por definir'
    })[a.observationalDesign]||(a.time==='retrospective'?'Observacional retrospectivo':'Observacional')
}
function design(a){
    if(a.evidenceNature==='mixed'){
        const m=({
            parallel:'convergente',
            quantqual:'explicativo secuencial CUAN → CUAL',
            qualquant:'exploratorio secuencial CUAL → CUAN',
            embedded:'incrustado',
            unknown:'por definir'
        })[a.mixedOrder];
        return`Diseño mixto ${m}; componente CUAN: ${quantitativeDesign(a)}; componente CUAL: ${qualitativeDesign(a)}`
    }
    return a.evidenceNature==='qualitative'?qualitativeDesign(a):quantitativeDesign(a)
}
function sampling(a){
    const q=[],qual=[];
    if(a.evidenceNature!=='qualitative'){
        if(a.population==='census')q.push('Censo de la población accesible; documentar cobertura y no respuesta.');
        else if(a.population==='complete'&&a.representation==='subgroups')q.push('Muestreo probabilístico estratificado, con afijación justificada.');
        else if(a.population==='groups')q.push('Muestreo por conglomerados o multietápico; incorporar pesos y efecto de diseño.');
        else if(a.population==='complete')q.push('Muestreo aleatorio simple o sistemático, verificando periodicidad.');
        else if(a.population==='none')q.push('Muestreo no probabilístico: limitar inferencia poblacional y describir sesgo de selección.');
        else q.push('Estrategia cuantitativa pendiente de definir.');
        if(a.outcome==='binary'&&a.groups==='none'){
    const z={
        90:1.644853626951,95:1.95996398454,99:2.575829303549
    }[a.confidence],e=Number(a.margin)/100,p=Number(a.expectedP)/100,r=Number(a.responseRate)/100,N=Number(a.populationN),deff=a.clustering==='clustered'?Number(a.designEffect):1;
    if(z&&e>0&&p>0&&p<1&&r>0&&r<=1&&deff>=1){
        const n0=z*z*p*(1-p)/(e*e),nf=N>1?n0/(1+(n0-1)/N):n0,n=Math.ceil(nf*deff/r);
        q.push(`Tamaño orientativo para estimar la proporción: n = ${n} unidades contactadas (n₀=${Math.ceil(n0)}, corrección finita=${N>1?Math.ceil(nf):'no aplicada'}, DEFF=${deff}, respuesta=${Math.round(r*100)}%). Verificar redondeo, elegibilidad y supuestos.`)
    }
    else q.push('No se calculó n: completa parámetros válidos de confianza, precisión, proporción, respuesta y efecto de diseño.');
        }
    else q.push('Calcular potencia o precisión para el resultado, estimando y modelo principal; documentar efecto mínimo relevante, alfa, potencia, pérdidas y estructura.');
    if(['clustered','repeated'].includes(a.clustering))q.push('Ajustar el tamaño por correlación intraclase/medidas y número efectivo de conglomerados o unidades.');
    }
    if(['qualitative','mixed'].includes(a.evidenceNature)){
        qual.push(( {
            criterion:'Muestreo intencional por criterios',
            variation:'Máxima variación',
            theoretical:'Muestreo teórico iterativo',
            case:'Selección de caso(s) delimitado(s)',
            snowball:'Bola de nieve con análisis de sesgos',
            unknown:'Selección cualitativa por definir'
        })[a.qualSampling]+'.');qual.push('Justificar suficiencia mediante poder informativo: amplitud del objetivo, especificidad, teoría, calidad del diálogo y estrategia analítica; no usar un número universal.');
    }
    return{quant:q,qual}
}
function analysis(a){
    const primary=[],effect=[],assumptions=[];
    if(a.evidenceNature==='qualitative'){
        primary.push(`${qualitativeDesign(a)} con codificación y estrategia analítica coherente con la pregunta.`);
        effect.push('Temas, categorías, patrones, narrativas o teoría sustentados con evidencia y casos discrepantes.');
        assumptions.push('Reflexividad, trazabilidad, contexto, suficiencia y triangulación cuando corresponda.');
        return{primary,effect,assumptions}
    }
    if(a.purpose==='measure'){
        primary.push('Desarrollo/evaluación del instrumento: contenido y procesos de respuesta; después estructura interna y precisión según el modelo de medición.');
        effect.push('Evidencia de contenido, cargas/ajuste, confiabilidad apropiada e invariancia si se comparan grupos.');
        assumptions.push('No interpretar alfa como validez; justificar dimensionalidad y población de uso.');
        return{primary,effect,assumptions}
    }
    if(a.purpose==='predict'){
        primary.push('Modelo predictivo con partición o remuestreo para validación interna, control de sobreajuste y, si es posible, validación externa.');
        effect.push('Calibración y error; discriminación cuando corresponda, siempre con incertidumbre.');
        assumptions.push('Tamaño efectivo, eventos por complejidad, fuga de información y manejo previo de faltantes.');
        return{primary,effect,assumptions}
    }
    const dep=['clustered','repeated','paired'].includes(a.clustering);
    const out=a.outcome,g=a.groups;
    if(out==='continuous'){
        if(g==='none')primary.push('Estimación de media/mediana y distribución con intervalo compatible.');
        else if(g==='twoind')primary.push('Regresión lineal o comparación de Welch para dos grupos independientes.');
        else if(g==='twopair')primary.push('Modelo de cambio/ANCOVA según diseño o comparación pareada.');
        else if(g==='manyind')primary.push('Regresión/ANOVA de Welch con contrastes planificados y ajuste de multiplicidad.');
        else primary.push(dep?'Modelo lineal mixto o marginal según el estimando.':'Regresión lineal múltiple con forma funcional especificada.');
        effect.push('Diferencia de medias o coeficiente con intervalo de confianza; tamaño estandarizado solo como complemento.');
        assumptions.push('Residuos, forma funcional, heterocedasticidad, influencia y dependencia.');
    }
    else if(out==='binary'){
        if(g==='none')primary.push('Estimación de proporción/prevalencia con intervalo apropiado al diseño muestral.');
        else if(g==='twopair')primary.push('McNemar para contraste simple o modelo binario para datos pareados/repetidos.');
        else primary.push(dep?'Modelo binario mixto, GEE o análisis de encuesta según el origen de la dependencia.':'Regresión binaria; elegir enlace según la medida objetivo.');
        effect.push('Riesgo, diferencia de riesgos, razón de riesgos u odds ratio con intervalo, claramente interpretado.');
        assumptions.push('Independencia o correlación modelada, forma funcional y datos escasos/separación.');
    }
    else if(out==='ordinal'){
        primary.push(dep?'Modelo ordinal mixto/marginal.':'Modelo de regresión ordinal; métodos por rangos solo si responden el estimando.');
        effect.push('OR ordinal o medida probabilística con intervalo.');
        assumptions.push('Proporcionalidad cuando se use; estructura y orden válidos.');
    }
    else if(out==='nominal'){
        primary.push(dep?'Modelo multinomial con estructura de dependencia.':'Regresión multinomial o tabla de contingencia para análisis simple.');
        effect.push('Probabilidades/contrastes o razones con intervalos.');
        assumptions.push('Celdas suficientes, categoría de referencia y dependencia.');
    }
    else if(out==='count'){
        primary.push(dep?'Modelo Poisson/binomial negativa mixto o GEE con exposición.':'Poisson con exposición; cambiar a binomial negativa si la sobredispersión lo justifica.');
        effect.push('Razón de tasas con intervalo.');
        assumptions.push('Sobredispersión, ceros, exposición y dependencia.');
    }
    else if(out==='timeevent'){
        primary.push('Kaplan–Meier para descripción y Cox o modelo paramétrico para ajustar; considerar riesgos competitivos.');
        effect.push('Supervivencia, diferencia temporal o hazard ratio con intervalo.');
        assumptions.push('Censura, riesgos proporcionales si aplica y número de eventos.');
    }
    else if(out==='accuracy'){
        primary.push('Sensibilidad, especificidad y curvas de desempeño frente a un estándar de referencia; considerar verificación y diseño pareado.');
        effect.push('Sensibilidad, especificidad, valores predictivos y AUC con intervalos.');
        assumptions.push('Espectro de participantes, cegamiento, umbral y estándar de referencia.');
    }
    else primary.push('No es posible seleccionar un modelo hasta definir el resultado primario.');
    if(a.missing==='moderate'||a.missing==='high')assumptions.push('Definir mecanismo plausible de faltantes, análisis principal y sensibilidad; evitar eliminación automática de casos.');
    if(a.evidenceNature==='mixed')primary.push('Integrar resultados CUAN y CUAL mediante conexión, construcción, fusión o incrustación; usar una matriz conjunta y formular metainferencias.');
    return{
        primary,effect,assumptions
    }
}
function measurement(a){
    const out=[];
    if(a.instrumentStatus==='new')out.push('Definir constructo y población; generar ítems/evidencias, revisar contenido, realizar entrevistas cognitivas/piloto y evaluar estructura y precisión.');
    if(a.instrumentStatus==='adapt')out.push('Traducción/adaptación cultural, revisión de contenido, entrevistas cognitivas y reevaluación de estructura y precisión en la población objetivo.');
    if(a.instrumentStatus==='validated')out.push('Confirmar que la evidencia de validez corresponde al idioma, población y uso; estimar precisión en la muestra actual.');
    if(a.instrument==='observation')out.push('Manual de codificación, entrenamiento y acuerdo interevaluador adecuado a la escala.');
    if(a.instrument==='records')out.push('Diccionario, procedencia, reglas de limpieza, calidad, duplicados, cobertura y cambios de definición.');
    if(a.evidenceNature==='qualitative')out.push('Guía flexible, pilotaje, registro de decisiones, reflexividad y protección de identidad.');
    return out
}
function viz(a){
    return({
        compare:['Gráfico de puntos o barras con intervalos; tabla para valores exactos.'],
        trend:['Líneas con bandas de incertidumbre; paneles por grupo si mejora lectura.'],
        distribution:['Histograma/densidad, Q–Q y caja/violín por grupo.'],
        relationship:['Dispersión con ajuste e incertidumbre; no ocultar la distribución.'],
        composition:['Barras apiladas al 100%; evitar 3D.'],
        map:['Mapa de tasas comparables o puntos según privacidad; justificar denominador.'],
        themes:['Mapa temático/proceso y matriz conjunta para integración; acompañar con narrativa.']
    })[a.vizGoal]||['Visualización por definir.']
}
function ethics(a){
    const out=[];
    if(a.humans!=='no')out.push('Confirmar revisión ética/institucional antes de recolectar o acceder a datos; la herramienta no determina cumplimiento.');
    if(['yes','possibly'].includes(a.vulnerable))out.push('Planear consentimiento/asentimiento, permiso de tutor y mitigación de coerción o relación jerárquica.');
    if(['yes','possibly'].includes(a.sensitive))out.push('Minimizar datos, separar identificadores, controlar acceso, cifrar cuando corresponda y definir conservación/eliminación.');
    if(a.ethicsStatus==='unclear')out.push('No iniciar recolección hasta aclarar autorización, consentimiento y gestión de datos.');
    return out
}
function guidance(a){
    const x=[];
    if(['cross','cohort','casecontrol'].includes(a.observationalDesign))x.push('STROBE');
    if(['interview','focus'].includes(a.instrument)&&['qualitative','mixed'].includes(a.evidenceNature))x.push('COREQ');
    if(a.evidenceNature==='mixed')x.push('JARS–Mixed');
    else if(a.evidenceNature==='qualitative')x.push('JARS–Qual');
    else x.push('JARS–Quant');
    if(a.intervention==='random')x.push('CONSORT / SPIRIT');
    return[...new Set(x)]
}
function plan(a){
    clean(a);
    const c=completion(a),cf=conflicts(a),blocks=cf.filter(x=>x.level==='block'),unknown=['evidenceNature','estimand'].some(k=>a[k]==='unknown')||(a.evidenceNature!=='qualitative'&&['outcome','groups','clustering'].some(k=>a[k]==='unknown'));
    const status=blocks.length||c.percent<100?'Información insuficiente':unknown?'Recomendación provisional':'Ruta suficientemente especificada';
    return{
        version:S().version,status,
        completion:c,
        conflicts:cf,
        framework:{
            approach:approach(a),
            scope:scope(a),
            design:design(a)
        },
        sampling:sampling(a),
        analysis:analysis(a),
        measurement:measurement(a),
        visualization:viz(a),
        ethics:ethics(a),
        guidelines:guidance(a)
    }
}
return{activeQuestions,completion,missingForStep,clean,conflicts,plan}})();
