<p align="center">
  <img src="docs/hero.webp" alt="Kasa Nord — Lima, por fin, en silencio" width="100%">
</p>

# KASA NORD

**Inmobiliaria de lujo · Lima, Perú**

> No vendemos metros cuadrados — vendemos la ausencia de ruido.

Landing page para una inmobiliaria limeña de propiedades de $500K+. El
posicionamiento se niega a fingir que Lima es fácil: el sitio publica la
medición real de cada casa — decibeles, distancia al centro, horario de visita
— y admite explícitamente que el silencio absoluto no existe en esta ciudad.

## Ver en vivo

🌐 **[kasa-nord.github.io](https://kasa-nord.github.io/)**

## Qué hay aquí

```
index.html            home completo (7 secciones)
assets/css/tokens.css sistema de diseño: color, tipografía, espacio, motion
assets/css/main.css   12 componentes
assets/js/main.js     reveal on scroll, stagger de palabras, contadores
assets/img/           44 fotos (Pixabay, sin atribución)
scripts/fetch.js      descargador de fotos por categoría
docs/hero.webp        captura del proyecto
01-estrategia.md      documento de marca y arquitectura
```

## Stack

HTML, CSS y JavaScript planos. Sin build, sin framework, sin dependencias.
Un `.html` abierto en el navegador ya funciona.

## Local

```bash
python -m http.server 5173
# → http://localhost:5173
```

## Detalles

- **Fuentes** Cormorant Garamond + Inter + IBM Plex Mono, vía Google Fonts
- **Fotografías** [Pixabay](https://pixabay.com) — licencia libre, sin atribución
- **Tipografía de contenido** Inter; la serif es exclusivamente para display
- **Animaciones** respetan `prefers-reduced-motion`

---

Contenido y datos de propiedades **ficticios**, para demostración.
