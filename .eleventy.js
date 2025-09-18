// .eleventy.js
module.exports = function (eleventyConfig) {
  // --- Passthroughs ---
  eleventyConfig.addPassthroughCopy({ "dist": "dist" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/uploads": "uploads" });
  eleventyConfig.addPassthroughCopy({ "src/assets/posters": "assets/posters" });
  eleventyConfig.addWatchTarget("src/uploads");

  // --- Data merge ---
  eleventyConfig.setDataDeepMerge(true);

  // --- Filters ---
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());

  eleventyConfig.addFilter("readableDate", (value) => {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "2-digit" });
  });

  // Return first n items (used in index)
  eleventyConfig.addFilter("head", (arr, n) => {
    if (!Array.isArray(arr)) return [];
    if (n < 0) return arr.slice(n);
    return arr.slice(0, n);
  });

  // --- Base collections ---
  eleventyConfig.addCollection("movies", (c) => {
    const items = c.getFilteredByGlob("src/movies/*.md")
      .filter((p) => p.data && p.data.date)
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date));

    if (process.env.E11TY_DEBUG) {
      console.log("\n[11ty] Movies collection:");
      for (const it of items) {
        console.log(" -", it.filePathStem.replace(/^.*src[\\/]/, ""), "| date:", it.data.date);
      }
    }
    return items;
  });

  eleventyConfig.addCollection("team", (c) => {
    const items = c.getFilteredByGlob(["src/team/*.md", "src/team/*.njk"])
      .sort((a, b) => {
        const ao = a.data.order ?? 0;
        const bo = b.data.order ?? 0;
        if (ao !== bo) return ao - bo;
        return (a.data.name || "").localeCompare(b.data.name || "");
      });

    if (process.env.E11TY_DEBUG) {
      console.log("\n[11ty] Team collection:");
      for (const it of items) {
        console.log(" -", it.filePathStem.replace(/^.*src[\\/]/, ""), "| name:", it.data.name);
      }
    }
    return items;
  });

  // --- Derived collections (Upcoming / Past) ---
  eleventyConfig.addCollection("moviesUpcoming", (c) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return c.getFilteredByGlob("src/movies/*.md")
      .filter((p) => p.data && p.data.date)
      .filter((p) => new Date(p.data.date) >= today)
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date)); // ascending: next first
  });

  eleventyConfig.addCollection("moviesPast", (c) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return c.getFilteredByGlob("src/movies/*.md")
      .filter((p) => p.data && p.data.date)
      .filter((p) => new Date(p.data.date) < today)
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date)); // most recent past first
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
