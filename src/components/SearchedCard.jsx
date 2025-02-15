import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const SearchedCard = () => {
  const [city, setCity] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [show, setShow] = useState(false);
  const [hourlyData, setHourlyData] = useState([]); // Stato per i dati orari

  const [bgImage, setBgImage] = useState(
    "https://plus.unsplash.com/premium_photo-1701596398952-5c142b34da08?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );

  const handleClose = () => setShow(false);
  const handleShow = (dayData) => {
    setHourlyData(dayData);
    setShow(true);
  };

  const { lat, lon } = useParams();

  const formatDate = (date) => {
    const options = { weekday: "short", day: "numeric", month: "long" };
    const formattedDate = new Date(date).toLocaleDateString("it-IT", options);

    const [day, dayNumber, month] = formattedDate.split(" ");
    const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

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

        if (weatherData.name) {
          fetchBackgroundImage(weatherData.name);
        }
      } else {
        console.error("Errore nel recupero dei dati meteo correnti");
      }

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
        setBgImage(data.urls.raw);
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
                    <Card.Text className="text-capitalize fw-bold">{city.weather[0].description}</Card.Text>
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

        <Row className="justify-content-center">
          {forecast.length > 0 ? (
            forecast
              .filter((item) => item.dt_txt.includes("12:00:00")) // voglio mostrare all'inizio solo card relative alle 12 (volevo fare una media giornaliera ma non ci sono arrivato)
              .map((item, index) => {
                const date = new Date(item.dt_txt);
                const temp = Math.round(item.main.temp - 273.15);
                const day = formatDate(date);

                // Filtra i dati orari per il giorno selezionato
                const dayData = forecast.filter((forecastItem) => {
                  const forecastDate = new Date(forecastItem.dt_txt);
                  return forecastDate.toDateString() === date.toDateString();
                });

                return (
                  <Col key={index} xs={12} sm={6} md={6} lg={4} xl={2}>
                    <Card className="mb-3">
                      <Card.Body style={{ position: "relative" }}>
                        <img
                          src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                          alt={item.weather[0].description}
                          style={{ width: "50px", height: "50px", position: "absolute", top: 10, right: 10 }}
                        />
                        <Card.Title>
                          <div className="fs-4">{day}</div>
                          <div>{`${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`}</div>
                        </Card.Title>
                        <Card.Text>{temp}°C</Card.Text>
                        <Card.Text className="text-capitalize fw-bold">{item.weather[0].description}</Card.Text>
                        <Button onClick={() => handleShow(dayData)} variant="info">
                          Info orari
                        </Button>
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
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Previsioni Orarie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2 border-bottom fw-bold">
            <Col xs={3}>Ora</Col>
            <Col xs={3}>Temp.</Col>
            <Col xs={3}>Condizioni</Col>
            <Col xs={3}>Umidità</Col>
          </Row>

          {hourlyData.map((hour, index) => {
            const time = new Date(hour.dt_txt).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
            const backgroundColor = index % 2 === 0 ? "white" : "#f7f7f7"; // volevo alternare i colori di bg per far capire lo stacco degli orari meglio
            return (
              <Row key={index} className="align-items-center border-bottom py-2" style={{ backgroundColor }}>
                <Col xs={3} className="fs-5">
                  {time}
                </Col>

                <Col xs={3} className="d-flex align-items-center">
                  <img
                    src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                    alt={hour.weather[0].description}
                    style={{ width: "40px", height: "40px" }}
                    className="me-2"
                  />
                  <span>{Math.round(hour.main.temp - 273.15)}°C</span>
                </Col>

                <Col xs={3} className="text-capitalize">
                  {hour.weather[0].description}
                </Col>

                <Col xs={3}>
                  <span className="text-primary">{hour.main.humidity}%</span>
                </Col>
              </Row>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SearchedCard;
