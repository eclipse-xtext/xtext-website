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
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPassthroughCopy({"../org.eclipse.xtext.doc/book.css": "book.css"});
  eleventyConfig.addPassthroughCopy({"../org.eclipse.xtext.doc/code.css": "code.css"});

  eleventyConfig.addCollection("documentation", (api) =>
    api.getFilteredByGlob("documentation/*.md")
  );

  eleventyConfig.addPlugin(eleventySyntaxhighlight);

  return {
    dir: {
      input: ".",
      output: "../org.eclipse.xtext.doc/contents",
      includes: "_includes/eclipse",
      layouts: "_layouts/eclipse",
      data: "_data"
    },
    templateFormats: ["md", "html", "liquid"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid"
  };
}
