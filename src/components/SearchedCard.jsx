import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const SearchedCard = () => {
  const [city, setCity] = useState(null);
  const [forecast, setForecast] = useState([]); // Stato per le previsioni meteo
  const { lat, lon } = useParams(); // Estrai lat e lon dalla URL

  useEffect(() => {
    fetchWeatherData();
  }, [lat, lon]); // Effettua il fetch quando lat e lon cambiano

  const fetchWeatherData = async () => {
    try {
      // Fetch dati meteo correnti
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=91b5ca7dea770ebd38fd11f37f7289c5`
      );

      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        setCity(weatherData);
      } else {
        console.error("Errore nel recupero dei dati meteo correnti");
      }

      // Fetch previsioni meteo (usando le variabili lat e lon)
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=91b5ca7dea770ebd38fd11f37f7289c5`
      );

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecast(forecastData.list); // Lista delle previsioni
      } else {
        console.error("Errore nel recupero delle previsioni meteo");
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };

  // Funzione per formattare la data cosi ottengo per esempio "Ven 14 Febbraio"
  const formatDate = (date) => {
    const options = { weekday: "short", day: "numeric", month: "long" };
    const formattedDate = new Date(date).toLocaleDateString("it-IT", options);

    // Separo giorno, giorno numerico e mese
    const [day, dayNumber, month] = formattedDate.split(" ");
    const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1); // Prima lettera del giorno maiuscola
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1); // Prima lettera del mese maiuscola

    return `${capitalizedDay} ${dayNumber} ${capitalizedMonth}`;
  };

  return (
    <Col xs={12} md={12} lg={12}>
      {/* Card per il meteo corrente */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`, // Imposta il background a tutte le card
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

                  <Card.Title>{city.name}</Card.Title>
                  <Card.Text>{Math.round(city.main.temp - 273.15)}°C</Card.Text>
                  <Card.Text className="text-capitalize">{city.weather[0].description}</Card.Text>
                  <Card.Text>
                    Massima: {Math.round(city.main.temp_max - 273.15)}°C / Minima:{" "}
                    {Math.round(city.main.temp_min - 273.15)}°C
                  </Card.Text>
                  <Card.Text>Percepita: {Math.round(city.main.feels_like - 273.15)}°C</Card.Text>
                </>
              ) : (
                <Card.Text>Caricamento dati...</Card.Text> // Messaggio durante il caricamento
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sezione per le previsioni */}
      <Row>
        {forecast.length > 0 ? (
          forecast.map((item, index) => {
            const date = new Date(item.dt * 1000); // Converto il timestamp in data
            const temp = Math.round(item.main.temp - 273.15); // Converto la temperatura da Kelvin a Celsius

            // Ottengo il giorno della settimana usando la funzione di formattazione della data
            const day = formatDate(date);

            return (
              <Col key={index} xs={12} sm={6} md={4} lg={3}>
                <Card
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`, // Background per le card delle previsioni
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
                      <div>{day}</div>
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
          <Card.Text>Caricamento previsioni...</Card.Text> // Messaggio durante il caricamento delle previsioni
        )}
      </Row>
    </Col>
  );
};

export default SearchedCard;
