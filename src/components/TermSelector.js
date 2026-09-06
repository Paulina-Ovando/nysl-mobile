// src/components/TermSelector.js
import React from 'react';

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

export default TermSelector;