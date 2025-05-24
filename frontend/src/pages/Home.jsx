import "@fontsource/nunito";
import TopHome from "../components/Home/TopHome";
import MiddleHome from "../components/Home/MiddleHome";
import BottomHome from "../components/Home/BottomHome";

const Home = ({ isAuthenticated }) => {
  return (
    <>
      <TopHome />
      <MiddleHome isAuthenticated={isAuthenticated} />
      {!isAuthenticated && <BottomHome />}
    </>
  );
};

export default Home;
