import React from 'react';
import gamesData from './data/games.json'; // Importamos el JSON
import './App.css';

// 1. Definimos un Componente para la Tarjeta Individual
const GameCard = ({ game }) => (
  <div className="card mb-3 shadow-sm border-0">
    <div className="card-body">
      <h5 className="card-title fw-bold text-dark">{game.teams}</h5>
      <h6 className="card-subtitle mb-2 text-muted">{game.date} - {game.time}</h6>
      <p className="card-text mb-0">📍 {game.location}</p>
    </div>
  </div>
);

// 2. Componente Principal que renderiza la lista
function App() {
  return (
    <div className="container mt-4">
      <header className="text-center mb-4">
        <h1 className="fw-bold">NYSL Mobile App</h1>
        <p className="text-secondary">Próximos Partidos</p>
      </header>
      
      {/* Usamos .map() para iterar sobre el JSON y crear una tarjeta por cada partido */}
      <div className="row">
        {gamesData.map((game) => (
          <div className="col-12 col-md-6 col-lg-4" key={game.id}>
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;