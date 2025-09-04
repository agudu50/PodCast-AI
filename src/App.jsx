import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing/LandingPage';
import Dashboard from './pages/Dashboard/DashboardPage';
import Upload from './pages/Upload/UploadPage';
import BlogEditor from './pages/BlogEditor/BlogEditorPage';
import Metadata from './pages/Metadata/MetadataPage';
import SocialSnippets from './pages/SocialSnippets/SocialSnippetsPage';
import Publishing from './pages/Publishing/PublishingPage';
import HelpPage from './pages/Help/HelpPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/blog/:episodeId" element={<BlogEditor />} />
        <Route path="/metadata" element={<Metadata />} />
        <Route path="/social" element={<SocialSnippets />} />
        <Route path="/publish" element={<Publishing />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </Router>
  );
};

export default App;
