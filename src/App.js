import React from 'react';
import gamesData from './data/games.json';
import './App.css';

// 1. Componente que representa una fila de la tabla
const GameRow = ({ game }) => (
  <tr>
    <td className="fw-bold">{game.date}</td>
    <td>{game.teams}</td>
    <td>{game.location}</td>
    <td>{game.time}</td>
  </tr>
);

// 2. Componente principal envuelto en un "container"
function App() {
  return (
    <div className="container my-5">
      <header className="mb-4">
        <h1 className="fw-bold text-primary">NYSL Mobile App</h1>
        <p className="lead text-muted">Calendario de la Temporada de Otoño</p>
      </header>

      {/* Tabla con estilos nativos de Bootstrap */}
      <div className="table-responsive shadow-sm">
        <table className="table table-bordered table-striped table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>Fecha</th>
              <th>Equipos</th>
              <th>Sede</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {gamesData.map((game) => (
              <GameRow key={game.id} game={game} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;