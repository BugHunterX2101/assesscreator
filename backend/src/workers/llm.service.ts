import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { AssignmentFormData } from '@vedaai/shared';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const buildSystemPrompt = () => `
You are an expert educator. Generate a structured question paper in JSON format only.
Return ONLY a valid JSON object matching this exact schema. No prose, no markdown, no explanation:
{
  "title": "string",
  "subject": "string",
  "grade": "string",
  "totalMarks": number,
  "sections": [
    {
      "id": "A",
      "title": "Section A — Multiple Choice Questions",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "number": 1,
          "text": "Question text here",
          "type": "MCQ",
          "difficulty": "easy | medium | hard",
          "marks": 2
        }
      ]
    }
  ]
}
`;

export const generatePrompt = (form: AssignmentFormData, referenceText?: string, feedback?: string) => {
  let prompt = `Assignment Details:\n`;
  prompt += `- Title: ${form.title}\n`;
  prompt += `- Subject: ${form.subject}\n`;
  prompt += `- Topic: ${form.topic}\n`;
  prompt += `- Grade: ${form.grade}\n`;
  if (form.instructions) {
    prompt += `- Additional Instructions: ${form.instructions}\n`;
  }

  prompt += `\nQuestion Configuration:\n`;
  form.questionTypes.forEach(qt => {
    prompt += `- ${qt.type}: ${qt.count} questions, ${qt.marksEach} marks each\n`;
  });

  prompt += `\nDifficulty Distribution:\n`;
  prompt += `- Easy: ${form.difficulty.easy}%\n`;
  prompt += `- Medium: ${form.difficulty.medium}%\n`;
  prompt += `- Hard: ${form.difficulty.hard}%\n`;

  if (referenceText) {
    prompt += `\nReference Material:\n${referenceText.substring(0, 3000)}\n`;
  }

  if (feedback) {
    prompt += `\nFeedback for Regeneration:\n${feedback}\nMake sure to incorporate this feedback in the new generation.\n`;
  }

  return prompt;
};

export const callLLM = async (systemPrompt: string, userPrompt: string) => {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    response_format: { type: "json_object" }
  });

  return completion.choices[0]?.message?.content || "";
};
