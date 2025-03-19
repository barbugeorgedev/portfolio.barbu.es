import { useCountUp } from "react-countup";
import CounterItem from "./CounterItem";

function AboutCounter() {
  useCountUp({ ref: "experienceCounter", end: 12, duration: 2 });
  useCountUp({ ref: "deploymentsCounter", end: 100, duration: 2 });
  useCountUp({ ref: "mobileAppsCounter", end: 2, duration: 2 });
  useCountUp({ ref: "projectsCounter", end: 50, duration: 2 });

  return (
    <div className="mt-10 sm:mt-20 bg-primary-light dark:bg-ternary-dark shadow-sm">
      <div className="font-general-medium container mx-auto py-20 block sm:flex sm:justify-between items-center">
        <CounterItem
          title="Years of experience"
          counter={<span id="experienceCounter" />}
          measurement="+"
        />

        <CounterItem
          title="Successful Deployments"
          counter={<span id="deploymentsCounter" />}
          measurement="+"
        />

        <CounterItem
          title="Projects completed"
          counter={<span id="projectsCounter" />}
          measurement="+"
        />

        <CounterItem
          title="Mobile Apps"
          counter={<span id="mobileAppsCounter" />}
          measurement=""
        />
      </div>
    </div>
  );
}

export default AboutCounter;
