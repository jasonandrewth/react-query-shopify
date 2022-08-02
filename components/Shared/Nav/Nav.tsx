import React from "react";
import Link from "next/link";

const Navigation = () => {
  return (
    <div>
      <Link href={`/`}>
        <a>Home</a>
      </Link>
    </div>
  );
};

export default Navigation;
