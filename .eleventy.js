// .eleventy.js
module.exports = function (eleventyConfig) {
  // ---- Passthroughs ----
  eleventyConfig.addPassthroughCopy({ "dist": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/uploads": "uploads" });
  eleventyConfig.addPassthroughCopy({ "src/assets/posters": "assets/posters" });

  // ---- Filters ----
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());
  eleventyConfig.addFilter("readableDate", (value) => {
    const d = value instanceof Date ? value : new Date(value);
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  });
  eleventyConfig.addFilter("head", (arr, n) => {
    if (!Array.isArray(arr)) return [];
    if (n < 0) return arr.slice(n);
    return arr.slice(0, n);
  });

  // ---- Collections ----
  eleventyConfig.addCollection("movies", (collection) =>
    collection.getFilteredByGlob("./src/movies/*.md").sort(
      (a, b) => new Date(a.data.date) - new Date(b.data.date)
    )
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
