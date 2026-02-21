import eleventySyntaxhighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

const mdOptions = {
  html: true,
  linkify: true,
  typographer: true
};

const md = markdownIt(mdOptions).use(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.headerLink()
});

export default function(eleventyConfig) {
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy({"favicon.ico": "favicon.ico"});
  eleventyConfig.addPassthroughCopy({"favicon.png": "favicon.png"});

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

  eleventyConfig.addFilter("date", (dateObj, format) => {
    if (!(dateObj instanceof Date)) {
      dateObj = new Date(dateObj);
    }
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  });

  eleventyConfig.addPlugin(eleventySyntaxhighlight);

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["md", "html", "liquid", "njk"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid"
  };
}
