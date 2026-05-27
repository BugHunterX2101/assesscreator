import { connectDB } from './src/config/db';
import { generateQuestions } from './src/services/toolkit.service';

const run = async () => {
  try {
    await connectDB();
    const result = await generateQuestions({
      topic: 'AI',
      subject: 'Science',
      grade: '11th Grade',
      questionType: 'Short Answer'
    });
    console.log(result);
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    process.exit(0);
  }
};

run();
