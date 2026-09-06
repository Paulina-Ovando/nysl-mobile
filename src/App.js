import React from 'react';
import { useQuery } from '@tanstack/react-query'; // Importamos el hook de consulta
import './App.css';

// Función asíncrona para hacer fetch a la URL que proporcionó Paula
const fetchCourses = async () => {
  const response = await fetch('https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Componente para renderizar la fila de cada curso
const CourseRow = ({ course }) => (
  <tr>
    <td className="fw-bold">{course.term}</td>
    <td>{course.number}</td>
    <td>{course.title}</td>
    <td>{course.meets}</td>
  </tr>
);

function App() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['coursesData'],
    queryFn: fetchCourses
  });

  if (isLoading) return <div className="container my-5 text-center"><h3>Cargando cursos desde la web...</h3></div>;
  if (error) return <div className="container my-5 text-center text-danger"><h3>Error: {error.message}</h3></div>;

  return (
    <div className="container my-5">
      <header className="mb-4">
        {/* Usamos el título que viene directamente de la API */}
        <h1 className="fw-bold text-primary">{data ? data.title : 'React Tutorial'}</h1>
        <p className="lead text-muted">Fetch Data: Northwestern CS Courses</p>
      </header>

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
            {/* CORRECCIÓN: Iteramos sobre data.courses en lugar de todo data */}
            {data && data.courses ? Object.values(data.courses).map((course, index) => (
              <CourseRow key={index} course={course} />
            )) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;