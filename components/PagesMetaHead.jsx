import Head from "next/head";

function PagesMetaHead({ title, keywords, description }) {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
    </Head>
  );
}

PagesMetaHead.defaultProps = {
  title: "George Barbu Portfolio",
  keywords:
    "George Barbu, portfolio, web developer, front-end, Next.js, React, UI/UX, web design, personal website, developer portfolio",
  description:
    "A personal portfolio showcasing the work and skills of George Barbu, featuring web development projects built with Next.js and React, with a focus on UI/UX design and front-end development",
};

export default PagesMetaHead;
