export const getProjectQueryVariables = (slug, isPreviewMode = false) => {
  return {
    slug,
    includePreview: isPreviewMode,
  };
};
