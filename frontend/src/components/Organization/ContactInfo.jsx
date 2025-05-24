const ContactInfo = ({ website, address, email }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-around items-center gap-4 mt-6 text-slate-600">
      <div className="flex items-center gap-2">
        <img src={require("../../images/world.png")} alt="Website" className="w-5 h-5" />
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {website}
        </a>
      </div>
      <div className="flex sm:items-center gap-2">
        <img src={require("../../images/pin.png")} alt="Address" className="w-5 h-5" />
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {address}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <img src={require("../../images/mail.png")} alt="Email" className="w-5 h-5" />
        <a href={`mailto:${email}`} className="hover:underline">
          {email}
        </a>
      </div>
    </div>
  );
};

export default ContactInfo;
