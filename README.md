# hola Alberto · Mi aventura en español

Plataforma web de español lista para GitHub Pages, sin Node.js, sin compilación y sin servicios de pago. La plantilla es reutilizable: el **nombre, los niveles y los cuatro colores se guardan en `config.json`**, mientras que la organización y los estados de las clases se leen desde **`roadmap.md`**.

El roadmap de esta entrega contiene **127 clases en 8 etapas**, con un nivel A2 orientativo de Preply. Como no hay clases confirmadas con la profesora, todas aparecen inicialmente como pendientes. El porcentaje mide **clases vistas**, no el dominio lingüístico.

## 1. Publicar por primera vez en GitHub

1. Descarga el archivo ZIP y **descomprímelo** en tu computadora.
2. En [github.com](https://github.com/), crea un nuevo repositorio. Para una publicación gratuita con GitHub Pages, normalmente será **público**. Ponle el nombre que prefieras, por ejemplo `espanol-alberto`.
3. Abre el repositorio, elige **Add file → Upload files** y arrastra **los archivos y carpetas descomprimidos**, no el ZIP cerrado. Debes ver `index.html` directamente en la raíz, junto con `app.js`, `style.css`, `config.json` y `roadmap.md`. Sube también las carpetas `materiales/`; dentro hay archivos `.gitkeep` para conservar las carpetas vacías.
4. Haz clic en **Commit changes**.
5. Abre **Settings → Pages**. En **Build and deployment**, elige **Deploy from a branch**; luego selecciona `main` y `/(root)` y guarda los cambios.
6. Espera a que GitHub termine el despliegue. En **Settings → Pages** encontrarás el enlace público. También puedes revisar **Actions** para ver si la publicación está pendiente o falló.
7. La dirección será normalmente `https://TU-USUARIO.github.io/NOMBRE-REPOSITORIO/`. No necesitas escribir la ruta del repositorio en ningún archivo.

**Privacidad:** el repositorio y la web de GitHub Pages pública pueden ser accesibles a cualquier persona. No incluyas datos de contacto, evaluaciones privadas ni otra información sensible del estudiante. Un enlace difícil de adivinar **no** hace privada la web.

## 2. Actualizar el avance después de una clase

1. En GitHub, abre `roadmap.md` y haz clic en el lápiz (**Edit this file**).
2. Busca el encabezado `#### CLASE 1 — ...` o la clase correspondiente.
3. Cambia el campo de estado, por ejemplo:

```md
**Estado:** ✅ VISTO
**Fecha de realización:** 2026-11-12
```

4. Agrega apartados opcionales dentro del bloque de esa clase, antes de la siguiente cabecera `#### CLASE ...`:

```md
##### Lo que vimos en clase
Repasamos las presentaciones y las preguntas de seguimiento.

##### Apuntes y explicaciones
**¿Cómo te llamas?** se utiliza para preguntar el nombre.

##### Ejercicios realizados
1. Completa: Me ______ Alberto.  
**Respuesta:** llamo.

##### Tareas
Escuchar un diálogo y anotar tres expresiones útiles.

##### Materiales
![Mapa de vocabulario](materiales/imagenes/mapa-vocabulario.png)
[Hoja de ejercicios (PDF)](materiales/pdf/ejercicios-clase-01.pdf)

##### Observaciones
Conviene reforzar la pronunciación de la erre.
```

5. Guarda con **Commit changes**. Cuando GitHub Pages publique la nueva versión, el historial, los contenidos, la biblioteca y las barras de progreso se actualizarán. La profesora controla los estados; el estudiante no puede cambiarlos desde la web.

**Estados admitidos:** `✅ VISTO`, `🟡 EN PROGRESO`, `⬜ PENDIENTE`, `🔄 REPASO PENDIENTE`. No marques clases como vistas solo porque el estudiante conozca de antemano su contenido: el historial refleja lo que realmente se trabajó.

Los títulos `#### CLASE N — Título` y `### Etapa N — Nombre` identifican las clases y etapas. Para conservar las identificaciones estables, mantén la numeración y la estructura de encabezados. Puedes añadir clases como `12A` si hace falta.

## 3. Incorporar imágenes, PDF y otros recursos

- **Imágenes e infografías:** sube los archivos a `materiales/imagenes/`. Después enlázalos en la clase como `![Descripción](materiales/imagenes/nombre.png)`; se mostrarán directamente en la página y se podrán ampliar.
- **PDF:** sube a `materiales/pdf/` y escribe `[Descargar ejercicios](materiales/pdf/ejercicios.pdf)` dentro de la clase. El enlace aparecerá también en la biblioteca.
- **Enlaces y vídeos:** añade `[Ver vídeo](https://...)` o un enlace a una lectura. Los archivos de vídeo enlazados aparecen en la biblioteca y se abren en su dirección original.
- **Respuestas a ejercicios:** usa `**Respuesta:** ...` cuando estén confirmadas. La web las pone dentro de un elemento desplegable para consultarlas.

Los apartados opcionales que no tengan contenido no aparecen como tarjetas vacías. **No hay materiales históricos incluidos** porque el documento original no contiene enlaces a ellos.

## 4. Crear un sitio para otro estudiante

No necesitas tocar HTML, CSS ni JavaScript. Duplica estos archivos en otro repositorio y modifica:

- **`config.json`**: cambia `studentName`, `siteTitle`, `currentLevel`, `targetLevel`, `welcomeMessage` y `description`. La marca del menú, la cabecera y el título de la pestaña se generan a partir de `studentName` (por ejemplo, `hola Alberto`). Si está vacío, se verá simplemente `hola`.
- **`config.json` → `themeColors`**: permite ajustar los cuatro colores principales, aunque esta entrega ya está preparada con Hunyadi Yellow `#E0A03F`, Auburn `#9F2B2C`, Vanilla `#FEF3B1` y Slate Gray `#355D67`.
- **`roadmap.md`**: reemplázalo por el roadmap completo del nuevo estudiante. El sitio detecta dinámicamente las clases y etapas presentes. No copies manualmente las 127 clases a ningún archivo JavaScript.
- **`materiales/`**: añade los recursos de ese estudiante. No utilices vínculos a archivos privados.

El formato de encabezados del roadmap adjunto es el mejor soportado. Otros documentos Markdown estructurados por unidades y temas pueden importarse, aunque sin numeración explícita la plataforma crea una vista temática y no inventa sesiones realizadas.

## 5. Estructura del ZIP

Los archivos vienen **directamente en la raíz**, sin carpeta contenedora adicional:

```text
index.html
style.css
app.js
parser.js
markdown.js
config.json
roadmap.md
favicon.svg
.nojekyll
README.md
VALIDACION.md
materiales/
  imagenes/.gitkeep
  pdf/.gitkeep
```

- `index.html` carga `./style.css` y `./app.js`.
- `app.js` importa `./parser.js` y `./markdown.js` y carga `roadmap.md` y `config.json` mediante rutas relativas al propio archivo.
- `.nojekyll` permite servir los archivos sin procesamiento Jekyll.
- No hay paquetes de Node, CDN obligatorios ni procesos de compilación.

## 6. Solución de problemas

**Error 404 en toda la página:** revisa que `index.html` esté en la raíz del repositorio y que GitHub Pages use la rama `main` y `/(root)`. Confirma en Settings → Pages o Actions que el despliegue terminó correctamente.

**Página sin estilos o en blanco:** confirma que los archivos `style.css`, `app.js`, `parser.js`, `markdown.js` estén al mismo nivel que `index.html`. Se distinguen mayúsculas de minúsculas. No crees carpetas `assets/js` si el HTML referencia los archivos de la raíz.

**No aparecen las clases:** comprueba que `roadmap.md` se haya subido con ese nombre y que conserve encabezados como `### Etapa ...` y `#### CLASE 1 — ...`. Si hay un error de lectura, la web muestra un mensaje de diagnóstico.

**No se ve el nombre nuevo:** edita `studentName` en `config.json`, guarda con Commit changes y comprueba que la publicación terminó. Actualiza la pestaña después del despliegue.

**Una imagen o PDF no carga:** revisa el nombre y la extensión, incluidas mayúsculas/minúsculas, y que el archivo exista en `materiales/`. Usa rutas relativas como `materiales/imagenes/foto.png`, **no** `/materiales/imagenes/foto.png`.

**El progreso no cambia:** actualiza el campo `**Estado:**` dentro de la clase detallada en `roadmap.md`, no solamente las tablas del resumen. Después de guardar, revisa que GitHub Pages haya publicado la versión más reciente. El progreso se calcula por clases vistas, no por contenido dominado.

**Abres `index.html` con doble clic y falla:** en una URL `file://`, el navegador normalmente bloquea el acceso a archivos Markdown y JSON mediante `fetch`. Esto no ocurre en GitHub Pages servido por HTTP(S). Si deseas probar localmente, puedes utilizar cualquier servidor HTTP estático.

## 7. Limitaciones técnicas y alcance de las pruebas

El sitio es estático. El alumno puede navegar, buscar, filtrar y consultar materiales, pero no puede modificar el historial oficial o almacenar datos privados desde la interfaz. Cambios en el Markdown se reflejan tras publicar el repositorio. No hay sincronización en tiempo real ni inicio de sesión.

Consulta `VALIDACION.md` para ver las comprobaciones realizadas sobre esta entrega y las pruebas que el entorno no permitió completar.
