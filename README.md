# GZR Enterprises Employee Digital Cards

A standalone, mobile-first cards site for GZR Enterprises employees. The custom domain root provides a simple landing page, while each employee has a direct card URL:

`https://cards.gzrenterprises.com/`

`https://cards.gzrenterprises.com/ghrazielle_deramos/`

This project is intentionally independent from the main GZR website. It uses a small editable employee-card list with no database or admin dashboard. Brand logos and company-name links point to the GZR website, but the cards app does not depend on the main site's source or routes.

## Employee card template

The current card entry is **Ghrazielle Rei de Ramos**, **Underpaid Only Anak** at `ghrazielle_deramos`.

To add another employee card in this same repository:

1. Add a new `EmployeeCard` object to `employeeCards` in `src/App.tsx`, with a unique HR-approved lowercase `username`, employee details, optional `additionalEmail`, editable `heroBio`, editable `note`, editable `shareCaption`, an optional website and `websiteLabel`, a local portrait path, and accurate image alt text.
2. Add the new employee's approved headshot under `public/`, using the `headshot-givenname_lastname.jpg` naming convention, then reference it with `${import.meta.env.BASE_URL}filename.jpg`.
3. Keep the existing `initialEmployee` object for Ghrazielle, or replace the sample values if this repository copy is intended to start with a different employee.
4. The root landing page reads `employeeCards` automatically. Each entry appears at `cards.gzrenterprises.com/<slug>/`.
5. Have HR provide the canonical `givenname_lastname` username. Edit that one value in `initialEmployee`; the URL slug, company email (`username@gzrenterprises.com`), headshot filename (`headshot-givenname_lastname.jpg`), and vCard filename (`GZR-givenname_lastname.vcf`) update from it automatically.
6. Replace `public/gzr-logo.png` only if the brand asset changes.
7. Build and deploy the same repository. Do not create another repository or change `CNAME`.

The contact actions are native `tel:` and `mailto:` links. The company email is generated from the HR-approved username. `additionalEmail` is blank by default; if filled, it appears after the company address, for example `ghrazielle_deramos@gzrenterprises.com, ghrazielle.deramos@gmail.com`. “Save to Contacts” creates a standards-compatible `.vcf` file in the browser using both email addresses when available. Downloaded contact files use the `GZR-givenname_lastname.vcf` naming format.

### Messenger and social link previews

The nested employee URL has a dedicated `public/ghrazielle_deramos/index.html` entry, so GitHub Pages serves it with HTTP 200 and social crawlers receive the card title, description, and absolute 8-bit JPEG `og-card-ghrazielle_deramos.jpg` preview image. The browser then follows the static meta redirect into the interactive React card. The `404.html` fallback remains for other direct nested paths. If Messenger shows an older preview after a change, send the URL again with a harmless query string such as `?preview=2`; Messenger caches link previews independently.

## Edit or remove an existing card

To edit Ghrazielle’s current card, open `src/App.tsx` and update the values in `initialEmployee`. The `username` is the only identifier to edit for the URL, company email, headshot filename, and vCard filename. The name, title, company, phone, optional additional email, website, website button title, LinkedIn URL, location, hero bio, note, share caption, contact links, vCard, and page copy use that record. If the HR-approved username changes, rename the matching `headshot-givenname_lastname.jpg` file in `public/`; the portrait path updates automatically. Keep `additionalEmail` blank unless the employee wants another email displayed; when filled, it appears after the generated company email. Set `website` and `websiteLabel` to the employee’s own site when appropriate; leave `website` empty to use the GZR website and the default “GZR Website” button title. Set `linkedin` to an employee’s personal LinkedIn profile, or leave it empty to use the GZR Enterprises company profile automatically. The `shareCaption` becomes the message text when the browser’s native share sheet is used; the card URL is still attached separately.

To remove a card, delete its entry from the `employeeCards` array. If it is no longer used by another entry, its headshot can also be deleted from `public/`. The old employee URL will no longer resolve to a card; keep `CNAME`, the Pages workflow, and the fallback source files.

## Local development

This is a Vite + React app. From the repository root:

```bash
pnpm install
PORT=5173 BASE_PATH=/ pnpm run dev
```

For the workspace artifact preview, the managed service provides `PORT` and `BASE_PATH`; use the `employee-cards` artifact preview instead of changing the main company site.

Production build:

```bash
PORT=5173 BASE_PATH=/ pnpm run build
```

The GitHub Pages build uses `BASE_PATH=/` because the custom domain serves the site from the domain root.

The repository keeps compressed base64 sources for the two HTML entry files so they can be copied safely through the repository upload flow. `pnpm run dev` and `pnpm run build` materialize `index.html` and `public/404.html` automatically before starting Vite.

## GitHub Pages and custom domain setup

1. Create a new GitHub repository for the cards project. Copy the contents of this folder into that repository, including `.github/workflows/deploy-pages.yml`, `public/404.gz.b64`, `pnpm-lock.yaml`, and `CNAME`. The workflow materializes `public/404.html` during the build.
2. Push the repository's default branch as `main`.
3. In GitHub, open **Settings → Pages** and set the source to **GitHub Actions**.
4. Add the custom domain `cards.gzrenterprises.com` in the Pages settings. The repository's `CNAME` file contains the same value.
5. At the DNS provider, create a `CNAME` record:

    - **Name/host:** `cards`
   - **Target/value:** `<your-github-username>.github.io`
   - **TTL:** provider default

   If the repository owner uses an organization account, use that organization's GitHub Pages host instead.
6. Wait for DNS and the Pages certificate check to complete. The workflow publishes the built `dist/public` directory automatically on pushes to `main`.
7. Program each NFC card with its direct employee URL, for example `https://cards.gzrenterprises.com/ghrazielle_deramos/`.

GitHub Pages can return `404.html` for a direct nested visit. The included fallback redirects that visit to the root entry while preserving the employee path, so the card still loads on an NFC tap and after a browser refresh.

## Project structure

```text
src/App.tsx                           # employee card list, landing page, card UI, vCard action
src/index.css                         # GZR visual language and responsive styling
site-entry.gz.b64                     # compressed source for the Vite index.html entry
public/gzr-logo.png                   # self-contained local GZR mark
public/og-card-ghrazielle_deramos.jpg # Messenger/Facebook link preview image
public/og-card-ghrazielle_deramos.png # original high-depth preview asset
public/ghrazielle_deramos/index.html  # HTTP 200 nested route with share metadata
public/404.gz.b64                     # compressed source for the GitHub Pages fallback
pnpm-lock.yaml                        # standalone dependency lockfile for Pages CI
.github/workflows/                    # cards-only Pages deployment
CNAME                                 # cards.gzrenterprises.com
```