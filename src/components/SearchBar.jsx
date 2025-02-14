import { useState } from "react";
import { Form, InputGroup, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState(""); // Stato per il campo di ricerca
  const [results, setResults] = useState([]); // Stato per i risultati della ricerca, inizializzato come array
  const navigate = useNavigate();

  // Funzione per gestire il cambiamento del valore di ricerca
  const handleSearchChange = async (query) => {
    setSearchQuery(query); // Imposta il valore della ricerca
    if (query) {
      try {
        const response = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=91b5ca7dea770ebd38fd11f37f7289c5`
        );
        const data = await response.json();
        setResults(Array.isArray(data) ? data : []); // Verifica che `data` sia un array
      } catch (error) {
        console.error("Errore nella ricerca:", error);
        setResults([]); // In caso di errore, resettare i risultati
      }
    } else {
      setResults([]); // Se la ricerca è vuota, resettiamo i risultati
    }
  };

  // Funzione per navigare al risultato selezionato
  const handleSelect = (lat, lon) => {
    navigate(`/search/${lat}/${lon}`);
  };

  return (
    <div>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Cerca una città"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)} // Gestisce il cambiamento
        />
      </InputGroup>

      {/* Dropdown per mostrare i risultati della ricerca */}
      {results.length > 0 && (
        <ListGroup style={{ position: "absolute", zIndex: 10, width: "100%" }}>
          {results.map(
            (
              result,
              index // creo una lista sottostante la searchbar con i risultati mappando results
            ) => (
              <ListGroup.Item
                key={index}
                action
                onClick={() => handleSelect(result.lat, result.lon)} // Naviga al risultato selezionato
                style={{
                  cursor: "pointer",
                  backgroundColor: "#f8f9fa",
                }}
              >
                {result.name}, {result.country}
              </ListGroup.Item>
            )
          )}
        </ListGroup>
      )}
    </div>
  );
}

export default SearchBar;
