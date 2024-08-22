import express from 'express';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';
import { client, Budgets, Expenses, Goals, Income } from '../lib/db.js';

const app = express();
app.use(bodyParser.json());

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: 'YOUR_OPENAI_API_KEY',
});
const openai = new OpenAIApi(configuration);

const generateResponse = async (message) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: message,
    max_tokens: 150,
  });
  return response.data.choices[0].text;
};

// Example endpoint to test OpenAI API
app.post('/chatbot', async (req, res) => {
  const userMessage = req.body.message;
  const botResponse = await generateResponse(userMessage);
  res.json({ response: botResponse });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
