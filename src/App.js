import { useState } from 'react'; // CORRECCIÓN APLICADA: Importación directa de useState
import { useQuery } from '@tanstack/react-query';
import './App.css';

const fetchCourses = async () => {
  const response = await fetch('https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Componente para la Fila de la Tabla
const CourseRow = ({ course }) => (
  <tr>
    <td className="fw-bold">{course.term}</td>
    <td>{course.number}</td>
    <td>{course.title}</td>
    <td>{course.meets}</td>
  </tr>
);

// NUEVO COMPONENTE: Botones para seleccionar el término (Term Selector)
const TermSelector = ({ term, setTerm }) => {
  const terms = ['Fall', 'Winter', 'Spring'];
  return (
    <div className="btn-group mb-4 shadow-sm" role="group">
      {terms.map(t => (
        <button
          key={t}
          type="button"
          // Si el botón coincide con el término seleccionado, lo pintamos de azul sólido; si no, solo el contorno.
          className={`btn ${term === t ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTerm(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

function App() {
  // ESTADO LOCAL: Inicializamos en 'Fall'
  const [term, setTerm] = useState('Fall');

  const { data, error, isLoading } = useQuery({
    queryKey: ['coursesData'],
    queryFn: fetchCourses
  });

  if (isLoading) return <div className="container my-5 text-center"><h3>Cargando cursos desde la web...</h3></div>;
  if (error) return <div className="container my-5 text-center text-danger"><h3>Error: {error.message}</h3></div>;

  // LÓGICA DE FILTRADO: Convertimos el objeto en array y filtramos por la propiedad 'term'
  const courses = data && data.courses ? Object.values(data.courses) : [];
  const filteredCourses = courses.filter(course => course.term === term);

  return (
    <div className="container my-5">
      <header className="mb-4">
        <h1 className="fw-bold text-primary">{data ? data.title : 'React Tutorial'}</h1>
        <p className="lead text-muted">Filter by term using useState</p>
      </header>

      {/* Inyectamos los botones y les pasamos el estado actual y la función para cambiarlo */}
      <TermSelector term={term} setTerm={setTerm} />

      <div className="table-responsive shadow-sm">
        <table className="table table-bordered table-striped table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>Term</th>
              <th>Number</th>
              <th>Title</th>
              <th>Meets</th>
            </tr>
          </thead>
          <tbody>
            {/* Iteramos SOBRE LA LISTA FILTRADA, no sobre la original */}
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <CourseRow key={index} course={course} />
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  No hay cursos disponibles para el periodo de {term}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;