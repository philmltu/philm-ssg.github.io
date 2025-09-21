// src/movies/dir.11tydata.js
function pad(n) { return String(n).padStart(2, "0"); }

// Parse a front matter date safely (handles "YYYY-MM-DD", Date objects, and ISO strings)
function parseFrontMatterDate(val) {
  if (val instanceof Date && !isNaN(val)) return val;

  if (typeof val === "string") {
    // Accept "YYYY-MM-DD" exactly and avoid TZ shifts
    const m = val.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      const [_, y, mo, d] = m;
      return new Date(Number(y), Number(mo) - 1, Number(d)); // local midnight, no offset issues
    }
    // Fallback: try generic Date parsing for ISO strings
    const t = new Date(val);
    if (t instanceof Date && !isNaN(t)) return t;
  }
  return null;
}

module.exports = {
  // Always use the movie layout
  layout: "layouts/movie.njk",

  eleventyComputed: {
    permalink: (data) => {
      // Prefer explicit front-matter `date`
      let d = parseFrontMatterDate(data.date);

      // As a final fallback, try Eleventy’s page date (from filename if present)
      if (!d && data.page && data.page.date instanceof Date && !isNaN(data.page.date)) {
        d = data.page.date;
      }

      const slug = data.page?.fileSlug || "untitled";

      if (d) {
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        return `movies/${yyyy}-${mm}-${dd}-${slug}/index.html`;
      }

      // No valid date: still generate a working page
      return `movies/${slug}/index.html`;
    },
  },
};
