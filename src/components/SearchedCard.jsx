import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const SearchedCard = () => {
  const [city, setCity] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [bgImage, setBgImage] = useState(
    "https://plus.unsplash.com/premium_photo-1701596398952-5c142b34da08?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ); // Stato per l'immagine di sfondo
  const { lat, lon } = useParams(); // Estrarre lat e lon dalla URL

  const formatDate = (date) => {
    const options = { weekday: "short", day: "numeric", month: "long" };
    const formattedDate = new Date(date).toLocaleDateString("it-IT", options);

    // Separo giorno, giorno numerico e mese
    const [day, dayNumber, month] = formattedDate.split(" ");
    const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1); // Prima lettera del giorno maiuscola
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1); // Prima lettera del mese maiuscola

    return `${capitalizedDay} ${dayNumber} ${capitalizedMonth}`;
  };

  useEffect(() => {
    fetchWeatherData();
  }, [lat, lon]);

  const fetchWeatherData = async () => {
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=91b5ca7dea770ebd38fd11f37f7289c5`
      );

      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        setCity(weatherData);

        // Dopo aver ottenuto il nome della città, posso usarla nella funzione che fetcha unsplash
        if (weatherData.name) {
          fetchBackgroundImage(weatherData.name);
        }
      } else {
        console.error("Errore nel recupero dei dati meteo correnti");
      }

      // lo so che è una cosa in più ma mi faceva troppo incazzare che l'api di openweather non mi dava uno sfondo per la città selezionata quindi mi sono iscritto ad unsplash
      // ho provato un pò l'api di unsplash e devo dire che era un pò complessa quindi non sempre prende foto che vanno bene, tra l'altro ha un limite di 50 richieste l'ora... spero vada bene!

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=91b5ca7dea770ebd38fd11f37f7289c5`
      );

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecast(forecastData.list);
      } else {
        console.error("Errore nel recupero delle previsioni meteo");
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };

  const fetchBackgroundImage = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${cityName}&client_id=aks67fyYJx6omX1SQSnqbH5W2FimWcGDOSw1B35BUIo`
      );

      if (response.ok) {
        const data = await response.json();
        setBgImage(data.urls.raw); // Imposta l'immagine di sfondo
      } else {
        console.error("Errore nel recupero dell'immagine di sfondo");
      }
    } catch (error) {
      console.error("Errore di rete durante il fetch dell'immagine:", error);
    }
  };

  return (
    <Container fluid>
      <Col xs={12} md={12} lg={12}>
        <Row className="mb-4">
          <Col xs={12}>
            <Card
              style={{
                backgroundImage: `url(${
                  bgImage ||
                  "https://plus.unsplash.com/premium_photo-1704757166140-0335d6952520?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
              }}
            >
              <Card.Body style={{ position: "relative", paddingTop: "50px" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                >
                  Meteo Attuale
                </div>
                {city ? (
                  <>
                    <img
                      src={`http://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
                      alt={city.weather[0].description}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "80px",
                        height: "80px",
                      }}
                    />
                    <Card.Title className="fs-2">{city.name}</Card.Title>
                    <Card.Text>{Math.round(city.main.temp - 273.15)}°C</Card.Text>
                    <Card.Text className="text-capitalize">{city.weather[0].description}</Card.Text>
                    <Card.Text>
                      Massima: {Math.round(city.main.temp_max - 273.15)}°C / Minima:{" "}
                      {Math.round(city.main.temp_min - 273.15)}°C
                    </Card.Text>
                    <Card.Text>Percepita: {Math.round(city.main.feels_like - 273.15)}°C</Card.Text>
                  </>
                ) : (
                  <Card.Text>Caricamento dati...</Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sezione per le previsioni */}
        <Row>
          {forecast.length > 0 ? (
            forecast.map((item, index) => {
              const date = new Date(item.dt * 1000);
              const temp = Math.round(item.main.temp - 273.15);
              const day = formatDate(date);

              return (
                <Col key={index} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    style={{
                      backgroundImage: `url("https://plus.unsplash.com/premium_photo-1704757166140-0335d6952520?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      color: "white",
                    }}
                    className="mb-3"
                  >
                    <Card.Body style={{ position: "relative" }}>
                      <img
                        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt={item.weather[0].description}
                        style={{ width: "50px", height: "50px", position: "absolute", top: 10, right: 10 }}
                      />
                      <Card.Title>
                        <div className="fs-3">{day}</div>
                        <div>{`${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`}</div>
                      </Card.Title>
                      <Card.Text>Temp: {temp}°C</Card.Text>
                      <Card.Text className="text-capitalize">{item.weather[0].description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Card.Text>Caricamento previsioni...</Card.Text>
          )}
        </Row>
      </Col>
    </Container>
  );
};

export default SearchedCard;
