import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import ProjectSingle from "./ProjectSingle";
import ProjectsFilter from "./ProjectsFilter";
import { useQuery } from "@apollo/client";
import { GET_ALL_PROJECTS } from "../../libs/graphql/queries/projects";

function ProjectsGrid() {
  const [searchProject, setSearchProject] = useState("");
  const [selectProject, setSelectProject] = useState("");
  const { loading, error, data } = useQuery(GET_ALL_PROJECTS);

  if (loading) return <p>Loading projects...</p>;
  if (error) {
    console.error("Error fetching projects:", error);
    return <p>Error loading projects.</p>;
  }

  // Ensure data.allProject exists
  const projects = data?.allProject || [];

  // Filter projects based on category
  const filteredByCategory = selectProject
    ? projects.filter((item) =>
        item.categories?.some((category) =>
          category.title.toLowerCase().includes(selectProject.toLowerCase())
        )
      )
    : projects;

  // Further filter projects based on search query
  const filteredProjects = filteredByCategory.filter((project) =>
    project.title.toLowerCase().includes(searchProject.toLowerCase())
  );

  return (
    <section className="py-5 sm:py-10 mt-5 sm:mt-10">
      <div className="text-center">
        <p className="font-general-medium text-2xl sm:text-4xl mb-1 text-ternary-dark dark:text-ternary-light">
          Projects Portfolio
        </p>
      </div>

      <div className="mt-10 sm:mt-16">
        <h3 className="font-general-regular text-center text-secondary-dark dark:text-ternary-light text-md sm:text-xl mb-3">
          Search projects by title or filter by category
        </h3>
        <div className="flex justify-between border-b border-primary-light dark:border-secondary-dark pb-3 gap-3">
          <div className="flex justify-between gap-2 w-full sm:w-auto">
            <span className="hidden sm:block bg-primary-light dark:bg-ternary-dark p-2.5 shadow-sm rounded-xl cursor-pointer">
              <FiSearch className="text-ternary-dark dark:text-ternary-light w-5 h-5" />
            </span>
            <input
              onChange={(e) => setSearchProject(e.target.value)}
              className="pl-3 pr-1 sm:px-4 py-2 border border-gray-200 dark:border-secondary-dark rounded-lg text-sm sm:text-md bg-secondary-light dark:bg-ternary-dark text-primary-dark dark:text-ternary-light w-full sm:w-auto"
              type="search"
              placeholder="Search Projects"
              aria-label="Search"
            />
          </div>
          <ProjectsFilter setSelectProject={setSelectProject} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 sm:gap-5">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => {
            const defaultImage =
              project.gallery?.find((item) => item.isDefault)?.image.asset
                .url || "/placeholder.jpg"; // Fallback image

            return (
              <ProjectSingle
                key={project.slug.current}
                slug={project.slug.current}
                title={project.title}
                categories={project.categories}
                img={defaultImage}
              />
            );
          })
        ) : (
          <p className="col-span-3 text-center text-gray-500 dark:text-gray-400">
            No projects found.
          </p>
        )}
      </div>
    </section>
  );
}

export default ProjectsGrid;
