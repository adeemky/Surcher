import ContactInfo from "./ContactInfo";
import ngodefault from "../../images/ngodefault.png";

const OrganizationHeader = ({ organization }) => {
  return (
    <>
      <div className="bg-gradient-to-br from-neutral-100 via-white to-neutral-200 shadow-md px-4 py-2 mb-4">
        <div className="hidden sm:flex max-w-6xl mx-auto px-4 py-10 font-nunito text-slate-800 h-[20rem] items-center">
          <div className="flex items-center gap-6 h-[20rem]">
            <div className="w-1/4">
              <img
                src={
                  organization.image && organization.image.trim() !== ""
                    ? organization.image
                    : ngodefault
                }
                alt={organization.name || "Default logo"}
                className="w-full h-auto object-cover rounded shadow transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="w-3/4 flex items-center justify-center">
              <div>
                <h1 className="text-4xl text-cyan-600 font-bold mb-2">{organization.name}</h1>
                <p className="text-lg font-medium text-gray-400 mb-2">
                  {organization.definition}
                </p>
                <p className="text-base">{organization.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex flex-row justify-around items-center gap-4 mt-6 text-slate-600">
          <ContactInfo
            website={organization.website}
            address={organization.address}
            email={organization.email}
          />
        </div>
      </div>

      {/* Mobil */}
      <div className="flex sm:hidden flex-col gap-4 px-4 py-10 font-nunito [background-color:#f2f2f2] shadow-lg text-slate-800 mb-2">
        <div className="flex gap-4 items-center">
          <div className="w-1/3">
            <img
              src={
                organization.image && organization.image.trim() !== ""
                  ? organization.image
                  : ngodefault
              }
              alt={organization.name || "Default logo"}
              className="w-full h-auto object-cover rounded shadow transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="flex-1 flex items-center">
            <div>
              <h1 className="text-xl text-cyan-600 font-bold">{organization.name}</h1>
              <p className="text-m text-gray-400">{organization.definition}</p>
            </div>
          </div>
        </div>
        <p className="text-base">{organization.description}</p>
        <ContactInfo
          website={organization.website}
          address={organization.address}
          email={organization.email}
        />
      </div>
    </>
  );
};

export default OrganizationHeader;
