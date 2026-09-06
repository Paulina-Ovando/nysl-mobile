import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './App.css';

const fetchCourses = async () => {
  const response = await fetch('https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

// --- LÓGICA DE DETECCIÓN DE CONFLICTOS ---

// 1. Extrae y convierte los textos "MWF 10:00-10:50" a un objeto con días y minutos
const parseMeetingTime = (meets) => {
  if (!meets || meets === '') return null;
  const [daysString, timeString] = meets.split(' ');
  if (!timeString) return null;
  
  // Extraemos los días (M, Tu, W, Th, F)
  const days = daysString.match(/M|Tu|W|Th|F/g) || [];
  
  // Convertimos las horas (ej. 10:00) a minutos totales desde la medianoche para poder compararlas
  const [startStr, endStr] = timeString.split('-');
  const parseTime = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  return { days, start: parseTime(startStr), end: parseTime(endStr) };
};

// 2. Compara un curso contra la lista de cursos seleccionados para ver si hay empalme
const hasConflict = (course, selectedCourses) => {
  const c1 = parseMeetingTime(course.meets);
  if (!c1) return false; // Si el curso no tiene horario definido, no hay conflicto

  return selectedCourses.some(selectedCourse => {
    // CORRECCIÓN: Comparamos usando el número del curso, ya que no existe un "id"
    if (course.number === selectedCourse.number) return false;
    
    // Si no son del mismo trimestre, físicamente no pueden chocar
    if (course.term !== selectedCourse.term) return false;

    const c2 = parseMeetingTime(selectedCourse.meets);
    if (!c2) return false;

    // ¿Comparten algún día?
    const daysOverlap = c1.days.some(day => c2.days.includes(day));
    
    // ¿Se empalman los minutos? (El inicio mayor debe ser menor que el fin menor)
    const timeOverlap = Math.max(c1.start, c2.start) < Math.min(c1.end, c2.end);
    
    return daysOverlap && timeOverlap;
  });
};

// --- COMPONENTES DE LA INTERFAZ ---

// Componente para la Fila de la Tabla interactiva
const CourseRow = ({ course, isSelected, isDisabled, toggleCourse }) => {
  // Asignamos clases dinámicas de Bootstrap según su estado (seleccionado, deshabilitado o normal)
  let rowClass = "";
  if (isSelected) rowClass = "table-success";
  else if (isDisabled) rowClass = "table-secondary text-muted opacity-50";

  return (
    <tr 
      className={rowClass} 
      onClick={() => { if (!isDisabled) toggleCourse(course); }}
      style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
    >
      <td className="fw-bold">{course.term}</td>
      <td>{course.number}</td>
      <td>{course.title}</td>
      <td>{course.meets}</td>
    </tr>
  );
};

// Componente de los Botones
const TermSelector = ({ term, setTerm }) => {
  const terms = ['Fall', 'Winter', 'Spring'];
  return (
    <div className="btn-group mb-4 shadow-sm" role="group">
      {terms.map(t => (
        <button
          key={t}
          type="button"
          className={`btn ${term === t ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTerm(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

// Componente Principal
function App() {
  const [term, setTerm] = useState('Fall');
  const [selectedCourses, setSelectedCourses] = useState([]); // NUEVO ESTADO: Cursos seleccionados

  const { data, error, isLoading } = useQuery({
    queryKey: ['coursesData'],
    queryFn: fetchCourses
  });

  if (isLoading) return <div className="container my-5 text-center"><h3>Cargando cursos desde la web...</h3></div>;
  if (error) return <div className="container my-5 text-center text-danger"><h3>Error: {error.message}</h3></div>;

  // Lógica de Toggle: Si el curso ya está seleccionado, lo quitamos; si no, lo agregamos.
  const toggleCourse = (course) => {
    if (selectedCourses.some(c => c === course)) {
      setSelectedCourses(selectedCourses.filter(c => c !== course));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const courses = data && data.courses ? Object.values(data.courses) : [];
  const filteredCourses = courses.filter(course => course.term === term);

  return (
    <div className="container my-5">
      <header className="mb-4">
        <h1 className="fw-bold text-primary">{data ? data.title : 'React Tutorial'}</h1>
        <p className="lead text-muted">Filter by time conflicts</p>
      </header>

      <TermSelector term={term} setTerm={setTerm} />

      <div className="table-responsive shadow-sm">
        <table className="table table-bordered table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>Term</th>
              <th>Number</th>
              <th>Title</th>
              <th>Meets</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => {
                const isSelected = selectedCourses.some(c => c === course);
                // Si no está seleccionado y detectamos un conflicto, lo deshabilitamos
                const isDisabled = !isSelected && hasConflict(course, selectedCourses);

                return (
                  <CourseRow 
                    key={index} 
                    course={course} 
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    toggleCourse={toggleCourse}
                  />
                );
              })
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