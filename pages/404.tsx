import React, { useEffect } from "react";
import { useRouter } from "next/router";

//Layout
import { getLayout } from "components/Layout/Layout";

//Redirect
const Error = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  });

  return <div className="w-screen h-screen grid self-center">404</div>;
};

Error.getLayout = getLayout;

export default Error;
