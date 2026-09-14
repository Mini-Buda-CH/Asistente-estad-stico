window.MethodSchema={
    version:'2.0.0',
    steps:[{
        id:'context',
        title:'Contexto',
        questions:[{
            id:'title',
            type:'text',
            required:false,
            label:'Título o tema provisional',
            help:'Escribe una frase breve; no incluyas datos personales.',
            placeholder:'Ej. Factores asociados al desempeño académico'
        },
        {
            id:'field',
            required:true,
            label:'Área principal del estudio',
            help:'Ayuda a contextualizar ejemplos; no determina por sí sola la metodología.',
            options:[
                ['social','Ciencias sociales'],
                ['education','Educación'],
                ['health','Salud'],
                ['engineering','Ingeniería / tecnología'],
                ['business','Economía / administración'],
                ['multidisciplinary','Otra / multidisciplinaria']
            ]
        },
        {
            id:'projectLevel',
            required:true,
            label:'Tipo de proyecto',
            options:[
                ['bachelor','Tesis de licenciatura'],
                ['master','Tesis de maestría'],
                ['doctorate','Tesis doctoral'],
                ['protocol','Protocolo o artículo'],
                ['applied','Evaluación o proyecto aplicado']
            ]
        },
        {
            id:'evidenceSource',
            required:true,
            label:'Fuente principal de evidencia',
            options:[
                ['primary','Datos primarios con participantes'],
                ['secondary','Base de datos o registros existentes'],
                ['documents','Documentos, textos, audio o imágenes'],
                ['simulation','Simulación o experimento computacional'],
                ['review','Revisión de literatura']
            ]
        },
        {
            id:'unit',
            type:'text',
            required:true,
            label:'Unidad de análisis',
            help:'Entidad sobre la que deseas concluir: persona, escuela, empresa, documento, dispositivo, evento, territorio, etc.',
            placeholder:'Ej. estudiantes de secundaria pública'
        }
        ]
    },
    {
        id:'question',
        title:'Pregunta y objetivo',
        questions:[{
            id:'researchQuestion',
            type:'textarea',
            required:true,
            label:'Pregunta principal de investigación',
            help:'Debe indicar qué deseas conocer y sobre quién o qué.',
            placeholder:'Ej. ¿Qué factores se asocian con…?'
        },
        {
            id:'purpose',
            required:true,
            label:'¿Qué busca lograr principalmente?',
            options:[
                ['explore','Explorar un fenómeno poco conocido'],
                ['describe','Describir o estimar prevalencia/frecuencia'],
                ['compare','Comparar grupos o momentos'],
                ['associate','Estimar asociación entre variables'],
                ['cause','Evaluar un efecto causal'],
                ['predict','Predecir o clasificar casos nuevos'],
                ['measure','Desarrollar o validar un instrumento'],
                ['understand','Comprender experiencias, significados o procesos']
            ]
        },
        {
            id:'evidenceNature',
            required:true,
            label:'¿Qué tipo de evidencia necesita la pregunta?',
            options:[
                ['numeric','Mediciones numéricas'],
                ['qualitative','Discursos, experiencias, procesos o documentos'],
                ['mixed','Integración de evidencia numérica y cualitativa'],
                ['unknown','Aún no lo sé']
            ]
        },
        {
            id:'estimand',
            required:true,
            label:'¿Qué producto principal deseas obtener?',
            help:'El producto analítico orienta el método más que el nombre de una prueba.',
            options:[
                ['estimate','Una estimación o distribución'],
                ['difference','Una diferencia entre grupos o momentos'],
                ['association','Una asociación ajustada o no ajustada'],
                ['causal','Un efecto causal definido'],
                ['prediction','Predicciones para casos nuevos'],
                ['measurement','Evidencia de validez/confiabilidad'],
                ['themes','Temas, categorías, interpretación o teoría'],
                ['integration','Una conclusión integrada CUAN–CUAL'],
                ['unknown','Aún no lo sé']
            ]
        },
        {
            id:'hypothesis',
            required:true,
            label:'¿La pregunta incluye hipótesis comprobables?',
            appliesIf:a=>['numeric','mixed'].includes(a.evidenceNature),
            options:[
                ['confirmatory','Sí, análisis confirmatorio'],
                ['exploratory','Sí, pero exploratorio'],
                ['no','No'],
                ['unknown','Aún no se define']
            ]
        }
        ]
    },
    {
        id:'design',
        title:'Diseño',
        questions:[
            {
                id:'intervention',
                required:true,
                label:'¿Se aplicará una intervención o exposición controlada?',
                appliesIf:a=>a.evidenceNature!=='qualitative',
                options:[
                    ['random','Sí, con asignación aleatoria'],
                    ['nonrandom','Sí, con grupos no aleatorios'],
                    ['single','Sí, un grupo sin comparación'],
                    ['none','No; observacional'],
                    ['na','No aplica']
                ]
            },
            {
                id:'observationalDesign',
                required:true,
                label:'Familia de diseño observacional',
                appliesIf:a=>a.intervention==='none',
                options:[
                    ['cross','Transversal'],
                    ['cohort','Cohorte / seguimiento'],
                    ['casecontrol','Casos y controles'],
                    ['ecological','Ecológico'],
                    ['timeseries','Serie temporal'],
                    ['diagnostic','Exactitud diagnóstica'],
                    ['unknown','Aún no se define']
                ]
            },
            {
                id:'time',
                required:true,
                label:'Temporalidad o número de mediciones',
                appliesIf:a=>a.evidenceNature!=='qualitative',
                options:[
                    ['one','Un momento'],
                    ['two','Dos momentos'],
                    ['many','Tres o más / seguimiento'],
                    ['retrospective','Retrospectivo con datos existentes']
                ]
            },
            {
                id:'qualAim',
                required:true,
                label:'Finalidad cualitativa principal',
                appliesIf:a=>['qualitative','mixed'].includes(a.evidenceNature),
                options:[
                    ['experience','Experiencia vivida'],
                    ['case','Comprender un caso delimitado'],
                    ['process','Construir teoría sobre un proceso'],
                    ['culture','Comprender una cultura o práctica compartida'],
                    ['themes','Identificar temas o patrones'],
                    ['discourse','Analizar discurso, narrativa o documentos'],
                    ['unknown','Aún no se define']
                ]
            },
            {
                id:'mixedOrder',
                required:true,
                label:'¿Cómo se integrarán los componentes?',
                appliesIf:a=>a.evidenceNature==='mixed',
                options:[
                    ['parallel','Convergente: simultáneos y posteriormente integrados'],
                    ['quantqual','Explicativo secuencial: CUAN → CUAL'],
                    ['qualquant','Exploratorio secuencial: CUAL → CUAN'],
                    ['embedded','Un componente incrustado dentro del principal'],
                    ['unknown','Aún no se define']
                ]
            }
        ]
    },
    {
        id:'sample',
        title:'Población y muestra',
        questions:[
            {
                id:'population',
                required:true,
                label:'¿Existe una lista o marco de la población?',
                appliesIf:a=>a.evidenceNature!=='qualitative',
                options:[
                    ['complete','Sí, lista completa'],
                    ['groups','Solo listas de grupos, sedes o conglomerados'],
                    ['none','No existe o no es accesible'],
                    ['census','Se estudiará toda la población accesible'],
                    ['unknown','Aún no lo sé']
                ]
            },
            {
                id:'representation',
                required:true,
                label:'Prioridad de la selección cuantitativa',
                appliesIf:a=>['numeric','mixed','unknown'].includes(a.evidenceNature),
                options:[
                    ['generalize','Generalizar a una población'],
                    ['subgroups','Representar subgrupos relevantes'],
                    ['effect','Detectar/estimar un efecto con precisión'],
                    ['feasible','Acceso y factibilidad'],
                    ['unknown','Aún no se define']
                ]
            },
            {
                id:'qualSampling',
                required:true,
                label:'Lógica de selección cualitativa',
                appliesIf:a=>['qualitative','mixed'].includes(a.evidenceNature),
                options:[
                    ['criterion','Criterios específicos'],
                    ['variation','Máxima variación'],
                    ['theoretical','Muestreo teórico iterativo'],
                    ['case','Caso(s) delimitado(s)'],
                    ['snowball','Bola de nieve / población difícil de localizar'],
                    ['unknown','Aún no se define']
                ]
            },
            {
                id:'clustering',
                required:true,
                label:'¿Las observaciones estarán relacionadas?',
                appliesIf:a=>a.evidenceNature!=='qualitative',
                options:[
                    ['independent','Independientes'],
                    ['clustered','Agrupadas en escuelas, hospitales, empresas, territorios, etc.'],
                    ['repeated','Repetidas en la misma unidad'],
                    ['paired','Pareadas o emparejadas'],
                    ['network','Conectadas en red'],
                    ['unknown','Aún no lo sé']
                ]
            },
            {
                id:'populationN',
                type:'number',
                required:false,
                min:2,
                label:'Tamaño de la población (opcional)',
                appliesIf:a=>['complete','groups'].includes(a.population),
                help:'Déjalo vacío si es desconocido.'
            },
            {
                id:'confidence',
                required:true,
                label:'Nivel de confianza para estimar la proporción',
                appliesIf:a=>['numeric','mixed'].includes(a.evidenceNature)&&a.outcome==='binary'&&a.groups==='none',
                options:[
                    ['90','90%'],
                ['95','95%'],
                ['99','99%']
                ]
            },
            {
                id:'margin',
                type:'number',
                required:true,
                min:0.1,
                label:'Margen de error máximo (%)',
                appliesIf:a=>['numeric','mixed'].includes(a.evidenceNature)&&a.outcome==='binary'&&a.groups==='none',
                help:'Ej. 5 para un margen de ±5 puntos porcentuales.'
            },
            {
                id:'expectedP',
                type:'number',
                required:true,
                min:0.1,
                label:'Proporción esperada (%)',
                appliesIf:a=>['numeric','mixed'].includes(a.evidenceNature)&&a.outcome==='binary'&&a.groups==='none',
                help:'Usa 50 si no existe un antecedente defendible.'
            },
            {
                id:'responseRate',
                type:'number',
                required:true,
                min:1,
                label:'Respuesta esperada (%)',
                appliesIf:a=>['numeric','mixed'].includes(a.evidenceNature)&&a.outcome==='binary'&&a.groups==='none',
                help:'Debe estar entre 1 y 100.'
            },
            {
                id:'designEffect',
                type:'number',
                required:true,
                min:1,
                label:'Efecto de diseño',
                appliesIf:a=>['numeric','mixed'].includes(a.evidenceNature)&&a.outcome==='binary'&&a.groups==='none'&&a.clustering==='clustered',
                help:'Usa 1 solo para muestreo aleatorio simple; en conglomerados debe justificarse.'
            }
        ]
    },
    {
        id:'measurement',
        title:'Medición',
        questions:[
            {
                id:'outcome',
                required:true,
                label:'Tipo de resultado primario',
                appliesIf:a=>['numeric','mixed','unknown'].includes(a.evidenceNature)&&!['measure'].includes(a.purpose),
                options:[
                    ['continuous','Continuo'],
                    ['binary','Binario: sí/no'],
                    ['nominal','Nominal con más de dos categorías'],
                    ['ordinal','Ordinal / Likert'],
                    ['count','Conteo o tasa'],
                    ['timeevent','Tiempo hasta un evento'],
                    ['accuracy','Exactitud diagnóstica'],
                    ['unknown','Aún no se define']
                ]
            },
            {
                id:'instrument',
                required:true,
                label:'Fuente o instrumento principal',
                options:[
                    ['survey','Cuestionario o escala'],
                    ['interview','Entrevista'],
                    ['focus','Grupo focal'],
                    ['observation','Observación o rúbrica'],
                    ['records','Registros/base secundaria'],
                    ['tests','Prueba física, clínica o de desempeño'],
                    ['sensors','Sensores o sistema digital'],
                    ['documents','Documentos o corpus']
                ]
            },
            {
                id:'instrumentStatus',
                required:true,
                label:'Estado del instrumento',
                appliesIf:a=>!['records','documents'].includes(a.instrument),
                options:[
                    ['validated','Validado en población y contexto similares'],
                    ['adapt','Será adaptado o traducido'],
                    ['new','Se construirá desde cero'],
                    ['unknown','Aún no se define']
                ]
            },
            {
                id:'primaryOutcome',
                type:'text',
                required:true,
                label:'Nombre del resultado, variable o fenómeno principal',
                placeholder:'Ej. puntaje de desempeño; abandono escolar; experiencia de cuidado'
            },
            {
                id:'missing',
                required:true,
                label:'Datos faltantes o pérdidas esperadas',
                appliesIf:a=>['numeric','mixed','unknown'].includes(a.evidenceNature),
                options:[
                    ['low','Bajos y controlables'],
                    ['moderate','Moderados'],
                    ['high','Altos o seguimiento difícil'],
                    ['unknown','Aún no se sabe']
                ]
            }
        ]
    },
    {
        id:'analysis',
        title:'Análisis',
        questions:[
            {
                id:'groups',
                required:true,
                label:'Estructura principal de comparación o modelado',
                appliesIf:a=>['numeric','mixed','unknown'].includes(a.evidenceNature)&&a.purpose!=='measure',
                options:[
                    ['none','Sin comparación: estimación descriptiva'],
                    ['twoind','Dos grupos independientes'],
                    ['twopair','Dos mediciones o grupos pareados'],
                    ['manyind','Tres o más grupos independientes'],
                    ['manyrep','Tres o más mediciones repetidas'],
                    ['model','Múltiples predictores o covariables'],
                    ['unknown','Aún no se define']
                ]
            },
            {
                id:'effectMeasure',
                required:true,
                label:'Medida principal que deseas reportar',
                appliesIf:a=>['numeric','mixed','unknown'].includes(a.evidenceNature)&&a.purpose!=='measure',
                options:[
                    ['mean','Media/diferencia de medias'],
                    ['proportion','Proporción/diferencia de proporciones'],
                    ['ratio','Razón: RR, OR o razón de tasas'],
                    ['correlation','Correlación o coeficiente'],
                    ['survival','Supervivencia o hazard ratio'],
                    ['performance','Error, calibración o discriminación'],
                    ['unknown','Aún no se define']
                ]
            },
            {
                id:'vizGoal',
                required:true,
                label:'Objetivo principal de visualización',
                options:[
                    ['compare','Comparar categorías'],
                    ['trend','Mostrar cambios en el tiempo'],
                    ['distribution','Mostrar distribución y atípicos'],
                    ['relationship','Mostrar relación entre variables'],
                    ['composition','Mostrar composición'],
                    ['map','Mostrar patrón geográfico'],
                    ['themes','Mostrar temas, proceso o integración']
                ]
            },
            {
                id:'software',
                required:true,
                label:'Entorno preferido para el análisis',
                options:[
                    ['python','Python'],
                    ['r','R'],
                    ['excel','Excel'],
                    ['gui','Jamovi / JASP / SPSS'],
                    ['qual','ATLAS.ti / NVivo / MAXQDA o análisis manual'],
                    ['unknown','Aún no definido']
                ]
            }
        ]
    },
    {
        id:'ethics',
        title:'Recursos y ética',
        questions:[
            {
                id:'constraints',
                required:true,
                label:'Principal restricción del proyecto',
                options:[
                    ['time','Tiempo'],
                    ['access','Acceso a datos/participantes'],
                    ['budget','Presupuesto'],
                    ['skills','Capacidad técnica'],
                    ['permissions','Permisos institucionales'],
                    ['none','Sin restricción crítica']
                ]
            },
            {
                id:'humans',
                required:true,
                label:'¿Participan personas o se usan datos personales?',
                options:[
                    ['yes','Sí'],
                    ['secondary','Solo datos secundarios potencialmente identificables'],
                    ['no','No'],
                    ['unknown','Aún no se sabe']
                ]
            },
            {
                id:'vulnerable',
                required:true,
                label:'¿Incluye menores, población vulnerable o relación jerárquica?',
                appliesIf:a=>['yes','secondary','unknown'].includes(a.humans),
                options:[
                    ['yes','Sí'],
                    ['possibly','Posiblemente'],
                    ['no','No']
                ]
            },
            {
                id:'sensitive',
                required:true,
                label:'¿Incluye datos sensibles, grabaciones o geolocalización?',
                appliesIf:a=>['yes','secondary','unknown'].includes(a.humans),
                options:[
                    ['yes','Sí'],
                    ['possibly','Posiblemente'],
                    ['no','No']
                ]
            },
            {
                id:'ethicsStatus',
                required:true,
                label:'Estado de revisión ética o autorización',
                appliesIf:a=>a.humans!=='no',
                options:[
                    ['approved','Aprobada/autorizada'],
                    ['planned','Se solicitará antes de recolectar/usar datos'],
                    ['unclear','No se ha determinado'],
                    ['na','No aplica según revisión institucional']
                ]
            }
        ]
    }
    ]
};
window.MethodSchema.labelFor=function(id,value){
    for(const s of this.steps)
        for(const q of s.questions)
    if(q.id===id){
        const o=(q.options||[]).find(x=>x[0]===value);
        return o?o[1]:value
    }
    return value
};
