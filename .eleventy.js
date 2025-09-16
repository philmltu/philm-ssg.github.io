// .eleventy.js
module.exports = function (eleventyConfig) {
  // --- Passthroughs ---
  eleventyConfig.addPassthroughCopy({ "dist": "dist" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/uploads": "uploads" });
  eleventyConfig.addPassthroughCopy({ "src/assets/posters": "assets/posters" });

  // Watch the uploads folder so the dev server reloads when you add images
  eleventyConfig.addWatchTarget("src/uploads");

  // --- Data merge (nice to have) ---
  eleventyConfig.setDataDeepMerge(true);

  // --- Filters ---
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());

  eleventyConfig.addFilter("readableDate", (value) => {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  });

  // Return the first n items of an array (like many 11ty starters)
  eleventyConfig.addFilter("head", (arr, n) => {
    if (!Array.isArray(arr)) return [];
    if (n < 0) return arr.slice(n);
    return arr.slice(0, n);
  });

  // --- Collections ---
  eleventyConfig.addCollection("movies", (collectionApi) => {
    const items = collectionApi
      .getFilteredByGlob("src/movies/*.md")
      .filter((p) => p.data && p.data.date)
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date));

    // Debug: list the movies Eleventy sees (enable by setting process.env.E11TY_DEBUG=1)
    if (process.env.E11TY_DEBUG) {
      console.log("\n[11ty] Movies collection:");
      for (const it of items) {
        console.log(
          " -",
          it.filePathStem.replace(/^.*src[\\/]/, ""),
          "| date:",
          it.data.date
        );
      }
    }
    return items;
  });

  eleventyConfig.addCollection("team", (collectionApi) => {
    const items = collectionApi
      .getFilteredByGlob("src/team/*.md")
      .sort((a, b) => {
        const ao = a.data.order ?? 0;
        const bo = b.data.order ?? 0;
        if (ao !== bo) return ao - bo;
        return (a.data.name || "").localeCompare(b.data.name || "");
      });

    if (process.env.E11TY_DEBUG) {
      console.log("\n[11ty] Team collection:");
      for (const it of items) {
        console.log(
          " -",
          it.filePathStem.replace(/^.*src[\\/]/, ""),
          "| name:",
          it.data.name
        );
      }
    }
    return items;
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
