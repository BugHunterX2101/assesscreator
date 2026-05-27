import { callLLM } from '../workers/llm.service';
import LibraryItem from '../models/LibraryItem';

export const generateQuestions = async (data: any) => {
  const prompt = `Topic: ${data.topic}\nSubject: ${data.subject}\nGrade: ${data.grade}\nQuestion Type: ${data.questionType}\nGenerate a set of educational questions.`;
  const system = `You are an expert educator. Generate ONLY valid JSON in the format: { "title": "string", "questions": [ { "text": "...", "answer": "..." } ] }`;
  const result = await callLLM(system, prompt);
  const parsed = JSON.parse(result);
  
  const item = new LibraryItem({
    title: parsed.title || `${data.topic} Questions`,
    type: 'Quiz',
    content: parsed
  });
  await item.save();
  return item;
};

export const generateRubric = async (data: any) => {
  const prompt = `Assignment: ${data.assignmentDescription}\nTotal Marks: ${data.totalMarks}\nScale: ${data.gradingScale}\nGenerate a grading rubric.`;
  const system = `You are an expert educator. Generate ONLY valid JSON in the format: { "title": "string", "criteria": [ { "name": "...", "points": number, "description": "..." } ] }`;
  const result = await callLLM(system, prompt);
  const parsed = JSON.parse(result);

  const item = new LibraryItem({
    title: parsed.title || `Rubric`,
    type: 'Template',
    content: parsed
  });
  await item.save();
  return item;
};

export const gradeEssay = async (data: any) => {
  const prompt = `Essay: ${data.essay}\nPrompt/Rubric: ${data.promptText}\nEvaluate the essay based on the rubric/prompt.`;
  const system = `You are an expert educator. Generate ONLY valid JSON in the format: { "score": number, "feedback": "detailed feedback string", "strengths": ["..."], "improvements": ["..."] }`;
  const result = await callLLM(system, prompt);
  const parsed = JSON.parse(result);

  const item = new LibraryItem({
    title: `Essay Feedback`,
    type: 'Assessment',
    content: parsed
  });
  await item.save();
  return item;
};

export const generateLessonPlan = async (data: any) => {
  const prompt = `Topic: ${data.topic}\nSubject: ${data.subject}\nGrade: ${data.grade}\nDuration: ${data.duration}\nGenerate a structured lesson plan.`;
  const system = `You are an expert educator. Generate ONLY valid JSON in the format: { "title": "...", "objectives": ["..."], "materials": ["..."], "activities": [ { "time": "...", "description": "..." } ] }`;
  const result = await callLLM(system, prompt);
  const parsed = JSON.parse(result);

  const item = new LibraryItem({
    title: parsed.title || `${data.topic} Lesson Plan`,
    type: 'Template',
    content: parsed
  });
  await item.save();
  return item;
};
