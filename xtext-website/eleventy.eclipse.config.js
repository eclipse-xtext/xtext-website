import eleventySyntaxhighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";

const mdOptions = {
  html: true,
  linkify: true,
  typographer: true
};

const md = markdownIt(mdOptions)
  .use(markdownItAnchor)
  .use(markdownItAttrs);

export default function(eleventyConfig) {
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPassthroughCopy({"../../xtext/org.eclipse.xtext.doc/book.css": "book.css"});
  eleventyConfig.addPassthroughCopy({"../../xtext/org.eclipse.xtext.doc/code.css": "code.css"});

  eleventyConfig.addCollection("documentation", (api) =>
    api.getFilteredByGlob("documentation/*.md")
  );

  eleventyConfig.ignores.add("_posts");
  eleventyConfig.ignores.add("community.html");
  eleventyConfig.ignores.add("download.html");
  eleventyConfig.ignores.add("releasenotes.html");
  eleventyConfig.ignores.add("index.html");
  eleventyConfig.ignores.add("documentation/*.html");
  eleventyConfig.ignores.add("documentation/index.html");
  eleventyConfig.ignores.add("_layouts/*.html");
  eleventyConfig.ignores.add("_includes");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("documentation.html");

  eleventyConfig.addPlugin(eleventySyntaxhighlight);

  eleventyConfig.addGlobalData("eleventyComputed.permalink", () => {
    return (data) => {
      if (data.page.filePathStem && data.page.filePathStem.startsWith("/documentation/")) {
        return `/${data.page.fileSlug}.html`;
      }
      return data.permalink;
    };
  });

  return {
    dir: {
      input: ".",
      output: "../../xtext/org.eclipse.xtext.doc/contents",
      includes: "_includes/eclipse",
      layouts: "_layouts/eclipse",
      data: "_data"
    },
    templateFormats: ["md", "html"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid"
  };
}
