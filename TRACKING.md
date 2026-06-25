# Tracking de Meta — Landing Curso IA (Luciano Musella)

Setup de tracking completo: Pixel del navegador + Advanced Matching + Conversions API (CAPI).

## Pixel
- **ID:** `997300713288599` (Pixel – Lanzamiento semanal)
- Instalado en el `<head>` de `index.html` y `b/index.html`.

## Eventos que se disparan

| Evento | Cuándo | Tipo | Para qué sirve |
|--------|--------|------|----------------|
| `PageView` | Al cargar la página | Estándar | Mide visitas |
| `ViewContent` | Al cargar la landing | Estándar | Público "vio la landing" (retargeting) |
| `PlayVideo` | Al reproducir el video/VSL | Custom | Público "vio el video" (interés alto) |
| `ReservarClick` | Al abrir el formulario | Custom | Público "abrió el form pero no se inscribió" |
| `Lead` | Al enviar el formulario con éxito | Estándar | **Conversión** — optimizar campañas |

El `Lead` se envía por **dos vías** con el mismo `event_id`:
1. **Navegador** (Meta Pixel) con Advanced Matching (email/teléfono/nombre encriptados).
2. **Servidor** (Conversions API) vía `/api/capi-lead.js`.

Meta **deduplica** ambos por el `event_id`, así que no se cuenta doble.

## ⚙️ Configuración pendiente en Vercel (lo hace Alejo)

La CAPI necesita un **token de acceso** que NO va en el código (es secreto). Pasos:

### 1. Generar el token en Meta
1. Events Manager → tu pixel `997300713288599` → **Configuración**.
2. Sección **Conversions API** → **Generar token de acceso**.
3. Copia el token (es largo, empieza por `EAA...`).

### 2. Agregar las variables de entorno en Vercel
En el proyecto de Vercel → **Settings → Environment Variables**, agrega:

| Name | Value | Environments |
|------|-------|--------------|
| `META_CAPI_TOKEN` | (el token `EAA...` que generaste) | Production, Preview, Development |
| `META_PIXEL_ID` | `997300713288599` | Production, Preview, Development |

Luego **Redeploy** para que tome las variables.

> Sin `META_CAPI_TOKEN`, la página sigue funcionando normal y el Pixel del
> navegador sigue midiendo; solo no se envía la copia server-side de la CAPI.

## ✅ Cómo verificar

1. Events Manager → **Probar eventos**.
2. Sección **sitio web**: ingresa `ai.lucianomusella.com` → "Probar eventos".
   - Debe llegar `PageView` y `ViewContent` al cargar.
   - Reproduce el video → `PlayVideo`.
   - Abre el form → `ReservarClick`.
   - Envía el form → `Lead` (deberías ver una marca de **Procesado por navegador y servidor** = dedupe funcionando).
3. Sección **servidor**: copia el `test_event_code` y, para una prueba server-side
   directa, se puede enviar en el body como `test_event_code` a `/api/capi-lead`.

## Archivos
- `index.html`, `b/index.html` — Pixel base en el `<head>`.
- `main.js` — eventos del navegador, Advanced Matching, event_id, llamada a la CAPI.
- `api/capi-lead.js` — Serverless Function que envía el `Lead` server-side a Meta.
