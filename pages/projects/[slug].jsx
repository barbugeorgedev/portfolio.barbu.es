"use client";

import { useQuery } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiClock, FiTag } from "react-icons/fi";
import PagesMetaHead from "../../components/PagesMetaHead";
import RelatedProjects from "../../components/projects/RelatedProjects";
import ShareButtons from "../../components/reusable/ShareButtons";
import BlockContentRenderer from "../../components/reusable/BlockContentRenderer";
import LoadingScreen from "../../components/reusable/LoadingScreen";
import { GET_PROJECT_BY_SLUG } from "../../libs/graphql/queries/projects";

function ProjectSingle() {
  const router = useRouter();
  const [projectSlug, setProjectSlug] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setProjectSlug(router.query.slug);
    }
  }, [router.isReady, router.query.slug]);

  const { loading, error, data } = useQuery(GET_PROJECT_BY_SLUG, {
    variables: { slug: projectSlug },
    skip: !projectSlug,
  });

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

  return (
    <div className="container mx-auto">
      <PagesMetaHead title={project.title} />

      {/* Header */}
      <div>
        <p className="font-general-medium text-left text-3xl sm:text-4xl font-bold text-primary-dark dark:text-primary-light mt-14 sm:mt-20 mb-7">
          {project.title}
        </p>
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
              {project.categories?.map((category) => category.title).join(", ")}
            </span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-10 mt-12">
        {project.gallery?.map((image, index) => (
          <div className="mb-10 sm:mb-0" key={index}>
            <div className="relative w-full h-96">
              <Image
                src={image.image.asset.url}
                alt={project.title}
                layout="fill"
                objectFit="cover"
                className="rounded-xl cursor-pointer shadow-lg sm:shadow-none"
                priority
              />
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="block sm:flex gap-0 sm:gap-10 mt-14">
        <div className="w-full sm:w-1/3 text-left">
          <div className="mb-7">
            <p className="font-general-regular text-2xl font-semibold text-secondary-dark dark:text-secondary-light mb-2">
              Client
            </p>
            <p className="font-general-regular text-ternary-dark dark:text-ternary-light">
              Name: {project.client?.name}
            </p>
            {project.website && (
              <p className="font-general-regular text-ternary-dark dark:text-ternary-light">
                Website:
                <a
                  href={project.website}
                  className="ml-1 hover:underline text-ternary-dark dark:text-ternary-light hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer duration-300"
                  aria-label="Project Website"
                >
                  {project.website}
                </a>
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

      <RelatedProjects currentProject={data?.allProject?.[0]} />
    </div>
  );
}

export default ProjectSingle;
