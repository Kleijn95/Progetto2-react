import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "./App.css";
import SearchBar from "./components/SearchBar";
import Cards from "./components/Cards";
import TopBar from "./components/TopBar";
import { useState, useEffect } from "react";
import SearchedCard from "./components/SearchedCard";

function App() {
  const [searchQuery, setSearchQuery] = useState(""); // Stato per la ricerca
  const [results, setResults] = useState([]); // Stato per i risultati di ricerca
  const [userLocation, setUserLocation] = useState(null); // Stato per la posizione dell'utente

  useEffect(() => {
    // Funzione per ottenere la posizione dell'utente
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lon: longitude });
          },
          (error) => {
            console.error("Errore nella geolocalizzazione:", error);
          }
        );
      } else {
        console.log("Geolocalizzazione non supportata dal browser.");
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
                  {/* Se l'utente accetta di mandare la localizzazione al brower la prima card sarà della sua località attuale (ho cercato su internet questa chicca che voleto mettere, la foto è settata a Catania, non ho avuto tempo per renderla dinamica) */}
                  {userLocation && (
                    <Cards
                      bgImage="https://images.unsplash.com/photo-1584198686005-d9f5d63efa0e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      lat={userLocation.lat}
                      lon={userLocation.lon}
                      isUserLocation={true} // Passa props che è la location dell'utente per poter mettere l'icona classica dei siti meteo per la tua locazione attuale
                    />
                  )}
                  {/* 4 card statiche che ho messo io con sfondo relativo a loro (volevo mettere lo sfondo relativo anche nella pagina searched card ma non sapevo come fare*/}
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

        {/* Route alla searchedCard che renderizza la pagina con più dettagli della città scelta */}
        <Route path="/search/:lat/:lon" element={<SearchedCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
