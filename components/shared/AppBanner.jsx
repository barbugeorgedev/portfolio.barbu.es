import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiArrowDownCircle } from "react-icons/fi";
import useThemeSwitcher from "../../hooks/useThemeSwitcher";

function AppBanner() {
  const [activeTheme] = useThemeSwitcher();

  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const fetchPDFUrl = async () => {
      try {
        const response = await fetch(
          "https://george.barbu.es/api/pdf/george-barbu-general.pdf?role=general",
          { method: "GET", mode: "cors" }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPdfUrl(data.url);
      } catch (error) {
        console.error("Error fetching PDF URL:", error);
      }
    };

    if (typeof window !== "undefined") {
      fetchPDFUrl();
    }
  }, []);

  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "George-Barbu.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
      className="flex flex-col sm:justify-between items-center sm:flex-row mt-5 md:mt-2"
    >
      <div className="w-full md:w-1/3 text-left">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.9,
            delay: 0.1,
          }}
          className="font-general-semibold text-2xl lg:text-3xl xl:text-4xl text-center sm:text-left text-ternary-dark dark:text-primary-light uppercase"
        >
          Hi, I am George
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.9,
            delay: 0.2,
          }}
          className="font-general-medium mt-4 text-lg md:text-xl lg:text-2xl xl:text-3xl text-center sm:text-left leading-normal text-gray-500 dark:text-gray-200"
        >
          A Tech Solutions Leader
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.9,
            delay: 0.3,
          }}
          className="flex justify-center sm:block"
        >
          {pdfUrl ? (
            <button
              onClick={handleDownload}
              className="font-general-medium flex justify-center items-center w-36 sm:w-48 mt-12 mb-6 sm:mb-0 text-lg  dark:border border-logo-blue-dark py-2.5 sm:py-3 shadow-lg rounded-lg bg-logo-blue-light focus:ring-1 focus:ring-logo-blue-dark hover:bg-logo-blue-dark text-white hover:text-white duration-500"
              aria-label="Download Resume"
            >
              <FiArrowDownCircle className="ml-0 sm:ml-1 mr-2 sm:mr-3 h-5 w-5 sm:w-6 sm:h-6 duration-100" />
              <span className="text-sm sm:text-lg duration-100">
                Download CV
              </span>
            </button>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              Loading CV...
            </p>
          )}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -180 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
        className="w-full sm:w-2/3 text-right float-right mt-8 sm:mt-0"
      >
        <img
          layout="responsive"
          src={
            activeTheme === "dark"
              ? "/images/developer-dark.svg"
              : "/images/developer.svg"
          }
          alt="Developer"
        />
      </motion.div>
    </motion.section>
  );
}

export default AppBanner;
