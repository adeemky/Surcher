import SectionBlock from "./SectionBlock";
import InfoHome from "./InfoHome";
import WhySurcher from "./WhySurcher";
import Testimonials from "./Testimonials";
import OrgHome from "./OrgHome";
import results from "../../images/results.png";
import vols from "../../images/vols.jpg";

const MiddleHome = ({ isAuthenticated }) => {
  return (
    <div className="px-4 md:px-10 my-20 space-y-24">
      <InfoHome />
      <SectionBlock
        imgSrc={vols}
        imgPosition="left"
        title="We believe that every voice counts"
        description="By signing up, you gain the opportunity to support NGOs by answering surveys that drive real-world impact.
        Every response helps organizations better understand communities, shape their actions, and build a fairer future."
        stats={[
          {
            title: "300+ NGOs",
            description: "Dozens of organizations gathered on one platform",
          },
          { title: "4k+ surveys", description: "Hundreds of surveys are conducted each year" },
          {
            title: "1m+ volunteers",
            description: "Over 1 million volunteers responded to surveys",
          },
        ]}
        buttonText="See Surveys"
        buttonLink={isAuthenticated ? "/surveys" : "/login"}
      />

      <WhySurcher />

      <OrgHome />

      <SectionBlock
        imgSrc={results}
        imgPosition="right"
        title="Open Data. Shared Impact."
        description="On Surcher, every completed survey becomes a valuable resource, openly accessible to researchers, advocates, and curious minds alike.
        Because knowledge grows when it’s shared and impact multiplies when it’s transparent."
        stats={[
          {
            title: "Instant Answers",
            description: "Get results as soon as the survey expires",
          },
          {
            title: "Trusted Results",
            description: "Only authenticated users can answer surveys",
          },
          {
            title: "Clear Graphics",
            description: "See the results of all your surveys in simple graphs",
          },
        ]}
        buttonText="See Results"
        buttonLink={isAuthenticated ? "/results" : "/login"}
      />
      <Testimonials />
    </div>
  );
};

export default MiddleHome;
