import Link from "next/link";

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

  const posts = data.postData.data;

  return (
    <div>
      {posts.map((post, idx) => {
        return (
          <Link
            key={idx}
            passHref
            href={`https://patreon.com${post.attributes.url}`}
          >
            <a target="_blank">
              <article key={idx}>
                <h2>{post.attributes.title}</h2>
                <p>{post.attributes.content}</p>
              </article>
            </a>
          </Link>
        );
      })}
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

  return {
    props: {
      data: {
        postData: postData,
      },
    },
  };
};

export default ShowsPage;
