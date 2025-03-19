import dynamic from "next/dynamic";
const AppHeader = dynamic(() => import("../shared/AppHeader"), { ssr: false });

import AppFooter from "../shared/AppFooter";
import PagesMetaHead from "../PagesMetaHead";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <PagesMetaHead />
      <AppHeader />
      <div>{children}</div>
      <AppFooter />
    </>
  );
};

export default DefaultLayout;
