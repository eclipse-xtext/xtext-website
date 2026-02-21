# Eclipse Xtext Website

This repository contains the websites [https://eclipse.dev/Xtext/](https://eclipse.dev/Xtext) and [https://eclipse.dev/Xtext/xtend](https://eclipse.dev/Xtext/xtend). For general information about Xtext, see the [main repository](https://github.com/eclipse/xtext).

The [published](https://github.com/eclipse/xtext-website/tree/published) branch corresponds to what is published on the actual websites. Fixes that should be made visible immediately must be committed there. The [main](https://github.com/eclipse/xtext-website/tree/main) branch is used to write documentation and release notes for the next major or minor release of Xtext.

## Building the Websites

The websites are built with [Eleventy (11ty)](https://www.11ty.dev/), a modern static site generator.

### Prerequisites

- Node.js 18 or later
- npm

### Quick Start

```bash
# Build Xtext website
cd xtext-website
npm install
npm run build

# Build Xtend website (outputs to xtext-website/_site/xtend)
cd ../xtend-website
npm install
npm run build
```

### Development Server

```bash
# Start local development server with hot reload
cd xtext-website
npm run serve
# Opens at http://localhost:8080

cd xtend-website
npm run serve
# Opens at http://localhost:8080
```

### Build Output

- `xtext-website/_site/` - Xtext website
- `xtext-website/_site/xtend/` - Xtend website (built into parent's output)

## Project Structure

```
xtext-website/
├── _data/           # Global data files (site.json)
├── _includes/       # Partials (head.html, header.html, footer.html)
├── _layouts/        # Page templates
│   └── eclipse/     # Eclipse help specific layouts
├── _posts/          # Blog posts and release notes
│   ├── news/
│   └── releasenotes/
├── documentation/   # Documentation pages
├── css/, js/        # Static assets
├── eleventy.config.js        # Main 11ty config
└── eleventy.eclipse.config.js # Eclipse help output config

xtend-website/
├── _data/           # Global data files
├── _includes/       # Partials
├── _layouts/        # Page templates
├── documentation/   # Documentation pages
└── eleventy.config.js
```

## Eclipse Help Documentation

The documentation is also used to generate Eclipse help content for the Xtext IDE plugin. The output goes to the `org.eclipse.xtext.doc` project in the main Xtext repository.

### Building Eclipse Help

```bash
cd xtext-website
npm run build:eclipse
```

This outputs to `../org.eclipse.xtext.doc/contents/` (adjust path in `eleventy.eclipse.config.js` as needed).

### Workflow for Updating Xtext Repo Docs

1. **Make changes** to documentation in `xtext-website/documentation/`
2. **Test locally** with `npm run serve`
3. **Build Eclipse help** with `npm run build:eclipse`
4. **Copy output** to Xtext repo:
   ```bash
   # Assuming xtext repo is at ../xtext
   cp -r _eclipse-output/* ../org.eclipse.xtext.doc/contents/
   ```
5. **Generate TOC** if needed (the `toc.xml` is generated separately)
6. **Commit** to both repositories

### Eclipse Help Structure

The Eclipse help uses a simplified layout (`_layouts/eclipse/documentation.html`) that:
- Uses `book.css` and `code.css` from Eclipse
- Has no navigation header/footer
- Is suitable for embedding in Eclipse IDE help system

## Adding New Content

### Release Notes

Create a new file in `_posts/releasenotes/`:

```markdown
---
layout: post
title: Version X.Y.Z
date: 2026-01-15
---

## New Features
...

## Bug Fixes
...
```

### Documentation Pages

Create in `documentation/` with front matter:

```markdown
---
layout: documentation
title: My Topic
---

# My Topic

Content here...
```

## Deployment

The sites are deployed via Jenkins CI to GitHub Pages. See `Jenkinsfile` for build configuration.

## Migration from Jekyll

This site was migrated from Jekyll to Eleventy. Key changes:
- `page.title` → `title` (front matter variables are top-level)
- `page.path` → `page.inputPath` (for edit links)
- `site.edit-repo` → `site['edit-repo']` (bracket notation for hyphenated keys)
- Layouts remain in `_layouts/`, includes in `_includes/`
- Collections defined in `eleventy.config.js` instead of `_config.yml`
