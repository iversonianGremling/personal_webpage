/* eslint-disable quotes */
import { defineConfig, Plugin } from "vite"; // Import Plugin type
import react from "@vitejs/plugin-react-swc";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import fs from "fs/promises";
import path from "path";

// Type declaration for Post
interface Post {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  image?: string;
  date: string;
  tags?: string[];
}

// Function to parse post content
function parsePostContent(content: string) {
  try {
    const dom = new JSDOM(`<div>${content}</div>`);
    const doc = dom.window.document;

    // Get the first image
    const firstImageEl = doc.querySelector("img");
    const firstImage = firstImageEl ? firstImageEl.src : null;

    // Get text content for description
    let description = doc.body.textContent || "";
    description = description.trim().substring(0, 160);
    if (description.length === 160) description += "...";

    return { firstImage, description };
  } catch (error) {
    console.error("Error parsing post content:", error);
    return { firstImage: null, description: "" };
  }
}

// Function to fetch all posts during build time
async function getPostsData(): Promise<Post[]> {
  try {
    const apiUrl = "https://api.velavelucci.com";

    const response = await fetch(`${apiUrl}/posts/`);

    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.statusText}`);
      return [];
    }

    const posts = (await response.json()) as Post[];
    return posts;
  } catch (error) {
    console.error("Error fetching posts for prerendering:", error);
    return [];
  }
}

// Pre-defined static routes
const staticRoutes = ["/", "/posts"];

// Custom prerender plugin that works with ES modules
function createPrerenderPlugin(options: {
  routes: string[];
  staticDir: string;
  transformHtml?: (
    html: string,
    ctx: { route: string },
  ) => Promise<string> | string;
}): Plugin {
  return {
    name: "custom-prerender-plugin",
    apply: "build",
    enforce: "post" as const, // Use "as const" to specify this is a literal type

    async closeBundle() {
      const { routes, staticDir, transformHtml } = options;
      console.log(`Prerendering ${routes.length} routes...`);

      // Create output directory if it doesn't exist
      try {
        await fs.mkdir(staticDir, { recursive: true });
      } catch (error) {
        // Directory already exists or other error
      }

      for (const route of routes) {
        try {
          // Determine output file path
          const outputPath =
            route === "/"
              ? path.join(staticDir, "index.html")
              : path.join(staticDir, route, "index.html");

          // Ensure directory exists
          const outputDir = path.dirname(outputPath);
          await fs.mkdir(outputDir, { recursive: true });

          // Read the base HTML file
          const baseHtml = await fs.readFile(
            path.join(staticDir, "index.html"),
            "utf-8",
          );

          // Apply transformation if provided
          let finalHtml = baseHtml;
          if (transformHtml) {
            const transformedHtml = await transformHtml(baseHtml, { route });
            if (transformedHtml) {
              finalHtml = transformedHtml;
            }
          }

          // Write the transformed HTML to the output path
          await fs.writeFile(outputPath, finalHtml);
          console.log(`Prerendered: ${route} -> ${outputPath}`);
        } catch (error) {
          console.error(`Error prerendering route ${route}:`, error);
        }
      }

      console.log("Prerendering complete!");
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "prerender-posts",
      async buildStart() {
        // Fetch posts and cache their routes before build starts
        console.log("Fetching posts for prerendering...");
        try {
          const posts = await getPostsData();
          const postRoutes = posts.map(
            (post) => `/post/${post.id || post._id}`,
          );

          // Add the post routes to the static routes
          staticRoutes.push(...postRoutes);
          console.log(
            `Added ${postRoutes.length} post routes for prerendering`,
          );
        } catch (error) {
          console.error("Failed to fetch posts for prerendering:", error);
        }
      },
    },
    createPrerenderPlugin({
      routes: staticRoutes,
      staticDir: "dist",

      transformHtml: async (html, { route }) => {
        // For post routes
        const postMatch = route.match(/\/post\/([a-zA-Z0-9-_]+)/);
        if (postMatch) {
          const postId = postMatch[1];
          const posts = await getPostsData();
          const post = posts.find((p) => (p.id || p._id) === postId);

          if (post) {
            try {
              // Parse content and generate meta tags
              const { firstImage, description } = parsePostContent(
                post.content,
              );

              // Handle possible HTML entities in title and description
              const escapeHtml = (text: string) => {
                return text
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;");
              };

              const safeTitle = escapeHtml(post.title);
              const safeDescription = escapeHtml(description);

              const ogImage =
                firstImage ||
                post.image ||
                "https://velavelucci.com/default-image.jpg";

              // Insert meta tags
              const metaTags = `
                <title>${safeTitle} | VELA VELUCCI</title>
                <meta name="description" content="${safeDescription}">
                <meta property="og:title" content="${safeTitle}">
                <meta property="og:description" content="${safeDescription}">
                <meta property="og:image" content="${ogImage}">
                <meta property="og:url" content="https://velavelucci.com${route}">
                <meta property="og:type" content="article">
                <meta name="twitter:card" content="summary_large_image">
              `;

              // Replace head content
              return html.replace("</head>", `${metaTags}</head>`);
            } catch (error) {
              console.error(
                `Error generating meta tags for post ${postId}:`,
                error,
              );
            }
          }
        }

        return html;
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: true,
      },
    },
    cors: true,
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (
            assetInfo.name &&
            assetInfo.name.match(/icon|image|styles|fonts/i)
          ) {
            return "assets/[name][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
