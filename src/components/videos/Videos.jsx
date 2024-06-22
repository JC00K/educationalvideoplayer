import { useState, useEffect } from "react";
import Search from "../search/Search";
import Upload from "../upload/Upload";
import "./style.css";
import "../search/style.css";
import FullLogoColor from "../../assets/FULL_LOGO_COLOR.png";

function getYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/getvideos/jeremy_cook1",
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos);
          setFilteredVideos(data.videos);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const fetchComments = async (videoId) => {
    try {
      const response = await fetch(`http://localhost:5000/comments/${videoId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_id: selectedVideo.id,
          content: newComment,
          user_id: "jeremy_cook1",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments((prevComments) => [...prevComments, data]);
        setNewComment("");
        fetchComments(selectedVideo.id);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setComments([]);
    setNewComment("");
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    fetchComments(video.id);
  };

  const toggleUpload = () => {
    setShowUpload(!showUpload);
  };

  const handleSearch = (searchTerm) => {
    const filtered = videos.filter((video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filtered);
  };

  return (
    <div className="video-page">
      <header className="header">
        <div className="header-left">
          <Search onSearch={handleSearch} />
        </div>
        <div className="header-center">
          <img src={FullLogoColor} alt="LearnWell" className="header-logo" />
        </div>
        <div className="header-right">
          <button className="upload-button" onClick={toggleUpload}>
            Upload
          </button>
        </div>
      </header>
      <div className="video-page-container">
        <div className="video-grid">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => {
              const youtubeId = getYouTubeId(video.video_url);
              return (
                <div
                  key={index}
                  className="video-card"
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="video-thumbnail">
                    <img
                      src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                    />
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-meta">
                      {video.user_id} •{" "}
                      {new Date(video.created_at).toLocaleDateString()}
                    </p>
                    <p className="video-comments">
                      {video.num_comments} comments
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-videos">No videos available</p>
          )}
        </div>
        {selectedVideo && (
          <div className="video-player-modal" onClick={handleCloseModal}>
            <div
              className="video-player-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-button" onClick={handleCloseModal}>
                &times;
              </button>
              <div className="video-player-container">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(
                    selectedVideo.video_url
                  )}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                ></iframe>
              </div>
              <h3 className="video-title">{selectedVideo.title}</h3>
              <p className="video-meta">
                {selectedVideo.user_id} •{" "}
                {new Date(selectedVideo.created_at).toLocaleDateString()}
              </p>
              <div className="video-comments-section">
                <h4>Comments ({comments.length})</h4>
                {comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <p className="comment-author">{comment.user_id}</p>
                    <p className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                ))}
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    required
                  />
                  <button type="submit">Post Comment</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      {showUpload && <Upload />}
    </div>
  );
};

export default Videos;
