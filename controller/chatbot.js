const axios = require('axios');
const natural = require('natural');
const { Configuration, OpenAIApi } = require('openai');
const router = require('express').Router();
require('dotenv').config();

// Create a new OpenAI API client with your API key
const configuration = new Configuration({
     apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Set up a route to handle POST requests to the server
router.post('/', async (req, res) => {
     // Extract the prompt from the request body
     const {message}= req.body;
     // Call the OpenAI API to generate a response
     const completion = await openai.createCompletion({
          model: 'text-davinci-002', // specify the model to use
          prompt:message,
          max_tokens: 2048, // limit the response to 200 tokens
     });

     // Send the response text back to the client
     res.send(completion.data.choices[0].text);

});

module.exports = router;


