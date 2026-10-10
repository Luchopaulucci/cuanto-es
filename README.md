# ¿Cuánto es?

Juego de mesa para el celu: de 2 a 8 personas, un solo teléfono, se lo van pasando. Sale una premisa —cuánto pesa, cuánto mide, en qué año pasó— y cada quien marca su número en un slider vertical. Gana el que queda más cerca, medido por error relativo (o por años, si la pregunta es un año).

Hecho para partidas argentinas: preguntas clásicas, raras, de argentinidad y un **modo picante** opcional. Nadie ve el número del otro hasta el reveal.

## Cómo correrlo

```bash
npm install
npm run dev
```

Queda en `http://localhost:4721`.

```bash
npm run build    # sale estático en dist/
npm run preview  # sirve el build
npm test
npm run lint
npm run typecheck
```

No hay backend. Después de la primera carga, el service worker deja el juego usable offline. Se puede instalar como PWA.

## Cómo se juega

1. Agregá de 2 a 8 nombres. Cada uno tiene un color (lo podés cambiar).
2. Elegí la cantidad de rondas (por defecto 10) y las categorías. El modo picante suma humor más sucio; no hay insultos a grupos ni nada con pibes.
3. En cada turno aparece “Pasá el celu a …” y recién ahí el slider, siempre arrancando al medio del rango.
4. Cuando todos tiraron, se revela el valor real, la fuente, y quién se quedó más cerca.
5. 3 / 2 / 1 puntos para el podio de la ronda (los empates se parten). Al final, el podio grande.

Si recargás a mitad de partida, se restaura desde `localStorage`. Si recargás o apretás atrás en el slider, volvés al pase de celu: **nunca** se muestra el número de la persona anterior. Las respuestas no van a la URL.

## Contenido

Más de 80 premisas con valor, unidad, rango del slider, escala (lineal o log) y fuente. Hay un set extra de fiesta (cuerpo y asquerosidades, cosas raras, argentinidad, animales bizarros, ¿en qué año?). Si un dato es legendario o discutido, va marcado `disputed` y en el reveal se lee **según la versión más citada**.

## SEO / compartir

La URL canónica se arma con `VITE_SITE_URL` (por defecto `https://cuanto-es-xi.vercel.app`). El `og.png` (1200×630) vive en `public/og.png`.

```
VITE_SITE_URL=https://tu-dominio.com
```

## Stack

Vite + React + TypeScript + Tailwind. Tests con Vitest y Testing Library. Deploy estático (incluye `vercel.json` con rewrite SPA).
