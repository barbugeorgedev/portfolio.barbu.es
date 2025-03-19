"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "../libs/graphql/apolloClient";

export default function ApolloProviderWrapper({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
