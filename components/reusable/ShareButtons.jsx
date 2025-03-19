import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const ShareButtons = ({ customText }) => {
  const [currentUrl, setCurrentUrl] = useState("");

  // Only run this on the client-side to get the window URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const text = customText || "Check out this awesome page!"; // Use the custom text or a default value

  const socialLinks = [
    {
      platform: "WhatsApp",
      icon: <FaWhatsapp />,
      url: `https://wa.me/?text=${encodeURIComponent(`${text} ${currentUrl}`)}`,
    },
    {
      platform: "Facebook",
      icon: <FaFacebook />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}&quote=${encodeURIComponent(text)}`,
    },
    {
      platform: "X (formerly Twitter)",
      icon: <FaTwitter />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(text)}`,
    },
    {
      platform: "LinkedIn",
      icon: <FaLinkedin />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl
      )}&title=${encodeURIComponent(text)}`,
    },
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map(({ platform, icon, url }) => (
        <Link
          key={platform}
          href={url}
          target="_blank"
          passHref={true}
          aria-label={`Share on ${platform}`}
          className="bg-ternary-light dark:bg-ternary-dark text-gray-400 hover:text-primary-dark dark:hover:text-primary-light p-2 rounded-lg shadow-sm duration-500"
        >
          <span className="text-lg lg:text-2xl">{icon}</span>
        </Link>
      ))}
    </div>
  );
};

export default ShareButtons;
