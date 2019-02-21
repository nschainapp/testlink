require("dotenv").config({
  path: `.env`
});

module.exports = {
  pathPrefix: "/images",
  siteMetadata: {
    title:
      "XebiaLabs documentation || Intelligence and Automation for Enterprise DevOps",
    maxVersion: "8.5",
    allProducts: JSON.parse(process.env.ALL_PRODUCTS),
    allVersions: JSON.parse(process.env.ALL_VERSIONS),
    allCategories: JSON.parse(process.env.ALL_CATEGORIES)
  },

  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sass",
    "gatsby-plugin-catch-links",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${__dirname}/src/docs`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        gfm: true,
        commonmark: true,
        footnotes: true,
        pedantic: true,
        // blocks: ["h2"], Blocks option value can be provided here as an array.
        excerpt_separator: `<!-- end -->`,
        // pathPrefix: "../../../..",
        plugins: [
          "gatsby-remark-static-images",
          "gatsby-remark-copy-linked-files",
          {
            resolve: `gatsby-remark-smartypants`,
            options: {
              dashes: `oldschool`,
              ignoreFileExtensions: []
            }
          },

          `gatsby-remark-prismjs`,
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-katex`
        ]
      }
    },
    "gatsby-transformer-sharp",
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "gatsby-starter-default",
        short_name: "starter",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/images/gatsby-icon.png" // This path is relative to the root of the site.
      }
    },
    {
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: {
        // Fields to index
        fields: [
          "title",
          "tags",
          "slug",
          "category",
          "subject",
          "product",
          "html",
          "rawMarkdownBody"
        ], //"title", "tags","slug",, "rawMarkdownBody"
        // How to resolve each field`s value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields` values
          MarkdownRemark: {
            title: node => node.frontmatter.title,
            tags: node => node.frontmatter.tags,
            category: node => node.frontmatter.category,
            subject: node => node.frontmatter.subject,
            slug: node => node.fields.slug,
            product: node => node.frontmatter.product,
            html: node => node.html,
            rawMarkdownBody: node => node.rawMarkdownBody,
            path: node => node.frontmatter.path
          }
        }
      }
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/favicon.ico",
        start_url: "/",
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          opengraph: false,
          twitter: false,
          yandex: false,
          windows: true
        }
      }
    },
    "gatsby-plugin-offline"
  ]
};
