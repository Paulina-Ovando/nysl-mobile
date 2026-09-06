// src/components/CourseRow.js
import React from 'react';

const CourseRow = ({ course, isSelected, isDisabled, toggleCourse }) => {
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

export default CourseRow;