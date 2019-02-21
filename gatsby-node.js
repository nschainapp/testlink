const path = require("path");
const fs = require("fs");
const { createFilePath } = require(`gatsby-source-filesystem`);
require("dotenv").config({
  path: `.env`
});

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `docs` });
    createNodeField({
      name: `slug`,
      node,
      value: slug
    });
    //if (slug.length > 0) console.log(slug);
  }
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  const { createRedirect } = actions;

  var allRedirects = fs.readFileSync("_redirects.yml", "utf8");
  allRedirects = allRedirects.split(/\n/);

  allRedirects.forEach(row => {
    if (row.trim() !== "" && row[0] !== "#") {
      let rowdata = row.split(" : ");
      if (rowdata[0] !== undefined && rowdata[1] !== undefined)
        if (rowdata[0].trim() !== "" && rowdata[1].trim() !== "") {
          let linkTo = rowdata[1].trim();
          if (linkTo.indexOf("/latest/") === 0) {
            linkTo = linkTo.replace(
              "/latest/",
              "/" + process.env.MAX_VERSION_LINK_PREFIX + "/"
            );
          }
          createRedirect({
            fromPath: rowdata[0].trim(),
            redirectInBrowser: true,
            toPath: linkTo
          });
        }
    }
  });

  const docsTemplate = path.resolve("src/templates/docs.js");
  const categoryTemplate = path.resolve("src/templates/cattemplate.jsx");

  return graphql(`
    {
      documentQuery: allMarkdownRemark {
        edges {
          node {
            html
            id
            frontmatter {
              category
              title
              product
              subject
            }
            fields {
              slug
            }
          }
        }
      }
      categoryQuery: site {
        siteMetadata {
          allCategories {
            version
            products {
              product
              categories {
                value
                label
              }
            }
          }
        }
      }
    }
  `).then(res => {
    if (res.errors) {
      return Promise.reject(res.errors);
    }

    res.data.categoryQuery.siteMetadata.allCategories.forEach(
      ({ version, products }) => {
        let ver = version;
        products.forEach(product => {
          product.categories.forEach(category => {
            if (category.value !== undefined) {
              let cat = [];
              cat.push(category.value);
              createPage({
                path:
                  "v." +
                  version +
                  "/" +
                  product.product +
                  "/" +
                  category.value.replace(/\s+/g, "-").toLowerCase(),
                component: categoryTemplate,
                context: {
                  regex:
                    "/v." +
                    version +
                    "/" +
                    product.product +
                    "|" +
                    "v." +
                    version +
                    "/xl-platform/",
                  version: version,
                  product: product.product,
                  gcategory: category.value
                }
              });
            }
          });
        });
      }
    );

    res.data.documentQuery.edges.forEach(({ node }) => {
      let parts = node.fields.slug.split("/");
      let curVer = parts[1].replace("v.", "");
      let curApp = parts[2];
      if (node.fields.slug.indexOf("xl-platform") > -1) {
        if (
          node.frontmatter.product !== null &&
          node.frontmatter.product !== undefined
        )
          node.frontmatter.product.forEach(element => {
            createPage({
              path: node.fields.slug.replace("xl-platform", element),
              component: docsTemplate,
              context: {
                version: curVer,
                product: element,
                category: node.frontmatter.category,
                document: node.frontmatter.title,
                regex:
                  node.fields.slug +
                  "|" +
                  node.fields.slug.replace("xl-platform", element)
              }
            });
          });
      } else {
        createPage({
          path: node.fields.slug,
          component: docsTemplate,
          context: {
            version: curVer,
            product: curApp,
            category: node.frontmatter.category,
            document: node.frontmatter.title,
            regex: node.fields.slug
          }
        });
        createRedirect({
          fromPath: node.fields.slug.slice(0, -1) + ".html",
          redirectInBrowser: true,
          toPath: node.fields.slug
        });
      }
    });
  });
};
