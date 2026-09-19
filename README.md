# Asistente de investigación 2.0

Aplicación web estática para orientar decisiones metodológicas y estadísticas en proyectos de investigación y tesis. Funciona completamente en el navegador, sin instalación, cuentas, base de datos ni servidor.

## Funciones

- Cuestionario adaptado a ciencias sociales, educación, salud, ingeniería y administración.
- Recomendación de enfoque, alcance, diseño, muestra, instrumento, análisis y visualizaciones.
- Alertas sobre causalidad, dependencia, validez, ética y generalización.
- Fórmulas y código inicial en Python, R o flujo para Excel/Jamovi/JASP.
- Autoguardado local, tema claro/oscuro y diseño responsive.
- Descarga del resultado en Markdown e impresión/guardado como PDF desde el navegador.

## Mejoras de la  versión 2.0

- Formulario adaptativo: oculta preguntas no aplicables.
- Pregunta de investigación, unidad de análisis, resultado primario y estimando explícitos.
- Rutas separadas para componentes cuantitativo y cualitativo en estudios mixtos.
- Selección analítica guiada por resultado, diseño y dependencia; no por una “escala dominante”.
- Estado honesto: información insuficiente, recomendación provisional o ruta suficientemente especificada.
- Completitud objetiva en lugar de una puntuación arbitraria de coherencia.
- Detección de contradicciones y bloqueo antes de generar resultados.
- Pantalla de revisión con edición por sección.
- Persistencia tolerante a errores, eliminación, exportación/importación JSON.
- Exportación Markdown e impresión/PDF.
- Etiquetas, errores asociados, foco y progreso accesibles.
- Motor, esquema, almacenamiento y exportación separados.
- Pruebas automáticas de casos metodológicos básicos.

## Ejecutar

La aplicación puede abrirse desde `index.html`, aunque se recomienda un servidor estático para que el almacenamiento tenga comportamiento estable:

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000`.

## Pruebas

```bash
node tests/engine.test.js
```

Las pruebas usan Node y no son necesarias para ejecutar la página.

## Arquitectura

- `assets/schema.js`: etapas, preguntas y condiciones.
- `assets/engine.js`: validación, conflictos e inferencias.
- `assets/storage.js`: persistencia segura.
- `assets/export.js`: Markdown y JSON.
- `assets/app.js`: interfaz, navegación y accesibilidad.
- `assets/styles.css`: diseño visual.

## Límites

La herramienta no sustituye asesoría metodológica, revisión ética, cálculo formal de potencia, evaluación disciplinar o validación de instrumentos. Las recomendaciones deben contrastarse con literatura específica y el protocolo de la institución.

## Privacidad

Las respuestas se conservan en `localStorage` cuando el navegador lo permite. La aplicación permite borrar el proyecto y exportarlo como JSON. No incorpora analítica ni transmite respuestas.

## Alcance académico

La aplicación es una guía educativa y no sustituye asesoría metodológica, cálculo formal de potencia, dictamen ético o protocolos disciplinares. Las decisiones deben documentarse con bibliografía específica del campo.

## Fuentes conceptuales incluidas

- Hernández-Sampieri y Mendoza, *Metodología de la investigación: las rutas cuantitativa, cualitativa y mixta*.
- Creswell y Plano Clark, diseños de métodos mixtos.
- Fórmula de Cochran para muestra de proporciones y corrección por población finita.
- Literatura sobre potencia, tamaño del efecto, validez, confiabilidad y saturación cualitativa.