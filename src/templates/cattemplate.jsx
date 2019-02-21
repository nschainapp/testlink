import React from "react";
import { graphql } from "gatsby";
//const windowGlobal = typeof window !== "undefined" && window;

export default class docs extends React.Component {
  render() {
    return <a href="www.google.com">saaa</a>;
  }
}
export const postQuery = graphql`
  query DocByCategory($gcategory: String!, $regex: String!) {
    allMarkdownRemark: allMarkdownRemark(
      filter: {
        fields: { slug: { regex: $regex } }
        frontmatter: { category: { eq: $gcategory } }
      }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            subject
            product
            category
          }
          fields {
            slug
          }
        }
      }
    }

    configData: site {
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
        allProducts {
          value
          label
        }
        allVersions {
          value
          label
        }
      }
    }
  }
`;
