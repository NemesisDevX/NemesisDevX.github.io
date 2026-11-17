# Egypt Virtual Museum

A bilingual (Arabic / English) museum-inspired web experience, published as a self-contained project within the owner's existing GitHub Pages site.

## Preview

https://nemesisdevx.github.io/egypt-virtual-museum/

## Features

- Premium responsive landing page with Egyptian-inspired art direction.
- Five themed galleries: Egyptian civilization, pharaonic artifacts, Islamic heritage, mummification, and Tutankhamun.
- Procedural WebGL/Three.js exhibition hall with five selectable themes, drag-to-look, zoom, and clickable artifact information.
- Live museum artifact discovery through The Metropolitan Museum of Art Collection API. Search, categorized filters, expanded artifact records and direct source links.
- Five-question educational quiz for young explorers.
- Instant AR/EN switching (localStorage persistence), mobile layout, semantic HTML and keyboard-friendly controls.
- If WebGL or external scripts are unavailable, a readable fallback is shown for the tour.

## Run locally

Because this is a static site, serve the repo folder with any local HTTP server, e.g.:

```sh
cd egypt-virtual-museum
python -m http.server 8000
```

Open http://localhost:8000 .

## Data and content

**Original museum data:** The Metropolitan Museum of Art Collection API, https://metmuseum.github.io/ . Records are fetched by the browser at runtime. Only records that identify themselves as public domain and have photos are displayed in the live collection. Source links, collection attribution, and period/material metadata come directly from museum records. Live search and images require an internet connection.

**Tutankhamun mask photo:** Sara Nabih, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tutankhamun%27s_death_mask.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The layout crops the photo. Attribution is visible in the footer and artifact details. The mask is not claimed as a Met object.

**3D gallery:** Procedurally generated, stylized architectural reinterpretation using Three.js, NOT a photogrammetric reconstruction or a scan of an actual gallery or artifact. The in-scene geometries are illustrative and should not be presented as faithful digital replicas.

**Historical text and quiz:** Introductory educational material; use authoritative sources for deeper research.

**Third-party dependencies:** Google Fonts and Three.js from esm.sh are loaded from CDNs; images are fetched from Wikimedia Commons or The Met. No analytics, user accounts, or backend in this preview.

## Scope / next phase

This is an **interactive preview**, not a fully curated or production-certified museum. Planned for a complete academic deliverable: vetted collection of 40+ artifacts with bilingual editorial descriptions, licensed photogrammetry/GLB models, citation verification, more accessible guided-tour flows, automated browser testing and a content management interface.

## Developer

Designed & Developed by [NemesisDevX](https://nemesisdevx.github.io/).

Independent educational demonstration, not endorsed by any museum.
