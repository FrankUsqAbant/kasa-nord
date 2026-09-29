# KASA NORD — Estrategia de marca y arquitectura

> Documento 01 / 05 · Antes de la primera línea de código

---

## 1. Posicionamiento

**No vendemos casas. Vendemos distancia.**

En Lima el mercado de lujo está saturado de catálogos: fotos de drone genéricas,oro de iossm, copy de "exclusividad" repetido hasta perder todo significado. Todo el mundo dice lujo. Por eso nadie suena a lujo.

El ángulo que sí está libre: **Lima es una ciudad difícil de habitar** — tráfico, sismos, ruido, falta de verde, un cielo gris permanente nueve meses al año. El producto no compite contra eso. **Lo borra.**

Eso es lo que se vende: una casa donde no pasa nada.

### La promesa

> *"Lima, por fin, en silencio."*

Cada decisión de diseño tiene que servir a esa frase. Si una animación no transmite calma, se quita aunque sea bonita.

---

## 2. Nombre y sistema visual

**KASA NORD** — del北欧 *norte*. No es un nombre inmobiliario (no hay "Propiedades", "Group", "Real Estate", ni un molino). Kasa = casa. Corto, cuatro sílabas, se dice bien en español, no suena电脑译.

Se eligió por lo que **no** dice: no promete nada. Un nombre que promete se desgasta. Uno que solo nombra, envejece mejor.

### Identidad

| Elemento | Decisión | Por qué |
|---|---|---|
| Color primario | Verde profundo `#0B1F1A` | Verde de valleandino en hora baja. Prohibitivamente caro, nunca se ve en competencia |
| Acento | Latón mate `#C4A265` | Cobreandino. Da calor sin caer en el dorado de banco |
| Fondo | Hueso cálido `#F4F1EA` | Blanco puro es clínico. El hueso se ve caro |
| Texto | Verde profundo, no negro | Negro es un placeholder. Nunca intencional |
| Tipografía display | Serif alta contraste | Espacio, aire, tiempo. Contrasta con la sans que se usa en todo el sector |
| Tipografía UI | Sans geométrica | Limpia, nunca compite con el display |
| Fotografía | Sobreexpuesta, desaturada, luz natural difusa | El相反 de la foto inmobiliaria: **sin hora dorada, sin drone, sin sol de las 5pm** |

### Anti-referencias (lo que NO vamos a hacer)

- Nada de "homes" / "casas" / "villas" en el titular
- Nada de contador de propiedades en el hero
- Nada de azul corporativo ni verde neón
- Nada de animación que dure más de 900ms
- Nada de stock de sonriendo en cocina
- Nada de "explorar", "descubrir", "redescubrir" — verbs de SaaS en una inmobiliaria

---

## 3. Arquitectura de la información

La caída más común en inmobiliaria de lujo es el home con todo mezclado. Aquí la jerarquía es estricta.

```
HOME
├── Hero — una sola casa, una sola frase, sin navegación competidora
│   y la prueba: la ciudad amortiguada
├── Proof bar — 3 cifras verificables, no adjetivos
├── Signature Collection — 3 propiedades FLAGSHIP (no las "destacadas",
│   sino las 3 que definen la marca)
├── The Thesis — sección editorial: por qué Lima, por qué aquí
│   (aísla del modo "diseño", es lo que nadie tiene)
├── Districts — mapeo por zona, no por tipo de propiedad
├── Journal — notas de arquitectura y barrio (contenido, no relleno)
├── Visit — CTA único, bisagra del proyecto
└── Footer — contacto directo, sin newsletter genérico
```

### DETALLE DE PROPIEDAD

```
/propiedad
├── Hero full-bleed + specs en columna fija
├── The spec — cifras, sin adjetivos
├── Gallery — criterios de selección de imagen
├── The light — sección de cómo entra la luz (identidad de marca)
├── Floor plan — interactivo, no imagen plana
├── Location — el tradeoff honesto (servicios / tiempo a Miraflores)
└── Sticky contact — siempre presente
```

---

## 4. Sistema de componentes (fase 2)

| Componente | Nota de diseño |
|---|---|
| `BentoGrid` | Rejilla con rowspan controlado. Nunca 3 tarjetas iguales |
| `PropertyCard` | Foto que desborda el card, spec en mono-espaciado, sin botón |
| `Marquee` | Números y Tick — cinta lenta, la única animación que se repite |
| `Reveal` | IntersectionObserver, `translateY(24px)` + `opacity`, 700ms, ease-out-quint |
| `SplitText` | Palabras en stagger, solo en el h1. Nunca en body |
| `Magnetic` | Botón CTA con atraer de cursor, 0.3 factor, suave |
| `Lightbox` | Galería, navegación por teclado, transición de opacidad |
| `Counter` | Cifras que cuentan al entrar en viewport, una vez |

---

## 5. Dirección de fotografía

Este proyecto vive o muere por las fotos. Criterio de selección:

- **Luz natural difusa.** Cielo nublado o interior con luz indirecta. Sol directo = amateur.
- **Sobreexpuesto 1/3–2/3 de stop.** El blanco se va a 245–250, no a 255. Textura en sombra.
- **Desaturar 15–25%.** No hasta el gris; basta para que no parezca catálogo de olives.
- **Sin personas mirando a cámara.** Siluetas anónimas, manos,[^(perso)]adas por dentro. Esto vende privacidad.
- **Sin drone en primer plano.** Drone existe en la barra de evidencia ("vista aérea desde") o nunca.
- **Ángulo a la altura de los ojos o ligeramente por debajo.** Por encima convierte una casa en maqueta.
- **Ratio de encuadre amplio (16:9 o más).** Nada vertical en galería principal.

### Origen de las fotos

Free, sin atribución, usable en producción: **Pixabay**. Es la única fuente con licencia limpia y sin registro obligatorio. Unsplash bloquea por Cloudflare, Pexels pide verificación manual.

---

## 6. Riesgos declarados

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Fotos de stock genéricas rompen el posicionamiento premium | **Alto** | Muy sobreexpuestas, poco saturadas, encuadreMillisout. El post-proceso hace el 60% del trabajo |
| El verde profundo se ve "eco" y no lujo | Medio | Anclado con latón y hueso, no verde sobre verde. El acento cálido es lo que lo salva |
| "Lima en silencio" no es un Mercado, es una romantización | **Alto** | Se resuelve siendo honesto en la sección Thesis: el tradeoff de San Borja es real y se dice |
| Movimiento por el movimiento | Medio | Regla dura: toda animación revela contenido. Si solo es decorativa, se elimina |
| Puertos ocupados en el entorno del usuario | Bajo | Puerto 5173, configurable por variable |

---

## 7. Decisiones tomadas

1. Marca: **KASA NORD**, positioning "distancia, no casa"
2. Mercado: Lima,urbs high-end, USD, formato premium
3. Fotografía: Pixabay + post-proceso agresivo
4. Stack: HTML/CSS/JS estático puro, sin dependencias ni build
5. Servidor: `python -m http.server 5173` (o Vite en 5173)
6. Contenido: 9 propiedades ficticias, datos verosímiles de Lima real

---

**Siguiente:** 02 — Sistema de tokens (color, tipo, espacio, motion) y reset CSS.
