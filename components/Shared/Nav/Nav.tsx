import { useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import clsx from "clsx";
import useMedia from "use-media";

import { useUI } from "components/UI/context";

//Components
import NavButton from "./components/NavButton";
import Newsletter from "./components/Newsletter/Newsletter";

import Logo from "Icons/Logo";

interface IProps {
  shopName?: string;
}

const links = [
  { href: "/products", text: "products" },
  { href: "/test", text: "testing" },
  { href: "/about", text: "about" },
];

const Navigation: React.FC<IProps> = () => {
  const [toggle, setToggle] = useState(false);

  const isDesktop = useMedia({ minWidth: "1024px" });

  const toggleHandler = () => {
    setToggle((prev) => !prev);
  };

  //Router
  const router = useRouter();

  //UI State
  const { openMenu, closeMenu, displayMenu, toggleMenu } = useUI();

  return (
    <>
      <nav className="fixed z-50 top-0 left-0 w-screen">
        <div className="bg-white z-20 py-4 px-4 md:px-6 xl:px-8 border-b border-black relative flex justify-between items-center">
          {isDesktop ? (
            <div>
              <ul className="flex last:m-0">
                {links.map((link, idx) => {
                  return (
                    <li className="mr-4 last:m-0" key={idx}>
                      <Link href={link.href}>
                        <a>
                          <NavButton
                            text={link.text}
                            isActive={router.pathname.startsWith(link.href)}
                          />
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div onClick={toggleMenu} className="lg:hidden">
              Menu
            </div>
          )}

          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <Link href={`/`} className="font-black uppercase text-xl">
              <a>
                <Logo />
              </a>
            </Link>
          </div>

          <Link href={`/cart`} className="font-black uppercase text-xl">
            Cart
          </Link>
        </div>
        <Newsletter />

        <div
          className={clsx(
            displayMenu
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0",
            "flex z-10 flex-wrap justify-between bg-white py-4 px-4 md:px-6 xl:px-8 lg:hidden border-b border-black transition-all duration-300 ease-in-out"
          )}
        >
          <Link href={`/products`}>
            <a>
              <NavButton
                text="Products"
                isActive={router.pathname.startsWith("/products")}
              />
            </a>
          </Link>

          <Link href={`/subscribe`}>
            <a>
              <NavButton
                text="Subscribe"
                isActive={router.pathname.startsWith("/subscribe")}
              />
            </a>
          </Link>

          <Link href={`/shows`}>
            <a>
              <NavButton
                text="shows"
                isActive={router.pathname.startsWith("/shows")}
              />
            </a>
          </Link>

          <Link href={`/about`}>
            <a>
              <NavButton
                text="about"
                isActive={router.pathname.startsWith("/about")}
              />
            </a>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default memo(Navigation);
