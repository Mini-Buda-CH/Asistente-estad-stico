window.MethodExport=(()=>{
    function download(name,text,type){
        const u=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');
        a.href=u;
        a.download=name;
        a.click();
        setTimeout(()=>URL.revokeObjectURL(u),0)
    }
    function md(a,p){
        const L=x=>x.length?x.map(v=>`- ${v}`).join('\n'):'- No aplica o pendiente';
        return`# ${a.title||'Ruta metodológica sugerida'}\n\n> Resultado educativo y provisional. Motor ${p.version}. Validar con asesoría disciplinar, protocolo y comité correspondiente.\n\n## Estado\n- ${p.status}\n- Completitud: ${p.completion.percent}% (${p.completion.done}/${p.completion.total})\n\n## Pregunta\n${a.researchQuestion||'No registrada'}\n\n## Marco metodológico\n- Enfoque: ${p.framework.approach}\n- Alcance: ${p.framework.scope}\n- Diseño: ${p.framework.design}\n\n## Conflictos y pendientes\n${L(p.conflicts.map(x=>x.text))}\n\n## Muestra cuantitativa\n${L(p.sampling.quant)}\n\n## Muestra cualitativa\n${L(p.sampling.qual)}\n\n## Medición\n${L(p.measurement)}\n\n## Análisis principal\n${L(p.analysis.primary)}\n\n## Medidas a reportar\n${L(p.analysis.effect)}\n\n## Supuestos y sensibilidad\n${L(p.analysis.assumptions)}\n\n## Visualización\n${L(p.visualization)}\n\n## Ética y datos\n${L(p.ethics)}\n\n## Guías sugeridas\n${L(p.guidelines)}\n`
    }
    return{
        markdown:(a,p)=>download('ruta-metodologica.md',md(a,p),'text/markdown;charset=utf-8'),
        json:state=>download('asistente-estadistico.json',JSON.stringify(state,null,2),'application/json'),
        text:md
    }
})();
