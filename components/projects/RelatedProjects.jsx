import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_ALL_PROJECTS } from "../../libs/graphql/queries/projects";

function RelatedProjects({ currentProject }) {
  const {
    loading: projectsLoading,
    error: projectsError,
    data: projectsData,
  } = useQuery(GET_ALL_PROJECTS);

  if (projectsLoading) return <p>Loading related projects...</p>;
  if (projectsError) return <p>Error loading related projects.</p>;

  const normalizeCategory = (category) =>
    category.toLowerCase().replace(/[^a-z0-9]/g, "");

  const categories =
    currentProject?.categories?.map((cat) => normalizeCategory(cat.title)) ||
    [];

  const currentProjectSlug = currentProject?.slug?.current;

  // Exclude current project from all project list
  const allOtherProjects =
    projectsData?.allProject?.filter(
      (p) => p.slug.current !== currentProjectSlug
    ) || [];

  // Attempt to find related projects based on shared categories
  const relatedProjects = allOtherProjects.filter((project) =>
    project.categories?.some((cat) =>
      categories.includes(normalizeCategory(cat.title))
    )
  );

  // Fallback to latest if no related
  const projectsToShow =
    relatedProjects.length > 0
      ? relatedProjects
      : allOtherProjects
          .sort(
            (a, b) =>
              new Date(b._createdAt || b.createdAt) -
              new Date(a._createdAt || a.createdAt)
          )
          .slice(0, 4); // Limit fallback to latest 4

  const isShowingRelated = relatedProjects.length > 0;

  return (
    <div className="mt-10 pt-10 sm:pt-14 sm:mt-20 border-t-2 border-primary-light dark:border-secondary-dark">
      <p className="font-general-regular text-primary-dark dark:text-primary-light text-3xl font-bold mb-10 sm:mb-14 text-left">
        {isShowingRelated ? "Related Projects" : "Latest Projects"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
        {projectsToShow.map((project) => (
          <div key={project.slug.current} className="flex flex-col">
            <Link
              href="/projects/[slug]"
              as={"/projects/" + project.slug.current}
              aria-label="Related Project"
              passHref
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl cursor-pointer">
                <Image
                  src={
                    project.gallery?.find((item) => item.isDefault)?.image.asset
                      .url || "/placeholder.jpg"
                  }
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  alt={project.title}
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedProjects;
