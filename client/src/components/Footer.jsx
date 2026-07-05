import { Link } from 'react-router-dom';
import { FiZap, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => (
  <footer className="border-t border-white/5 bg-dark-light/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <FiZap className="text-white text-sm" />
            </div>
            <span className="font-bold text-lg">
              Interview<span className="text-primary">Ace</span> AI
            </span>
          </div>
          <p className="text-text-muted text-sm max-w-md">
            Practice Smarter. Crack Interviews Faster. AI-powered mock interviews with personalized feedback.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><Link to="/register" className="hover:text-text transition-colors">Get Started</Link></li>
            <li><a href="#features" className="hover:text-text transition-colors">Features</a></li>
            <li><a href="#pricing" className="hover:text-text transition-colors">Pricing</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Connect</h4>
          <div className="flex gap-4">
            <a href="#" className="text-text-muted hover:text-primary transition-colors"><FiGithub /></a>
            <a href="#" className="text-text-muted hover:text-primary transition-colors"><FiTwitter /></a>
            <a href="#" className="text-text-muted hover:text-primary transition-colors"><FiLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 mt-8 pt-8 text-center text-text-muted text-sm">
        © {new Date().getFullYear()} InterviewAce AI. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
