import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMic, FiFileText, FiBarChart2, FiClock, FiTarget, FiZap,
  FiUpload, FiCpu, FiMessageSquare, FiAward, FiChevronDown,
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const LandingPage = () => {
  const features = [
    { icon: FiMic, title: 'AI Mock Interviews', desc: 'Practice with AI-generated questions tailored to your resume and skills.' },
    { icon: FiFileText, title: 'Resume Analysis', desc: 'Upload your resume and get AI-powered analysis with improvement suggestions.' },
    { icon: FiZap, title: 'Voice Interviews', desc: 'Practice speaking answers with real-time speech-to-text transcription.' },
    { icon: FiBarChart2, title: 'Performance Analytics', desc: 'Track your progress with detailed charts and readiness scores.' },
    { icon: FiClock, title: 'Interview History', desc: 'Review past interviews and download comprehensive PDF reports.' },
    { icon: FiTarget, title: 'Career Suggestions', desc: 'Get personalized career recommendations based on your performance.' },
  ];

  const steps = [
    { icon: FiUpload, title: 'Upload Resume', desc: 'Upload your PDF or DOCX resume for AI analysis' },
    { icon: FiCpu, title: 'Generate Questions', desc: 'AI creates personalized interview questions' },
    { icon: FiMessageSquare, title: 'Take Interview', desc: 'Answer via text or voice with real-time feedback' },
    { icon: FiAward, title: 'Get Feedback', desc: 'Receive detailed scores and improvement plans' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'Software Engineer at Google', text: 'InterviewAce helped me land my dream job. The AI feedback was incredibly detailed and actionable.' },
    { name: 'Michael Rodriguez', role: 'Full Stack Developer', text: 'The voice interview feature made me confident in real interviews. My scores improved 40% in 2 weeks.' },
    { name: 'Priya Sharma', role: 'Backend Developer at Amazon', text: 'Best interview prep platform I have used. The resume analysis and career suggestions are spot on.' },
  ];

  const faqs = [
    { q: 'How does AI question generation work?', a: 'Our AI analyzes your resume, skills, and selected domain to generate unique, relevant interview questions at your chosen difficulty level.' },
    { q: 'Can I practice voice interviews?', a: 'Yes! Use our Web Speech API powered voice mode to practice speaking your answers with real-time transcription.' },
    { q: 'Is my data secure?', a: 'Absolutely. We use JWT authentication, encrypted passwords, and secure MongoDB Atlas storage.' },
    { q: 'What file formats are supported for resumes?', a: 'We support PDF and DOCX resume formats up to 5MB in size.' },
  ];

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navbar />

      {/* Hero */}
      <section id="home" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <span className="inline-block px-4 py-2 rounded-full glass text-accent text-sm font-medium mb-6">
              Practice Smarter. Crack Interviews Faster.
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              AI-Powered{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Interview Preparation
              </span>{' '}
              Platform
            </h1>
            <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Master technical and HR interviews with personalized AI feedback, voice practice, and comprehensive analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Start Practicing
              </Link>
              <a href="#features" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="glass p-2 rounded-2xl max-w-4xl mx-auto">
              <div className="bg-dark-light rounded-xl p-8 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-text-muted text-xs ml-2">InterviewAce AI Dashboard</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {['Total Interviews: 12', 'Avg Score: 78%', 'Highest: 92%', 'Readiness: 85%'].map((stat) => (
                    <div key={stat} className="glass p-3 rounded-lg text-sm">{stat}</div>
                  ))}
                </div>
                <div className="glass p-4 rounded-lg">
                  <p className="text-primary text-sm mb-2">Current Question (3/10)</p>
                  <p className="text-text">Explain the difference between Virtual DOM and Real DOM in React.</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">Powerful Features</h2>
            <p className="text-text-muted max-w-xl mx-auto">Everything you need to ace your next interview</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card group hover:border-primary/30"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-primary text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-muted text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="text-text-muted">Four simple steps to interview success</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="text-white text-2xl" />
                </div>
                <div className="absolute top-8 left-[60%] hidden md:block w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                <span className="text-primary text-sm font-bold">Step {i + 1}</span>
                <h3 className="font-semibold mt-1 mb-2">{step.title}</h3>
                <p className="text-text-muted text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">What Our Users Say</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card"
              >
                <p className="text-text-muted text-sm mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-text-muted text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp} className="mb-16">
            <h2 className="section-title mb-4">Simple Pricing</h2>
            <p className="text-text-muted">Start free, upgrade when you are ready</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Free', price: '$0', features: ['5 Interviews/month', 'Basic Analytics', 'Resume Upload'] },
              { name: 'Pro', price: '$19', features: ['Unlimited Interviews', 'Voice Mode', 'PDF Reports', 'Career Advisor'], popular: true },
              { name: 'Team', price: '$49', features: ['Everything in Pro', 'Team Analytics', 'Admin Dashboard', 'Priority Support'] },
            ].map((plan) => (
              <div key={plan.name} className={`glass-card ${plan.popular ? 'border-primary/50 ring-2 ring-primary/20' : ''}`}>
                {plan.popular && <span className="text-primary text-xs font-bold">MOST POPULAR</span>}
                <h3 className="text-xl font-bold mt-2">{plan.name}</h3>
                <p className="text-3xl font-bold my-4">{plan.price}<span className="text-sm text-text-muted">/mo</span></p>
                <ul className="space-y-2 text-sm text-text-muted mb-6">
                  {plan.features.map((f) => <li key={f}>✓ {f}</li>)}
                </ul>
                <Link to="/register" className={plan.popular ? 'btn-primary w-full block text-center' : 'btn-secondary w-full block text-center'}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">FAQ</h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="glass-card group">
                <summary className="font-semibold cursor-pointer flex items-center justify-between list-none">
                  {faq.q}
                  <FiChevronDown className="group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-text-muted text-sm mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto glass-card text-center bg-gradient-to-br from-primary/10 to-secondary/10">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Interview?</h2>
          <p className="text-text-muted mb-8">Join thousands of candidates preparing smarter with AI</p>
          <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-block">
            Start Free Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
