# Xtend Website

This is the Xtend website (https://eclipse.dev/Xtext/xtend/).

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
# Build the site (outputs to ../xtext-website/_site/xtend/)
npm run build

# Start development server with hot reload
npm run serve
```

The site will be available at http://localhost:8080.

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

## Deployment

The Xtend site builds into `../xtext-website/_site/xtend/` so both sites can be deployed together.