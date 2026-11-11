# Validación de la entrega «hola Alberto»

## Contenido y estructura comprobados

- El Markdown adjunto por la usuaria se conserva íntegro como `roadmap.md`.
- Se importan **8 etapas y 127 clases**, todas con identificadores únicos.
- Se verificó que las 127 clases tienen título, objetivos comunicativos, gramática, vocabulario y funciones de conversación; todas figuran inicialmente como `PENDIENTE`, sin inventar clases vistas.
- `config.json` contiene `studentName: "Alberto"` y los cuatro colores `#E0A03F`, `#9F2B2C`, `#FEF3B1`, `#355D67`.
- Se comprobó que la marca se genera de forma dinámica: `hola Alberto`; una prueba sustituyó temporalmente la configuración por otro nombre y la marca se actualizó sin editar JavaScript.
- No se utiliza el branding anterior `hola!studio`.
- Los archivos esenciales se encuentran directamente en la raíz del proyecto y utilizan rutas relativas.

## Pruebas técnicas realizadas

- `node --check` para los tres módulos JavaScript (`app.js`, `parser.js`, `markdown.js`).
- Prueba de JavaScript sin navegador: inicialización de la aplicación, pantalla de inicio, marca, lectura de configuración, progreso 0%, representación de nueve rutas, búsqueda y filtrado por estado.
- Prueba de actualización en una **copia temporal** del Markdown: cambiar una clase a `VISTO` con fecha, notas, ejercicios, tareas e imagen/PDF enlazados conservó las 127 clases y reconoció los nuevos materiales.
- Comprobación HTTP de recursos esenciales en una subruta, para simular un sitio de proyecto de GitHub Pages.
- Inspección del ZIP final para comprobar archivos presentes, ausencia de carpeta contenedora y referencias internas válidas.

## Limitación explícita

Se intentó abrir el sitio con Chromium/Playwright, pero el entorno bloqueó la navegación HTTP local con `ERR_BLOCKED_BY_ADMINISTRATOR`. Por eso **no se verificó visualmente en un navegador real** la respuesta a clics, la apariencia móvil o la carga de imágenes mediante una sesión de usuario. Las pruebas anteriores validan estructura, sintaxis, importación de contenido y comportamiento simulado, pero no sustituyen una prueba manual en GitHub Pages tras la publicación.

La publicación en un repositorio real no forma parte de esta entrega: sigue las instrucciones de `README.md` para activarla.
