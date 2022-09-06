import Image from "next/image";
import Link from "next/link";
import { NextSeo } from "next-seo";

//Data Fetching
import { useQuery, dehydrate, QueryClient } from "@tanstack/react-query";
import { patreonRequestClient } from "src/lib/clients/axiosClient";
//Layout
import { getLayout } from "components/Layout/Layout";

const SubscribePage = ({ data }) => {
  const {
    isLoading,
    isError,
    data: postData,
    error,
  } = useQuery(
    ["patreon"],
    async () =>
      await patreonRequestClient.get(
        `https://www.patreon.com/api/oauth2/v2/campaigns/6702424?include=tiers&fields${encodeURIComponent(
          "[tier]"
        )}=title,description,image_url,url,amount_cents`
      ),
    { initialData: data }
  );

  return (
    <div className="grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mx-auto px-2 lg:px-0  max-w-[1920px]">
      {data.tierData.map((tier, idx) => {
        return (
          <Link
            key={idx}
            passHref
            href={`https://patreon.com${tier.attributes.url}`}
          >
            <a target="_blank">
              <article
                key={idx}
                className="shadow-xl rounded-lg border border-black overflow-hidden"
              >
                <Image
                  src={tier.attributes.image_url}
                  alt={tier.attributes.title}
                  width={500}
                  height={500}
                  blurDataURL={tier.attributes.image_url} //automatically provided
                  placeholder="blur" // Optional blur-up while loading
                  className="w-full p-0 m-0"
                />
                <div className="px-4 max-w-[500px]">
                  <h2 className="whitespace-normal m-0 py-2 pr-2 font-bold">
                    {tier.attributes.title}: {tier.attributes.amount_cents} per
                    month
                  </h2>
                  {tier?.attributes?.description && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: tier.attributes.description as string,
                      }}
                      className="pb-2 md:pb-4"
                    ></div>
                  )}
                </div>
              </article>
            </a>
          </Link>
        );
      })}
    </div>
  );
};

SubscribePage.getLayout = getLayout;

export const getStaticProps = async () => {
  const tierRes = await patreonRequestClient.get(
    `https://www.patreon.com/api/oauth2/v2/campaigns/6702424?include=tiers&fields${encodeURIComponent(
      "[tier]"
    )}=title,description,image_url,url,amount_cents`
  );

  const tierData = tierRes.data;

  return {
    props: {
      data: {
        tierData: tierData.included,
      },
    },
    revalidate: 10, // In seconds
  };
};

export default SubscribePage;
