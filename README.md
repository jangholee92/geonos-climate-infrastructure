# GEONOS Infrastructure

Interactive climate-to-energy and resilience decision prototype for cold
storage and data centers.

## Local development

```bash
npm ci
npm run dev -- --host 0.0.0.0 --port 4173
```

Open `http://localhost:4173`.

## Validation

```bash
npm run lint
npm test
npm run build:pages
```

## GitHub Pages

The repository includes `.github/workflows/pages.yml`. On every push to
`main`, GitHub Actions builds the static site into `gh-pages` and deploys it to
GitHub Pages.

For a new repository, open **Settings → Pages → Build and deployment** and
select **GitHub Actions** once. The next push to `main` will publish the site.

## Evidence boundary

- Hunts Point is a real public redevelopment case; its facility energy use,
  refrigeration design, tariff, and battery are modeled.
- Project Atlas is a hypothetical 24 MW Queens data center.
- All outputs are planning estimates pending site interval data, equipment
  curves, and an applicable tariff.
