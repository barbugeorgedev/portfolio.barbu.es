function Button({ title, handleClick }) {
  return (
    <button
      onClick={handleClick}
      className="font-general-medium flex justify-center items-center w-36 sm:w-48 mt-12 mb-6 sm:mb-0 text-lg  dark:border border-logo-blue-dark py-2.5 sm:py-3 shadow-lg rounded-lg bg-logo-blue-light focus:ring-1 focus:ring-logo-blue-dark hover:bg-logo-blue-dark text-white hover:text-white duration-500"
      aria-label="Download Resume"
    >
      <span className="text-sm sm:text-lg duration-100">{title}</span>
    </button>
  );
}

export default Button;
