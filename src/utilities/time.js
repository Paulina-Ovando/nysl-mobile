// src/utilities/time.js

export const parseMeetingTime = (meets) => {
  if (!meets || meets === '') return null;
  const [daysString, timeString] = meets.split(' ');
  if (!timeString) return null;
  
  const days = daysString.match(/M|Tu|W|Th|F/g) || [];
  
  const [startStr, endStr] = timeString.split('-');
  const parseTime = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  return { days, start: parseTime(startStr), end: parseTime(endStr) };
};

export const hasConflict = (course, selectedCourses) => {
  const c1 = parseMeetingTime(course.meets);
  if (!c1) return false;

  return selectedCourses.some(selectedCourse => {
    if (course.number === selectedCourse.number) return false;
    if (course.term !== selectedCourse.term) return false;

    const c2 = parseMeetingTime(selectedCourse.meets);
    if (!c2) return false;

    const daysOverlap = c1.days.some(day => c2.days.includes(day));
    const timeOverlap = Math.max(c1.start, c2.start) < Math.min(c1.end, c2.end);
    
    return daysOverlap && timeOverlap;
  });
};