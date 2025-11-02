
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

export const useDashboardData = () => {
  const { backendUrl, token } = useContext(AppContext);
  
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [personalNotes, setPersonalNotes] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/projects/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setUpcomingTasks(data.upcomingTasks);
        setPersonalNotes(data.personalNotes);
        setRecentProjects(data.recentProjects);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [token]);

  return {
    upcomingTasks,
    personalNotes,
    recentProjects,
    loading,
    refetch: fetchDashboardData
  };
};