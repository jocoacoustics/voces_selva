# GitHub Pages · Narupa v0.2.6

https://jocoacoustics.github.io/voces_selva/

**Este directorio existe desde la entrega, pero su `visualizador.html` es inicialmente la maqueta.** No publiques el sitio como separación real hasta que el notebook ejecute ambos modelos y genere `PUBLICACION.json`.

`index.html`: portada CC con animación y redirección idénticas, sin modificaciones al CSS.  
`visualizador.html`: reemplazado automáticamente por `pipeline.run()` después de inferencia real.  
`preview.jpg`: imagen social original de CC.  
`assets/`: logo Jocotoco de respaldo.

Validar desde la raíz del proyecto: `python scripts/verificar_publicacion.py --root . --strict`.

Si se usa `Settings → Pages → GitHub Actions`, el workflow comprueba el sitio antes de desplegarlo.
