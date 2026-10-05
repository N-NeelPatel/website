# n-neelpatel.github.io/website

Personal site of Neel Patel, senior backend & AI engineer. Built with [Astro](https://astro.build) and Tailwind CSS, deployed to GitHub Pages.

## Develop

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + static build into dist/
```

## Editing content

- **Profile, metrics, experience, principles, skills:** `src/data/profile.ts`
- **Case studies:** one Markdown file per study in `src/content/work/` (frontmatter schema in `src/content.config.ts`)
- **Social preview image:** `public/og.png` (1200×630)

## Deploy

Every push to `main` builds and deploys via `.github/workflows/deploy.yml` (GitHub Actions → Pages).
