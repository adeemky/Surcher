import { useRef, useState } from "react";
import testimonials1 from "../../images/testimonials1.png";
import testimonials2 from "../../images/testimonials2.png";
import testimonials3 from "../../images/testimonials3.png";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const feedbacks = [
    {
      name: "David, Surcher User",
      text: "It feels empowering to contribute to causes I care about. These surveys let me raise my voice, and I know it's being heard.",
      image: testimonials1,
    },
    {
      name: "Karen, Save the Children's President",
      text: "Surcher has become a powerful tool for us to better understand communities. The insights we get shape our programs on the ground.",
      image: testimonials2,
    },
    {
      name: "WWF Team, Volunteers",
      text: "We’ve used Surcher to connect with people who share our passion for protecting nature. Their feedback guides our campaigns.",
      image: testimonials3,
    },
  ];

  return (
    <div className="py-24 px-4 md:px-16 flex flex-col items-center">
      <h2 className="text-5xl text-center text-slate-700 mb-12 font-ancizar">
        What People Are Saying
      </h2>
      <div className="w-full max-w-4xl overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={() => {
            const scrollLeft = scrollRef.current.scrollLeft;
            const cardWidth = scrollRef.current.offsetWidth;
            const index = Math.round(scrollLeft / cardWidth);
            setActiveIndex(index);
          }}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        >
          {feedbacks.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-full max-w-4xl h-[28rem] snap-center text-center bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="h-2/3 w-full">
                <img
                  src={item.image}
                  alt={`Photo of ${item.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1/3 p-6 text-center flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.name}</h3>
                <p className="text-slate-600 italic px-4">"{item.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6 gap-2">
        {feedbacks.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx === activeIndex ? "bg-slate-700" : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
