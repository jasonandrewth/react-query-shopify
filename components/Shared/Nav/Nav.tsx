import React, { useState } from "react";
import Link from "next/link";

import clsx from "clsx";
import useMedia from "use-media";

import { Collection } from "src/generated/graphql";

interface IProps {
  navData: Collection[];
  shopName: string;
}

const Navigation: React.FC<IProps> = ({ navData, shopName }) => {
  const [toggle, setToggle] = useState(false);

  const isMobile = useMedia({ maxWidth: "768px" });

  const toggleHandler = () => {
    setToggle((prev) => !prev);
  };
  return (
    <nav className="lg:h-screen sticky z-50 top-0 left-0 md:border-b-0 lg:border-r border-black list-none bg-white">
      <div
        onClick={toggleHandler}
        className="lg:hidden w-full border-b border-black p-4 font-black uppercase text-center text-xl"
      >
        {" "}
        Menu
      </div>
      <div
        className={clsx(
          isMobile && (toggle ? "opacity-100 h-auto" : "opacity-0 h-0"),
          "flex flex-col border-black transition-all duration-150 ease-in-out"
        )}
      >
        <ul className={clsx("flex flex-col h-full")}>
          <li
            onClick={toggleHandler}
            className="w-full lg:h-[20%] border-b border-black p-4 font-black uppercase text-center text-xl flex items-center justify-center"
          >
            <Link href={`/`}>
              <a>{shopName}</a>
            </Link>
          </li>
          <li
            onClick={toggleHandler}
            className="w-full border-b border-black p-4 font-black uppercase text-center text-xl"
          >
            <Link href={`/`}>
              <a>Community</a>
            </Link>
          </li>
          {navData.map((navItem) => {
            return (
              <li
                key={navItem.id}
                onClick={toggleHandler}
                className="w-full border-b border-black p-4 font-black uppercase text-center text-xl"
              >
                <Link
                  as={`/collections/${navItem.handle}`}
                  href="/collections/[id]"
                  scroll={false}
                >
                  <a>{navItem.title}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
