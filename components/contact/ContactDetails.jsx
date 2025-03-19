import {
  FiPhone,
  FiMapPin,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiGlobe,
} from "react-icons/fi";

const contacts = [
  {
    id: 1,
    name: "Malaga, Manilva, Spain",
    icon: <FiMapPin />,
    link: "https://www.google.com/maps?q=Malaga,Manilva,Spain",
  },
  {
    id: 2,
    name: "+34 722 853 139",
    icon: <FiPhone />,
    link: "tel:+34722853139",
  },
  {
    id: 3,
    name: "george@barbu.es",
    icon: <FiMail />,
    link: "mailto:george@barbu.es",
  },
  {
    id: 4,
    name: process.env.NEXT_PUBLIC_CV_SITE_URL,
    icon: <FiGlobe />,
    link: process.env.NEXT_PUBLIC_CV_SITE_URL,
  },
  {
    id: 5,
    name: process.env.NEXT_PUBLIC_GITHUB,
    icon: <FiGithub />,
    link: process.env.NEXT_PUBLIC_GITHUB,
  },
  {
    id: 6,
    name: process.env.NEXT_PUBLIC_LINKEDIN,
    icon: <FiLinkedin />,
    link: process.env.NEXT_PUBLIC_LINKEDIN,
  },
];

function ContactDetails() {
  return (
    <div className="w-full">
      <div className="text-left max-w-xl px-6">
        <ul>
          {contacts.map((contact) => (
            <li className="flex" key={contact.id}>
              <i className="text-2xl text-neutral-500 dark:text-neutral-400 mr-4 mt-1">
                {contact.icon}
              </i>
              <a
                href={contact.link}
                target="_blank"
                className="text-lg mb-4 text-ternary-dark dark:text-ternary-light"
              >
                {contact.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ContactDetails;
