import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          {/* <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css"
          /> */}
          <link rel="stylesheet" href="/css/antd.min.css" />
          <link rel="stylesheet" href="/css/style.css" />
          <link rel="stylesheet" href="/css/slick-theme.min.css" />
          <link rel="stylesheet" href="/css/slick.min.css" />
          <link
            rel="stylesheet"
            href="/font-awesome-4.7.0/css/font-awesome.min.css"
          />
          {/* Iubenda Cookie Solution */}
          <script type="text/javascript" dangerouslySetInnerHTML={{
            __html: `
              var _iub = _iub || [];
              _iub.csConfiguration = {
                "siteId":3962706,
                "cookiePolicyId":66875822,
                "lang":"en",
                "storage":{"useSiteId":true},
                "callback": {
                  onPreferenceExpressed: function(preference) {
                    if (preference) {
                      // Initialize GA when consent is given
                      window.initGAWithConsent && window.initGAWithConsent();
                    }
                  }
                }
              };
            `
          }} />
          <script type="text/javascript" src="https://cs.iubenda.com/autoblocking/3962706.js" />
          <script type="text/javascript" src="//cdn.iubenda.com/cs/gpp/stub.js" />
          <script type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
