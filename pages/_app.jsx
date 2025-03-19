import "../styles/globals.css";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import DefaultLayout from "../components/layout/DefaultLayout";
import UseScrollToTop from "../hooks/useScrollToTop";
import ApolloProviderWrapper from "../components/ApolloProviderWrapper";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Check if we have a saved theme
    const savedTheme = localStorage.getItem("theme");

    // If we have a saved theme and it's dark, apply dark mode
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <ApolloProviderWrapper>
      <AnimatePresence>
        <div className="bg-secondary-light dark:bg-primary-dark transition duration-300">
          <DefaultLayout>
            <Component {...pageProps} />
          </DefaultLayout>
          <UseScrollToTop />
        </div>
      </AnimatePresence>
    </ApolloProviderWrapper>
  );
}

export default MyApp;
