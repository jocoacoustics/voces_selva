# GitHub Pages · Narupa v0.3.1

https://jocoacoustics.github.io/voces_selva/

**Este directorio existe desde la entrega, pero su `visualizador.html` es inicialmente la maqueta.** No publiques el sitio como separación real hasta que el notebook ejecute ambos modelos y genere `PUBLICACION.json`.

- `index.html`: portada CC original (animaciones/temporizador intactos); `prefetch` de la segunda página.
- `visualizador.html`: vista previa inicial; reemplazada automáticamente por la salida científica del notebook.
- `preview.jpg`: imagen de redes.
- `assets/`: logo de respaldo.
- `.nojekyll`: habilita archivos estáticos.
- `PUBLICACION.json`: **solo tras inferencia auténtica** de ambos checkpoints.

La publicación exige `python scripts/verificar_publicacion.py --root . --strict`; el workflow GitHub Actions la valida antes de desplegar. Si falta el manifiesto real, **no se publica**.
