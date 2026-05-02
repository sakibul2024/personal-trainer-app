import { useState, useEffect } from 'react';
import { getTrainingsWithCustomers } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import _ from 'lodash';

function StatisticsPage() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const trainings = await getTrainingsWithCustomers();
    
    const grouped = _.groupBy(trainings, 'activity');
    
    const data = [];
    for (let activity in grouped) {
      const totalMinutes = _.sumBy(grouped[activity], 'duration');
      data.push({
        activity: activity,
        minutes: totalMinutes
      });
    }
    
    setChartData(data);
    setLoading(false);
  };

  if (loading) {
    return <h2>Loading statistics...</h2>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Training Statistics</h2>
      <h3>Total Minutes by Activity</h3>
      
      <BarChart width={600} height={400} data={chartData}>
        <XAxis dataKey="activity" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="minutes" fill="#8884d8" />
      </BarChart>
      
      <h3>Details:</h3>
      <table border="1" style={{ borderCollapse: 'collapse', width: '400px' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '8px' }}>Activity</th>
            <th style={{ padding: '8px' }}>Total Minutes</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: '8px' }}>{item.activity}</td>
              <td style={{ padding: '8px' }}>{item.minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatisticsPage;