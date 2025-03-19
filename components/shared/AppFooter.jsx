import { FiGithub, FiLinkedin, FiGlobe } from "react-icons/fi";
import AppFooterCopyright from "./AppFooterCopyright";

const socialLinks = [
  {
    id: 1,
    icon: <FiGlobe />,
    url: process.env.NEXT_PUBLIC_CV_SITE_URL,
  },
  {
    id: 2,
    icon: <FiGithub />,
    url: process.env.NEXT_PUBLIC_GITHUB,
  },
  {
    id: 3,
    icon: <FiLinkedin />,
    url: process.env.NEXT_PUBLIC_LINKEDIN,
  },
];

function AppFooter() {
  return (
    <div className="container mx-auto">
      <div className="pt-20 sm:pt-30 pb-8 mt-20 border-t-2 border-primary-light dark:border-secondary-dark">
        {/* Footer social links */}
        <div className="font-general-regular flex flex-col justify-center items-center mb-12 sm:mb-28">
          <p className="text-3xl sm:text-4xl text-primary-dark dark:text-primary-light mb-5">
            Follow me
          </p>
          <ul className="flex gap-4 sm:gap-8">
            {socialLinks.map((link) => (
              <a
                href={link.url}
                target="__blank"
                key={link.id}
                className="text-logo-blue-light hover:text-logo-blue-dark dark:hover:text-logo-blue-dark cursor-pointer rounded-lg bg-gray-50 dark:bg-ternary-dark shadow-sm p-4 duration-300"
              >
                <i className="text-xl sm:text-2xl md:text-3xl">{link.icon}</i>
              </a>
            ))}
          </ul>
        </div>

        <AppFooterCopyright />
      </div>
    </div>
  );
}

export default AppFooter;
