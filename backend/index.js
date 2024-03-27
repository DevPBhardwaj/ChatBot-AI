import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your React app's origin
}));

// OpenAI Configuration
const configuration = new Configuration({
  organization: "org-JMAhtwl2LieReTwSKlZt4tZd",
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Chatbot API
app.post("/", async (request, response) => {
  const { chats } = request.body;

  // Make a completion request to OpenAI
  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a EbereGPT. You can help with graphic design tasks",
      },
      ...chats,
    ],
  });

  // Send back the response
  response.json({
    output: result.data.choices[0].message,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
