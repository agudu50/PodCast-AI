import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { 
  FaCopy, 
  FaTwitter, 
  FaInstagram,
  FaMagic,
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
  FaCut,
  FaHeart,
  FaRetweet,
  FaRegComment,
  FaMusic,
  FaShare,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaHome,
  FaShareAlt,
  FaTimes
} from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import './socialsnippets.css';

const SocialSnippets = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [snippets, setSnippets] = useState({
    twitter: '',
    instagram: '',
    tiktok: ''
  });
  const [videoClips, setVideoClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState('clips');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragEnd, setDragEnd] = useState(0);

  // Load data from localStorage
  useEffect(() => {
    const savedProject = JSON.parse(localStorage.getItem('currentProject')) || {};
    
    setSnippets({
      twitter: savedProject.socialSnippets?.twitter || 'Check out our latest podcast episode! #podcast #content',
      instagram: savedProject.socialSnippets?.instagram || 'New episode alert! 🎙️ Tune in now! #podcastlife',
      tiktok: savedProject.socialSnippets?.tiktok || 'New episode dropping soon! 🎧 #podcast #fyp'
    });

    // Mock video clips
    setVideoClips([
      { id: 1, start: 30, end: 45, text: 'Key discussion about AI' },
      { id: 2, start: 120, end: 135, text: 'Interview highlight' },
      { id: 3, start: 210, end: 225, text: 'Main takeaway' }
    ]);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
      };
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, [videoRef.current]);

  const handleInputChange = (platform, value) => {
    setSnippets({ ...snippets, [platform]: value });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const generateAISuggestions = () => {
    setIsGenerating(true);
    // Mock AI generation
    setTimeout(() => {
      setSnippets({
        twitter: `"The future of content creation is here!" 🚀 Just dropped a new episode about AI tools. Listen now! #podcast ${videoClips.length ? `Clip: ${videoClips[0].text}` : ''}`,
        instagram: `New episode alert! 🎧 We discuss:\n\n• AI content tools\n• Podcast to blog workflows\n• SEO optimization\n\nTap the link in bio! 👆 #contentcreator`,
        tiktok: `POV: When you realize this podcast episode is fire 🔥\n\n${videoClips[0]?.text || 'Hot take incoming'} #podcast #fyp #viral`
      });
      setIsGenerating(false);
      setSuccess('AI suggestions generated!');
      setTimeout(() => setSuccess(''), 3000);
    }, 1500);
  };

  const saveAndContinue = () => {
    const projectData = JSON.parse(localStorage.getItem('currentProject')) || {};
    projectData.socialSnippets = snippets;
    projectData.videoClips = videoClips;
    localStorage.setItem('currentProject', JSON.stringify(projectData));
    navigate('/publish');
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      videoRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const seekToTime = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleClipSelect = (clip) => {
    setSelectedClip(clip);
    seekToTime(clip.start);
  };

  const handleTimelineMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * 300; // Assuming 300s video duration
    setDragStart(time);
    setIsDragging(true);
  };

  const handleTimelineMouseMove = (e) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const time = pos * 300;
      setDragEnd(time);
    }
  };

  const handleTimelineMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      const start = Math.min(dragStart, dragEnd);
      const end = Math.max(dragStart, dragEnd);
      if (end - start > 5) { // Minimum 5s clip
        const newClip = {
          id: Date.now(),
          start: Math.round(start),
          end: Math.round(end),
          text: `Clip from ${Math.round(start)}s to ${Math.round(end)}s`
        };
        setVideoClips([...videoClips, newClip]);
        setSelectedClip(newClip);
        setSuccess('New clip created!');
        setTimeout(() => setSuccess(''), 2000);
      }
    }
  };

  const maxLengths = {
    twitter: 280,
    instagram: 2200,
    tiktok: 150
  };

  return (
    <div className="social-snippets-container">
      {/* Header with left title and right menu button */}
      <header className="mobile-header">
        <div className="header-content">
          <div className="navbar-title">
            <FaHome className="home-icon" />
            <span>Social Snippets</span>
          </div>
          <button 
            className="menu-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <FaTimes /> : <FaShareAlt />}
          </button>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`social-snippets-content ${sidebarOpen ? 'sidebar-active' : ''}`}>
        <div className="glass-card">
          <header className="editor-header">
            <div>
              <h1 className="title"><br></br><br></br>Social Snippets</h1>
              <p className="subtitle">Create shareable content from your podcast</p>
            </div>
            <div className="progress-indicator">
              <span className="active">1. Metadata</span>
              <span className="active">2. Social Snippets</span>
              <span>3. Publishing</span>
            </div>
          </header>

          {success && (
            <div className="success-message">
              <p>{success}</p>
            </div>
          )}

          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'clips' ? 'active' : ''}`}
              onClick={() => setActiveTab('clips')}
            >
              Video Clips
            </button>
            <button 
              className={`tab-button ${activeTab === 'snippets' ? 'active' : ''}`}
              onClick={() => setActiveTab('snippets')}
            >
              Social Snippets
            </button>
          </div>

          {activeTab === 'clips' && (
            <div className="clip-section">
              <div className="clip-controls">
                <button 
                  className="ai-suggest-btn"
                  onClick={generateAISuggestions}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <FaSpinner className="spinner" /> Generating...
                    </>
                  ) : (
                    <>
                      <FaMagic /> AI Suggest Clips
                    </>
                  )}
                </button>
                <button className="ai-suggest-btn">
                  <FaCut /> Extract Clip
                </button>
              </div>

              <div 
                className={`clip-preview ${isFullscreen ? 'fullscreen' : ''}`}
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  src="/sample-video.mp4" // Replace with actual video source
                  poster="/video-thumbnail.jpg"
                  className="video-player"
                  loop
                />
                {!isPlaying && (
                  <div className="play-overlay">
                    <div className="play-button"></div>
                  </div>
                )}
                <div className="video-controls">
                  <button onClick={(e) => { e.stopPropagation(); toggleMute(); }}>
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <div className="time-display">
                    {formatTime(currentTime)} / {formatTime(300)}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}>
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                </div>
              </div>

              <div 
                className="clip-timeline"
                onMouseDown={handleTimelineMouseDown}
                onMouseMove={handleTimelineMouseMove}
                onMouseUp={handleTimelineMouseUp}
                onMouseLeave={handleTimelineMouseUp}
              >
                <div className="timeline-progress" style={{ width: `${(currentTime / 300) * 100}%` }}></div>
                {videoClips.map(clip => (
                  <div 
                    key={clip.id}
                    className={`clip-marker ${selectedClip?.id === clip.id ? 'active' : ''}`}
                    style={{ 
                      left: `${(clip.start / 300) * 100}%`,
                      width: `${((clip.end - clip.start) / 300) * 100}%`
                    }}
                    onClick={(e) => { e.stopPropagation(); handleClipSelect(clip); }}
                  >
                    <div className="clip-tooltip">{clip.text}</div>
                  </div>
                ))}
                {isDragging && (
                  <div 
                    className="clip-selection"
                    style={{ 
                      left: `${(Math.min(dragStart, dragEnd) / 300) * 100}%`,
                      width: `${(Math.abs(dragEnd - dragStart) / 300) * 100}%`
                    }}
                  ></div>
                )}
              </div>

              <div className="clip-list">
                <h3>Your Clips</h3>
                {videoClips.length > 0 ? (
                  <div className="clip-items">
                    {videoClips.map(clip => (
                      <div 
                        key={clip.id}
                        className={`clip-item ${selectedClip?.id === clip.id ? 'active' : ''}`}
                        onClick={() => handleClipSelect(clip)}
                      >
                        <div className="clip-time">{formatTime(clip.start)} - {formatTime(clip.end)}</div>
                        <div className="clip-text">{clip.text}</div>
                        <button className="clip-play" onClick={(e) => { e.stopPropagation(); seekToTime(clip.start); }}>
                          Play
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-clips">No clips yet. Create one by selecting a portion of the timeline.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'snippets' && (
            <div className="snippets-container">
              {/* Twitter Section */}
              <div className="snippet-section">
                <div className="platform-header">
                  <FaTwitter className="icon" />
                  <h2>Twitter/X</h2>
                  <div className="platform-badge" style={{ backgroundColor: 'rgba(29, 161, 242, 0.1)' }}>
                    <span style={{ color: '#1DA1F2' }}>280 chars max</span>
                  </div>
                </div>
                
                <div className="platform-preview twitter-preview">
                  <div className="preview-header">
                    <div className="preview-avatar"></div>
                    <div className="preview-username">YourPodcast</div>
                  </div>
                  <div className="preview-content">
                    {snippets.twitter || 'Your Twitter post will appear here...'}
                  </div>
                  {selectedClip && (
                    <div className="preview-image">
                      [Video Clip Preview]
                    </div>
                  )}
                  <div className="preview-footer">
                    <span><FaHeart /> 42</span>
                    <span><FaRetweet /> 12</span>
                    <span><FaRegComment /> 5</span>
                  </div>
                </div>
                
                <div className="input-container">
                  <textarea
                    value={snippets.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    maxLength={maxLengths.twitter}
                    className="input-field"
                    placeholder="Write your Twitter/X post here..."
                  />
                  <div className="input-footer">
                    <p className="char-counter">
                      {maxLengths.twitter - snippets.twitter.length} characters remaining
                    </p>
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(snippets.twitter)}
                    >
                      <FaCopy /> Copy Text
                    </button>
                  </div>
                </div>
              </div>

              {/* Instagram Section */}
              <div className="snippet-section">
                <div className="platform-header">
                  <FaInstagram className="icon" />
                  <h2>Instagram</h2>
                  <div className="platform-badge" style={{ backgroundColor: 'rgba(225, 48, 108, 0.1)' }}>
                    <span style={{ color: '#E1306C' }}>2200 chars max</span>
                  </div>
                </div>
                
                <div className="platform-preview instagram-preview">
                  <div className="preview-header">
                    <div className="preview-avatar"></div>
                    <div className="preview-username">your_podcast</div>
                  </div>
                  <div className="preview-image">
                    {selectedClip ? '[Selected Clip Thumbnail]' : '[Episode Cover]'}
                  </div>
                  <div className="preview-content">
                    {snippets.instagram || 'Your Instagram caption will appear here...'}
                  </div>
                  <div className="preview-footer">
                    <span>❤️ 1,234 likes</span>
                  </div>
                </div>
                
                <div className="input-container">
                  <textarea
                    value={snippets.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    maxLength={maxLengths.instagram}
                    className="input-field"
                    placeholder="Write your Instagram post here..."
                  />
                  <div className="input-footer">
                    <p className="char-counter">
                      {maxLengths.instagram - snippets.instagram.length} characters remaining
                    </p>
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(snippets.instagram)}
                    >
                      <FaCopy /> Copy Text
                    </button>
                  </div>
                </div>
              </div>

              {/* TikTok Section */}
              <div className="snippet-section">
                <div className="platform-header">
                  <FaTiktok className="icon" />
                  <h2>TikTok</h2>
                  <div className="platform-badge" style={{ backgroundColor: 'rgba(37, 244, 238, 0.1)' }}>
                    <span style={{ color: '#25F4EE' }}>150 chars max</span>
                  </div>
                </div>
                
                <div className="platform-preview tiktok-preview">
                  <div className="preview-header">
                    <div className="preview-avatar"></div>
                    <div className="preview-username">@yourpodcast</div>
                  </div>
                  <div className="preview-image">
                    {selectedClip ? (
                      <>
                        <div className="tiktok-video"></div>
                        <FaMusic className="music-icon" />
                      </>
                    ) : (
                      '[Video Clip Preview]'
                    )}
                  </div>
                  <div className="preview-content">
                    {snippets.tiktok || 'Your TikTok caption will appear here...'}
                  </div>
                  <div className="tiktok-stats">
                    <span><FaHeart /> 12.5K</span>
                    <span><FaRegComment /> 342</span>
                    <span><FaShare /> 1.2K</span>
                  </div>
                </div>
                
                <div className="input-container">
                  <textarea
                    value={snippets.tiktok}
                    onChange={(e) => handleInputChange('tiktok', e.target.value)}
                    maxLength={maxLengths.tiktok}
                    className="input-field"
                    placeholder="Write your TikTok caption here..."
                  />
                  <div className="input-footer">
                    <p className="char-counter">
                      {maxLengths.tiktok - snippets.tiktok.length} characters remaining
                    </p>
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(snippets.tiktok)}
                    >
                      <FaCopy /> Copy Text
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="nav-buttons">
            <button 
              className="nav-button secondary"
              onClick={() => navigate('/metadata')}
            >
              <FaArrowLeft /> Back to Metadata
            </button>
            <button 
              className="nav-button primary"
              onClick={saveAndContinue}
            >
              Continue to Publishing <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default SocialSnippets;