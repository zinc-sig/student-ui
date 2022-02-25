import { ApolloProvider } from '@apollo/client'
import { parse } from "cookie";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fad } from "@fortawesome/pro-duotone-svg-icons";
import { far } from "@fortawesome/pro-regular-svg-icons";
import { useApollo } from "../lib/apollo";
import { ZincProvider } from "../contexts/zinc";

import 'react-gh-like-diff/dist/css/diff2html.min.css';
import "../styles/index.css"

library.add(fad, far);

function ZincApp({ Component, pageProps, user, semester, cookie }) {
  let initialApolloState = {};
  if(pageProps) {
    initialApolloState = pageProps.initialApolloState;
  }
  const client = useApollo(cookie, initialApolloState);

  return (
    <ApolloProvider client={client}>
      <ZincProvider user={user} semester={semester}>
        <Component {...pageProps}/>
      </ZincProvider>
    </ApolloProvider>
  )
}

ZincApp.getInitialProps = async ({ctx}) => {
  const { user, semester } = parse(ctx.req.headers.cookie);
  return {
    cookie: ctx.req.headers.cookie,
    user: parseInt(user, 10),
    semester: parseInt(semester, 10)
  }
}

export default ZincApp