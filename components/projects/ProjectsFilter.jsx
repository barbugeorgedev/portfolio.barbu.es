import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES_PROJECTS } from "../../libs/graphql/queries/projects";

function ProjectsFilter({ setSelectProject }) {
  const { loading, error, data } = useQuery(GET_ALL_CATEGORIES_PROJECTS);

  const selectOptions =
    data?.allCategory?.map((category) => category.title) || [];

  return (
    <select
      onChange={(e) => {
        const value = e.target.value;
        setSelectProject(value === "All Projects" ? "" : value);
      }}
      className="
                px-4
                sm:px-6
                py-2
                border
                dark:border-secondary-dark
                rounded-lg
                text-sm
                sm:text-md
                dark:font-medium
                bg-secondary-light
                dark:bg-ternary-dark
                text-primary-dark
                dark:text-ternary-light
            "
      defaultValue="All Projects"
    >
      <option value="All Projects" className="text-sm sm:text-md">
        All Projects
      </option>

      {selectOptions.map((option) => (
        <option className="text-normal sm:text-md" key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default ProjectsFilter;
