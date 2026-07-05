import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

export const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  if (ext === '.docx' || ext === '.doc') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error('Unsupported file format');
};

export const parseResumeLocally = (text) => {
  const skillsKeywords = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'MongoDB', 'SQL',
    'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'HTML', 'CSS', 'Git',
    'Express', 'Angular', 'Vue', 'C++', 'C#', '.NET', 'Spring', 'Django',
    'Flask', 'Machine Learning', 'AI', 'Data Structures', 'Algorithms',
  ];

  const foundSkills = skillsKeywords.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );

  const lines = text.split('\n').filter((l) => l.trim());
  const education = lines.filter((l) =>
    /university|college|b\.?tech|b\.?e|m\.?tech|degree|bachelor|master/i.test(l)
  );
  const experience = lines.filter((l) =>
    /experience|intern|worked|developer|engineer|company/i.test(l)
  );
  const projects = lines.filter((l) =>
    /project|built|developed|created|implemented/i.test(l)
  );

  return {
    skills: foundSkills,
    technologies: foundSkills,
    projects: projects.slice(0, 5),
    education: education.slice(0, 3),
    experience: experience.slice(0, 5),
  };
};
