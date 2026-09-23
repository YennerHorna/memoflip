# MemoFlip

Juego web de memoria (tipo "cartas de parejas" / concentración) pensado como entrenador
cognitivo de sesiones cortas (5–10 min). El jugador voltea cartas en un tablero y busca
encontrar las parejas iguales en el menor tiempo y número de movimientos posible.

El diseño está anclado en literatura de psicología cognitiva: curva del olvido / repetición
espaciada (Ebbinghaus), efecto de la prueba / testing effect (Roediger & Karpicke), y memoria
de trabajo (Baddeley & Hitch, para futuros modos "Secuencia" y "N-back").

Actualmente solo está implementado el **Modo Clásico** (parejas).

## Cómo correrlo en local

El proyecto es JavaScript vanilla, sin bundler ni dependencias de runtime. Pero **debe servirse
por HTTP**, no abrir `src/index.html` con doble click: el juego usa `fetch()` para cargar el
JSON de la sprite sheet, y eso falla si se abre directo con `file://`.

```bash
npm install
npm run dev
```

Esto levanta un servidor estático sobre `src/` (por defecto en `http://localhost:3000`).
También podés usar cualquier otro servidor estático equivalente, por ejemplo:

```bash
npx serve src
```

## Estructura de carpetas

```
src/
├── assets/sprites/   # Sprite sheets PNG + JSON de metadata
├── core/             # Lógica pura del juego, sin DOM (testeable en Node)
├── ui/                # Todo lo que toca el DOM (pintar el tablero, cartas, HUD, modales)
├── services/          # Wrappers de APIs del navegador (localStorage, audio)
├── modes/             # Conecta core/ + ui/ para un modo de juego específico (ej. classicMode.js)
├── styles/            # CSS con variables de tema (soporta modo claro/oscuro)
├── index.html
└── app.js             # Punto de entrada
```

## Alcance actual

Solo web (desktop y móvil vía navegador responsive). No incluye todavía PWA
(`manifest.json` / service worker) ni apps nativas (Capacitor / Android / iOS) — quedan para
una fase posterior.
