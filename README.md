# Drop Radar landing page

A dedicated static export of the existing Drop Radar presentation landing page. It preserves the original French content, layout, illustrations, radar, reveal animations, timeline, filters, carousel, and demonstration reminder buttons.

The live application is [dropradar-app.fr](https://dropradar-app.fr). This landing page is independent of the application repository and its production services.

## Preview locally

Open a terminal in this directory and run:

```sh
python3 -m http.server 3011
```

Then open [http://localhost:3011](http://localhost:3011). Stop the server with `Ctrl+C`. No package installation, build, environment variables, or API keys are required.

## Files

- `index.html`: page content and inline SVG illustrations.
- `assets/styles.css`: the original page stylesheet, with relative image references.
- `assets/main.js`: the original authored interactions and animations.
- `assets/images/`: the eleven embedded source images extracted byte-for-byte, including the seahorse, four radar thumbnails, and six product illustrations.
- `ASSET_CREDITS.md`: original photograph credits and license links, mapped to the exported image filenames.
- `.nojekyll`: serves the directory as a plain static GitHub Pages site.

The original Google Fonts stylesheet remains in the HTML. It requests DM Sans, JetBrains Mono, Manrope, and Playfair Display. An internet connection is needed to load these fonts; local fallback fonts still render the page offline. All product illustrations and application code are local.

## Demonstration data and behavior

The six brands, products, prices, dates, and release states are fixed fictional examples, as stated on the page. Filters select their authored states. The previous/next controls scroll the carousel. Enabled reminder buttons only toggle their own `aria-pressed` state in the current page; reloading resets them. There is no storage, authentication, API call, database access, email delivery, or notification scheduling. The Supabase and server descriptions explain the real project's architecture; this export does not connect to either.

The original dates and states deliberately remain unchanged. They do not follow today's date: for example, the 7 November fixture remains labelled “À venir”, with enabled reminder buttons, even after that date. The disabled buttons on the released and cancelled examples are also fixed. A visible local-demo notice makes this explicit. Do not treat this page as a live catalogue or use its buttons to request real reminders.

The source uses viewport-dependent, one-time entrance animations. Resizing across a mobile/desktop breakpoint during a sequence does not restart it; reload at the intended viewport for a fresh demonstration. Reduced-motion preferences keep the filters and reminder toggles available while disabling the entrance sequences.

## GitHub Pages

Use a separate repository for this landing page. Upload the contents of this directory so that `index.html` and `assets/` are at the repository root. In the repository's **Settings → Pages**, select **Deploy from a branch**, choose the branch containing these files (usually `main`), and choose **/(root)**. Save the setting and wait for Pages to report the public URL.

Relative asset URLs work at both a domain root and a repository subpath. The footer links to the live application at `https://dropradar-app.fr`; existing section and demo links stay within this landing page. No deployment workflow, build service, or domain change is required. Published presentation: https://22niko-spw.github.io/drop-radar-landing/. The public repository is https://github.com/22niko-spw/drop-radar-landing.

## Provenance

Source: [the user's published Claude artifact](https://claude.ai/artifact/BgVQ3RvhgPB2cQefJM2rid), retrieved on 9 November 2026. The export removes the injected Claude frame preamble and runtime, their frame-runtime comments, and the runtime's messaging/telemetry code. It retains the single authored interaction script, externalizes the stylesheet and script, and decodes the original embedded images without alteration.

The only visible additions are the explicit local-demo notice and the footer link to the live application. Source-code comments are in English. The original French project text and authorship remain intact: Noham Oulma, David Lengellé, and Nicolas Ojeda, Holberton School. The relevant original photograph attributions and license links are preserved in [ASSET_CREDITS.md](ASSET_CREDITS.md), using this export’s filenames.
