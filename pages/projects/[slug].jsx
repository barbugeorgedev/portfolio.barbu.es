"use client";

import { useQuery } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiClock, FiTag, FiSmartphone, FiEye } from "react-icons/fi";
import PagesMetaHead from "../../components/PagesMetaHead";
import RelatedProjects from "../../components/projects/RelatedProjects";
import ShareButtons from "../../components/reusable/ShareButtons";
import CustomLinkIcons from "../../components/reusable/CustomLinkIcons";
import BlockContentRenderer from "../../components/reusable/BlockContentRenderer";
import LoadingScreen from "../../components/reusable/LoadingScreen";
import { GET_PROJECT_BY_SLUG } from "../../libs/graphql/queries/projects";

function ProjectSingle() {
  const router = useRouter();
  const [projectSlug, setProjectSlug] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Check for preview mode
  const isPreviewMode =
    router.query.preview === "true" || router.query.preview === true;

  useEffect(() => {
    if (router.isReady) {
      setProjectSlug(router.query.slug);
    }
  }, [router.isReady, router.query.slug]);

  const { loading, error, data } = useQuery(GET_PROJECT_BY_SLUG, {
    variables: {
      slug: projectSlug,
      preview: isPreviewMode,
    },
    skip: !projectSlug,
  });

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goNext = () => {
    setCurrentIndex((prev) =>
      prev === project.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? project.gallery.length - 1 : prev - 1
    );
  };

  // Exit preview mode function
  const exitPreview = async () => {
    try {
      // Call API route to exit preview mode
      await fetch("/api/preview/exit");
      // Redirect to the same page without preview
      router.push(router.asPath.split("?")[0]);
    } catch (error) {
      console.error("Error exiting preview:", error);
    }
  };

  useEffect(() => {
    if (
      !loading &&
      !error &&
      data &&
      (!data.allProject || data.allProject.length === 0)
    ) {
      router.replace("/projects"); // Redirect to /projects if project not found
    }
  }, [loading, error, data, router]);

  if (loading) return <LoadingScreen />;

  if (error) {
    console.error("Apollo Error:", error);
    return (
      <p className="text-red-500 text-center mt-10">
        Error loading project: {error.message}
      </p>
    );
  }

  const project = data?.allProject?.[0];

  if (!project) return null; // Prevent rendering anything while redirecting

  // Check if project has app store links
  const isAndroidApp = project.categories?.some(
    (cat) => cat.title === "Android App" || cat.slug?.current === "android-app"
  );
  const isIOSApp = project.categories?.some(
    (cat) => cat.title === "IOS App" || cat.slug?.current === "ios-app"
  );

  // Show only first 3 images on the main page
  const displayedImages = project.gallery?.slice(0, 3) || [];
  const hasMoreImages = project.gallery?.length > 3;

  return (
    <div className="container mx-auto">
      <PagesMetaHead title={project.title} />

      {/* Preview Mode Banner */}
      {isPreviewMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <FiEye className="text-lg" />
            <span className="font-medium">
              {project._draft ? "Draft Preview Mode" : "Preview Mode"}
            </span>
            <button
              onClick={exitPreview}
              className="ml-4 px-3 py-1 bg-white text-orange-500 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Exit Preview
            </button>
          </div>
        </div>
      )}

      {/* Content wrapper with top padding if in preview mode */}
      <div className={isPreviewMode ? "pt-12" : ""}>
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <p className="font-general-medium text-left text-3xl sm:text-4xl font-bold text-primary-dark dark:text-primary-light mt-14 sm:mt-20 mb-7">
              {project.title}
            </p>
            {/* Draft indicator */}
            {project._draft && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 mt-14 sm:mt-20">
                <FiEye className="w-3 h-3 mr-1" />
                Draft
              </span>
            )}
          </div>

          <div className="flex">
            <div className="flex items-center mr-10">
              <FiClock className="text-xl text-ternary-dark dark:text-ternary-light" />
              <span className="font-general-regular ml-2 leading-none text-primary-dark dark:text-primary-light">
                {new Date(project.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center">
              <FiTag className="w-4 h-4 text-ternary-dark dark:text-ternary-light" />
              <span className="font-general-regular ml-2 leading-none text-primary-dark dark:text-primary-light">
                {project.categories
                  ?.map((category) => category.title)
                  .join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Gallery - Show only first 3 images */}
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-10 mt-12">
          {displayedImages.map((image, index) => (
            <div className="mb-10 sm:mb-0 relative" key={index}>
              <div className="relative w-full h-96">
                <Image
                  src={image.image.asset.url}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl cursor-pointer shadow-lg sm:shadow-none"
                  onClick={() => openLightbox(index)}
                  priority
                />
                {/* Show "View All" overlay on the third image if there are more images */}
                {index === 2 && hasMoreImages && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-60 rounded-xl flex items-center justify-center cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    <div className="text-white text-center">
                      <div className="text-2xl font-bold">
                        +{project.gallery.length - 3}
                      </div>
                      <div className="text-sm">View All Photos</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox - Shows all images in gallery */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-3xl font-bold z-10"
            >
              &times;
            </button>

            <button
              onClick={goPrev}
              className="absolute left-4 text-white text-4xl font-bold z-10"
            >
              &#8249;
            </button>

            <div className="relative w-11/12 max-w-4xl h-[80vh]">
              <Image
                src={project.gallery[currentIndex].image.asset.url}
                alt={project.title}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
                priority
              />
            </div>

            <button
              onClick={goNext}
              className="absolute right-4 text-white text-4xl font-bold z-10"
            >
              &#8250;
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
              {currentIndex + 1} / {project.gallery.length}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="block sm:flex gap-0 sm:gap-10 mt-14">
          <div className="w-full sm:w-1/3 text-left">
            <div className="mb-7">
              <p className="font-general-regular text-2xl font-semibold text-secondary-dark dark:text-secondary-light mb-2">
                Client
              </p>
              <p className="font-general-regular text-ternary-dark dark:text-ternary-light">
                Name: <span className="font-bold">{project.client?.name}</span>
              </p>
              {project.website && (
                <p className="font-general-regular text-ternary-dark dark:text-ternary-light">
                  Website:
                  <span className="font-bold">
                    <a
                      href={project.website}
                      className="ml-1 hover:underline text-ternary-dark dark:text-ternary-light hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer duration-300"
                      aria-label="Project Website"
                    >
                      {project.website}
                    </a>
                  </span>
                </p>
              )}
            </div>

            <div className="mb-7">
              <p className="font-general-regular text-2xl font-semibold text-ternary-dark dark:text-ternary-light mb-2">
                Objective
              </p>
              <p className="font-general-regular text-primary-dark dark:text-ternary-light">
                {project.objective}
              </p>
            </div>

            <div className="mb-7">
              <p className="font-general-regular text-2xl font-semibold text-ternary-dark dark:text-ternary-light mb-2">
                Technologies Used
              </p>
              <p className="font-general-regular text-primary-dark dark:text-ternary-light">
                {project.technologies?.join(", ")}
              </p>
            </div>

            {/* App Store Links */}
            {(project.playStoreLink || project.appStoreLink) && (
              <div className="mb-7">
                <p className="font-general-regular text-2xl font-semibold text-ternary-dark dark:text-ternary-light mb-3">
                  Download App
                </p>
                <div className="flex flex-col gap-3 xl:flex-row xl:gap-3">
                  {project.playStoreLink && isAndroidApp && (
                    <a
                      href={project.playStoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 w-fit"
                      aria-label="Download on Google Play"
                    >
                      <svg
                        className="w-6 h-6 mr-3"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                      </svg>
                      <div>
                        <div className="text-xs">Get it on</div>
                        <div className="text-sm font-semibold">Google Play</div>
                      </div>
                    </a>
                  )}

                  {project.appStoreLink && isIOSApp && (
                    <a
                      href={project.appStoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors duration-300 w-fit"
                      aria-label="Download on App Store"
                    >
                      <svg
                        className="w-6 h-6 mr-3"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                      </svg>
                      <div>
                        <div className="text-xs">Download on the</div>
                        <div className="text-sm font-semibold">App Store</div>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

            {project.customLinks?.length > 0 && (
              <div className="mb-7">
                <p className="font-general-regular text-2xl font-semibold text-ternary-dark dark:text-ternary-light mb-2">
                  Additional Links
                </p>
                <ul className="space-y-2">
                  {project.customLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-gray-400 hover:underline"
                      >
                        <CustomLinkIcons iconName={link.icon} />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="font-general-regular text-2xl font-semibold text-ternary-dark dark:text-ternary-light mb-2">
                Share This
              </p>
              <div className="flex items-center gap-3 mt-5">
                <ShareButtons customText="Check out this amazing project!" />
              </div>
            </div>
          </div>

          <div className="w-full sm:w-2/3 text-left mt-10 sm:mt-0">
            <p className="text-primary-dark dark:text-primary-light text-2xl font-bold mb-7">
              Challenge
            </p>

            {/* Use the BlockContentRenderer Component */}
            <BlockContentRenderer content={project.challengeRaw} />
          </div>
        </div>

        <RelatedProjects
          currentProject={data?.allProject?.[0]}
          fallbackProjects={
            data?.allProject
              ?.filter((project) => project._id !== data?.allProject?.[0]?._id)
              .slice(0, 3) // Show latest 3 as fallback
          }
        />
      </div>
    </div>
  );
}

export default ProjectSingle;
