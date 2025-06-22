"use client";
import { useState, useEffect } from "react";
import Script from "next/script"; // Load reCAPTCHA script
import Button from "../reusable/Button";
import FormInput from "../reusable/FormInput";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auto-hide success message after 20 seconds
  useEffect(() => {
    if (responseMessage && messageType === "success") {
      const timer = setTimeout(() => {
        setResponseMessage("");
        setMessageType("");
      }, 20000); // 20 seconds

      return () => clearTimeout(timer);
    }
  }, [responseMessage, messageType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");
    setMessageType("");

    // Validation checks
    if (!formData.name.trim()) {
      setResponseMessage("Name is required.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      setResponseMessage("Enter a valid email.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (
      !formData.subject.trim() ||
      formData.subject.length < 3 ||
      formData.subject.length > 100
    ) {
      setResponseMessage("Subject must be between 3 and 100 characters.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (
      !formData.message.trim() ||
      formData.message.length < 10 ||
      formData.message.length > 1000
    ) {
      setResponseMessage("Message must be between 10 and 1000 characters.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!captchaToken) {
      setResponseMessage("reCAPTCHA verification failed. Try again.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, captchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResponseMessage("Message sent successfully!");
      setMessageType("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setResponseMessage(
        error.message || "An error occurred. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Load reCAPTCHA token when script is ready
  const handleRecaptchaLoad = () => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
            action: "submit",
          })
          .then((token) => setCaptchaToken(token));
      });
    }
  };

  // Get message styling based on type
  const getMessageClasses = () => {
    const baseClasses =
      "mt-4 text-center text-sm px-4 py-2 rounded-md transition-all duration-300";

    if (messageType === "success") {
      return `${baseClasses} text-green-800 bg-green-100 border border-green-300 dark:text-green-200 dark:bg-green-900 dark:border-green-700`;
    } else if (messageType === "error") {
      return `${baseClasses} text-red-800 bg-red-100 border border-red-300 dark:text-red-200 dark:bg-red-900 dark:border-red-700`;
    }
    return `${baseClasses} text-gray-700 dark:text-gray-300`;
  };

  return (
    <div className="w-full ">
      {/* Load reCAPTCHA script */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
        onLoad={handleRecaptchaLoad}
      />

      <div className="leading-loose">
        {responseMessage && (
          <div className={getMessageClasses()}>{responseMessage}</div>
        )}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl m-4 p-6 sm:p-10 bg-secondary-light dark:bg-secondary-dark rounded-xl shadow-xl text-left"
        >
          <FormInput
            inputLabel="Full Name"
            labelFor="name"
            inputType="text"
            inputId="name"
            inputName="name"
            placeholderText="Your Name"
            ariaLabelName="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <FormInput
            inputLabel="Email"
            labelFor="email"
            inputType="email"
            inputId="email"
            inputName="email"
            placeholderText="Your email"
            ariaLabelName="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormInput
            inputLabel="Subject"
            labelFor="subject"
            inputType="text"
            inputId="subject"
            inputName="subject"
            placeholderText="Subject"
            ariaLabelName="Subject"
            value={formData.subject}
            onChange={handleChange}
          />

          <div className="mt-6">
            <label
              className="block text-lg text-primary-dark dark:text-primary-light mb-2"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              className="w-full px-5 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-ternary-dark rounded-md shadow-sm text-md"
              id="message"
              name="message"
              cols={14}
              rows={6}
              aria-label="Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mt-6">
            <Button
              title={loading ? "Sending..." : "Send Message"}
              type="submit"
              aria-label="Send Message"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
