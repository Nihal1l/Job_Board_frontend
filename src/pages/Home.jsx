import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import JobPortalHero from "../components/JobPortalHero";
import JobList from "../components/Jobs/JobList";
import PopularCategoriesWithModal from "../components/Categories/PopularCategoriesWithModal";
import FeaturesSection from "../components/Home/FeaturesSection";
import FindBestCompanies from "../components/Home/FindBestCompanies";
import QuestionsAnswersAccordion from "../components/Home/QuestionsAnswersAccordion";

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");

    if (status && message) {
      if (status === "success") {
        toast.success(decodeURIComponent(message), {
          duration: 5000,
          icon: "🚀",
        });
      } else if (status === "fail" || status === "cancel") {
        toast.error(decodeURIComponent(message), {
          duration: 5000,
        });
      }

      // Clear the query parameters from the URL
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <JobPortalHero />
      <PopularCategoriesWithModal />
      <FeaturesSection />
      <JobList />
      <FindBestCompanies />
      <QuestionsAnswersAccordion />
    </div>
  );
};

export default Home;
