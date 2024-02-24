import ScrollToTopButton from "../components/common/ScrollToTopButton";
import Hero from "../components/common/Hero";
import tmdbConfigs from "../api/configs/tmdb.config";
import ContentSlide from "../components/common/ContentSlide";
import Container from "../components/common/Container";
import EmailForm from "../components/common/EmailForm";

const HomePage = () => {
  return (
    <div>
      <ScrollToTopButton></ScrollToTopButton>

      <Hero
        mediaType={tmdbConfigs.mediaType.movie}
        mediaCategory={tmdbConfigs.mediaCategory.popular}
      ></Hero>

      <div style={{ maxWidth: "1122px", margin: "0 auto" }}>
        <Container header="Now Playing">
          <ContentSlide
            mediaType={tmdbConfigs.mediaType.movie}
            mediaCategory={tmdbConfigs.mediaCategory.now_playing}
          ></ContentSlide>
        </Container>

        <Container header="Popular Movies">
          <ContentSlide
            mediaType={tmdbConfigs.mediaType.movie}
            mediaCategory={tmdbConfigs.mediaCategory.popular}
          ></ContentSlide>
        </Container>

        <Container header="Rated Movies">
          <ContentSlide
            mediaType={tmdbConfigs.mediaType.tv}
            mediaCategory={tmdbConfigs.mediaCategory.top_rated}
          ></ContentSlide>
        </Container>

        <Container header="Top Movies">
          <ContentSlide
            mediaType={tmdbConfigs.mediaType.movie}
            mediaCategory={tmdbConfigs.mediaCategory.popular}
          ></ContentSlide>
        </Container>

        <EmailForm />
      </div>
    </div>
  );
};

export default HomePage;
