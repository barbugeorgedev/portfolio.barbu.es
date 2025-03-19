import BlockContent from "@sanity/block-content-to-react";

// Define custom serializers for blocks and inline elements
const serializers = {
  types: {
    block: (props) => {
      const { node } = props;

      // Render headers with spacing
      if (node.style === "h2") {
        return (
          <h2 className="text-3xl font-semibold my-5">{props.children}</h2>
        );
      }

      // Render paragraphs with spacing
      if (node.style === "normal") {
        return (
          <p className="my-5 text-lg text-ternary-dark dark:text-ternary-light">
            {props.children}
          </p>
        );
      }

      // For other block types, render as paragraphs with spacing
      return <p className="my-5">{props.children}</p>;
    },
    // You can handle other types like images or custom inline elements here
  },
  marks: {
    // Define how inline elements like links should be rendered
    link: ({ children, mark }) => {
      return (
        <a
          href={mark.href}
          className="text-indigo-600 hover:underline dark:text-indigo-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
  },
  inline: {
    break: () => <br />, // Handle line breaks
  },
};

// BlockContentRenderer component
const BlockContentRenderer = ({ content }) => {
  if (!content) return null; // If no content is provided, return null.

  return (
    <BlockContent
      blocks={content} // Only pass the blocks content here
      serializers={serializers} // Use the custom serializers
    />
  );
};

export default BlockContentRenderer;
