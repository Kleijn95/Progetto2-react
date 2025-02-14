import { useEffect, useState } from "react";
import { Button, Card, Col } from "react-bootstrap";
import { GeoAlt } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const Cards = (props) => {
  const [city, setCity] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${props.lat}&lon=${props.lon}&appid=91b5ca7dea770ebd38fd11f37f7289c5`
      );

      if (response.ok) {
        const data = await response.json();
        setCity(data);
      } else {
        console.error("Errore nel recupero dei dati");
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };

  return (
    <Col xs={12} md={6} lg={3}>
      <Card
        className="mb-2"
        style={{
          backgroundImage: `url(${props.bgImage})`,
          backgroundSize: "cover",
          overflow: "hidden",
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

              <Card.Title className="fs-3">
                {city.name} {props.isUserLocation && <GeoAlt style={{ marginLeft: "8px", color: "black" }} />}{" "}
                {/* se ha la props isUserLocation  mi mette l'icon di react-bootstrap */}
              </Card.Title>
              <Card.Text>{Math.round(city.main.temp - 273.15)}°C</Card.Text>
              <Card.Text className="text-capitalize">{city.weather[0].description}</Card.Text>
              <Card.Text>
                Massima: {Math.round(city.main.temp_max - 273.15)}°C / Minima: {Math.round(city.main.temp_min - 273.15)}
                °C
              </Card.Text>
              <Card.Text>Percepita: {Math.round(city.main.feels_like - 273.15)}°C</Card.Text>
            </>
          ) : (
            <Card.Text>Caricamento dati...</Card.Text>
          )}
          <Link to={`/search/${props.lat}/${props.lon}/`}>
            <Button variant="info" className="mt-3">
              See more forecasts.
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Cards;
