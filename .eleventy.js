// .eleventy.js
module.exports = function (eleventyConfig) {
  // ---- Passthroughs ----
  eleventyConfig.addPassthroughCopy({ "dist": "dist" }); // CSS ends up at /dist/css/styles.css
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/uploads": "uploads" });
  eleventyConfig.addPassthroughCopy({ "src/assets/posters": "assets/posters" });

  // ---- Filters ----
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());

  eleventyConfig.addFilter("readableDate", (value) => {
    const d = value instanceof Date ? value : new Date(value);
    return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "2-digit" });
  });

  // Take first/last N items
  eleventyConfig.addFilter("head", (arr, n) => {
    if (!Array.isArray(arr)) return [];
    if (n < 0) return arr.slice(n);
    return arr.slice(0, n);
  });

  // ---- Collections ----
  // Movies sorted by date ascending
  eleventyConfig.addCollection("movies", (collection) =>
    collection.getFilteredByGlob("./src/movies/*.md").sort((a, b) =>
      new Date(a.data.date) - new Date(b.data.date)
    )
  );

  // Team collection: all Markdown files in src/team, sorted by `order` then name
  eleventyConfig.addCollection("team", (collection) => {
    const items = collection.getFilteredByGlob("./src/team/*.md");
    items.sort((a, b) => {
      const ao = Number.isFinite(+a.data.order) ? +a.data.order : 9999;
      const bo = Number.isFinite(+b.data.order) ? +b.data.order : 9999;
      if (ao !== bo) return ao - bo;
      const an = (a.data.name || "").toLowerCase();
      const bn = (b.data.name || "").toLowerCase();
      return an.localeCompare(bn);
    });
    return items;
  });

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
