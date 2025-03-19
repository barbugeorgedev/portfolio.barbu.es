import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_ALL_PROJECTS } from "../../libs/graphql/queries/projects";

function RelatedProjects({ currentProject }) {
  // Fetch all projects (GraphQL doesn't support filtering)
  const {
    loading: projectsLoading,
    error: projectsError,
    data: projectsData,
  } = useQuery(GET_ALL_PROJECTS);

  if (projectsLoading) return <p>Loading related projects...</p>;
  if (projectsError) return <p>Error loading related projects.</p>;

  // Helper function to normalize category names for comparison
  const normalizeCategory = (category) => {
    return category.toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  // Extract categories from the current project with normalization
  const categories =
    currentProject?.categories?.map((cat) => normalizeCategory(cat.title)) ||
    [];

  // Get current project slug for exclusion
  const currentProjectSlug = currentProject?.slug?.current;

  // Add extensive debugging
  console.log("Current project data:", {
    title: currentProject?.title,
    slug: currentProjectSlug,
    id: currentProject?._id || currentProject?.id,
  });

  // Create project map to detect duplicates (for debugging)
  const projectMap = {};

  // Filter projects by matching categories (excluding the current project)
  const relatedProjects = projectsData?.allProject
    ?.filter((p) => {
      // Debug project comparison
      const isCurrentProject = p.slug.current === currentProjectSlug;

      // Log each comparison for debugging
      if (isCurrentProject) {
        console.log("Detected current project in results:", {
          title: p.title,
          slug: p.slug.current,
        });
      }

      // Track all projects for duplicate detection
      if (!projectMap[p.slug.current]) {
        projectMap[p.slug.current] = {
          title: p.title,
          categories: p.categories?.map((c) => c.title) || [],
        };
      }

      // Skip current project - strict slug comparison
      if (isCurrentProject) return false;

      // Check for category matches with normalization
      return p.categories?.some((cat) =>
        categories.includes(normalizeCategory(cat.title))
      );
    })
    ?.filter((p) => p.slug.current !== currentProjectSlug) // Double-check exclusion
    ?.sort(
      (a, b) =>
        new Date(b._createdAt || b.createdAt) -
        new Date(a._createdAt || a.createdAt)
    )
    ?.slice(0, 4);

  return (
    <div className="mt-10 pt-10 sm:pt-14 sm:mt-20 border-t-2 border-primary-light dark:border-secondary-dark">
      <p className="font-general-regular text-primary-dark dark:text-primary-light text-3xl font-bold mb-10 sm:mb-14 text-left">
        Related Projects
      </p>
      {relatedProjects && relatedProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
          {relatedProjects.map((project) => {
            // Extra check to ensure current project isn't displayed
            if (project.slug.current === currentProjectSlug) {
              console.log("Still found current project in render list!");
              return null;
            }

            return (
              <div key={project.slug.current} className="flex flex-col">
                <Link
                  href="/projects/[slug]"
                  as={"/projects/" + project.slug.current}
                  aria-label="Related Project"
                  passHref
                >
                  <Image
                    src={
                      project.gallery?.find((item) => item.isDefault)?.image
                        .asset.url || "/placeholder.jpg"
                    }
                    className="rounded-xl cursor-pointer"
                    width={400}
                    height={400}
                    alt={project.title}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No related projects found.</p>
      )}
    </div>
  );
}

export default RelatedProjects;
