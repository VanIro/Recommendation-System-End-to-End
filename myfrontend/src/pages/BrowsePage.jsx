import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useContent from "../custom-hooks/useContent";
import {fetch_trailer_url} from "../custom-hooks/useContent";
import HeaderWrapper from "../components/Header/HeaderWrapper";
import HeaderLink from "../components/Header/HeaderLink";
import NavBar from "../components/Header/NavBar";
import Logo from "../components/Header/Logo";
import SignoutButton from "../components/Header/SignoutButton";
import SigninButton from "../components/Header/SigninButton";
import FeatureWrapper from "../components/Header/FeatureWrapper";
import FeatureTitle from "../components/Header/FeatureTitle";
import FeatureSubTitle from "../components/Header/FeatureSubTitle";
import PlayButton from "../components/Header/PlayButton";
import RateButton from "../components/Header/RateButton";
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
  const [ loading, setLoading ] = useState(true);
  const [ series, setSeries ] = useState([]);

  const [category, setCategory] = useState("films");
  const navigate = useNavigate();

  // if(category=="series"){ 
    useContent("series", (data)=>{
      
      setLoading(true)
      // setLoading(false)
      console.log("Series->",data)
      setSeries(data)
    });
  // }
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

  // let [ films, setFilms ] = useState([]);
  // if(category=="films") {

    let {films} =  useContent("films", (data)=>{
      // console.log("films:",data.length,data)
      // setLoading(false)
      setLoading(true)
      // setFilms(prev=>{
      //   // console.log("setting films:",data.length,data)
      //   // console.log(prev==data,prev)
      //   return data
      // })
    });
    useEffect(()=>{
      console.log("here is films after being set",films.length,films)
      films.forEach(()=>console.log("something reloaded"))
    },[films])
  // }

  
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

  const currentCategory = category === "films" ? films : series;
  const [showCardFeature, setShowCardFeature] = useState(false);
  const [activeItem, setActiveItem] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeItemTrailerUrl, setActiveItemTrailerUrl] = useState("");

  
  useEffect(()=>{
    console.log("currentCategory changed...", currentCategory)
    setLoading(false)
  },[films,series])
  
  // console.log("Reloaded.. loading=",loading,films.length, films)
  console.log("Reloaded.. loading=")
  console.log(currentCategory)
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
          <HeaderLink
            className={
              // category === "series" ? "header-link-bold" : "header-link"
              "header-link"
            }
            onClick={() => navigate("/myRatings")}
            >
            My Ratings
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
      {/* {console.log(`currentCategory.map will run with ${currentCategory?currentCategory.length:currentCategory} not s items`,films)} */}
      {loading?(<div>Loading... </div>):  
        currentCategory.map((slideItem) => {
          // console.log("here is a slideItem", slideItem)
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
                        console.log("click detected");
                        setShowCardFeature(true);
                        setActiveItem(cardItem);
                        fetch_trailer_url(category,cardItem.id).then((url)=>{console.log("got trailer url: ", url);setActiveItemTrailerUrl(url)});
                      }}
                      // src={`../images/${category}/${cardItem.genre}/${cardItem.slug}/small.jpg`}
                      src={`https://image.tmdb.org/t/p/original/${cardItem.poster_path}?api_key=${TMDB_API_KEY}`}
                    />
                    <RateButton card_data={cardItem} card_category={category}>
                      ❤️...
                    </RateButton>
                    
                  </CardWrapper>
                )
              })}
            </AllCardsWrapper>
            {showCardFeature &&
            slideItem.title.toLowerCase() === activeItem.genre.toLowerCase() ? (
              <CardFeatureWrapper
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original/${activeItem.backdrop_path}?api_key=${TMDB_API_KEY})`,
                }}
              >
                <CardTitle>{activeItem.title}</CardTitle>
                <CardDescription>{activeItem.overview}</CardDescription>
                <CardFeatureClose onClick={() => {
                  setShowCardFeature(false)
                  setActiveItemTrailerUrl("")
                }
                } />
                <PlayButton onClick={() => setShowPlayer(true)}>
                  Play
                </PlayButton>
                {showPlayer ? ()=>{
                  console.log("final activeUrl",activeItemTrailerUrl)
                  return (
                  <PlayerOverlay onClick={() => setShowPlayer(false)}>
                    <PlayerVideo src_url={activeItemTrailerUrl} type="video/mp4" />
                  </PlayerOverlay>
                )} : null}
              </CardFeatureWrapper>
            ) : null}
          </SlideWrapper>
          )
        })
      }
      </AllSlidesWrapper>
      <FooterCompound />
    </>
  );
}

export default BrowsePage;
