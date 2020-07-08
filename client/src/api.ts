import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: "http://localhost:8080/v1/graphql",
});

export const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  link: link,

  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export const route_one: L.LatLngTuple[] = [[45.63803, -122.60242]];
