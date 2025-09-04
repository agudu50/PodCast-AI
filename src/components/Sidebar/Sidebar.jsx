import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, FaUpload, FaEdit, FaTags, FaShareAlt, FaCalendarAlt, 
  FaBars, FaTimes, FaBell, FaQuestionCircle 
} from 'react-icons/fa';
import './sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [unreadCount] = useState(3); // Static for demo

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(true);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaHome />, notification: true },
    { path: '/upload', label: 'Upload', icon: <FaUpload /> },
    { path: '/blog', label: 'Blog Editor', icon: <FaEdit /> },
    { path: '/metadata', label: 'Metadata', icon: <FaTags /> },
    { path: '/social', label: 'Social Snippets', icon: <FaShareAlt /> },
    { path: '/publish', label: 'Publishing', icon: <FaCalendarAlt /> },
  ];

  return (
    <>
      {isMobile && (
        <button 
          className="mobile-toggle-btn" 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <FaBars />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
        <div className="sidebar-header">
          <div className="user-profile">
            <img 
              src="https://pbs.twimg.com/profile_images/1870295644885123072/6DwWvhX7_400x400.jpg" 
              className="user-avatar"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23fff"><circle cx="50" cy="35" r="25"/><circle cx="50" cy="85" r="40"/></svg>';
              }}
            />
            <div className="user-info">
              <h1 className="username">Jamila Grier</h1>
              <p className="user-role">Content Director</p>
            </div>
          </div>
          {isMobile && (
            <button 
              className="close-btn" 
              onClick={toggleSidebar}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => isMobile && setIsOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
              {item.notification && <span className="notification-dot"></span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/help" className="help-link">
            <FaQuestionCircle />
            <span>Help Center</span>
          </NavLink>
          <p className="copyright">© 2025 BYTEBAO</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;