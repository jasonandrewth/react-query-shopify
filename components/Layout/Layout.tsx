import Head from "next/head";
import Link from "next/link";

import { gql } from "graphql-request";
import { GraphQLResponse } from "graphql-request/dist/types";

import {
  useGetNavItemsQuery,
  GetNavItemsQuery,
  useGetAllCollectionsQuery,
  GetAllCollectionsQuery,
  Collection,
} from "src/generated/graphql";

import graphqlRequestClient from "src/lib/clients/graphqlRequestClient";

import Nav from "components/Shared/Nav";

interface IProps {
  main: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ main }) => {
  const {
    isLoading: navItemsLoading,
    error: navItemsError,
    isError: isNavItemsError,
    data: navItemsData,
  } = useGetNavItemsQuery<GetNavItemsQuery, Error>(
    graphqlRequestClient,
    {},
    { staleTime: Infinity, cacheTime: Infinity }
  );

  const {
    isLoading,
    error,
    isError,
    data: collectionsData,
  } = useGetAllCollectionsQuery<GetAllCollectionsQuery, Error>(
    graphqlRequestClient,
    {},
    { staleTime: Infinity, cacheTime: Infinity }
  );

  if (isLoading || navItemsLoading) return <h1>loading...</h1>;

  if (isError || navItemsError) return <h1>{JSON.stringify(error)}</h1>;

  const navIds = navItemsData.menu.items.map((menuItem) => {
    return menuItem.resourceId;
  });

  const displayedCollections = collectionsData.collections.nodes.filter(
    (node) => {
      return navIds.includes(node.id);
    }
  );

  return (
    <>
      <Head>
        <title>Layouts Example</title>
      </Head>
      <Nav />
      {displayedCollections &&
        displayedCollections.map((collection) => {
          return (
            <Link
              as={`/collections/${collection.handle}`}
              href="/collections/[id]"
              key={collection.handle}
            >
              <span className="mr-4">{collection.title}</span>
            </Link>
          );
        })}
      <main className="p-8">{main}</main>
    </>
  );
};

export default Layout;

const GET_ALL_COLS_QUERY = gql`
  query getProducts($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          title
          handle
        }
      }
    }
  }
`;
