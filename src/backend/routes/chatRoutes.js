import express from 'express';
import axios from 'axios';

const router = express.Router();

// The URL of your Python Flask AI backend (now on port 5001)
const flaskApiUrl = 'http://localhost:5001/ask';

/**
 * @route   POST /api/chat
 * @desc    Forward a query to the Python AI backend
 * @access  Public (or add your auth middleware)
 */
router.post('/', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Forward the query to the Flask service
    const flaskResponse = await axios.post(flaskApiUrl, { query });

    // Return the AI's answer to the client
    res.json(flaskResponse.data);
  } catch (error) {
    console.error('Error calling Python AI service:', error.message);
    res.status(500).json({ error: 'Failed to get a response from the AI service.' });
  }
});

export default router;