// src/App.js
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TermSelector from './components/TermSelector';
import CourseRow from './components/CourseRow';
import { hasConflict } from './utilities/time';
import './App.css';

const fetchCourses = async () => {
  const response = await fetch('https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

function App() {
  const [term, setTerm] = useState('Fall');
  const [selectedCourses, setSelectedCourses] = useState([]);

  const { data, error, isLoading } = useQuery({
    queryKey: ['coursesData'],
    queryFn: fetchCourses
  });

  if (isLoading) return <div className="container my-5 text-center"><h3>Cargando cursos desde la web...</h3></div>;
  if (error) return <div className="container my-5 text-center text-danger"><h3>Error: {error.message}</h3></div>;

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
        <p className="lead text-muted">Modularize the code</p>
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