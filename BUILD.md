# Hugo Site Build Instructions

## Prerequisites

Install Hugo (extended version required):

```bash
# macOS
brew install hugo

# Linux
# Download from https://github.com/gohugoio/hugo/releases
# Or use snap install hugo --channel=extended

# Verify installation
hugo version
```

## Building the Sites

### Xtext Website

```bash
cd xtext-website
hugo
```

Output goes to `xtext-website/public/`.

To run a local development server:
```bash
cd xtext-website
hugo server -D
```
Then open http://localhost:1313/Xtext/

### Xtend Website

```bash
cd xtend-website
hugo
```

Output goes to `xtend-website/public/`.

To run a local development server:
```bash
cd xtend-website
hugo server -D
```
Then open http://localhost:1313/Xtext/xtend/

### Building Both Sites (for deployment)

The Xtend site should be built into the Xtext site's `public/xtend/` directory:

```bash
# Build Xtext site
cd xtext-website
hugo

# Build Xtend site into Xtext's public directory
cd ../xtend-website
hugo --destination ../xtext-website/public/xtend
```

The combined output is now in `xtext-website/public/`.

## Output Structure

```
xtext-website/public/
├── index.html              # Xtext homepage
├── download.html
├── community.html
├── documentation/          # Xtext documentation
├── releasenotes/
├── news/
├── eclipse/               # Eclipse help format
│   ├── documentation/
│   ├── releasenotes/
│   └── ...
├── xtend/                 # Xtend website (when built with --destination)
│   ├── index.html
│   ├── documentation/
│   └── ...
├── css/
├── js/
└── images/
```

## Eclipse Help Output

The Xtext site automatically generates Eclipse help format output in `public/eclipse/`.

See [ECLIPSE_HELP.md](ECLIPSE_HELP.md) for details on integrating with the Eclipse help system.

## Content Management

### Adding a New Documentation Page

1. Create a markdown file in `content/documentation/`:
   ```
   ---
   title: My New Page
   type: documentation
   ---
   
   # My New Page
   
   Content here...
   ```

2. Add a link in `layouts/partials/documentation-menu.html`

### Adding a Release Note

Create a file in `content/releasenotes/` with the date prefix:
```
YYYY-MM-DD-version-X.Y.Z.md
```

Example: `2025-06-15-version-2.43.0.md`

Hugo will automatically extract the date from the filename.

### Adding a News Post

Create a file in `content/news/` with the date prefix:
```
YYYY-MM-DD-title.md
```

## Configuration

### Xtext Website (`hugo.toml`)

- `baseURL`: Set to `https://eclipse.dev/Xtext/`
- `uglyURLs`: `true` (generates `.html` files instead of directories)
- `[params]`: Custom variables like `src.xtext`, `javadoc.java`, etc.

### Xtend Website (`hugo.toml`)

- `baseURL`: Set to `https://eclipse.dev/Xtext/xtend/`
- Same structure as Xtext config

## Shortcodes

The Xtext site uses custom shortcodes for dynamic content:

- `{{< title >}}` - Outputs the page title
- `{{< src "xtext" >}}` - Expands to Xtext source URL
- `{{< javadoc "java" >}}` - Expands to Java API URL
- `{{< upsite "eclipse" >}}` - Expands to Eclipse URL

Example:
```markdown
See [IGenerator2]({{< src "xtext" >}}/org.eclipse.xtext/src/org/eclipse/xtext/generator/IGenerator2.java)
```

## Troubleshooting

### "date field not parsable" error

Hugo extracts dates from filenames automatically. Remove any `date:` fields from front matter in posts/releasenotes.

### CSS/JS not loading

Check that `baseURL` in `hugo.toml` matches your deployment URL. For local testing, use `hugo server` which handles this automatically.

### Template errors

Hugo uses Go templates, not Liquid. Common differences:
- `{{ .Title }}` not `{{ page.title }}`
- `{{ .Site.BaseURL }}` not `{{ site.baseurl }}`
- `{{ range .Pages }}` not `{% for post in site.posts %}`
