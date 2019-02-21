import React, { Component } from "react";
// import Markdown from "react-remarkable";
export default class document extends Component {
  render() {
    let htmlFixedLinks = this.fixLinksInDocument(this.props.post.html);
    return (
      <section className="doc-search-result-articles">
        <article className="doc-search-result mb-4">
          <h3>{this.props.post.frontmatter.title}</h3>
          <div
            className="doc-search-result-content px-md-5 py-3"
            dangerouslySetInnerHTML={{
              __html: htmlFixedLinks
            }}
          />
        </article>
      </section>
    );
  }

  fixLinksInDocument(htmlText) {
    let txt = htmlText;
    let slug = this.props.post.fields.slug;
    let ver = slug.split("/")[1];
    //let capp = slug.split("/")[2];
    //const regex = /\]\(\/xl-([^)]+)\)/g;
    let regex = /<a href="\/xl-([^>]+)>/g;
    let m = regex.exec(txt);
    while (m !== undefined && m !== null) {
      let finded = m[0];
      finded = finded.replace('<a href="', '<a href="/' + ver);
      finded = finded.replace(".html", "");
      txt = txt.replace(m[0], finded);
      m = regex.exec(txt);
    }
    regex = /src="%5Cstatic%5C/g;
    m = regex.exec(txt);
    while (m !== undefined && m !== null) {
      let finded = m[0];
      finded = finded.replace('src="%5Cstatic%5C', 'src="../../../../static/');
      txt = txt.replace(m[0], finded);
      m = regex.exec(txt);
    }
    regex = /src="\/images\//g;
    m = regex.exec(txt);
    while (m !== undefined && m !== null) {
      let finded = m[0];
      finded = finded.replace('src="/images/', 'src="../../../../static/');
      txt = txt.replace(m[0], finded);
      m = regex.exec(txt);
    }
    //Stxt = txt.replace("{:.table .table-striped}", "");
    return txt;
  }
}
