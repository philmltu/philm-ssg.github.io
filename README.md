# PHILM Movie Club Website

This site is built with **Eleventy** (11ty).  
It shows the latest movie posts on the homepage and has static pages like "About" and "Contact".

## Run locally
```bash
npm install
npm run start
```
The site will be at http://localhost:8080

## Adding new movies
1. Create a new file in `posts/`, for example:
   ```
   posts/2025-09-28-new-movie.md
   ```
2. Use this template:
   ```markdown
   ---
   layout: layouts/post.njk
   title: Movie Title
   date: 2025-09-28
   image: /assets/images/movie.png
   description: Short one-line summary.
   ---
   Write the full movie description here.
   ```
3. Add the movie poster to `assets/images/`.

The new post will automatically appear on the homepage.

## Adding new pages
- Create `something.md` in the root with:
  ```markdown
  ---
  layout: layouts/base.njk
  title: Page Title
  ---
  # Page Title
  Your content here.
  ```

## For AI
If you want AI help later, just ask it:  
- “Give me a new `post` file for a movie with date/title/description.”  
- “Give me a new page file in Eleventy format.”  
- “Update `base.njk` to include X in the header/footer.”  
- “Update CSS in `assets/css/style.css` to change styling.”
