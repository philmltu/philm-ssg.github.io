module.exports = function (eleventyConfig) {
  // Copy compiled CSS to _site as /assets
  eleventyConfig.addPassthroughCopy({ "dist": "assets" });

  // Safe current year filter (avoid undefined "year" errors)
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
};
