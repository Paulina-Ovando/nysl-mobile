import { useState, useEffect } from 'react';
import TermSelector from './components/TermSelector';
import CourseRow from './components/CourseRow';
import { hasConflict } from './utilities/time';
// Importamos nuestras herramientas de Firebase
import { useData, database } from './utilities/firebase';
import { ref, set } from 'firebase/database';
import './App.css';

function App() {
  const [term, setTerm] = useState('Fall');
  const [selectedCourses, setSelectedCourses] = useState([]);
  
  // Estado local para guardar los cursos extraídos de internet
  const [apiData, setApiData] = useState(null);

  // LECTURA 1: Obtenemos los cursos de la API (para simular que la DB ya tiene datos)
  useEffect(() => {
    fetch('https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php')
      .then(res => res.json())
      .then(data => setApiData(data))
      .catch(err => console.error("Error fetching API:", err));
  }, []);

  // LECTURA 2 (FIREBASE): Leemos si hay selecciones guardadas previamente en la nube
  const [savedSelections, loading, error] = useData('/selections');

  // ESCRITURA (FIREBASE): Función para guardar los cursos seleccionados
  const saveToFirebase = () => {
    // Apuntamos a la "rama" /selections de nuestro árbol JSON
    const selectionsRef = ref(database, 'selections');
    set(selectionsRef, selectedCourses)
      .then(() => alert('¡Tus cursos se guardaron en Firebase exitosamente!'))
      .catch((err) => alert('Error al guardar: ' + err.message));
  };

  const toggleCourse = (course) => {
    if (selectedCourses.some(c => c.number === course.number)) {
      setSelectedCourses(selectedCourses.filter(c => c.number !== course.number));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  if (!apiData) return <div className="container my-5 text-center"><h3>Cargando datos...</h3></div>;

  const courses = apiData.courses ? Object.values(apiData.courses) : [];
  const filteredCourses = courses.filter(course => course.term === term);

  return (
    <div className="container my-5">
      <header className="mb-4">
        <h1 className="fw-bold text-primary">{apiData.title}</h1>
        <p className="lead text-muted">Integración con Firebase Realtime Database</p>
      </header>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <TermSelector term={term} setTerm={setTerm} />
        
        {/* BOTÓN PARA ESCRIBIR EN LA BASE DE DATOS */}
        <button 
          className="btn btn-success shadow-sm" 
          onClick={saveToFirebase}
          disabled={selectedCourses.length === 0}
        >
          ☁️ Guardar Selección en la Nube
        </button>
      </div>

      {/* Retroalimentación de Lectura de Firebase */}
      {savedSelections && (
        <div className="alert alert-info shadow-sm">
          <strong>Última selección en la nube:</strong> Tienes {savedSelections.length} cursos guardados.
        </div>
      )}

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
                const isSelected = selectedCourses.some(c => c.number === course.number);
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
                  No hay cursos.
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