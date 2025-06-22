import * as FiIcons from "react-icons/fi";
import * as SiIcons from "react-icons/si";
import * as BsIcons from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as PiIcons from "react-icons/pi";

const allIcons = {
  ...FiIcons,
  ...SiIcons,
  ...BsIcons,
  ...AiIcons,
  ...FaIcons,
  ...MdIcons,
  ...RiIcons,
  ...PiIcons,
};

export default function CustomLinkIcons({ iconName, className = "w-5 h-5" }) {
  const Icon = allIcons[iconName];
  if (!Icon) return null;

  return <Icon className={className} />;
}
