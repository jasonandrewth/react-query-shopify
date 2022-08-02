import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Error = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  });

  return <div>404</div>;
};

export default Error;
