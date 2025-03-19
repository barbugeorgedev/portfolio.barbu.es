import { gql } from "@apollo/client";

export const GET_PROJECT_BY_SLUG = gql`
  query GetProjectBySlug($slug: String!) {
    allProject(where: { slug: { current: { eq: $slug } } }) {
      title
      website
      slug {
        current
      }
      createdAt
      objective
      technologies
      gallery {
        image {
          asset {
            url
          }
        }
      }
      categories {
        title
      }
      client {
        name
      }
      challengeRaw
    }
  }
`;

export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    allProject {
      title
      slug {
        current
      }
      createdAt
      objective
      technologies
      gallery {
        isDefault
        image {
          asset {
            url
          }
        }
      }
      categories {
        title
      }
      client {
        name
      }
      challengeRaw
    }
  }
`;

export const GET_ALL_CATEGORIES_PROJECTS = gql`
  query GetAllCategoriesProjects {
    allCategory {
      title
      slug {
        current
      }
      description
      icon {
        asset {
          url
        }
      }
    }
  }
`;
