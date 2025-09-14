module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  // Human-friendly date filter (built-in JS, no deps)
  eleventyConfig.addFilter("friendlyDate", function(dateObj) {
    if(!(dateObj instanceof Date)) dateObj = new Date(dateObj);
    return dateObj.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  // Year shortcode for Nunjucks
  eleventyConfig.addShortcode("year", () => new Date().getFullYear());

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};
