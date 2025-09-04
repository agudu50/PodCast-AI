import React, { useState, useEffect } from 'react';
import { FaPodcast, FaRocket, FaArrowRight, FaBars, FaTimes, FaMagic, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-container">
      <div className="landing-background-watermark">
        <span>P</span>
        <span>O</span>
        <span>D</span>
        <span>C</span>
        <span>A</span>
        <span>S</span>
        <span>T</span>
        <span>A</span>
        <span>I</span>
      </div>
      
      {/* Floating particles */}
      <div className="landing-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="landing-particle" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            animationDuration: `${Math.random() * 20 + 10}s`,
            animationDelay: `${Math.random() * 5}s`
          }}></div>
        ))}
      </div>

      <nav className={`landing-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-logo">
          <FaMagic className="landing-logo-icon" /> PodcastAI
        </div>
        <div className="landing-nav-menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={`landing-nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#features" onClick={toggleMenu}>Features</a></li>
          <li><a href="#workflow" onClick={toggleMenu}>Workflow</a></li>
          <li><a href="#faq" onClick={toggleMenu}>FAQ</a></li>
          <li><button className="landing-nav-cta" onClick={goToDashboard}>Get Started</button></li>
        </ul>
      </nav>

      <div className="landing-main-content">
        <header className="landing-hero">
          <div className="landing-hero-content">
            <div className="landing-hero-text">
              <div className="landing-hero-badge">NEW GENERATION AI TOOL</div>
              <h1 className="landing-hero-title">
                <span className="landing-title-gradient">PodcastAI</span>: Transform Your Content
              </h1>
              <p className="landing-hero-subtitle">
                AI-powered automation that turns your podcasts into SEO-optimized blogs, 
                viral social snippets, and professional video reels in minutes.
              </p>
              <div className="landing-hero-cta-container">
                <button className="landing-cta-button primary" onClick={goToDashboard}>
                  Start Now <FaArrowRight className="landing-cta-icon" />
                </button>
                <button className="landing-cta-button secondary" onClick={goToDashboard}>
                  See Demo
                </button>
              </div>
            </div>
            <div className="landing-hero-visual">
              <div className="landing-visual-container">
                {/* Card 1 */}
                <div className="landing-visual-card landing-visual-card-1">
                  <img 
                    src="/images/podcast-mic.png" 
                    alt="Podcast microphone"
                    className="landing-card-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(45deg, #111, #222)';
                    }}
                  />
                </div>
                
                {/* Card 2 */}
                <div className="landing-visual-card landing-visual-card-2">
                  <img 
                    src="/images/audio-wave.png" 
                    alt="Audio waveform"
                    className="landing-card-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(45deg, #222, #333)';
                    }}
                  />
                </div>
                
                {/* Card 3 */}
                <div className="landing-visual-card landing-visual-card-3">
                  <img 
                    src="/images/studio-setup.png" 
                    alt="Studio setup"
                    className="landing-card-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(45deg, #333, #444)';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-stat-item">
              <div className="landing-stat-number">10,000+</div>
              <div className="landing-stat-label">Podcasts Processed</div>
            </div>
            <div className="landing-stat-item">
              <div className="landing-stat-number">95%</div>
              <div className="landing-stat-label">Time Saved</div>
            </div>
            <div className="landing-stat-item">
              <div className="landing-stat-number">4.9/5</div>
              <div className="landing-stat-label">User Rating</div>
            </div>
          </div>
        </header>

        <section id="features" className="landing-features">
          <h2>Next-Level Podcast Automation</h2>
          <div className="landing-feature-grid">
            <div className="landing-feature-card">
              <FaPodcast className="landing-feature-icon" />
              <h3>AI Blog Generator</h3>
              <p>Turn episodes into SEO-optimized blogs with smart keyword integration.</p>
            </div>
            <div className="landing-feature-card">
              <FaRocket className="landing-feature-icon" />
              <h3>Viral Social Snippets</h3>
              <p>Instantly create shareable posts for Twitter, LinkedIn, and Instagram.</p>
            </div>
            <div className="landing-feature-card">
              <FaMagic className="landing-feature-icon" />
              <h3>Branded Video Reels</h3>
              <p>Auto-generate captioned, branded clips for TikTok, Instagram, and YouTube.</p>
            </div>
          </div>
        </section>

        <section id="workflow" className="landing-workflow">
          <h2>The PodcastAI Magic</h2>
          <div className="landing-workflow-steps">
            <div className="landing-step">
              <span className="landing-step-number">1</span>
              <h3>Upload Your Episode</h3>
              <p>Drag-and-drop your audio or video file in seconds.</p>
            </div>
            <div className="landing-step">
              <span className="landing-step-number">2</span>
              <h3>AI-Powered Creation</h3>
              <p>Our AI transcribes, optimizes, and crafts content instantly.</p>
            </div>
            <div className="landing-step">
              <span className="landing-step-number">3</span>
              <h3>Publish with Ease</h3>
              <p>Edit, schedule, or post directly to your favorite platforms.</p>
            </div>
          </div>
        </section>

        <section id="faq" className="landing-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="landing-faq-grid">
            <div className="landing-faq-item">
              <FaQuestionCircle className="landing-faq-icon" />
              <h4>How does PodcastAI generate content?</h4>
              <p>Our AI transcribes your podcast, analyzes it for key points, and creates SEO-optimized blogs, social snippets, and branded video clips automatically.</p>
            </div>
            <div className="landing-faq-item">
              <FaQuestionCircle className="landing-faq-icon" />
              <h4>Can I edit the AI-generated content?</h4>
              <p>Absolutely! All generated content is fully editable, allowing you to tweak blogs, captions, and video clips to match your brand's voice.</p>
            </div>
            <div className="landing-faq-item">
              <FaQuestionCircle className="landing-faq-icon" />
              <h4>Which platforms are supported?</h4>
              <p>PodcastAI integrates with Instagram, TikTok, YouTube Shorts, Twitter, LinkedIn, WordPress, and Buffer for seamless publishing.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="landing-contact">
          <h2>Join the Podcast Revolution</h2>
          <p>Ready to amplify your content? Let's make it happen!</p>
          <button className="landing-contact-button" onClick={goToDashboard}>Start Now</button>
        </section>
      </div>

      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-logo">
            <FaMagic className="landing-logo-icon" /> PodcastAI
          </div>
          <div className="landing-footer-links">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="landing-footer-social">
            <a href="https://x.com/bytebaoofficial?lang=en">Twitter</a>
            <a href="https://www.instagram.com/bytebao/">Instagram</a>
            <a href="https://www.linkedin.com/company/bytebao/posts/?feedView=all">LinkedIn</a>
          </div>
          <p>© 2025 PodcastAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;