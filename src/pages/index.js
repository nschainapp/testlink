import React from "react";

import Layout from "../components/layout";
//import { Link } from "@reach/router";
import GatsbyLink from "gatsby-link";

class BlogIndex extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <GatsbyLink
          to={"/v.1.5/test-docs/how-to/d-plugin-community-to-official"}
        >
          d-plugin-community-to-official
        </GatsbyLink>
        <br />
        <GatsbyLink to={"/v.1.5/test-docs/how-to/d-plugin"}>
          d-plugin
        </GatsbyLink>
        <br />

        <br />
        <GatsbyLink
          to={"/v.1.5/test-docs/how-to/install-test-release-as-a-trial"}
        >
          install-test-release-as-a-trial
        </GatsbyLink>
        <br />
        <GatsbyLink to={"/v.1.5/test-docs/how-to/install-test-release"}>
          install-test-release
        </GatsbyLink>
      </Layout>
    );
  }
}

export default BlogIndex;
