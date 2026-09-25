# Sonidos de MemoFlip

Coloca aquí los archivos de audio con **estos nombres exactos** (los carga `services/audio.js`).
Si falta alguno, el juego sigue funcionando sin ese sonido.
`win` y `loss` se cortan solos al empezar otra partida o volver al menú.

| Archivo      | Cuándo suena                                                       |
|--------------|--------------------------------------------------------------------|
| `flip.mp3`   | Al voltear o tocar una carta (en todos los modos)                  |
| `error.mp3`  | Pareja incorrecta · carta equivocada en Secuencia · fallo en N-back |
| `win.mp3`    | Victoria: Clásico completado · récord en Secuencia · N-back ≥ 80 % |
| `loss.mp3`   | Derrota: sin vidas en Secuencia (sin récord) · N-back < 80 %       |
| `music.mp3`  | Música de fondo en bucle; empieza con el primer click/toque/tecla  |

Recomendaciones: efectos cortos (< 1 s) y música en bucle sin silencio al inicio/final.
MP3 funciona en todos los navegadores. Para cambiar un nombre o añadir un sonido nuevo,
edita `SOUND_FILES` en `src/services/audio.js`.
