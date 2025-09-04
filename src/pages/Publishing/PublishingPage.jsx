import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSpinner,
  FaArrowLeft,
  FaTwitter,
  FaInstagram,
  FaSpotify,
  FaYoutube,
  FaApple,
  FaChartLine,
  FaEdit,
  FaTrash,
  FaRegClock,
  FaHome,
  FaTimes,
  FaExternalLinkAlt,
  FaLink
} from 'react-icons/fa';
import './publishing.css';

const Publishing = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [content, setContent] = useState({
    title: '',
    date: '',
    time: '',
    platforms: {
      twitter: { selected: false, connected: false },
      instagram: { selected: false, connected: false },
      spotify: { selected: false, connected: false },
      youtube: { selected: false, connected: false },
      apple: { selected: false, connected: false }
    },
    isRecurring: false,
    recurrence: 'weekly'
  });
  const [scheduledContent, setScheduledContent] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [activeTab, setActiveTab] = useState('schedule');
  const [authPlatform, setAuthPlatform] = useState(null);
  const [authWindow] = useState(null);

  // Mock platform connection status (in a real app, this would come from backend)
  useEffect(() => {
    // Simulate checking which platforms are already connected
    const timer = setTimeout(() => {
      setContent(prev => ({
        ...prev,
        platforms: {
          twitter: { ...prev.platforms.twitter, connected: false },
          instagram: { ...prev.platforms.instagram, connected: false },
          spotify: { ...prev.platforms.spotify, connected: false },
          youtube: { ...prev.platforms.youtube, connected: false },
          apple: { ...prev.platforms.apple, connected: false }
        }
      }));
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock API functions
  const mockScheduleContent = async (content) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          scheduledId: `sch_${Math.random().toString(36).substr(2, 9)}`,
          ...content
        });
      }, 1500);
    });
  };

  const mockGetScheduledContent = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'sch_abc123',
            title: 'Episode 1: Introduction',
            date: '2025-07-20',
            time: '10:00 AM',
            platforms: ['twitter', 'spotify', 'youtube'],
            status: 'scheduled'
          },
          {
            id: 'sch_def456',
            title: 'Teaser Post',
            date: '2025-07-19',
            time: '2:00 PM',
            platforms: ['twitter', 'instagram'],
            status: 'published'
          }
        ]);
      }, 1000);
    });
  };

  const mockGetAnalytics = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          scheduledCount: 5,
          publishedCount: 12,
          upcomingCount: 3,
          platforms: {
            twitter: 8,
            instagram: 6,
            spotify: 4,
            youtube: 7,
            apple: 3
          }
        });
      }, 800);
    });
  };

  const platformIcons = {
    twitter: <FaTwitter className="platform-icon" />,
    instagram: <FaInstagram className="platform-icon" />,
    spotify: <FaSpotify className="platform-icon" />,
    youtube: <FaYoutube className="platform-icon" />,
    apple: <FaApple className="platform-icon" />
  };

  const platformColors = {
    twitter: '#1DA1F2',
    instagram: '#E1306C',
    spotify: '#1DB954',
    youtube: '#FF0000',
    apple: '#A3AAAE'
  };

  const platformAuthUrls = {
    twitter: 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=MOCK_TWITTER_CLIENT&redirect_uri=https://yourdomain.com/auth/twitter/callback&scope=tweet.read%20tweet.write%20users.read%20offline.access',
    instagram: 'https://api.instagram.com/oauth/authorize?client_id=MOCK_INSTAGRAM_CLIENT&redirect_uri=https://yourdomain.com/auth/instagram/callback&scope=user_profile,user_media&response_type=code',
    spotify: 'https://accounts.spotify.com/authorize?client_id=MOCK_SPOTIFY_CLIENT&response_type=code&redirect_uri=https://yourdomain.com/auth/spotify/callback&scope=ugc-image-upload%20user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing%20app-remote-control%20streaming%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public%20user-follow-modify%20user-follow-read%20user-read-playback-position%20user-top-read%20user-read-recently-played%20user-library-modify%20user-library-read%20user-read-email%20user-read-private',
    youtube: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=MOCK_YOUTUBE_CLIENT&redirect_uri=https://yourdomain.com/auth/youtube/callback&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload%20https://www.googleapis.com/auth/youtube%20https://www.googleapis.com/auth/youtubepartner',
    apple: 'https://appleid.apple.com/auth/authorize?client_id=MOCK_APPLE_CLIENT&redirect_uri=https://yourdomain.com/auth/apple/callback&response_type=code%20id_token&scope=name%20email'
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [scheduled, analytics] = await Promise.all([
          mockGetScheduledContent(),
          mockGetAnalytics()
        ]);
        setScheduledContent(scheduled);
        setAnalytics(analytics);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setModalMessage('Failed to load data. Please try again.');
        setShowModal(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle platform selection with auth flow
  const handlePlatformToggle = async (platform) => {
    // If already connected, just toggle selection
    if (content.platforms[platform].connected) {
      setContent({
        ...content,
        platforms: {
          ...content.platforms,
          [platform]: {
            ...content.platforms[platform],
            selected: !content.platforms[platform].selected
          }
        }
      });
      return;
    }

    // Show auth dialog
    setAuthPlatform(platform);
    
    // In a real app, you would open the OAuth window here
    // const width = 600, height = 700;
    // const left = (window.innerWidth - width) / 2;
    // const top = (window.innerHeight - height) / 2;
    // const authWin = window.open(
    //   platformAuthUrls[platform],
    //   `${platform}Auth`,
    //   `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    // );
    // setAuthWindow(authWin);
    
    // For this demo, we'll simulate successful auth after a delay
    setTimeout(() => {
      handleAuthSuccess(platform);
    }, 2000);
  };

  // Handle successful authentication
  const handleAuthSuccess = (platform) => {
    setContent(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: {
          selected: true,
          connected: true
        }
      }
    }));
    setAuthPlatform(null);
    if (authWindow) authWindow.close();
    setModalMessage(`Successfully connected your ${platform.charAt(0).toUpperCase() + platform.slice(1)} account!`);
    setShowModal(true);
  };

  // Handle auth cancellation
  const handleAuthCancel = () => {
    setAuthPlatform(null);
    if (authWindow) authWindow.close();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContent({
      ...content,
      [name]: value
    });
  };

  const handleRecurrenceToggle = () => {
    setContent({
      ...content,
      isRecurring: !content.isRecurring
    });
  };

  const handleSchedule = async () => {
    const selectedPlatforms = Object.entries(content.platforms)
      .filter(([, { selected }]) => selected)
      .map(([platform]) => platform);

    if (!content.title || !content.date || !content.time || selectedPlatforms.length === 0) {
      setModalMessage('Please complete all fields and select at least one platform');
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const scheduledItem = {
        title: content.title,
        date: content.date,
        time: content.time,
        platforms: selectedPlatforms,
        isRecurring: content.isRecurring,
        recurrence: content.recurrence
      };

      const result = await mockScheduleContent(scheduledItem);
      
      setScheduledContent([...scheduledContent, {
        id: result.scheduledId,
        title: content.title,
        date: content.date,
        time: content.time,
        platforms: selectedPlatforms,
        status: 'scheduled'
      }]);

      setModalMessage(`"${content.title}" successfully scheduled for ${content.date} at ${content.time}`);
      setShowModal(true);
      
      // Reset form
      setContent({
        title: '',
        date: '',
        time: '',
        platforms: {
          twitter: { selected: false, connected: false },
          instagram: { selected: false, connected: false },
          spotify: { selected: false, connected: false },
          youtube: { selected: false, connected: false },
          apple: { selected: false, connected: false }
        },
        isRecurring: false,
        recurrence: 'weekly'
      });

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setModalMessage('Error scheduling content. Please try again.');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const goBack = () => {
    navigate('/social-snippets');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'scheduled':
        return <span className="status-badge scheduled"><FaRegClock /> Scheduled</span>;
      case 'published':
        return <span className="status-badge published"><FaCheckCircle /> Published</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="publishing-container">
      {/* Header with left title and right menu button */}
      <header className="mobile-header">
        <div className="header-content">
          <div className="navbar-title">
            <FaHome className="home-icon" />
            <span>Publishing</span>
          </div>
          <button 
            className="menu-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <FaTimes /> : <FaCalendarAlt />}
          </button>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`publishing-content ${sidebarOpen ? 'sidebar-active' : ''}`}>
        <div className="glass-card">
          <header className="publishing-header">
            <h1 className="publishing-title">
              <span className="gradient-text"><br></br><br></br>
                Content Publishing Hub</span>
            </h1>
            <p className="publishing-subtitle">
              Schedule, manage, and track your content distribution
            </p>
          </header>

          <div className="publishing-tabs">
            <button 
              className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule Content
            </button>
            <button 
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Publishing Analytics
            </button>
            <button 
              className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              Content Calendar
            </button>
          </div>

          {isLoading && !showModal && (
            <div className="loading-overlay">
              <FaSpinner className="spinner" />
              <span>Loading...</span>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="tab-content">
              <div className="scheduler-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <FaCalendarAlt className="input-icon" />
                      Content Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="form-input"
                      value={content.title}
                      onChange={handleInputChange}
                      placeholder="Enter content title"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaCalendarAlt className="input-icon" />
                      Release Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      className="form-input"
                      value={content.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaCalendarAlt className="input-icon" />
                      Release Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      className="form-input"
                      value={content.time}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">
                      <FaCalendarAlt className="input-icon" />
                      Distribution Platforms
                    </label>
                    <div className="platform-grid">
                      {Object.entries(content.platforms).map(([platform, { selected, connected }]) => (
                        <button
                          key={platform}
                          className={`platform-card ${selected ? 'active' : ''} ${connected ? 'connected' : ''}`}
                          onClick={() => handlePlatformToggle(platform)}
                          style={{ 
                            '--platform-color': platformColors[platform],
                            '--platform-color-light': `${platformColors[platform]}40`
                          }}
                        >
                          <div className="platform-icon-container">
                            {platformIcons[platform]}
                            {connected && (
                              <span className="connection-badge">
                                <FaCheckCircle />
                              </span>
                            )}
                          </div>
                          <span className="platform-name">
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </span>
                          {!connected && selected && (
                            <span className="platform-auth-pending">
                              <FaSpinner className="spinner" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <div className="recurring-toggle">
                      <label className="toggle-label">
                        <span>Recurring Content</span>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={content.isRecurring} 
                            onChange={handleRecurrenceToggle} 
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </label>
                    </div>

                    {content.isRecurring && (
                      <div className="recurring-options">
                        <label>Recurrence Pattern</label>
                        <select
                          name="recurrence"
                          className="form-input"
                          value={content.recurrence}
                          onChange={handleInputChange}
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  className="primary-button schedule-btn"
                  onClick={handleSchedule}
                  disabled={isLoading}
                >
                  {isLoading ? <FaSpinner className="spinner" /> : <FaPlus />}
                  {isLoading ? 'Scheduling...' : 'Schedule Content'}
                </button>
              </div>

              <div className="upcoming-content">
                <h2 className="section-title">
                  <FaRegClock /> Upcoming Content
                </h2>
                {scheduledContent.filter(item => item.status === 'scheduled').length > 0 ? (
                  <div className="content-list">
                    {scheduledContent
                      .filter(item => item.status === 'scheduled')
                      .map((item) => (
                        <div key={item.id} className="content-card">
                          <div className="content-header">
                            <h3>{item.title}</h3>
                            <div className="content-meta">
                              <span className="content-date">{item.date} at {item.time}</span>
                              {getStatusBadge(item.status)}
                            </div>
                          </div>
                          <div className="content-platforms">
                            {item.platforms.map(platform => (
                              <span 
                                key={platform} 
                                className="platform-tag"
                                style={{ backgroundColor: `${platformColors[platform]}20` }}
                              >
                                {platformIcons[platform]}
                                {platform}
                              </span>
                            ))}
                          </div>
                          <div className="content-actions">
                            <button className="action-btn edit">
                              <FaEdit /> Edit
                            </button>
                            <button className="action-btn delete">
                              <FaTrash /> Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No upcoming content scheduled</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && analytics && (
            <div className="tab-content">
              <div className="analytics-dashboard">
                <div className="analytics-summary">
                  <div className="summary-card">
                    <div className="summary-value">{analytics.scheduledCount}</div>
                    <div className="summary-label">Scheduled</div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-value">{analytics.publishedCount}</div>
                    <div className="summary-label">Published</div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-value">{analytics.upcomingCount}</div>
                    <div className="summary-label">Upcoming</div>
                  </div>
                </div>

                <div className="platform-distribution">
                  <h3 className="section-title">
                    <FaChartLine /> Platform Distribution
                  </h3>
                  <div className="distribution-grid">
                    {Object.entries(analytics.platforms).map(([platform, count]) => (
                      <div 
                        key={platform} 
                        className="platform-metric"
                        style={{ '--platform-color': platformColors[platform] }}
                      >
                        <div className="platform-header">
                          <div className="platform-icon" style={{ color: platformColors[platform] }}>
                            {platformIcons[platform]}
                          </div>
                          <span className="platform-name">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                        </div>
                        <div className="platform-count">{count} posts</div>
                        <div className="platform-bar">
                          <div 
                            className="bar-fill"
                            style={{ 
                              width: `${(count / Math.max(...Object.values(analytics.platforms))) * 100}%`,
                              backgroundColor: platformColors[platform]
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="tab-content">
              <div className="calendar-view">
                <h2 className="section-title">
                  <FaCalendarAlt /> Content Calendar
                </h2>
                <div className="calendar-container">
                  {/* Calendar visualization would be implemented here */}
                  <div className="calendar-placeholder">
                    <p>Calendar visualization coming soon</p>
                  </div>
                </div>
                <div className="calendar-legend">
                  {Object.entries(platformColors).map(([platform, color]) => (
                    <div key={platform} className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: color }}></span>
                      <span className="legend-label">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="publishing-footer">
            <button 
              className="secondary-button back-btn"
              onClick={goBack}
            >
              <FaArrowLeft /> Back to Social Snippets
            </button>
            <div className="analytics-badge">
              <FaChartLine /> Publishing Analytics
            </div>
          </div>
        </div>

        {/* Auth Dialog Modal */}
        {authPlatform && (
          <div className="modal-overlay">
            <div className="modal-content auth-modal">
              <div className="modal-icon">
                {platformIcons[authPlatform]}
              </div>
              <h3 className="modal-title">
                Connect your {authPlatform.charAt(0).toUpperCase() + authPlatform.slice(1)} account
              </h3>
              <p className="modal-message">
                To schedule content on {authPlatform.charAt(0).toUpperCase() + authPlatform.slice(1)}, 
                we need permission to access your account.
              </p>
              
              <div className="auth-steps">
                <div className="auth-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <strong>You'll be redirected to {authPlatform.charAt(0).toUpperCase() + authPlatform.slice(1)}</strong>
                    <p>Log in to your account if you're not already</p>
                  </div>
                </div>
                <div className="auth-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <strong>Review the permissions</strong>
                    <p>We only request access to publish content on your behalf</p>
                  </div>
                </div>
                <div className="auth-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <strong>You'll be redirected back</strong>
                    <p>After approval, you can start scheduling content</p>
                  </div>
                </div>
              </div>
              
              <div className="auth-buttons">
                <button 
                  className="secondary-button"
                  onClick={handleAuthCancel}
                >
                  Cancel
                </button>
                <a 
                  href={platformAuthUrls[authPlatform]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="primary-button"
                >
                  <FaExternalLinkAlt /> Continue to {authPlatform.charAt(0).toUpperCase() + authPlatform.slice(1)}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Status Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-icon">
                {modalMessage.includes('successfully') ? (
                  <FaCheckCircle className="success" />
                ) : (
                  <FaTimesCircle className="error" />
                )}
              </div>
              <h3 className="modal-title">
                {modalMessage.includes('successfully') ? 'Success!' : 'Oops!'}
              </h3>
              <p className="modal-message">{modalMessage}</p>
              <button 
                className="primary-button modal-close"
                onClick={closeModal}
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Publishing;