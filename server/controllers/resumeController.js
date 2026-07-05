import User from '../models/User.js';
import { extractTextFromFile, parseResumeLocally } from '../services/resumeParser.js';
import { analyzeResume } from '../services/aiService.js';

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const resumeText = await extractTextFromFile(req.file.path);
    const localParsed = parseResumeLocally(resumeText);

    const user = await User.findById(req.user._id);
    user.resumeUrl = `/uploads/${req.file.filename}`;
    user.resumeData = localParsed;
    user.skills = [...new Set([...user.skills, ...localParsed.skills])];
    await user.save();

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: user.resumeUrl,
      parsed: localParsed,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const analyzeResumeHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.resumeUrl && !req.body.text) {
      return res.status(400).json({ success: false, message: 'No resume found. Upload first.' });
    }

    let resumeText = req.body.text;
    if (!resumeText && user.resumeUrl) {
      const filePath = `.${user.resumeUrl}`;
      resumeText = await extractTextFromFile(filePath);
    }

    let analysis;
    try {
      analysis = await analyzeResume(resumeText);
    } catch {
      analysis = parseResumeLocally(resumeText);
      analysis.resumeScore = Math.min(70 + analysis.skills.length * 2, 95);
      analysis.missingSkills = ['System Design', 'Cloud Computing'];
      analysis.suggestions = ['Add more quantifiable achievements', 'Include project links'];
    }

    user.resumeData = {
      skills: analysis.skills || [],
      projects: analysis.projects || [],
      education: analysis.education || [],
      experience: analysis.experience || [],
      technologies: analysis.technologies || analysis.skills || [],
    };
    user.resumeScore = analysis.resumeScore || 75;
    user.missingSkills = analysis.missingSkills || [];
    user.resumeSuggestions = analysis.suggestions || [];
    user.skills = [...new Set([...user.skills, ...(analysis.skills || [])])];
    await user.save();

    res.json({
      success: true,
      data: {
        skills: user.resumeData.skills,
        projects: user.resumeData.projects,
        education: user.resumeData.education,
        experience: user.resumeData.experience,
        resumeScore: user.resumeScore,
        missingSkills: user.missingSkills,
        suggestions: user.resumeSuggestions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: {
        resumeUrl: user.resumeUrl,
        resumeData: user.resumeData,
        resumeScore: user.resumeScore,
        missingSkills: user.missingSkills,
        suggestions: user.resumeSuggestions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
