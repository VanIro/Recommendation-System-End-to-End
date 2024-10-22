import React, { useState } from "react";
import useContent from "../custom-hooks/useContent";
import HeaderWrapper from "../components/Header/HeaderWrapper";
import NavBar from "../components/Header/NavBar";
import Logo from "../components/Header/Logo";
import SignoutButton from "../components/Header/SignoutButton";
import SigninButton from "../components/Header/SigninButton";
import FeatureWrapper from "../components/Header/FeatureWrapper";
import FeatureTitle from "../components/Header/FeatureTitle";
import FeatureSubTitle from "../components/Header/FeatureSubTitle";
import PlayButton from "../components/Header/PlayButton";
import HeaderLink from "../components/Header/HeaderLink";
import AllSlidesWrapper from "../components/Movies/AllSlidesWrapper";
import SlideWrapper from "../components/Movies/SlideWrapper";
import SlideTitle from "../components/Movies/SlideTitle";
import AllCardsWrapper from "../components/Movies/AllCardsWrapper";
import CardWrapper from "../components/Movies/CardWrapper";
import CardImage from "../components/Movies/CardImage";
import CardTitle from "../components/Movies/CardTitle";
import CardDescription from "../components/Movies/CardDescription";
import CardFeatureWrapper from "../components/Movies/CardFeatureWrapper";
import CardFeatureClose from "../components/Movies/CardFeatureClose";
import PlayerVideo from "../components/Movies/PlayerVideo";
import PlayerOverlay from "../components/Movies/PlayerOverlay";
import FooterCompound from "../compounds/FooterCompound";

import { TMDB_API_KEY } from "../../env";

function BrowsePage() {
  let [ series, setSeries ] = useState([]);
  useContent("series", (data)=>setSeries(data));
  // series = [
  //   {
  //     title: "Documentaries",
  //     data: series.filter((item) => item.genre === "documentaries"),
  //   },
  //   {
  //     title: "Comedies",
  //     data: series.filter((item) => item.genre === "comedies"),
  //   },
  //   {
  //     title: "Children",
  //     data: series.filter((item) => item.genre === "children"),
  //   },
  //   { title: "Crime", data: series.filter((item) => item.genre === "crime") },
  //   {
  //     title: "Feel-Good",
  //     data: series.filter((item) => item.genre === "feel-good"),
  //   },
  // ];

  let [ films, setFilms ] = useState([]);
  useContent("films", (data)=>{
    console.log("films:",films)
    setFilms(data)
  });
  
  console.log("Reloaded..")
  // films = [
  //   { title: "Drama", data: films.filter((item) => item.genre === "drama") },
  //   {
  //     title: "Thriller",
  //     data: films.filter((item) => item.genre === "thriller"),
  //   },
  //   {
  //     title: "Children",
  //     data: films.filter((item) => item.genre === "children"),
  //   },
  //   {
  //     title: "Suspense",
  //     data: films.filter((item) => item.genre === "suspense"),
  //   },
  //   {
  //     title: "Romance",
  //     data: films.filter((item) => item.genre === "romance"),
  //   },
  // ];

  const [category, setCategory] = useState("films");
  const currentCategory = category === "films" ? films : series;
  const [showCardFeature, setShowCardFeature] = useState(false);
  const [activeItem, setActiveItem] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <>
      <HeaderWrapper className="header-wrapper-browse">
        <NavBar className="navbar-browse">
          <Logo />
          <div className="navbar-browseTypeOption">
          <HeaderLink
            className={
              category === "films" ? "header-link-bold" : "header-link"
            }
            onClick={() => setCategory("films")}
          >
            Films
          </HeaderLink>
          <HeaderLink
            className={
              category === "series" ? "header-link-bold" : "header-link"
            }
            onClick={() => setCategory("series")}
            >
            Series
          </HeaderLink>
          </div>
          <SignoutButton>Logout</SignoutButton>
        </NavBar>
        <FeatureWrapper>
          <FeatureTitle className="feature-title-browse">
            Watch Joker Now
          </FeatureTitle>
          <FeatureSubTitle className="feature-subtitle-browse">
            Forever alone in a crowd, failed comedian Arthur Fleck seeks
            connection as he walks the streets of Gotham City. Arthur wears two
            masks, the one he paints for his day job as a clown, and the guise
            he projects in a futile attempt to feel like he is part of the world
            around him.
          </FeatureSubTitle>
          <PlayButton onClick={() => setShowPlayer(true)}>Play</PlayButton>
          {showPlayer ? (
            <PlayerOverlay onClick={() => setShowPlayer(false)}>
              <PlayerVideo src="./videos/video.mp4" type="video/mp4" />
            </PlayerOverlay>
          ) : null}
        </FeatureWrapper>
      </HeaderWrapper>

      <AllSlidesWrapper>
        {currentCategory&&currentCategory.map((slideItem) => {
          console.log("here is a slideItem", slideItem)
          return (
          <SlideWrapper key={`${category}-${slideItem.title.toLowerCase()}`}>
            <SlideTitle>{slideItem.title}</SlideTitle>
            <AllCardsWrapper>
              {slideItem.data.map((cardItem) => {
                // console.log("here is a cardItem: ",cardItem)
                return (
                  <CardWrapper key={cardItem.id}>
                    <CardImage
                      onClick={() => {
                        setShowCardFeature(true);
                        setActiveItem(cardItem);
                      }}
                      // src={`../images/${category}/${cardItem.genre}/${cardItem.slug}/small.jpg`}
                      src={`https://image.tmdb.org/t/p/original/${cardItem.poster_path}?api_key=${TMDB_API_KEY}`}
                    />
                  </CardWrapper>
                )
              })}
            </AllCardsWrapper>
            {showCardFeature &&
            slideItem.title.toLowerCase() === activeItem.genre ? (
              <CardFeatureWrapper
                style={{
                  backgroundImage: `https://image.tmdb.org/t/p/original/${cardItem.backdrop_path}?api_key=${TMDB_API_KEY})`,
                }}
              >
                <CardTitle>{activeItem.title}</CardTitle>
                <CardDescription>{activeItem.description}</CardDescription>
                <CardFeatureClose onClick={() => setShowCardFeature(false)} />
                <PlayButton onClick={() => setShowPlayer(true)}>
                  Play
                </PlayButton>
                {showPlayer ? (
                  <PlayerOverlay onClick={() => setShowPlayer(false)}>
                    <PlayerVideo src="../videos/video.mp4" type="video/mp4" />
                  </PlayerOverlay>
                ) : null}
              </CardFeatureWrapper>
            ) : null}
          </SlideWrapper>
          )
        })}
      </AllSlidesWrapper>
      <FooterCompound />
    </>
  );
}

export default BrowsePage;
