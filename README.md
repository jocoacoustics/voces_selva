# GitHub Pages · Narupa v0.3.2

https://jocoacoustics.github.io/voces_selva/

Esta carpeta **sí está incluida** en el ZIP maestro.

- `index.html`: portada visual CC original (animaciones intactas), con iframe precargando el visualizador y traspaso por confirmación de preparación, sin temporizador fijo.
- `visualizador.html`: vista previa inicial; reemplazada automáticamente por la salida científica del notebook.
- `preview.jpg`: imagen de redes.
- `assets/`: logo de respaldo.
- `.nojekyll`: habilita archivos estáticos.
- `PUBLICACION.json`: **solo tras inferencia auténtica** de ambos checkpoints.

La publicación exige `python scripts/verificar_publicacion.py --root . --strict`; el workflow GitHub Actions la valida antes de desplegar. Si falta el manifiesto real, **no se publica**.
