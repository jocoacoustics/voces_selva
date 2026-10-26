# Las voces escondidas de la selva · GitHub Pages v0.3.10

https://jocoacoustics.github.io/voces_selva/

La **única página pública** es `index.html`. Incorpora la portada de Jocotoco y el visualizador: crece el logo desde el primer instante mientras se descargan en paralelo los medios, sin `iframe`, redirección ni barras de desplazamiento durante la espera.

Archivos necesarios:
- `index.html`: documento ligero (~37 KB), portada, estilos, metadatos, estructura UX y arranque inmediato de la animación.
- `assets/model.js`: datos del visualizador, audio y espectrogramas (se sustituye tras inferencia real).
- `assets/runtime.js`: controles, sincronización del audio y activación de las capas.
- `assets/logo-verde-jocotoco.svg`: portada original local.
- `assets/Logo-jocotoco-clean-001.svg`: logo limpio del encabezado y favicon.
- `preview.jpg`, `.nojekyll` y este README.
- `PUBLICACION.json`: solo después de una doble inferencia real validada. Contiene SHA-256 de `index.html`, `model.js`, `runtime.js` y ambos SVG.

**No existe `visualizador.html`.** No hace falta subir otro archivo HTML. No obstante, los archivos JavaScript sí son obligatorios: `index.html` no funciona aislado.

Para probar localmente desde `githubpages/`:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000`. Evita abrir `index.html` mediante `file://` para pruebas completas, por restricciones de carga de algunos navegadores.

Para publicar el resultado científico, ejecuta el notebook maestro, comprueba `python scripts/verificar_publicacion.py --root . --strict` desde la raíz del proyecto y configura **Settings → Pages → GitHub Actions**. El workflow impide desplegar la vista previa como resultado real.



### Logotipos locales v0.3.10

La portada usa `assets/logo-verde-jocotoco.svg`; el encabezado y favicon utilizan `assets/Logo-jocotoco-clean-001.svg`. Ambos archivos originales se incluyen en el ZIP. No se consulta ninguna URL externa para los logotipos.
