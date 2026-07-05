import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

let genAI = null;
let openai = null;

const initGemini = () => {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const initOpenAI = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
};

const parseJSON = (text) => {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const jsonStr = jsonMatch[1] || jsonMatch[0];
    return JSON.parse(jsonStr);
  }
  return JSON.parse(text);
};

export const generateAIResponse = async (prompt, jsonMode = false) => {
  try {
    const gemini = initGemini();
    if (gemini) {
      const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const model = gemini.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(
        jsonMode ? `${prompt}\n\nRespond ONLY with valid JSON, no markdown.` : prompt
      );
      const text = result.response.text();
      return jsonMode ? parseJSON(text) : text;
    }
  } catch (error) {
    console.error('Gemini API error:', error.message);
  }

  try {
    const client = initOpenAI();
    if (client) {
      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });
      const text = response.choices[0].message.content;
      return jsonMode ? parseJSON(text) : text;
    }
  } catch (error) {
    console.error('OpenAI API error:', error.message);
  }

  throw new Error('No AI service available. Configure GEMINI_API_KEY or OPENAI_API_KEY.');
};

export const generateQuestions = async ({ skills, domain, difficulty, type, count, resumeData }) => {
  const prompt = `Generate ${count} unique ${type} interview questions for a candidate.
Domain: ${domain}
Difficulty: ${difficulty}
Skills: ${skills?.join(', ') || 'General'}
Resume Skills: ${resumeData?.skills?.join(', ') || 'N/A'}
Projects: ${resumeData?.projects?.join(', ') || 'N/A'}

Return JSON array with format:
[{"question": "question text", "category": "technical/hr"}]

Questions must be unique, match difficulty level, and be relevant to skills.`;

  const result = await generateAIResponse(prompt, true);
  return Array.isArray(result) ? result : result.questions || [];
};

export const evaluateAnswer = async (question, answer, domain, difficulty) => {
  const prompt = `Evaluate this interview answer.

Question: ${question}
Answer: ${answer}
Domain: ${domain}
Difficulty: ${difficulty}

Return JSON:
{
  "score": 0-100,
  "communication": 0-10,
  "technicalAccuracy": 0-10,
  "confidence": 0-10,
  "problemSolving": 0-10,
  "completeness": 0-10,
  "strengths": ["strength1"],
  "weaknesses": ["weakness1"],
  "improvements": ["improvement1"],
  "feedback": "detailed feedback"
}`;

  return generateAIResponse(prompt, true);
};

export const analyzeResume = async (resumeText) => {
  const prompt = `Analyze this resume text and extract structured information.

Resume:
${resumeText}

Return JSON:
{
  "skills": ["skill1"],
  "technologies": ["tech1"],
  "projects": ["project description"],
  "education": ["degree info"],
  "experience": ["job experience"],
  "resumeScore": 0-100,
  "missingSkills": ["skill to learn"],
  "suggestions": ["improvement suggestion"]
}`;

  return generateAIResponse(prompt, true);
};

export const generateFinalReport = async (interviewData) => {
  const prompt = `Generate a comprehensive interview report based on this data:

${JSON.stringify(interviewData, null, 2)}

Return JSON:
{
  "performanceSummary": "summary text",
  "strengths": ["strength1"],
  "weaknesses": ["weakness1"],
  "suggestions": ["suggestion1"],
  "recommendedTopics": ["topic1"],
  "learningPath": ["step1"]
}`;

  return generateAIResponse(prompt, true);
};

export const generateCareerRecommendations = async (userData) => {
  const prompt = `Based on this candidate profile, provide career recommendations:

${JSON.stringify(userData, null, 2)}

Return JSON:
{
  "suitableRoles": ["role1"],
  "missingSkills": ["skill1"],
  "learningResources": ["resource1"],
  "readinessPercentage": 0-100,
  "personalizedPlan": ["step1"]
}`;

  return generateAIResponse(prompt, true);
};

export const generateDailyChallenge = async () => {
  const prompt = `Generate one technical interview question for today's daily challenge.

Return JSON:
{
  "question": "question text",
  "hint": "helpful hint",
  "solution": "detailed solution",
  "domain": "DSA",
  "difficulty": "Medium"
}`;

  return generateAIResponse(prompt, true);
};

export const chatAssistant = async (message, history = []) => {
  const context = history.map((m) => `${m.role}: ${m.content}`).join('\n');
  const prompt = `You are InterviewAce AI assistant. Help with interview preparation, career guidance, technical concepts, and resume tips.

Previous conversation:
${context}

User: ${message}

Provide helpful, concise response.`;

  return generateAIResponse(prompt, false);
};
