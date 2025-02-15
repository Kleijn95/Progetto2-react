import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "./App.css";
import SearchBar from "./components/SearchBar";
import Cards from "./components/Cards";
import TopBar from "./components/TopBar";
import { useState, useEffect } from "react";
import SearchedCard from "./components/SearchedCard";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [userCity, setUserCity] = useState(""); // Stato per il nome della città
  const [bgImage, setBgImage] = useState(null); // Stato per l'immagine di sfondo

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lon: longitude });

            // Dopo aver ottenuto la posizione, ottieni il nome della città
            fetchCityName(latitude, longitude);
          },
          (error) => {
            console.error("Errore nella geolocalizzazione:", error);
          }
        );
      } else {
        console.log("Geolocalizzazione non supportata dal browser.");
      }
    };

    const fetchCityName = async (lat, lon) => {
      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=91b5ca7dea770ebd38fd11f37f7289c5`
        );
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          setUserCity(weatherData.name); // Salva il nome della città
          fetchBackgroundImage(weatherData.name); // Dopo aver ottenuto il nome, carica l'immagine
        }
      } catch (error) {
        console.error("Errore nel recupero del nome della città:", error);
      }
    };

    const fetchBackgroundImage = async (cityName) => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${cityName}&client_id=aks67fyYJx6omX1SQSnqbH5W2FimWcGDOSw1B35BUIo`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data.urls.raw);
          setBgImage(data.urls.raw); // Salva l'URL dell'immagine di sfondo
        }
      } catch (error) {
        console.error("Errore nel recupero dell'immagine di sfondo", error);
      }
    };

    getUserLocation();
  }, []);

  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Container fluid>
                <Row>
                  <Col className="col-12">
                    <SearchBar />
                    {searchQuery && <Cards searchQuery={searchQuery} />}
                  </Col>
                </Row>
              </Container>

              <Container fluid>
                <Row style={{ marginTop: "50px" }}>
                  {userLocation && (
                    <Cards bgImage={bgImage} lat={userLocation.lat} lon={userLocation.lon} isUserLocation={true} />
                  )}
                  {/* Altre cards statiche */}
                  <Cards
                    bgImage="https://images.unsplash.com/photo-1580655653885-65763b2597d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    lon="-118.242766"
                    lat="34.0536909"
                  />
                  <Cards
                    bgImage="https://plus.unsplash.com/premium_photo-1661878122586-2d75a86f3400?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    lon="4.8936041"
                    lat="52.3727598"
                  />
                  <Cards
                    bgImage="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    lon="151.2082848"
                    lat="-33.8698439"
                  />
                  <Cards
                    bgImage="https://plus.unsplash.com/premium_photo-1661962723801-1015e61ec340?q=80&w=2070&auto=format&fit=crop&ixib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    lon="12.4829321"
                    lat="41.8933203"
                  />
                </Row>
              </Container>
            </>
          }
        />
        <Route path="/search/:lat/:lon" element={<SearchedCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
