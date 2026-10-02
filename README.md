# Athion Studio — GitHub Pages

Production-ready static website for **Athion Studio**, operated by Athion Private Limited.

## Production hardening included
- Optimized WebP portfolio imagery; original heavy PNGs removed from the deploy bundle
- Responsive image loading with intrinsic dimensions, async decoding and lazy loading
- Custom 1200×630 social preview image
- Open Graph + large Twitter/X preview metadata
- Canonical URLs and page-specific SEO metadata
- Organization, WebSite, Service and WebPage structured data
- `robots.txt`, curated `sitemap.xml` and custom `404.html`
- Keyboard skip link, visible focus states and reduced-motion support
- Visitor-entered direction text safely escaped before DOM insertion
- `.nojekyll` included for predictable GitHub Pages deployment
- SVG favicon

## Direction system
The interactive **Athion Direction** experience is a lightweight, deterministic browser-based recommendation flow. It uses predefined service rules rather than claiming to be a generative AI system.

## Canonical domain
SEO URLs currently use `https://athionstudio.com/`. If the production domain changes, update canonical URLs, Open Graph URLs, structured data, `robots.txt`, sitemap locations and the social preview image URL before deployment.

## GitHub Pages
Publish the contents of this folder from the repository root. In GitHub, open **Settings → Pages**, choose the branch/folder containing these files, and keep HTTPS enabled. Configure the custom domain there if required.

## Contact form
The contact form submits to the configured Basin endpoint already present in `contact.html`. Verify the Basin destination and email delivery settings in the Basin dashboard before launch.
