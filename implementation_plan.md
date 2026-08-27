# Mobile Performance Audit & Optimization Plan
**Target Site**: [https://bd.dataillam.com/](https://bd.dataillam.com/)  
**Environment**: Production Subdomain on Hostinger Apache/HCDN  
**Primary Goal**: Elevate Mobile Performance score from **56–68** to **90+** while maintaining Accessibility (95+), Best Practices (95+), SEO (95+), and preserving 100% of visual design & functionality.

---

## 1. Project Architecture & Setup Summary (Step 1 & Step 5)

| Component | Audit Finding | Verification Status |
| :--- | :--- | :--- |
| **Framework / Language** | Vanilla HTML5 static pages (`index.html`, `About/index.html`, `Service/index.html`, `Bdaas/index.html`, `Contact/index.html`) | Verified |
| **Build System** | Static file directory structure served directly by Apache web server. No Node bundler/build step required. | Verified |
| **Hosting & Subdomain** | Subdomain `bd.dataillam.com` hosted on Hostinger panel with Hostinger CDN (`hcdn`) edge proxy. Supports Brotli compression & HTTP/3. | Verified |
| **Subdomain Bug** | `.htaccess` line 22 contains a hardcoded redirect: `RewriteRule ^(([^/]+/)*)index\.html$ https://www.dataillam.com/$1 [R=301,L]`. Requesting `https://bd.dataillam.com/index.html` causes an unintended 301 cross-domain redirect to `www.dataillam.com`. | Verified |
| **CSS Architecture** | Per-page CSS files (`home.css` 71.8KB, `about.css` 57.6KB, `service.css` 38.7KB, `bdaas.css` 30.3KB, `contact.css` 28.3KB, `navbar.css` 5.6KB, `footer.css` 5.8KB). External CDN CSS for Bootstrap 5.3.3, Bootstrap Icons 1.11.3, FontAwesome 6.0.0. | Verified |
| **JavaScript Architecture**| jQuery 3.7.1 + Bootstrap 5.3.3 Bundle + custom page JS (`home.js`, `about.js`, `service.js`, `bdaas.js`, `contact.js`, `navbar.js`). Google Analytics GTag in `<head>`. | Verified |
| **Image & Asset Handling** | Combination of WebP and PNG/JPEG assets. Most images lack explicit `width` and `height` attributes and mobile `srcset` responsive sizing. Below-the-fold images lack `loading="lazy"`. | Verified |

---

## 2. Live Subdomain Audit & HTTP Headers (Step 5)

Live cURL & Node response header testing on `bd.dataillam.com`:
- **Server Response Time (TTFB)**: ~28ms – 37ms for static HTML & assets via Hostinger HCDN edge cache. Excellent TTFB baseline.
- **Compression**: Brotli (`content-encoding: br`) is active on HTML, CSS, JS.
- **Browser Caching**: Static images have `cache-control: public, max-age=31536000` (1 year). CSS/JS have `max-age=2592000` (1 month). HTML has `max-age=900` (15 mins).
- **Subdomain Redirect Anomaly**:
  - `http://bd.dataillam.com/` -> `301` -> `https://bd.dataillam.com/` (Clean 150ms hop).
  - `https://bd.dataillam.com/index.html` -> `301` -> `https://www.dataillam.com/` (**BUG**: Hardcoded apex domain redirect in `.htaccess`).

---

## 3. Page-by-Page Inventory & Bottleneck Traceability (Step 2, 3 & 4)

### 3.1 Home Page (`https://bd.dataillam.com/`)
- **LCP Element**: Hero Visual Image (`img/wmremove-transformed (1).webp`).
  - **Problem**: Preloaded in `<head>`, but file size is 152.36 KB (1190×1200 px resolution). On mobile screen (375px wide), downloading a 1200px 152KB image over mobile CPU/network simulation inflates LCP to ~3.2s–4.1s.
- **Render-Blocking Resources**:
  - Google Fonts CSS (`Vesper Libre` + `Inter`) loaded synchronously in `<head>` via blocking `<link href="...">`.
  - Google Tag Manager script (`gtag/js?id=G-H3YMLE3T8D`) loaded synchronously in `<head>`.
  - `css/home.css` (71.76 KB unminified).
- **Layout Shift (CLS)**:
  - Header logo `img/Without BG Without Name.png` (129.51 KB PNG) missing `width` & `height` attributes.
  - Below-the-fold images missing `width` & `height` attributes.

### 3.2 About Page (`https://bd.dataillam.com/About/`)
- **LCP Element**: Hero Visual Image (`img/Gemini_Generated_Image_xd8lttxd8lttxd8l (1).webp`).
  - **Problem**: Size 77.05 KB. Lacks explicit `width` & `height` attributes.
- **Render-Blocking Resources**:
  - Bootstrap 5.3.3 CSS loaded synchronously from jsDelivr CDN (`https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`).
  - Google Fonts CSS loaded synchronously in `<head>`.
  - `css/about.css` (57.60 KB unminified).
- **JavaScript & TBT**:
  - jQuery 3.7.1 + Bootstrap JS + `js/about.js` (14.37 KB) + `js/navbar.js` (6.30 KB) execute on mobile main thread, consuming 350ms+ CPU execution time.
- **Layout Shift (CLS)**:
  - Executive photos (`Deepak photo.webp`, `Deeraj photo.webp`) and journey section images missing explicit `width` and `height` attributes. Below-the-fold executive photos lack `loading="lazy"`.

### 3.3 Service Page (`https://bd.dataillam.com/Service/`)
- **LCP Element**: Hero Card Image (`img/imgi_5_business problems.webp`).
  - **Problem**: Preloaded in `<head>`. Size 36.98 KB. Missing `width` & `height` attributes.
- **Render-Blocking Resources**:
  - Bootstrap 5.3.3 CSS loaded synchronously from CDN.
  - `css/service.css` (38.72 KB unminified).
- **Image Sizing & CLS**:
  - 8 `<img>` tags on page, **zero** of them have `loading="lazy"` or `width`/`height` dimensions declared!

### 3.4 BDaaS Page (`https://bd.dataillam.com/Bdaas/`)
- **LCP Element**: Hero Transformation Graphic (`img/SME_→_MNC_Growth_Transformation_202605191212.webp`).
  - **Problem**: Size 119.57 KB (1536×1024 px). Oversized for mobile screens (~350px display width).
- **Render-Blocking Resources**:
  - FontAwesome 6.0.0 CSS (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`) loaded synchronously in `<head>`.
  - Google Fonts loaded synchronously.
  - `css/bdaas.css` (30.27 KB unminified).
- **Heavy Media Payload**:
  - Article cover images below fold (`Article 4.webp` 349.26 KB, `Article 2.webp` 224.37 KB, `Article 3.webp` 214.70 KB, `Article 1.webp` 158.19 KB) total over 1 MB! These delay main thread scrolling and network completion on mobile.

### 3.5 Contact Page (`https://bd.dataillam.com/Contact/`)
- **LCP Element**: Hero Form Background Image (`img/Image 1 (1).webp`).
  - **Problem**: Size 70.55 KB. Lacks explicit `width` & `height` attributes.
- **Render-Blocking Resources**:
  - Bootstrap 5.3.3 CSS + Bootstrap Icons 1.11.3 CSS loaded synchronously from CDN in `<head>`.
  - `css/contact.css` (28.25 KB unminified).

---

## 4. Mobile vs. Desktop Technical Performance Gap (Step 6)

| Metric / Dimension | Desktop (Score 80–94+) | Mobile (Score 56–68) | Technical Root Cause |
| :--- | :--- | :--- | :--- |
| **CPU Processing** | High-clock desktop CPU processes 200KB JS in ~40ms (TBT < 50ms). | Simulated mobile 4x CPU slowdown takes ~450ms–750ms to parse/execute jQuery, Bootstrap & custom JS, causing high Total Blocking Time (TBT). |
| **Hero Image Transfer** | 1200px 152KB image downloads in 80ms over high-speed desktop connection. | 152KB image over 4G mobile emulation takes 1.5s–2.2s, directly delaying LCP and Speed Index. |
| **CDN Render-Blocking Latency** | Desktop RTT is ~10ms for external CSS/Font CDNs. | Mobile RTT (~150ms per TCP/TLS handshake) stacks for Google Fonts, Bootstrap CSS, Bootstrap Icons, FontAwesome, delaying First Contentful Paint (FCP). |
| **Layout Shift (CLS)** | Fixed desktop viewport dimensions absorb image loading layout reflows. | Mobile viewports reflow dramatically when images without `width`/`height` dimensions download and expand mid-scroll. |

---

## 5. Prioritized Optimization Plan (P0 – P3) (Step 8)

### P0 (Critical / Highest Mobile Impact – Target: LCP & FCP)
1. **Fix Subdomain Redirect Bug in `.htaccess`**
   - *File*: `.htaccess` (line 22)
   - *Fix*: Replace hardcoded `https://www.dataillam.com/$1` redirect rule with a relative host rule `https://%{HTTP_HOST}/$1`.
   - *Impact*: Prevents unintended cross-domain redirects for subdomain URLs.
2. **Optimize Hero LCP Images for Mobile (Downscaling & Mobile Variants)**
   - *Files*: `img/wmremove-transformed (1).webp` (Home), `img/SME_→_MNC_Growth_Transformation_202605191212.webp` (BDaaS), `img/Gemini_Generated_Image_xd8lttxd8lttxd8l (1).webp` (About), `img/Image 1 (1).webp` (Contact), `img/imgi_5_business problems.webp` (Service).
   - *Fix*: Generate dedicated mobile-optimized webp variants (~480px width, < 30KB) and serve via responsive `<picture>` tags or `srcset`.
   - *Impact*: Reduces Hero LCP image payload from 152KB/120KB down to ~25KB (80%+ payload reduction), dropping LCP time by 1.5s+ on mobile.
3. **Eliminate Render-Blocking CDN CSS & Fonts**
   - *Files*: `index.html`, `About/index.html`, `Service/index.html`, `Bdaas/index.html`, `Contact/index.html`.
   - *Fix*: Asynchronously load Google Fonts, Bootstrap CSS, Bootstrap Icons, and FontAwesome CSS using `<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">` with fallback noscript tags, and add `font-display: swap`.
   - *Impact*: Eliminates 3-4 render-blocking HTTP network waterfalls, improving FCP and Speed Index by 400ms–800ms.

### P1 (High Impact – Target: CLS, TBT & Page Weight)
4. **Add Explicit Width & Height Attributes to ALL `<img>` Tags**
   - *Files*: All 5 HTML pages.
   - *Fix*: Add exact native `width="..." height="..."` attributes to every image element to allow browsers to reserve aspect-ratio layout space.
   - *Impact*: Reduces Cumulative Layout Shift (CLS) score close to 0.00.
5. **Add `loading="lazy"` to All Below-the-Fold Images**
   - *Files*: All 5 HTML pages.
   - *Fix*: Add `loading="lazy" decoding="async"` to all images below the initial fold (including executive photos, article thumbnails, card icons).
   - *Impact*: Defers ~1 MB+ of non-critical image downloads on mobile initial page load.
6. **Non-Blocking Analytics (Defer GTag / GA4)**
   - *Files*: All 5 HTML pages (`<head>`).
   - *Fix*: Add `defer` or move inline GTag initialization to execute after page load (`window.addEventListener('load')`).
   - *Impact*: Frees main-thread parser execution during critical initial render phase.

### P2 (Medium Impact – Target: CSS/JS Payload & Caching)
7. **Compress & Minify Local CSS Files**
   - *Files*: `css/home.css`, `css/about.css`, `css/service.css`, `css/bdaas.css`, `css/contact.css`.
   - *Fix*: Minify custom CSS stylesheets to eliminate unused comments and formatting whitespace.
   - *Impact*: Saves 20-30% on stylesheet transfer size.
8. **Optimize Navbar & Footer PNG Logo Asset**
   - *Files*: `img/Without BG Without Name.png` (129.51 KB).
   - *Fix*: Convert PNG logo to an optimized WebP vector/raster asset (~15 KB).
   - *Impact*: Saves ~114 KB of repetitive logo payload across all 5 pages.

### P3 (Low Risk / Maintenance Optimization)
9. **Article Thumbnail WebP Compression on BDaaS Page**
   - *Files*: `img/Article 1.webp` through `Article 4.webp` (Total ~950 KB).
   - *Fix*: Re-compress article thumbnails to 600px width at 80% WebP quality (~35 KB each).
   - *Impact*: Saves ~800 KB of total page weight on BDaaS page.

---

## 6. Verification & Rollout Strategy (Steps 9 & 10)

1. **Step-by-Step Staging**: Implement P0 fixes first, followed by P1 and P2.
2. **Safety & Zero Design Distortions**: Maintain exact responsive layout bounds, typography styles, button alignments, form endpoints, and interactive carousel behavior.
3. **Automated Verification**: Build/test workspace and run Node validation scripts for syntax integrity, console clean state, and image asset integrity.
