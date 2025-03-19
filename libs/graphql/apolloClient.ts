import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const SANITY_GRAPHQL_URL = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/graphql/production/default`;

const client = new ApolloClient({
  link: new HttpLink({ uri: SANITY_GRAPHQL_URL }),
  cache: new InMemoryCache(),
});

export default client;
