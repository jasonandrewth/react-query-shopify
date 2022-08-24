import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { formatPrice } from "lib/shopify/usePrice";

import { CheckoutLineItem } from "src/generated/graphql";

interface IProps {
  item: CheckoutLineItem;
}

export const CartItem: React.FC<IProps> = ({ item }) => {
  return (
    <TableRow key={item.id}>
      <TableCell>
        <Image
          src={item?.variant?.image?.url}
          alt={"d"}
          width={30}
          height={40}
        />
      </TableCell>
      <TableCell component="th" scope="row">
        {item.title}
      </TableCell>
      <TableCell align="center"></TableCell>
      <TableCell align="center">{item.quantity}</TableCell>

      <TableCell align="center">
        {formatPrice({
          amount: item.variant.priceV2.amount * item.quantity,
          currencyCode: item.variant.priceV2.currencyCode,
        })}
      </TableCell>
      <TableCell align="right">Delete</TableCell>
    </TableRow>
  );
};

export default CartItem;
