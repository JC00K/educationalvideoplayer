import { useState } from "react";
import "./style.css";

const Upload = () => {
  // Title, URL, Description all required fields for new video object
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");


  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          video_url: url,
          description,
          user_id: "jeremy_cook1",
        }),
      });

      if (response.ok) {
        console.log("Video uploaded successfully");
        setTitle("");
        setUrl("");
        setDescription("");
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="upload-component">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Upload Video</button>
      </form>
    </div>
  );
};

export default Upload;
