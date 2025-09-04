import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { 
  FaSave, 
  FaArrowRight, 
  FaBold, 
  FaItalic, 
  FaListUl, 
  FaListOl, 
  FaHeading,
  FaMagic,
  FaChartLine,
  FaSpinner,
  FaLink,
  FaQuoteLeft,
  FaImage,
  FaUndo,
  FaRedo,
  FaEdit,
  FaTimes,
  FaHome,
  FaExclamationCircle
} from 'react-icons/fa';
import { databases, DATABASE_ID, COLLECTIONS } from '../../lib/appwrite';
import axios from 'axios';
import './blogeditor.css';

const BlogEditor = () => {
  const navigate = useNavigate();
  const { episodeId } = useParams();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [tone, setTone] = useState('professional');
  const [seoScore, setSeoScore] = useState(0);
  const [activeTab, setActiveTab] = useState('editor');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load data from backend or localStorage with default fallback
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const savedProject = JSON.parse(localStorage.getItem('currentProject') || '{}');
        const currentEpisodeId = episodeId || savedProject.episodeId;

        if (currentEpisodeId) {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-data/${currentEpisodeId}`);
            const { blog } = response.data;
            if (blog && Object.keys(blog).length > 0) {
              setTitle(blog.seo_title || '');
              setContent(blog.blog_content || '');
              setKeywords(blog.tags || []);
            }
          } catch (fetchErr) {
            setError(`Backend fetch failed: ${fetchErr.message}. Using local data or default.`);
          }
        }

        // Fallback to localStorage or default
        if (!content && savedProject.transcription) {
          setContent(savedProject.transcription);
          setTitle(savedProject.title || (savedProject.transcription.split('.')[0].trim().length > 10 && savedProject.transcription.split('.')[0].trim().length < 60 ? savedProject.transcription.split('.')[0].trim() : 'New Blog Post'));
          setKeywords(savedProject.keywords || ['podcast', 'episode']);
        } else if (!content) {
          setContent('Start your blog post here...');
          setTitle('New Blog Post');
          setKeywords(['podcast', 'episode']);
        }
      } catch (err) {
        setError(`Error loading data: ${err.message}. Starting with default editor.`);
        setContent('Start your blog post here...');
        setTitle('New Blog Post');
        setKeywords(['podcast', 'episode']);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [episodeId]);

  // Update word and character counts
  useEffect(() => {
    const words = content.split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(content.length);
    updateSeoScore();
  }, [content]);

  const updateSeoScore = () => {
    const score = Math.min(100, 
      (title.length > 10 && title.length <= 60 ? 20 : Math.max(0, title.length * 0.33)) + 
      (keywords.length * 5) + 
      (wordCount >= 300 ? 30 : Math.min(30, wordCount / 10)) +
      (content.includes(keywords[0] || '') ? 15 : 0)
    );
    setSeoScore(Math.round(score));
  };

  useEffect(() => {
    updateSeoScore();
  }, [title, content, keywords]);

  const generateAIBlog = async () => {
    setIsGenerating(true);
    try {
      if (episodeId) {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/enhance-blog/${episodeId}`);
        if (response.data.success) {
          const updatedResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-data/${episodeId}`);
          const { blog } = updatedResponse.data;
          setContent(blog.blog_content || content);
          setTitle(blog.seo_title || title);
          setKeywords(blog.tags || keywords);
        }
      }
    } catch (err) {
      setError(`AI enhancement failed: ${err.message}. Using simulation.`);
      const aiGeneratedContent = `# ${title || 'Generated Title'}\n\nIn this episode, we discuss ${keywords.join(', ') || 'various topics'}. \n\n${content.substring(0, 500) || 'Your content here'}\n\n## Key Takeaways\n\n[AI-generated insights will appear once OpenAI is active]`;
      setContent(aiGeneratedContent);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.toLowerCase()) && keywords.length < 10) {
      setKeywords([...keywords, newKeyword.toLowerCase()]);
      setNewKeyword('');
    } else if (keywords.length >= 10) {
      setError('Maximum 10 keywords allowed.');
    }
  };

  const saveDraft = async () => {
    const projectData = {
      episodeId: episodeId || JSON.parse(localStorage.getItem('currentProject') || '{}').episodeId,
      title,
      content,
      keywords,
      tone,
      seoScore,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('currentProject', JSON.stringify(projectData));

    try {
      if (episodeId) {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOG_POSTS, [`equal("episode_id", "${episodeId}")`]);
        const blogDocument = response.documents[0];

        if (blogDocument) {
          await databases.updateDocument(DATABASE_ID, COLLECTIONS.BLOG_POSTS, blogDocument.$id, {
            seo_title: title,
            blog_content: content,
            tags: keywords,
          });
        } else {
          await databases.createDocument(DATABASE_ID, COLLECTIONS.BLOG_POSTS, ID.unique(), {
            episode_id: episodeId,
            seo_title: title,
            blog_content: content,
            tags: keywords,
          });
        }
      }
      alert('Draft saved successfully!');
    } catch (err) {
      setError(`Failed to save to database: ${err.message}. Saved locally.`);
    }
  };

  const continueToMetadata = () => {
    saveDraft();
    if (!error) navigate('/metadata');
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    setContent(document.getElementById('editor').innerHTML);
    document.getElementById('editor').focus();
  };

  if (loading) {
    return (
      <div className="blog-editor-container loading">
        <FaSpinner className="spinner" size={48} />
        <p>Loading blog data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-editor-container error">
        <FaExclamationCircle size={48} />
        <p>{error}</p>
        <button onClick={() => setError('')} className="dismiss-error"><FaTimes /></button>
      </div>
    );
  }

  return (
    <div className="blog-editor-container">
      <header className="mobile-header">
        <div className="header-content">
          <div className="navbar-title">
            <FaHome className="home-icon" />
            <span>Blog Editor</span>
          </div>
          <button 
            className="menu-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <FaTimes /> : <FaEdit />}
          </button>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`blog-editor-content ${sidebarOpen ? 'sidebar-active' : ''}`}>
        <div className="glass-card">
          <header className="editor-header">
            <h1 className="editor-title">Podcast to Blog Editor</h1>
            <p className="editor-subtitle">Transform your podcast transcription into an SEO-optimized blog post</p>
          </header>

          <div className="editor-tabs">
            <button 
              className={`tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              Editor
            </button>
            <button 
              className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'seo' ? 'active' : ''}`}
              onClick={() => setActiveTab('seo')}
            >
              SEO Analysis
            </button>
          </div>

          {activeTab === 'editor' && (
            <div className="tab-content">
              <div className="seo-fields">
                <div className="input-group">
                  <label htmlFor="blog-title">Blog Title</label>
                  <input
                    id="blog-title"
                    type="text"
                    placeholder="Enter a compelling title"
                    className="input-field"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength="60"
                  />
                  <div className="character-count">{title.length}/60</div>
                </div>
                
                <div className="keyword-section">
                  <label>Keywords</label>
                  <div className="keyword-chips">
                    {keywords.map((keyword, index) => (
                      <span key={index} className="chip">
                        {keyword}
                        <button 
                          onClick={() => setKeywords(keywords.filter((_, i) => i !== index))}
                          className="chip-remove"
                          aria-label={`Remove ${keyword}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <div className="keyword-input-group">
                      <input
                        type="text"
                        placeholder="Add keyword"
                        className="input-field keyword-input"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                      />
                      <button 
                        onClick={handleAddKeyword}
                        className="add-keyword-btn"
                        disabled={!newKeyword.trim()}
                        aria-label="Add keyword"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="tone-selection">
                  <label htmlFor="tone-select">Tone:</label>
                  <select
                    id="tone-select"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="input-field"
                  >
                    <option value="professional">Professional</option>
                    <option value="conversational">Conversational</option>
                    <option value="authoritative">Authoritative</option>
                    <option value="friendly">Friendly</option>
                    <option value="informative">Informative</option>
                  </select>
                </div>
              </div>
              
              <div className="rich-text-editor">
                <div className="toolbar">
                  <div className="toolbar-group">
                    <button 
                      className="toolbar-btn" 
                      onClick={() => formatText('bold')}
                      title="Bold"
                      aria-label="Bold"
                    >
                      <FaBold />
                    </button>
                    <button 
                      className="toolbar-btn" 
                      onClick={() => formatText('italic')}
                      title="Italic"
                      aria-label="Italic"
                    >
                      <FaItalic />
                    </button>
                  </div>
                  
                  <div className="toolbar-group">
                    <button 
                      className="toolbar-btn"
                      onClick={() => formatText('insertUnorderedList')}
                      title="Bullet List"
                      aria-label="Bullet List"
                    >
                      <FaListUl />
                    </button>
                    <button 
                      className="toolbar-btn"
                      onClick={() => formatText('insertOrderedList')}
                      title="Numbered List"
                      aria-label="Numbered List"
                    >
                      <FaListOl />
                    </button>
                  </div>
                  
                  <div className="toolbar-group">
                    <button 
                      className="toolbar-btn"
                      onClick={() => formatText('formatBlock', '<h2>')}
                      title="Heading"
                      aria-label="Heading"
                    >
                      <FaHeading />
                    </button>
                    <button 
                      className="toolbar-btn"
                      onClick={() => formatText('createLink', prompt('Enter URL:'))}
                      title="Link"
                      aria-label="Link"
                    >
                      <FaLink />
                    </button>
                  </div>
                  
                  <div className="toolbar-group">
                    <button 
                      className="toolbar-btn"
                      onClick={() => formatText('formatBlock', '<blockquote>')}
                      title="Quote"
                      aria-label="Quote"
                    >
                      <FaQuoteLeft />
                    </button>
                    <button 
                      className="toolbar-btn"
                      onClick={() => formatText('insertImage', prompt('Image URL:'))}
                      title="Image"
                      aria-label="Image"
                    >
                      <FaImage />
                    </button>
                  </div>
                  
                  <div className="toolbar-group">
                    <button 
                      className="toolbar-btn"
                      onClick={() => formatText('undo')}
                      title="Undo"
                      aria-label="Undo"
                    >
                      <FaUndo />
                    </button>
                    <button 
                      className="toolbar-btn"
                      onClick={() => formatText('redo')}
                      title="Redo"
                      aria-label="Redo"
                    >
                      <FaRedo />
                    </button>
                  </div>
                </div>
                
                <div
                  id="editor"
                  className="editor"
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: content }}
                  onInput={(e) => setContent(e.target.innerHTML)}
                  placeholder="Start writing your blog post here..."
                />
                
                <div className="editor-footer">
                  <div className="stats">
                    <span>Words: {wordCount}</span>
                    <span>Characters: {charCount}</span>
                  </div>
                  <div className="seo-score-display">
                    <FaChartLine />
                    <span>SEO Score: {seoScore}%</span>
                  </div>
                </div>
              </div>
              
              <button 
                className="ai-generate-btn"
                onClick={generateAIBlog}
                disabled={isGenerating || !content}
                aria-label="Enhance with AI"
              >
                {isGenerating ? (
                  <>
                    <FaSpinner className="spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaMagic />
                    Enhance with AI
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="tab-content">
              <div className="preview-container">
                <h2 className="preview-title">{title || 'Your Blog Title'}</h2>
                <div className="preview-meta">
                  <span className="preview-date">{new Date().toLocaleDateString()}</span>
                  {keywords.length > 0 && (
                    <span className="preview-keywords">Keywords: {keywords.join(', ')}</span>
                  )}
                  <span className="preview-tone">Tone: {tone}</span>
                </div>
                <div 
                  className="preview-content"
                  dangerouslySetInnerHTML={{ __html: content || '<p>Your blog content will appear here...</p>' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="tab-content">
              <div className="seo-score-card">
                <div className="score-circle" style={{ 
                  background: `conic-gradient(#4CAF50 0% ${seoScore}%, rgba(255,255,255,0.1) ${seoScore}% 100%)`
                }}>
                  <div className="score-value">{seoScore}%</div>
                  <div className="score-label">SEO Score</div>
                </div>
                <div className="score-breakdown">
                  <h3>Optimization Tips</h3>
                  <ul>
                    <li className={title.length >= 10 && title.length <= 60 ? 'passed' : 'failed'}>
                      {title.length >= 10 && title.length <= 60 ? '✓' : '✗'} Title length (10-60 chars)
                    </li>
                    <li className={keywords.length >= 3 ? 'passed' : 'failed'}>
                      {keywords.length >= 3 ? '✓' : '✗'} At least 3 keywords
                    </li>
                    <li className={wordCount >= 300 ? 'passed' : 'failed'}>
                      {wordCount >= 300 ? '✓' : '✗'} Minimum 300 words
                    </li>
                    <li className={content.includes(keywords[0] || '') ? 'passed' : 'failed'}>
                      {content.includes(keywords[0] || '') ? '✓' : '✗'} First keyword used in content
                    </li>
                    <li className={content.includes('<h2>') ? 'passed' : 'failed'}>
                      {content.includes('<h2>') ? '✓' : '✗'} Uses subheadings
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <div className="editor-actions">
            <button 
              className="secondary-button"
              onClick={saveDraft}
              aria-label="Save draft"
            >
              <FaSave /> Save Draft
            </button>
            <button 
              className="primary-button"
              onClick={continueToMetadata}
              aria-label="Continue to metadata"
            >
              Continue to Metadata <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;