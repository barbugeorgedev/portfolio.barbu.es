function AppFooterCopyright() {
  return (
    <div className="font-general-regular flex justify-center items-center text-center">
      <div className="text-lg text-ternary-dark dark:text-ternary-light">
        &copy; {new Date().getFullYear()}
        <a
          href={`${process.env.NEXT_PUBLIC_CV_SITE_URL}`}
          target="_blank"
          className="text-logo-blue-light hover:text-logo-blue-dark dark:hover:text-white ml-1 duration-500"
        >
          George Barbu
        </a>
        .
      </div>
    </div>
  );
}

export default AppFooterCopyright;
