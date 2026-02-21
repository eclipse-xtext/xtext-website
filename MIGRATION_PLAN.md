# Static Site Generator Migration Plan

## Executive Summary

**Current state:** Jekyll (Ruby-based) with outdated dependencies and painful maintenance

**Recommendation:** Migrate to **Eleventy (11ty)** for lower migration risk due to Liquid template compatibility.

**Alternative:** Hugo if template rewriting is acceptable and cleaner native multi-output is preferred.

---

## Current Architecture

### Websites
- `xtext-website/` - Main Xtext website (https://eclipse.dev/Xtext/)
- `xtend-website/` - Xtend website (https://eclipse.dev/Xtext/xtend/)

### Directory Structure
```
xtext-website/
├── _config.yml          # Jekyll config (Kramdown, GFM, custom vars)
├── _layouts/            # HTML templates (default.html, documentation.html, etc.)
├── _includes/           # Partials (head.html, header.html, footer.html)
├── _posts/              # Release notes and news
│   ├── releasenotes/    # Version release notes
│   └── news/            # News posts
├── documentation/       # Documentation pages (.md and .html)
├── css/, js/           # Static assets
└── index.html          # Homepage

xtend-website/
├── _config.yml          # Separate config with baseurl: /Xtext/xtend
├── _layouts/, _includes/, _posts/
└── download.md
```

### Jekyll Configuration
```yaml
# Key settings from _config.yml
markdown: kramdown
kramdown:
  input: GFM
  toc_levels: 1..4

# Custom variables
src:
  xtext: "https://github.com/eclipse-xtext/xtext/blob/main"
javadoc:
  java: "https://docs.oracle.com/javase/11/docs/api"
```

### Jekyll Plugins Used
- `jekyll-markdown-block` - Markdown processing in blocks
- `therubyracer` / `execjs` - JavaScript runtime

### Eclipse Help Generation
Located at: `/home/dietrich/xtext-main/git/xtext/org.eclipse.xtext.doc/`

Current workflow (Ant):
1. Swaps `documentation.html` layout with `documentation-eclipse.html`
2. Runs Jekyll build
3. Copies output to `contents/` directory
4. Generates `toc.xml` via Java tool (`gen_toc.jar`)

Output: `contents/*.html`, `contents/toc.xml`, `contents/book.css`, `contents/code.css`

### Deployment
- Jenkins pipeline builds both sites
- Xtext site built first, Xtend built into `_site/xtend` subdirectory
- Deployed to GitHub Pages (xtext-website-publish repo)

---

## Option A: Eleventy (11ty) Migration

### Why 11ty?
- **Liquid compatibility** - Existing templates work with minimal changes
- **JavaScript ecosystem** - Familiar to most developers
- **Flexible** - Multiple template engines supported
- **Active community** - Good documentation and plugins

### Migration Steps

#### Phase 1: Setup (Day 1)
```bash
# Initialize npm project
cd xtext-website
npm init -y
npm install --save-dev @11ty/eleventy

# Install plugins
npm install --save-dev @11ty/eleventy-plugin-syntaxhighlight
npm install --save-dev markdown-it-anchor
```

#### Phase 2: Configuration (Day 1-2)

Create `eleventy.config.js`:
```javascript
import eleventySyntaxhighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

const mdOptions = {
  html: true,
  linkify: true,
  typographer: true
};

const md = markdownIt(mdOptions).use(markdownItAnchor);

export default function(eleventyConfig) {
  // Markdown config (GFM-like)
  eleventyConfig.setLibrary("md", md);

  // Passthrough copies
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy({"favicon.ico": "favicon.ico"});

  // Layouts from _includes
  eleventyConfig.setLayoutsDirectory("_includes");

  // Collections
  eleventyConfig.addCollection("releasenotes", (api) =>
    api.getFilteredByGlob("_posts/releasenotes/*.md")
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("news", (api) =>
    api.getFilteredByGlob("_posts/news/*.md")
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("documentation", (api) =>
    api.getFilteredByGlob("documentation/*.md")
  );

  // Global data (migrate from _config.yml)
  eleventyConfig.addGlobalData("site", {
    title: "Xtext - Language Engineering Framework",
    url: "https://eclipse.dev",
    baseurl: "/Xtext",
    src: {
      xtext: "https://github.com/eclipse-xtext/xtext/blob/main",
      mwe: "https://github.com/eclipse-mwe/mwe/blob/master",
      emf: "https://git.eclipse.org/r/plugins/gitiles/emf/org.eclipse.emf/+/refs/tags/R2_20_0"
    },
    javadoc: {
      java: "https://docs.oracle.com/javase/11/docs/api",
      guice: "https://google.github.io/guice/api-docs/latest/javadoc",
      junit: "https://junit.org/junit4/javadoc/4.13"
    }
  });

  // Plugins
  eleventyConfig.addPlugin(eleventySyntaxhighlight);

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "html", "liquid", "njk"],
    markdownTemplateEngine: "liquid"
  };
};
```

#### Phase 3: Template Migration (Day 2-3)

Most Liquid templates work as-is. Minor changes needed:

**_includes/head.html** - Change variable syntax:
```liquid
<!-- Before (Jekyll) -->
<title>{{ page.title }} - {{ site.title }}</title>

<!-- After (11ty) - same, works! -->
<title>{{ title }} - {{ site.title }}</title>
```

**_includes/header.html** - Navigation:
```liquid
<!-- Works in 11ty with collections -->
{% for doc in collections.documentation %}
  <a href="{{ doc.url }}">{{ doc.data.title }}</a>
{% endfor %}
```

**Layouts** - Move to `_includes/`:
```
_layouts/default.html → _includes/default.html
_layouts/post.html    → _includes/post.html
```

Update front matter in content files:
```yaml
---
layout: default    # stays the same
title: My Page
---
```

#### Phase 4: Eclipse Help Output (Day 3-4)

Create separate config for Eclipse help: `eleventy.eclipse.config.js`

```javascript
import eleventyConfig from "./eleventy.config.js";

export default function(config) {
  // Inherit base config
  eleventyConfig(config);

  // Override layout directory for Eclipse templates
  config.setLayoutsDirectory("_includes/eclipse");

  // Different output directory
  return {
    dir: {
      input: ".",
      output: "../org.eclipse.xtext.doc/contents",
      includes: "_includes/eclipse"
    }
  };
}
```

Create Eclipse-specific layouts in `_includes/eclipse/`:
```html
<!-- _includes/eclipse/default.html -->
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>{{ title }}</title>
  <link href="book.css" rel="stylesheet" type="text/css">
  <link href="code.css" rel="stylesheet" type="text/css">
  <link rel="home" href="index.html" title="">
</head>
<body>
{{ content }}
</body>
</html>
```

Build command:
```bash
# Website
npx @11ty/eleventy

# Eclipse help
npx @11ty/eleventy --config=eleventy.eclipse.config.js
```

#### Phase 5: Xtend Website (Day 4)

Similar setup in `xtend-website/` with:
- Different `baseurl: "/Xtext/xtend"`
- Same template structure

Build into parent's `_site/xtend/`:
```javascript
// xtend-website/eleventy.config.js
export default {
  dir: {
    output: "../xtext-website/_site/xtend"
  }
};
```

#### Phase 6: Jenkins Update (Day 5)

Update `Jenkinsfile`:
```groovy
stage('Generate site') {
  steps {
    container('xtext-buildenv') {
      dir ('git-repo/xtext-website') {
        sh '''
          npm ci
          npx @11ty/eleventy
        '''
      }
      dir ('git-repo/xtend-website') {
        sh '''
          npm ci
          npx @11ty/eleventy
        '''
      }
    }
  }
}
```

### Estimated Timeline: 5 days

### 11ty Migration Checklist
- [x] ~~Initialize npm projects~~ (Not used - Hugo chosen)
- [x] ~~Create eleventy.config.js for xtext-website~~ (Not used - Hugo chosen)
- [x] ~~Create eleventy.config.js for xtend-website~~ (Not used - Hugo chosen)
- [x] ~~Migrate global data from _config.yml~~ (Not used - Hugo chosen)
- [x] ~~Set up collections (releasenotes, news, documentation)~~ (Not used - Hugo chosen)
- [x] ~~Move layouts to _includes/~~ (Not used - Hugo chosen)
- [x] ~~Test Liquid templates compatibility~~ (Not used - Hugo chosen)
- [x] ~~Create Eclipse help config and layouts~~ (Not used - Hugo chosen)
- [x] ~~Update Jenkinsfile~~ (Not used - Hugo chosen)
- [x] ~~Test deployment~~ (Not used - Hugo chosen)
- [ ] Update Eclipse help generation in xtext repo

---

## Option B: Hugo Migration

### Why Hugo?
- **Fastest builds** - milliseconds vs seconds
- **Single binary** - no dependency management
- **Native multi-output** - cleaner architecture for website + Eclipse help
- **Active development** - very popular, well-maintained

### Migration Steps

#### Phase 1: Setup (Day 1)
```bash
# Create new Hugo site
cd xtext-website
hugo new site . --force

# Directory structure will be created:
# archetypes/, content/, data/, layouts/, static/, themes/
```

#### Phase 2: Configuration (Day 1-2)

Create `hugo.toml`:
```toml
baseURL = 'https://eclipse.dev/Xtext/'
title = 'Xtext - Language Engineering Framework'
languageCode = 'en-us'

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
  [markup.tableOfContents]
    endLevel = 4
    startLevel = 1

# Custom output format for Eclipse help
[outputFormats.eclipse]
  mediaType = 'text/html'
  path = 'eclipse'
  isHTML = true
  permalinkable = true

# Enable both outputs
[outputs]
  home = ['html']
  section = ['html', 'eclipse']
  page = ['html', 'eclipse']

# Custom site parameters (migrate from _config.yml)
[params]
  [params.src]
    xtext = "https://github.com/eclipse-xtext/xtext/blob/main"
    mwe = "https://github.com/eclipse-mwe/mwe/blob/master"
  [params.javadoc]
    java = "https://docs.oracle.com/javase/11/docs/api"
    guice = "https://google.github.io/guice/api-docs/latest/javadoc"

[taxonomies]
  tag = "tags"
  category = "categories"
```

#### Phase 3: Content Migration (Day 2)

```bash
# Hugo has a Jekyll importer
hugo import jekyll /path/to/jekyll/site
```

This converts:
- `_posts/` → `content/posts/`
- `_pages/` → `content/`
- Front matter is converted

Manual migration for documentation:
```
documentation/301_grammarlanguage.md → content/documentation/301_grammarlanguage.md
```

#### Phase 4: Template Rewrite (Day 2-4)

Convert Liquid to Go templates:

**layouts/_default/baseof.html** (base template):
```html
<!DOCTYPE html>
<html>
{{ partial "head.html" . }}
<body>
  {{ partial "header.html" . }}
  {{ block "main" . }}{{ end }}
  {{ partial "footer.html" . }}
</body>
</html>
```

**layouts/_default/single.html** (website):
```html
{{ define "main" }}
<article>
  <h1>{{ .Title }}</h1>
  {{ .Content }}
</article>
{{ end }}
```

**layouts/_default/single.eclipse.html** (Eclipse help):
```html
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>{{ .Title }}</title>
  <link href="book.css" rel="stylesheet" type="text/css">
  <link href="code.css" rel="stylesheet" type="text/css">
</head>
<body>
  {{ .Content }}
</body>
</html>
```

**layouts/_default/list.html** (section listings):
```html
{{ define "main" }}
<h1>{{ .Title }}</h1>
{{ .Content }}
<ul>
{{ range .Pages }}
  <li><a href="{{ .RelPermalink }}">{{ .Title }}</a></li>
{{ end }}
</ul>
{{ end }}
```

**partials/head.html**:
```html
<head>
  <meta charset="utf-8">
  <title>{{ .Title }} - {{ .Site.Title }}</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
```

#### Phase 5: Static Assets (Day 3)
```
css/     → static/css/
js/      → static/js/
images/  → static/images/
```

#### Phase 6: Eclipse Help Build (Day 4)

Single build produces both outputs:
```bash
hugo

# Output:
# public/                    <- Website
# public/eclipse/            <- Eclipse help
```

For Eclipse help only (separate build):
```bash
# hugo.eclipse.toml
baseURL = '/'
disableKinds = ['home', 'taxonomy', 'term']

hugo --config hugo.eclipse.toml --destination ../org.eclipse.xtext.doc/contents
```

#### Phase 7: Xtend Website (Day 4-5)

Similar Hugo setup with:
```toml
# xtend-website/hugo.toml
baseURL = 'https://eclipse.dev/Xtext/xtend/'
title = 'Xtend - Modernized Java'
```

Build output to parent:
```bash
hugo --destination ../xtext-website/public/xtend
```

#### Phase 8: Jenkins Update (Day 5)

Update `Jenkinsfile`:
```groovy
stage('Generate site') {
  steps {
    sh '''
      cd xtext-website && hugo
      cd ../xtend-website && hugo --destination ../xtext-website/public/xtend
    '''
  }
}
```

### Estimated Timeline: 5 days

### Hugo Migration Checklist
- [x] Install Hugo
- [x] Create hugo.toml for xtext-website
- [x] Import Jekyll content
- [x] Create layouts (convert Liquid to Go templates)
  - [x] baseof.html
  - [x] single.html
  - [x] single.eclipse.html
  - [x] list.html
  - [x] partials (head, header, footer)
- [x] Migrate static assets
- [x] Create hugo.toml for xtend-website
- [x] Test builds
- [x] Update Jenkinsfile
- [ ] Update Eclipse help generation in xtext repo (manual step)

---

## Feature Comparison

| Feature | Current (Jekyll) | 11ty | Hugo |
|---------|-----------------|------|------|
| Build speed | Slow (2+ min) | Fast (1-2s) | Fastest (ms) |
| Dependencies | Ruby + gems | Node.js + npm | Single binary |
| Template engine | Liquid | Liquid, Nunjucks, etc. | Go templates |
| Multi-output | Via Ant swap | Pagination workaround | Native support |
| Learning curve | N/A | Low (Liquid compatible) | Medium |
| Migration effort | N/A | Low | Medium-High |
| Maintenance | Painful | Easy | Easy |

---

## Recommendation

### Primary: Eleventy (11ty)

**Rationale:**
1. **Lower risk** - Liquid templates mostly work without modification
2. **Familiar ecosystem** - Node.js is more common than Ruby
3. **Good enough performance** - Build time drops from minutes to seconds
4. **Active community** - Well-documented, growing adoption

**Tradeoff:** Multi-output requires pagination workaround, but this is a one-time setup.

### Alternative: Hugo

**When to choose:**
1. Build speed is critical (thousands of pages)
2. Template rewriting is acceptable
3. Cleaner architecture for multi-output is preferred
4. No Node.js in environment preferred

**Tradeoff:** More upfront work to rewrite templates, but cleaner long-term architecture.

---

## Post-Migration Benefits

### Immediate
- ✅ Modern, actively maintained tooling
- ✅ Faster builds (instant feedback during development)
- ✅ Simpler dependency management
- ✅ Better local development experience

### Long-term
- ✅ Easier onboarding for new contributors
- ✅ More predictable builds in CI/CD
- ✅ Better plugin ecosystem
- ✅ Community support and documentation

---

## Next Steps

1. **Decision**: Choose 11ty or Hugo based on team preference
2. **Prototype**: Create minimal working version for one documentation page
3. **Validate**: Test Eclipse help output
4. **Full migration**: Follow detailed checklist
5. **Deploy**: Update Jenkins and deploy

---

## Files to Create

### For 11ty Migration:
- `xtext-website/package.json`
- `xtext-website/eleventy.config.js`
- `xtext-website/eleventy.eclipse.config.js`
- `xtext-website/_data/site.json`
- `xtend-website/package.json`
- `xtend-website/eleventy.config.js`

### For Hugo Migration:
- `xtext-website/hugo.toml`
- `xtext-website/layouts/_default/baseof.html`
- `xtext-website/layouts/_default/single.html`
- `xtext-website/layouts/_default/single.eclipse.html`
- `xtext-website/layouts/partials/head.html`
- `xtend-website/hugo.toml`

---

## Questions/Decisions Needed

- [ ] Confirm 11ty vs Hugo preference
- [ ] Verify Eclipse help requirements (toc.xml generation)
- [ ] Confirm deployment target remains GitHub Pages
- [ ] Identify any custom Jekyll plugins that need porting
