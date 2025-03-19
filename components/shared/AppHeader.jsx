import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiSun, FiMoon, FiX, FiMenu } from "react-icons/fi";
import logoLight from "../../public/images/logo-light.svg";
import logoDark from "../../public/images/logo-dark.svg";
import useThemeSwitcher from "../../hooks/useThemeSwitcher";

function AppHeader() {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // Destructure the values correctly from useThemeSwitcher
  const [activeTheme, toggleTheme, mounted] = useThemeSwitcher();

  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  // Don't render theme-specific content until mounted to prevent hydration issues
  const [logoSrc, setLogoSrc] = useState(logoLight);

  useEffect(() => {
    if (mounted) {
      setLogoSrc(activeTheme === "dark" ? logoLight : logoDark);
    }
  }, [activeTheme, mounted]);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      id="nav"
      className="sm:container sm:mx-auto"
    >
      {/* Header */}
      <div className="z-10 max-w-screen-lg xl:max-w-screen-xl block sm:flex sm:justify-between sm:items-center py-6">
        {/* Header menu links and small screen hamburger menu */}
        <div className="flex justify-between items-center px-4 sm:px-0">
          <div>
            <Link href="/">
              {mounted && (
                <Image
                  src={logoSrc}
                  className="cursor-pointer"
                  alt={activeTheme === "dark" ? "Dark Logo" : "Light Logo"}
                  width={225}
                  height={120}
                />
              )}
            </Link>
          </div>

          <div className="flex flex-end items-center justify-center  sm:hidden ">
            {/* Small screen hamburger menu */}
            <button
              onClick={toggleMenu}
              type="button"
              className="focus:outline-none"
              aria-label="Hamburger Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-8 w-8 mr-2 mb-2 fill-current text-secondary-dark dark:text-ternary-light"
              >
                {showMenu ? (
                  <FiX className="text-3xl" />
                ) : (
                  <FiMenu className="text-3xl" />
                )}
              </svg>
            </button>
            {/* Theme switcher small screen */}
            {mounted && (
              <button
                onClick={toggleTheme}
                aria-label="Theme Switcher"
                className="block ml-0 bg-primary-light  border border-ternary-dark  dark:bg-ternary-dark p-2  flex center shadow-sm rounded-xl cursor-pointer"
              >
                {activeTheme === "dark" ? (
                  <FiSun className="text-ternary-dark hover:text-gray-400 dark:text-ternary-light dark:hover:text-primary-light text-xl" />
                ) : (
                  <FiMoon className="text-ternary-dark  hover:text-ternary-dark text-xl " />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Header links small screen */}
        <div
          className={
            showMenu
              ? "block m-0 sm:ml-4 sm:mt-3 md:flex px-5 py-3 sm:p-0 justify-between items-center shadow-lg sm:shadow-none"
              : "hidden"
          }
        >
          <div className="block text-left text-lg text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light  sm:mx-4 mb-2 sm:py-2">
            <Link href="/projects" aria-label="Projects">
              Projects
            </Link>
          </div>
          <div className="block text-left text-lg text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light  sm:mx-4 mb-2 sm:py-2 border-t-2 pt-3 sm:pt-2 sm:border-t-0 border-primary-light dark:border-secondary-dark">
            <Link href="/about" aria-label="About Me">
              About Me
            </Link>
          </div>
          <div className="block text-left text-lg text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light  sm:mx-4 mb-2 sm:py-2 border-t-2 pt-3 sm:pt-2 sm:border-t-0 border-primary-light dark:border-secondary-dark">
            <Link href="/contact" aria-label="Contact">
              Contact
            </Link>
          </div>
          <div className="border-t-2 pt-3 sm:pt-0 sm:border-t-0 border-primary-light dark:border-secondary-dark">
            <button
              onClick={() =>
                window.open(process.env.NEXT_PUBLIC_CV_SITE_URL, "_blank")
              }
              className="font-general-medium sm:hidden block text-left text-md bg-blue-500 hover:bg-blue-600 text-white shadow-sm rounded-sm px-4 py-2 mt-2 duration-300 w-24"
              aria-label="My CV Button"
            >
              My Resume
            </button>
          </div>
        </div>

        {/* Header links large screen */}
        <div className="font-general-medium hidden m-0 sm:ml-4 mt-5 sm:mt-3 sm:flex p-5 sm:p-0 justify-center items-center shadow-lg sm:shadow-none">
          <div
            className="block text-left text-lg font-medium text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light  sm:mx-4 mb-2 sm:py-2"
            aria-label="Projects"
          >
            <Link href="/projects">Projects</Link>
          </div>
          <div
            className="block text-left text-lg font-medium text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light  sm:mx-4 mb-2 sm:py-2"
            aria-label="About Me"
          >
            <Link href="/about">About Me</Link>
          </div>

          <div
            className="block text-left text-lg font-medium text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light  sm:mx-4 mb-2 sm:py-2"
            aria-label="Contact"
          >
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        {/* Header right section buttons */}
        <div className="hidden sm:flex justify-between items-center flex-col md:flex-row">
          <div className="hidden md:flex">
            <button
              onClick={() =>
                window.open(process.env.NEXT_PUBLIC_CV_SITE_URL, "_blank")
              }
              className="text-md font-general-medium bg-logo-blue-light hover:bg-logo-blue-dark text-white shadow-sm rounded-md px-5 py-2.5 duration-300"
              aria-label="My CV Button"
            >
              My Resume
            </button>
          </div>

          {/* Theme switcher large screen */}
          {mounted && (
            <div
              onClick={toggleTheme}
              aria-label="Theme Switcher"
              className="ml-6 bg-primary-light border border-logo-blue-light dark:bg-ternary-dark p-3 shadow-sm rounded-xl cursor-pointer"
            >
              {activeTheme === "dark" ? (
                <FiSun className="text-logo-blue-light  hover:text-logo-blue-light dark:hover:text-white  text-xl" />
              ) : (
                <FiMoon className="text-logo-blue-light hover:text-ternary-dark text-xl" />
              )}
            </div>
          )}
        </div>
      </div>
      <div></div>
    </motion.nav>
  );
}

export default AppHeader;
