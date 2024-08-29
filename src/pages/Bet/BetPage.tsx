import PlaceBetPage from "../../components/layouts/home-5b/Bet/PlaceBetPage";
import HeaderLeague from "../../components/header/HeaderLeague";
import NewFooter from "../../components/footer/NewFooter";

const CreateTeamPage = () => {
  return (
    <div className="home-5">
      <HeaderLeague />
        <PlaceBetPage />
      <NewFooter />
    </div>
  );
};

export default CreateTeamPage;
