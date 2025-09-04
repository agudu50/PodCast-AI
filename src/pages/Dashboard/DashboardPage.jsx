import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Added for navigation
import { Line, Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { 
  FaFileAudio, 
  FaFileAlt, 
  FaFilter, 
  FaPlayCircle, 
  FaChartLine, 
  FaUpload, 
  FaMicrophone,
  FaHome,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { BsGraphUpArrow, BsThreeDotsVertical } from 'react-icons/bs';
import { FiExternalLink } from 'react-icons/fi';
import Sidebar from '../../components/Sidebar/Sidebar';
import './dashboard.css';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler
);

const Dashboard = () => {
  const [filter, setFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Color palette
  const colors = {
    purple: '#8A2BE2',
    teal: '#00CED1',
    pink: '#FF69B4',
    blue: '#1E90FF',
    yellow: '#FFD700',
    dark: '#121212',
    darker: '#0A0A0A',
    light: '#FFFFFF',
    lighter: 'rgba(255,255,255,0.9)',
    gray: 'rgba(255,255,255,0.2)'
  };

  // Chart data
  const chartData = {
    line: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Episodes Published',
          data: [5, 10, 8, 15, 12, 18],
          borderColor: colors.purple,
          backgroundColor: 'rgba(138, 43, 226, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.light,
          pointBorderColor: colors.purple,
          pointRadius: 5,
          pointHoverRadius: 7
        },
      ],
    },
    bar: {
      labels: ['Spotify', 'Apple', 'YouTube', 'Google', 'Amazon'],
      datasets: [
        {
          label: 'Listeners (K)',
          data: [120, 80, 150, 90, 60],
          backgroundColor: [
            colors.blue,
            colors.teal,
            colors.pink,
            colors.yellow,
            colors.purple
          ],
          borderColor: colors.light,
          borderWidth: 1,
          borderRadius: 6
        },
      ],
    },
    pie: {
      labels: ['Published', 'Draft', 'Scheduled'],
      datasets: [
        {
          data: [70, 15, 15],
          backgroundColor: [
            colors.purple,
            colors.blue,
            colors.teal
          ],
          borderColor: colors.darker,
          borderWidth: 2,
          hoverOffset: 10
        },
      ],
    }
  };

  // Chart options
  const chartOptions = {
    line: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          labels: { 
            color: colors.light, 
            font: { size: 12 } 
          } 
        },
        tooltip: {
          backgroundColor: colors.darker,
          titleColor: colors.light,
          bodyColor: colors.lighter,
          borderColor: colors.gray,
          borderWidth: 1
        }
      },
      scales: {
        x: { 
          grid: { color: colors.gray }, 
          ticks: { color: colors.lighter } 
        },
        y: { 
          grid: { color: colors.gray }, 
          ticks: { color: colors.lighter } 
        }
      }
    },
    bar: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          labels: { 
            color: colors.light, 
            font: { size: 12 } 
          } 
        },
        tooltip: {
          backgroundColor: colors.darker,
          titleColor: colors.light,
          bodyColor: colors.lighter,
          borderColor: colors.gray,
          borderWidth: 1
        }
      },
      scales: {
        x: { 
          grid: { color: colors.gray }, 
          ticks: { color: colors.lighter } 
        },
        y: { 
          grid: { color: colors.gray }, 
          ticks: { color: colors.lighter },
          beginAtZero: true
        }
      }
    },
    pie: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: 'right',
          labels: { 
            color: colors.light, 
            font: { size: 12 } 
          }
        },
        tooltip: {
          backgroundColor: colors.darker,
          titleColor: colors.light,
          bodyColor: colors.lighter,
          borderColor: colors.gray,
          borderWidth: 1
        }
      }
    }
  };

  // Sample content data
  const recentContent = [
    { 
      id: 1, 
      title: 'Future of AI Podcasting', 
      type: 'audio', 
      date: '2025-07-15', 
      status: 'published', 
      listens: '24.7K',
      link: '#' 
    },
    { 
      id: 2, 
      title: 'Interview with Tech Leaders', 
      type: 'video', 
      date: '2025-07-14', 
      status: 'published', 
      listens: '18.2K',
      link: '#' 
    },
    { 
      id: 3, 
      title: 'Marketing Strategies', 
      type: 'audio', 
      date: '2025-07-12', 
      status: 'scheduled', 
      listens: 'Coming Soon',
      link: '#' 
    },
  ];

  // Stats data
  const stats = [
    { 
      value: '142K', 
      label: 'Total Listens', 
      icon: <FaMicrophone />, 
      trend: 'up',
      change: '+12%' 
    },
    { 
      value: '10', 
      label: 'Episodes', 
      icon: <FaFileAudio />, 
      trend: 'up',
      change: '+2' 
    },
    { 
      value: '8', 
      label: 'Blog Posts', 
      icon: <FaFileAlt />, 
      trend: 'up',
      change: '+3' 
    },
    { 
      value: '92%', 
      label: 'Engagement', 
      icon: <FaChartLine />, 
      trend: 'up',
      change: '+5%' 
    }
  ];

  return (
    <div className="dashboard">
      {/* Header with left title and right menu button */}
      <header className="mobile-header">
        <div className="header-content">
          <div className="navbar-title">
            <FaHome className="home-icon" />
            <span>Dashboard</span>
          </div>
          <button 
            className="menu-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Main Content */}
      <main className={`dashboard-main ${sidebarOpen ? 'sidebar-active' : ''}`}>
        {/* Welcome Header */}
        <header className="dashboard-header">
          <div className="welcome-message">
            <h1><br></br>Welcome Back, <span>Jamilia</span></h1>
            <p>Here's what's happening with your podcast today</p>
          </div>
          <Link to="/upload" className="new-episode-btn">
            <FaPlayCircle /> New Episode
          </Link>
        </header>

        {/* Stats Overview */}
        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon" style={{ backgroundColor: `rgba(138, 43, 226, 0.2)` }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
                <div className={`trend ${stat.trend}`}>
                  <BsGraphUpArrow /> {stat.change}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Charts Section */}
        <section className="analytics-section">
          <h2><FaChartLine /> Performance Analytics</h2>
          
          <div className="charts-container">
            <div className="chart-wrapper">
              <h3>Monthly Growth</h3>
              <div className="chart-container">
                <Line data={chartData.line} options={chartOptions.line} />
              </div>
            </div>
            
            <div className="chart-wrapper">
              <h3>Platform Distribution</h3>
              <div className="chart-container">
                <Bar data={chartData.bar} options={chartOptions.bar} />
              </div>
            </div>
            
            <div className="chart-wrapper">
              <h3>Content Status</h3>
              <div className="chart-container">
                <Pie data={chartData.pie} options={chartOptions.pie} />
              </div>
            </div>
          </div>
        </section>

        {/* Recent Content */}
        <section className="content-section">
          <div className="section-header">
            <h2><FaUpload /> Recent Content</h2>
            <div className="filter-control">
              <FaFilter />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter content"
              >
                <option value="all">All Content</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
          
          <div className="content-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Listens</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentContent
                  .filter(item => filter === 'all' || item.status === filter)
                  .map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="content-title">
                          {item.type === 'audio' ? <FaFileAudio /> : <FaPlayCircle />}
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.title} <FiExternalLink className="external-icon" />
                          </a>
                        </div>
                      </td>
                      <td>{item.type}</td>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.listens}</td>
                      <td>
                        <span className={`status ${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button className="menu-btn" aria-label="More options">
                          <BsThreeDotsVertical />
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;