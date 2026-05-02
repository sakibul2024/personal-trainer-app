import { useState, useEffect } from 'react';
import { getTrainingsWithCustomers } from '../services/api';
import dayjs from 'dayjs';

function TrainingCalendar() {
  const [trainings, setTrainings] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    const data = await getTrainingsWithCustomers();
    setTrainings(data);
  };

  // Get trainings for a specific day
  const getTrainingsForDay = (date) => {
    return trainings.filter(training => {
      const trainingDate = dayjs(training.date);
      return trainingDate.isSame(date, 'day');
    });
  };


  const renderMonthView = () => {
    const startOfMonth = currentDate.startOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = currentDate.daysInMonth();
    const days = [];
    
  
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = currentDate.date(day);
      const dayTrainings = getTrainingsForDay(date);
      const isToday = date.isSame(dayjs(), 'day');
      const isSelected = date.isSame(selectedDate, 'day');
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => {
            setSelectedDate(date);
            setView('day');
          }}
        >
          <div className="calendar-day-number">{day}</div>
          {dayTrainings.slice(0, 3).map((training, idx) => (
            <div key={idx} className="calendar-day-event">
              {training.activity} - {training.duration}min
            </div>
          ))}
          {dayTrainings.length > 3 && (
            <div className="calendar-day-event">+{dayTrainings.length - 3} more</div>
          )}
        </div>
      );
    }
    
    return days;
  };

 
  const renderWeekView = () => {
    const startOfWeek = currentDate.startOf('week');
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.add(i, 'day');
      const dayTrainings = getTrainingsForDay(date);
      const isToday = date.isSame(dayjs(), 'day');
      
      weekDays.push(
        <div key={i} className="week-day">
          <div className={`week-day-header ${isToday ? 'today' : ''}`}>
            <div>{date.format('dddd')}</div>
            <div className="week-day-date">{date.format('DD.MM')}</div>
          </div>
          <div className="week-day-trainings">
            {dayTrainings.map((training, idx) => (
              <div key={idx} className="week-training-item">
                <strong>{training.activity}</strong><br/>
                {training.customer?.firstname} {training.customer?.lastname}<br/>
                {dayjs(training.date).format('HH:mm')} - {training.duration}min
              </div>
            ))}
            {dayTrainings.length === 0 && (
              <div className="no-trainings">No trainings</div>
            )}
          </div>
        </div>
      );
    }
    
    return weekDays;
  };

  
  const renderDayView = () => {
    const dayTrainings = getTrainingsForDay(selectedDate);
    const sortedTrainings = [...dayTrainings].sort((a, b) => 
      dayjs(a.date).hour() - dayjs(b.date).hour()
    );
    
    return (
      <div>
        <div className="day-view-header">
          <h3>{selectedDate.format('dddd, DD.MM.YYYY')}</h3>
        </div>
        <div className="day-view-trainings">
          {sortedTrainings.map((training, idx) => (
            <div key={idx} className="day-training-item">
              <div className="training-time">
                {dayjs(training.date).format('HH:mm')}
              </div>
              <div className="training-details">
                <strong>{training.activity}</strong><br/>
                Customer: {training.customer?.firstname} {training.customer?.lastname}<br/>
                Duration: {training.duration} minutes
              </div>
            </div>
          ))}
          {sortedTrainings.length === 0 && (
            <div className="no-trainings">No trainings for this day</div>
          )}
        </div>
      </div>
    );
  };

  const navigatePrevious = () => {
    if (view === 'month') {
      setCurrentDate(currentDate.subtract(1, 'month'));
    } else if (view === 'week') {
      setCurrentDate(currentDate.subtract(1, 'week'));
    } else {
      setSelectedDate(selectedDate.subtract(1, 'day'));
    }
  };

  const navigateNext = () => {
    if (view === 'month') {
      setCurrentDate(currentDate.add(1, 'month'));
    } else if (view === 'week') {
      setCurrentDate(currentDate.add(1, 'week'));
    } else {
      setSelectedDate(selectedDate.add(1, 'day'));
    }
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
    setSelectedDate(dayjs());
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div>
          <button onClick={navigatePrevious} className="calendar-nav-btn">◀ Previous</button>
          <button onClick={goToToday} className="calendar-nav-btn" style={{ marginLeft: '10px' }}>Today</button>
          <button onClick={navigateNext} className="calendar-nav-btn" style={{ marginLeft: '10px' }}>Next ▶</button>
        </div>
        <div>
          <button onClick={() => setView('month')} className="calendar-nav-btn">Month</button>
          <button onClick={() => setView('week')} className="calendar-nav-btn">Week</button>
          <button onClick={() => setView('day')} className="calendar-nav-btn">Day</button>
        </div>
      </div>

      <div className="calendar-current-date">
        <h2>
          {view === 'month' && currentDate.format('MMMM YYYY')}
          {view === 'week' && `Week of ${currentDate.startOf('week').format('DD.MM.YYYY')}`}
          {view === 'day' && selectedDate.format('DD.MM.YYYY')}
        </h2>
      </div>

      {view === 'month' && (
        <>
          <div className="calendar-weekdays">
            <div className="weekday">Sun</div>
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
          </div>
          <div className="calendar-grid">
            {renderMonthView()}
          </div>
        </>
      )}

      {view === 'week' && (
        <div className="week-view">
          {renderWeekView()}
        </div>
      )}

      {view === 'day' && renderDayView()}
    </div>
  );
}

export default TrainingCalendar;