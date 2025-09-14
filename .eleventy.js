// .eleventy.js
module.exports = function (eleventyConfig) {
  // ---- Passthroughs ----
  eleventyConfig.addPassthroughCopy({ "dist": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/uploads": "uploads" });
  eleventyConfig.addPassthroughCopy({ "src/assets/posters": "assets/posters" });

  // ---- Filters ----
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());

  // ---- Collections ----
  eleventyConfig.addCollection("movies", (collection) =>
    collection.getFilteredByGlob("./src/movies/*.md").sort((a, b) =>
      new Date(a.data.date) - new Date(b.data.date)
    )
  );

  // ---- Return config ----
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
