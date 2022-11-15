import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import type { NextPageContext } from "next";
import { useImmer } from "use-immer";

import { InputLabel, MenuItem, FormControl, Select } from "@material-ui/core";

import { SHOPIFY_CHECKOUT_ID_COOKIE } from "lib/const";

import nookies from "nookies";
import { useQueryClient } from "@tanstack/react-query";
import { shopifyGraphqlRequestClient } from "src/lib/clients/graphqlRequestClient";

//Swiper
//Swiper
import { Swiper } from "swiper";
import { Swiper as SwiperSlider, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Lazy } from "swiper";

import "swiper/css/navigation";
import "swiper/css/pagination";

//Components
import Adder from "components/UI/Adder";
import Button from "components/UI/Button";

//Hooks
import { formatPrice } from "lib/shopify/usePrice";

import {
  CheckoutLineItemInput,
  useAddCartItemMutation,
  AddCartItemMutation,
  AddCartItemMutationVariables,
  useCreateCartMutation,
  CreateCartMutation,
  CreateCartMutationVariables,
  Product,
  ProductVariant,
  useGetCartItemCountQuery,
} from "src/generated/graphql";

interface IProps {
  product: Product;
  context: NextPageContext;
}

interface State {
  variant: ProductVariant;
  quantity: number;
}

const ProductSingle: React.FC<IProps> = ({ product, context }) => {
  // const [quantity, setQuantity] = useState<number>(1);
  const [swiper, setSwiper] = useState<Swiper>();
  const [state, setState] = useImmer<State>({
    variant: product.variants.nodes[0],
    quantity: 1,
  });

  const queryClient = useQueryClient();

  // Create Cart
  const {
    mutateAsync: mutateCreateCartAsync,
    isLoading: createCartLoading,
    isError: cartError,
  } = useCreateCartMutation<CreateCartMutation, Error>(
    shopifyGraphqlRequestClient,
    {
      onSuccess: (
        data: AddCartItemMutation,
        _variables: CreateCartMutationVariables,
        _context: unknown
      ) => {
        queryClient.invalidateQueries(useCreateCartMutation.getKey());
      },
      onError: () => {
        console.log(error);
      },
    }
  );

  const {
    mutate,
    isLoading,
    error,
    isError,
    mutateAsync: mutateCartItemAsync,
  } = useAddCartItemMutation<AddCartItemMutation, Error>(
    shopifyGraphqlRequestClient,
    {
      onSuccess: (
        data: AddCartItemMutation,
        _variables: AddCartItemMutationVariables,
        _context: unknown
      ) => {
        const checkoutId = nookies.get(
          context,
          SHOPIFY_CHECKOUT_ID_COOKIE
        ).shopify_checkoutId;
        queryClient.invalidateQueries(useAddCartItemMutation.getKey());
        queryClient.invalidateQueries(
          useGetCartItemCountQuery.getKey({ checkoutId: checkoutId })
        );
      },
      onError: () => {
        console.error(error);
      },
    }
  );

  const addItemToCart = async (lineItem: CheckoutLineItemInput) => {
    try {
      const checkoutId = nookies.get(
        context,
        SHOPIFY_CHECKOUT_ID_COOKIE
      ).shopify_checkoutId;
      await mutateCartItemAsync({ checkoutId: checkoutId, lineItem: lineItem });
    } catch (error) {
      const { checkoutCreate } = await mutateCreateCartAsync({
        input: { lineItems: [lineItem] },
      });

      nookies.set(
        context,
        SHOPIFY_CHECKOUT_ID_COOKIE,
        checkoutCreate?.checkout?.id!,
        {
          maxAge: 30 * 24 * 60 * 60,
        }
      );
    }
  };

  const buyNow = async (lineItem: CheckoutLineItemInput) => {
    try {
      const { checkoutCreate } = await mutateCreateCartAsync({
        input: { lineItems: [lineItem] },
      });

      window.open(checkoutCreate.checkout.webUrl, "_self").focus();
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 p-2 md:px-4 lg:px-6 mx-auto max-w-8xl">
      <div>
        <SwiperSlider
          // install Swiper modules
          modules={[Navigation, Pagination]}
          preloadImages
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={true}
          navigation
          onSwiper={setSwiper}
          onSlideChange={(s) => console.log("current slide:", s.activeIndex)}
        >
          {product?.images?.nodes.map((image) => {
            return (
              <SwiperSlide key={image.id}>
                <Image
                  src={image.url}
                  alt={image.altText}
                  width={image.width}
                  height={image.height}
                  //with priority they load in the slider
                  priority
                />
              </SwiperSlide>
            );
          })}
        </SwiperSlider>
      </div>
      <div className="flex flex-col md:px-8">
        <h1 className="font-extrabold text-3xl mt-3 md:m-0"></h1>
        <span className="font-extrabold text-2xl mt-0 mb-3">
          {formatPrice({
            amount: state.variant.priceV2.amount,
            currencyCode: state.variant.priceV2.currencyCode,
          })}
        </span>
        <Adder
          amount={state.quantity}
          add={() =>
            setState((draft) => {
              draft.quantity += 1;
            })
          }
          subtract={() =>
            setState((draft) => {
              draft.quantity -= 1;
            })
          }
        />

        <Button
          onClick={async () => {
            await addItemToCart({
              quantity: state.quantity,
              variantId: state.variant.id,
            });
            setState((draft) => {
              draft.quantity = 1;
            });
          }}
          loading={isLoading}
          disabled={product?.availableForSale === false}
          className="py-3 md:max-w-xs hover:bg-accent-2"
        >
          {product?.availableForSale === false
            ? "Not Available"
            : "Add To Cart"}
        </Button>

        {product?.availableForSale && (
          <Button
            onClick={async () => {
              await buyNow({
                quantity: state.quantity,
                variantId: state.variant.id,
              });
              setState((draft) => {
                draft.quantity = 1;
              });
            }}
            loading={createCartLoading}
            className=" py-3 mt-3 bg-primary hover:text-secondary md:max-w-xs hover:bg-accent-7"
          >
            Buy Now
          </Button>
        )}

        {isError && cartError && (
          <span className="text-red pt-3">Error adding item to cart</span>
        )}

        <div
          className="mt-3"
          dangerouslySetInnerHTML={{ __html: product?.descriptionHtml }}
        />

        {/* HERE THE VARIANTS ARE DISPLAYED AS A DROPDOWN WITH MATERIAL UI BUT RATHER BUILD YPUR OWN
       SELECTORS FOR YOUR DATA */}
        <div className="pt-4">
          <FormControl>
            <InputLabel id="product-variants-label">Variants</InputLabel>
            <Select
              label="Variants"
              labelId="product-variants-label"
              disabled={isLoading}
              value={state.variant.id}
              onChange={(event) => {
                const variant = product.variants.nodes.find(
                  ({ id }) => id === event.target.value
                );

                const slideIndex = product.images.nodes.findIndex(
                  (image) => image === variant?.image
                );

                if (slideIndex !== -1) {
                  swiper?.slideTo(slideIndex);
                }

                setState((draft) => {
                  draft.variant = variant!;
                });
              }}
            >
              {product.variants.nodes.map((variant) => (
                <MenuItem key={variant.id} value={variant.id}>
                  {variant.title}
                  {/* {variant.title} - {formatPrice(variant.priceV2.amount)} */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default ProductSingle;
