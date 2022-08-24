import Image from "next/image";
import Link from "next/link";

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
    <div>
      {data.tierData.map((tier, idx) => {
        return (
          <Link
            key={idx}
            passHref
            href={`https://patreon.com${tier.attributes.url}`}
          >
            <a target="_blank">
              <article>
                <Image
                  src={tier.attributes.image_url}
                  alt={tier.attributes.title}
                  width={500}
                  height={500}
                  blurDataURL={tier.attributes.image_url} //automatically provided
                  placeholder="blur" // Optional blur-up while loading
                />
                <h2>{tier.attributes.title}</h2>
                <h3>{tier.attributes.amount_cents} CENTS</h3>
                <p>{tier.attributes.description}</p>
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
  };
};

export default SubscribePage;
