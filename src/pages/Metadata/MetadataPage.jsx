import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { 
  FaSave, 
  FaArrowRight, 
  FaHeading, 
  FaAlignLeft, 
  FaPlus, 
  FaTrashAlt,
  FaArrowLeft,
  FaChartLine,
  FaLightbulb,
  FaHome,
  FaTags,
  FaTimes
} from 'react-icons/fa';
import { ID } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '../../lib/appwrite';
import axios from 'axios';
import './metadata.css';

const Metadata = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const [episodeId, setEpisodeId] = useState('');

  // Load or initialize metadata
  useEffect(() => {
    const savedProject = JSON.parse(localStorage.getItem('currentProject') || '{}');
    const currentEpisodeId = savedProject.episodeId;

    if (currentEpisodeId) {
      setEpisodeId(currentEpisodeId);
      // Attempt to fetch from backend
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-data/${currentEpisodeId}`)
        .then(response => {
          const { metadata } = response.data;
          if (metadata && Object.keys(metadata).length > 0) {
            setTitle(metadata.title || '');
            setDescription(metadata.description || '');
            setTags(metadata.tags || []);
          } else {
            // Fallback to localStorage
            setTitle(savedProject.title || 'New Podcast Episode');
            setDescription(savedProject.description || 'Discover this exciting new podcast episode...');
            setTags(savedProject.tags || savedProject.keywords || ['podcast']);
          }
        })
        .catch(err => {
          setError(`Backend fetch failed: ${err.message}. Using local defaults.`);
          setTitle(savedProject.title || 'New Podcast Episode');
          setDescription(savedProject.description || 'Discover this exciting new podcast episode...');
          setTags(savedProject.tags || savedProject.keywords || ['podcast']);
        });
    } else {
      // New session: generate temporary episodeId and default values
      const tempEpisodeId = ID.unique();
      setEpisodeId(tempEpisodeId);
      setTitle('New Podcast Episode');
      setDescription('Discover this exciting new podcast episode...');
      setTags(['podcast']);
    }

    // Set suggested tags
    setSuggestedTags([
      'content creation',
      'seo',
      'blogging',
      'audio content'
    ].filter(tag => !tags.includes(tag)));
  }, []);

  // Calculate SEO score
  useEffect(() => {
    const score = Math.min(100, 
      (title.length > 10 && title.length <= 60 ? 30 : Math.max(0, title.length * 0.5)) +
      (description.length > 50 && description.length <= 160 ? 30 : Math.max(0, description.length * 0.2)) +
      (tags.length >= 3 ? 20 : Math.min(20, tags.length * 5)) +
      (tags.some(tag => title.includes(tag)) ? 10 : 0) +
      (tags.some(tag => description.includes(tag)) ? 10 : 0)
    );
    setSeoScore(Math.round(score));
  }, [title, description, tags]);

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase()) && tags.length < 10) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
      setSuggestedTags(suggestedTags.filter(tag => tag !== tagInput.trim().toLowerCase()));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setSuggestedTags([...suggestedTags, tagToRemove].filter(tag => !tags.includes(tag)));
  };

  const addSuggestedTag = (tag) => {
    if (!tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setSuggestedTags(suggestedTags.filter(t => t !== tag));
    }
  };

  const saveMetadata = async () => {
    const savedProject = JSON.parse(localStorage.getItem('currentProject') || {});
    savedProject.metadata = {
      title,
      description,
      tags,
      seoScore,
      lastUpdated: new Date().toISOString(),
      episodeId
    };
    localStorage.setItem('currentProject', JSON.stringify(savedProject));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);

    try {
      // Save to Appwrite
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.METADATA, [`equal("episode_id", "${episodeId}")`]);
      const metadataDoc = response.documents[0];
      if (metadataDoc) {
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.METADATA, metadataDoc.$id, {
          episode_id: episodeId,
          title,
          description,
          tags,
          seo_score: seoScore,
          last_updated: new Date().toISOString(),
        });
      } else {
        await databases.createDocument(DATABASE_ID, COLLECTIONS.METADATA, ID.unique(), {
          episode_id: episodeId,
          title,
          description,
          tags,
          seo_score: seoScore,
          last_updated: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(`Failed to save to backend: ${err.message}. Saved locally.`);
    }
  };

  const continueToNext = () => {
    saveMetadata();
    if (!error) navigate('/social-snippets');
  };

  const goBack = () => {
    saveMetadata();
    if (!error) navigate('/blog-editor');
  };

  const getSeoColor = () => {
    if (seoScore >= 80) return '#4CAF50';
    if (seoScore >= 50) return '#FFC107';
    return '#F44336';
  };

  return (
    <div className="metadata-container">
      <header className="mobile-header">
        <div className="header-content">
          <div className="navbar-title">
            <FaHome className="home-icon" />
            <span>Metadata</span>
          </div>
          <button 
            className="menu-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <FaTimes /> : <FaTags />}
          </button>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`metadata-content ${sidebarOpen ? 'sidebar-active' : ''}`}>
        <div className="glass-card">
          <header className="metadata-header">
            <h1 className="metadata-title">
              <span className="gradient-text">Metadata Optimization</span>
            </h1>
            <p className="metadata-subtitle">
              Enhance your content's visibility with optimized metadata
            </p>
          </header>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => setError('')} className="close-error">Close</button>
            </div>
          )}

          <div className="metadata-grid">
            <div className="metadata-form">
              <div className="meta-field">
                <label className="input-label">
                  <FaHeading className="input-icon" />
                  <span>Meta Title</span>
                  <span className="char-counter">{title.length}/60 (ideal: 50-60 chars)</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="A compelling title that includes primary keywords"
                  maxLength="60"
                />
              </div>

              <div className="meta-field">
                <label className="input-label">
                  <FaAlignLeft className="input-icon" />
                  <span>Meta Description</span>
                  <span className="char-counter">{description.length}/160 (ideal: 120-160 chars)</span>
                </label>
                <textarea
                  className="input-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="An engaging summary that encourages clicks"
                  maxLength="160"
                  rows="4"
                />
              </div>

              <div className="meta-field">
                <label className="input-label">
                  <FaPlus className="input-icon" />
                  <span>Tags</span>
                  <span className="char-counter">{tags.length}/10 max</span>
                </label>
                <div className="tag-input-container">
                  <input
                    type="text"
                    className="input-field"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Add tag and press Enter"
                  />
                  <button 
                    onClick={addTag}
                    className="add-tag-button"
                    disabled={!tagInput.trim() || tags.length >= 10}
                  >
                    Add
                  </button>
                </div>
                
                {tags.length > 0 && (
                  <div className="tags-container">
                    {tags.map((tag, index) => (
                      <span key={index} className="tag-chip">
                        {tag}
                        <button 
                          onClick={() => removeTag(tag)}
                          className="tag-remove"
                          aria-label={`Remove ${tag}`}
                        >
                          <FaTrashAlt size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="metadata-sidebar">
              <div className="seo-score-card">
                <div className="score-header">
                  <FaChartLine className="score-icon" />
                  <h3>SEO Score</h3>
                </div>
                <div 
                  className="score-circle"
                  style={{ 
                    background: `conic-gradient(${getSeoColor()} 0% ${seoScore}%, rgba(255,255,255,0.1) ${seoScore}% 100%)`
                  }}
                >
                  <div className="score-value">{seoScore}%</div>
                </div>
                <div className="score-description">
                  {seoScore >= 80 ? 'Excellent!' : 
                   seoScore >= 50 ? 'Good, but could improve' : 
                   'Needs work'}
                </div>

                <div className="seo-tips">
                  <div className="tips-header">
                    <FaLightbulb className="tips-icon" />
                    <h4>Optimization Tips</h4>
                  </div>
                  <ul className="tips-list">
                    {title.length < 50 && (
                      <li className="tip-item">
                        <span className="tip-badge">!</span>
                        Make title longer (50-60 chars ideal)
                      </li>
                    )}
                    {title.length > 60 && (
                      <li className="tip-item">
                        <span className="tip-badge">!</span>
                        Shorten title (under 60 chars)
                      </li>
                    )}
                    {description.length < 120 && (
                      <li className="tip-item">
                        <span className="tip-badge">!</span>
                        Expand description (120-160 chars)
                      </li>
                    )}
                    {tags.length < 3 && (
                      <li className="tip-item">
                        <span className="tip-badge">!</span>
                        Add more tags (3-5 recommended)
                      </li>
                    )}
                    {tags.length > 0 && !title.includes(tags[0]) && (
                      <li className="tip-item">
                        <span className="tip-badge">!</span>
                        Include primary tag in title
                      </li>
                    )}
                  </ul>
                </div>

                {suggestedTags.length > 0 && (
                  <div className="suggested-tags">
                    <h4>Suggested Tags</h4>
                    <div className="suggested-tags-grid">
                      {suggestedTags.map((tag, index) => (
                        <button
                          key={index}
                          className="suggested-tag"
                          onClick={() => addSuggestedTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="metadata-actions">
            <button 
              className="secondary-button"
              onClick={goBack}
            >
              <FaArrowLeft /> Back to Editor
            </button>
            <div className="action-group">
              <button 
                className="save-button"
                onClick={saveMetadata}
              >
                {isSaved ? 'Saved!' : 'Save Draft'} <FaSave />
              </button>
              <button 
                className="primary-button"
                onClick={continueToNext}
              >
                Continue <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metadata;