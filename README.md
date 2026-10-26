# GitHub Pages · Narupa v0.3.3

https://jocoacoustics.github.io/voces_selva/

**Un solo `index.html`** incorpora la portada animada original de CC y el visualizador. Durante la carga no hay scrollbar ni segundo logo. El estado de preparado depende de imágenes, capas espectrales, metadatos de audio y fin de animación CSS original; no hay temporizador que decida revelar la interfaz.

- `index.html`: vista previa autónoma inicial; tras inferencia real pasa a ser la versión científica.
- `visualizador.html`: redirección de compatibilidad a `index.html` para enlaces previos.
- `preview.jpg`: imagen social.
- `assets/logo-jocotoco-respaldo.png`: respaldo si falla SVG original.
- `.nojekyll`: configuración estática.
- `PUBLICACION.json`: solo se genera al concluir inferencia auténtica 8F+4F.

Para publicar: ejecutar el notebook completo y `python scripts/verificar_publicacion.py --root . --strict`. El workflow rechaza la maqueta inicial.
