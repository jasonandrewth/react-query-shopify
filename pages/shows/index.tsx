import React from "react";

//Data Fetching
import { useQuery, dehydrate, QueryClient } from "@tanstack/react-query";
import { patreonRequestClient } from "src/lib/clients/axiosClient";
//Layout
import { getLayout } from "components/Layout/Layout";

const ShowsPage = ({ data }) => {
  //   const { isLoading, isError, data, error } = useQuery(
  //     ["patreon"],
  //     async () => await patreonRequestClient.get("campaigns/6702424/posts"),
  //     { initialData: postData }
  //   );

  console.log("post data", data.postData);
  console.log("tier data", data.tierData);

  return (
    <div>
      {/* {posts.map((post, idx) => {
        return <p key={idx}>{JSON.stringify(post)}</p>;
      })} */}
    </div>
  );
};

ShowsPage.getLayout = getLayout;

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  const res = await patreonRequestClient.get(
    `https://www.patreon.com/api/oauth2/v2/campaigns/6702424/posts?fields${encodeURIComponent(
      "[post]"
    )}=url,title,content`
  );
  const postData = res.data;

  ("campaigns/6702424?include=tiers&fields[tier]=title,description,image_url,url");

  const tierRes = await patreonRequestClient.get(
    `https://www.patreon.com/api/oauth2/v2/campaigns/6702424?include=tiers&fields${encodeURIComponent(
      "[tier]"
    )}=title,description,image_url,url`
  );

  const tierData = tierRes.data;

  //   const data = await res.json();

  return {
    props: {
      data: {
        postData: postData,
        tierData: tierData,
      },
    },
  };
};

export default ShowsPage;
