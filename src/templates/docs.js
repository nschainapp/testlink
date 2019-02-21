import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Headroom from "react-headroom";
//import Header from "../components/header";
//import Footer from "../components/footer";
//import LeftSidebar from "../components/leftsidebar";
//import Breadcrumb from "../components/breadcrumb";
import Document from "../components/document";
//import { navigate } from "gatsby";
//import { Redirect } from "@reach/router";

export default class docs extends React.Component {
  constructor(props) {
    super(props);
    let currenturl = this.props.location.pathname.split("/");

    let cat = "installation";
    //console.log(typeof this.props.pageContext.category);
    if (typeof this.props.pageContext.category === "object") {
      if (this.props.pageContext.category !== null)
        cat = this.props.pageContext.category[0];
    }
    this.state = {
      post: props.data.markdownRemark,
      allDocuments: this.props.pageContext.alldocs,
      selecFilter: "",

      currenturl: currenturl,
      firstCategory: this.getFirstCategory(
        this.props.pageContext.version,
        this.props.pageContext.product
      ),
      selectedCategory: cat,
      selectedDocument: this.props.pageContext.document,
      selectedCategoryDocuments: [],
      allCategories: [],
      lazyLoadEnabled: true,
      xlVersions: [],
      queryText: "",
      query: "",
      selectedApplication: props.data.configData.siteMetadata.allProducts.filter(
        p => p.value === this.props.pageContext.product
      )[0],
      selectedVersion: props.data.configData.siteMetadata.allVersions.filter(
        p => p.value === this.props.pageContext.version
      )[0],
      results: [],
      displayLengthText: "",
      displayQueryText: "",
      resultCount: -1,
      showAllResults: false,
      showAllResultsCategory: ""
    };
  }

  categoryOnClickHandler(key) {
    this.setState({
      selectedCategory: key
    });
  }
  getFirstCategory(version, product) {
    let cat = "installation";
    try {
      cat = this.props.data.configData.siteMetadata.allCategories
        .find(o => o.version === version)
        .products.find(o => o.product === product).categories[0].value;
    } catch (e) {}
    return cat;
  }
  changeStateFromChild = childState => {
    this.setState(childState);
  };

  componentDidMount() {
    if (
      this.props.location.state !== undefined &&
      this.props.location.state !== null
    ) {
      this.setState({
        query: this.props.location.state.query,
        lazyLoadEnabled: false
      });
    } else this.setState({ lazyLoadEnabled: false });
  }
  showSearchResults = showIt => {
    this.setState({
      showSearchResults: showIt
    });
  };

  showAllOnClickHandler = app => {
    this.setState({
      showAllResults: true,
      showAllResultsCategory: app
    });
  };
  convertNameForDisplay(appName) {
    appName = appName.split("-");
    appName[0] = appName[0].toUpperCase();
    appName[1] = appName[1].charAt(0).toUpperCase() + appName[1].substr(1);
    return appName.join(" ");
  }
  leftsbClickCategory = cat => {
    this.setState({
      selectedCategory: "" + cat
    });
    this.leftsidebar.categoryOnClickHandler(cat);
  };

  render() {
    return (
      <Layout>
        <Headroom style={{ height: "92px" }} />

        <div
          className={
            this.state.lazyLoadEnabled
              ? "lazy-load container-fluid"
              : "container-fluid"
          }
          value={"-" + this.state.lazyLoadEnabled + "-"}
        >
          {
            <div
              className="d-none"
              value={"-" + this.state.lazyLoadEnabled + "-"}
            />
          }
          <div className="row">
            <section className="col-lg-9 py-4 px-5">
              <Document post={this.props.data.markdownRemark} />
            </section>
          </div>
        </div>
      </Layout>
    );
  }
}
export const postQuery = graphql`
  query DocBySlug($regex: String!) {
    markdownRemark: markdownRemark(fields: { slug: { regex: $regex } }) {
      html
      rawMarkdownBody
      frontmatter {
        title
        category
        product
      }
      fields {
        slug
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
    # ProductsAndVersions: site {
    #   siteMetadata {
    #     allProducts {
    #       value
    #       label
    #     }
    #     allVersions {
    #       value
    #       label
    #     }
    #     maxVersion
    #   }
    # }
    # ProductsAndVersions: allMarkdownRemark {
    #   edges {
    #     node {
    #       frontmatter {
    #         category
    #         title
    #         product
    #         subject
    #       }
    #       fields {
    #         slug
    #       }
    #     }
    #   }
    # }
    # SearchIndexQuery: siteSearchIndex {
    #   index
    # }
  }
`;
