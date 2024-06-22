import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

// Constants used for calls
const userId = "jeremy_cook1";
const BASE_URL = `https://take-home-assessment-423502.uc.r.appspot.com/api`;

// GET request for specific users videos
app.get(`/getvideos/${userId}`, async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/videos?user_id=${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "An error occurred while fetching videos" });
  }
});

// POST request for adding a comment to a video
app.post("/comments", async (req, res) => {
  try {
    const { video_id, content, user_id } = req.body;

    if (!video_id || !content || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await fetch(`${BASE_URL}/videos/comments`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ video_id, content, user_id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error posting comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while posting the comment" });
  }
});

// GET request to retrieve all comments for a specific video
app.get("/comments/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const response = await fetch(
      `${BASE_URL}/videos/comments?video_id=${videoId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching comments" });
  }
});

// POST request to create a video object
app.post("/create", async (req, res) => {
  const { user_id, description, video_url, title } = req.body;
  try {
    const response = await fetch(`${BASE_URL}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, description, video_url, title }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error creating video:", error);
    res.status(500).json({ error: "An error occurred while creating a video" });
  }
});

// Server setup
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
