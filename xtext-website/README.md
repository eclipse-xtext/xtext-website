# Xtext Website

This is the main Xtext website (https://eclipse.dev/Xtext/).

## Building with Eleventy (11ty)

### Prerequisites

- Node.js 18 or later
- npm

### Installation

```bash
npm install
```

### Development

```bash
# Build the site
npm run build

# Start development server with hot reload
npm run serve
```

The site will be available at http://localhost:8080. Output is written to `_site/`.

### Eclipse Help Output

To generate documentation for Eclipse IDE help:

```bash
npm run build:eclipse
```

Output goes to `../org.eclipse.xtext.doc/contents/` (configure path in `eleventy.eclipse.config.js`).

## Project Structure

```
_data/           # Global site data (site.json)
_includes/       # Partials (head.html, header.html, footer.html)
_layouts/        # Page templates
_posts/          # Release notes and news
documentation/   # Documentation pages
```

## Adding Content

### Release Notes

Create files in `_posts/releasenotes/` with naming: `YYYY-MM-DD-version-X-Y-Z.md`

### Documentation

Add markdown files to `documentation/` with front matter:

```yaml
---
layout: documentation
title: Topic Title
---
```

## Updating Eclipse Help in Xtext Repo

1. Make documentation changes in this repo
2. Test with `npm run serve`
3. Build Eclipse help: `npm run build:eclipse`
4. Copy output to `org.eclipse.xtext.doc/contents/` in Xtext repo
5. Generate `toc.xml` if structure changed
6. Commit to both repos
