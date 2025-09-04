import React, { useState } from 'react';
import { 
  FaQuestionCircle, 
  FaUpload, 
  FaEdit, 
  FaTags, 
  FaShareAlt, 
  FaCalendarAlt, 
  FaCog, 
  FaInfoCircle, 
  FaHome, 
  FaFileAlt, 
  FaMicrophone, 
  FaVideo, 
  FaDatabase, 
  FaLock,
  FaSearch,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import './HelpPage.css';

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: <FaInfoCircle /> },
    { id: 'dashboard', title: 'Dashboard Overview', icon: <FaHome /> },
    { id: 'uploading', title: 'Uploading Episodes', icon: <FaUpload /> },
    { id: 'blog-generation', title: 'Blog Generation', icon: <FaFileAlt /> },
    { id: 'metadata', title: 'Metadata Management', icon: <FaTags /> },
    { id: 'social-snippets', title: 'Social Snippets & Clips', icon: <FaShareAlt /> },
    { id: 'publishing', title: 'Publishing & Scheduling', icon: <FaCalendarAlt /> },
    { id: 'settings', title: 'Settings & Customizations', icon: <FaCog /> },
    { id: 'backend', title: 'Backend & Technical Info', icon: <FaDatabase /> },
    { id: 'faqs', title: 'FAQs & Troubleshooting', icon: <FaQuestionCircle /> }
  ];

  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hp-container">
      <header className="hp-header">
        <h1>
          <FaQuestionCircle className="hp-header-icon" />
          ByteBao AI SEO Automation System Help Center
        </h1>
        <p className="hp-header-subtitle">
          Comprehensive guide for transforming podcasts into SEO-optimized content and automating multi-platform publishing. Designed for ByteBao to boost visibility and streamline workflows.
        </p>
        <div className="hp-search-bar">
          <FaSearch className="hp-search-icon" />
          <input 
            type="text" 
            placeholder="Search sections..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search help sections"
          />
        </div>
      </header>

      <nav className="hp-nav">
        <ul>
          {filteredSections.map(section => (
            <li key={section.id}>
              <a href={`#${section.id}`} aria-label={`Go to ${section.title}`}>
                {section.icon} {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="hp-content">
        {filteredSections.map(section => (
          <section key={section.id} id={section.id} className="hp-section">
            <h2 onClick={() => toggleSection(section.id)} className="hp-section-title">
              {section.icon} {section.title}
              {expandedSections[section.id] ? <FaChevronUp className="hp-toggle-icon" /> : <FaChevronDown className="hp-toggle-icon" />}
            </h2>
            {expandedSections[section.id] && (
              <div className="hp-section-content">
                {section.id === 'getting-started' && (
                  <>
                    <p>Welcome to the ByteBao AI SEO Automation System! Convert podcast episodes into SEO-optimized blogs, metadata, social snippets, and short video clips. Automates publishing to Instagram, TikTok, YouTube Shorts, Twitter/X, LinkedIn, Spotify, Apple Podcasts, and more.</p>
                    <ul>
                      <li><strong>Project Overview</strong>: Built for ByteBao by The Tech Tutors using OpenAI Whisper for transcription and GPT-4 Turbo for generation.</li>
                      <li><strong>Purpose</strong>: Optimize SEO, repurpose content, automate distribution for better visibility.</li>
                      <li><strong>Scope</strong>: Handles uploads up to 2 hours, English content only. Internal access via API keys (no user auth).</li>
                      <li><strong>Initial Setup</strong>: Start from the landing page's "Get Started" button. Prepare ByteBao branding assets.</li>
                    </ul>
                  </>
                )}
                {section.id === 'dashboard' && (
                  <>
                    <p>The dashboard is your central hub for content management.</p>
                    <ul>
                      <li><strong>Quick Stats</strong>: Episodes processed, blog drafts, posts, clips.</li>
                      <li><strong>Recent Uploads</strong>: List with statuses (Draft, Published, Scheduled).</li>
                      <li><strong>CTA</strong>: "Upload New Episode" to begin workflow.</li>
                      <li><strong>Analytics</strong>: SEO performance via Google Search Console or Chartable.</li>
                    </ul>
                  </>
                )}
                {section.id === 'uploading' && (
                  <>
                    <p>Upload podcast audio/video to start processing.</p>
                    <ol>
                      <li>Access Upload Page from dashboard.</li>
                      <li>Drag-and-drop MP3/MP4 files (under 2 hours).</li>
                      <li>Click "Transcribe & Generate Content".</li>
                      <li>Uses OpenAI Whisper for accurate transcription.</li>
                      <li>Transcripts stored in database.</li>
                    </ol>
                    <p><strong>Tip</strong>: Files in Appwrite's "podcast_uploads" bucket.</p>
                  </>
                )}
                {section.id === 'blog-generation' && (
                  <>
                    <p>Turn transcripts into SEO blogs.</p>
                    <ul>
                      <li><strong>AI Process</strong>: GPT-4 creates editable drafts with titles, headings, summaries.</li>
                      <li><strong>Editing</strong>: Rich text editor, tone selector, keyword suggestions.</li>
                      <li><strong>Features</strong>: Embed quotes, optimize for search.</li>
                      <li><strong>Next</strong>: "Save & Continue" to metadata.</li>
                      <li><strong>Storage</strong>: "blog_postsល
                      posts" collection in Appwrite.</li>
                    </ul>
                  </>
                )}
                {section.id === 'metadata' && (
                  <>
                    <p>Generate/customize SEO metadata.</p>
                    <ul>
                      <li><strong>Auto-Generation</strong>: Titles, descriptions, tags for platforms (YouTube, Spotify).</li>
                      <li><strong>Editing</strong>: Override fields.</li>
                      <li><strong>Apply</strong>: "Apply to Blog".</li>
                      <li><strong>Benefits</strong>: Better discoverability.</li>
                      <li><strong>Custom</strong>: Platform-specific for integrations.</li>
                    </ul>
                  </>
                )}
                {section.id === 'social-snippets' && (
                  <>
                    <p>Create short-form social content.</p>
                    <ul>
                      <li><strong>Text Snippets</strong>: Captions for Twitter/X, Instagram, LinkedIn (editable, copyable).</li>
                      <li><strong>Video Clips</strong>: Extract highlights, add captions/watermarks, editing tools.</li>
                      <li><strong>Preview</strong>: Player for review/edits.</li>
                      <li><strong>Post</strong>: Buttons for Instagram, TikTok, YouTube Shorts.</li>
                      <li><strong>Storage</strong>: "snippets" collection; clips in "assets_generated".</li>
                      <li><strong>Extra</strong>: SEO/trend-optimized.</li>
                    </ul>
                  </>
                )}
                {section.id === 'publishing' && (
                  <>
                    <p>Automate content distribution.</p>
                    <ul>
                      <li><strong>List View</strong>: Statuses (Draft, Published, Scheduled).</li>
                      <li><strong>Calendar</strong>: Upcoming posts overview.</li>
                      <li><strong>Actions</strong>: "Publish Now" or "Schedule".</li>
                      <li><strong>Integrations</strong>: TikTok, Instagram, etc., via Zapier/Buffer.</li>
                      <li><strong>Queue</strong>: "publish_queue" for tracking.</li>
                      <li><strong>Workflow</strong>: Returns to dashboard post-publish.</li>
                    </ul>
                  </>
                )}
                {section.id === 'settings' && (
                  <>
                    <p>Personalize for ByteBao.</p>
                    <ul>
                      <li><strong>Connections</strong>: Link social platforms.</li>
                      <li><strong>Branding</strong>: Tone, fonts, hashtags, logos, colors.</li>
                      <li><strong>Integrations</strong>: WordPress, Buffer, Zapier for sync/email.</li>
                      <li><strong>History</strong>: Manage uploads/assets.</li>
                      <li><strong>Preferences</strong>: AI tone, language (English initial).</li>
                    </ul>
                  </>
                )}
                {section.id === 'backend' && (
                  <>
                    <p>Powered by Appwrite (no-auth internal).</p>
                    <ul>
                      <li><strong>Storage</strong>: "podcast_uploads" for files; "assets_generated" for clips.</li>
                      <li><strong>Collections</strong>: "transcripts", "blog_posts", "snippets", "publish_queue".</li>
                      <li><strong>Security</strong>: Encrypted, API key access (team only).</li>
                      <li><strong>Tech Stack</strong>: React + Tailwind (frontend), Node.js + Express (backend), Whisper + GPT-4 (AI), Appwrite/MongoDB (storage), GitHub Actions (CI/CD).</li>
                      <li><strong>Performance</strong>: Processes within 60 seconds; 30–50 episodes/month; 99.5% uptime.</li>
                      <li><strong>Constraints</strong>: English content, uploads under 2 hours; OpenAI API tokens required.</li>
                    </ul>
                  </>
                )}
                {section.id === 'faqs' && (
                  <dl>
                    <dt>What if transcription fails?</dt>
                    <dd>Check MP3/MP4 format and under 2 hours. Retry or contact support.</dd>
                    <dt>How do I edit content?</dt>
                    <dd>Use editable fields on Blog/Metadata/Snippets. Save before proceeding.</dd>
                    <dt>Why no login?</dt>
                    <dd>Internal system; access via API keys.</dd>
                    <dt>Can I add platforms?</dt>
                    <dd>Future: CMS sync, emails. Contact Tech Tutors.</dd>
                    <dt>Deadlines?</dt>
                    <dd>MVP: July 12, 2025; Full: August 5, 2025. Live as of August 22, 2025.</dd>
                    <dt>Troubleshooting Tip</dt>
                    <dd>Fund Whisper/GPT tokens. Check console/Appwrite logs for errors.</dd>
                  </dl>
                )}
              </div>
            )}
          </section>
        ))}
        {filteredSections.length === 0 && <p className="hp-no-results">No sections match your search.</p>}
      </main>

      <footer className="hp-footer">
        <p>
          <FaInfoCircle /> Contact Kelvin Agyare (Project Lead) for help. 
          Version 1.0 | Updated: August 22, 2025
        </p>
      </footer>
    </div>
  );
};

export default HelpPage;