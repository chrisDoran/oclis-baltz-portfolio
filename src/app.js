import React, { useState, useEffect } from "react";

import logo from "/Logo.png";

function App() {
  const [page, setPage] = useState("main");
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    fetch("/projects.json")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error loading projects.json", err));

    fetch("/posts.json")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error loading posts.json", err));
  }, []);

  const nextImage = () => {
    if (!activeProject) return;
    setImageIndex((prev) => (prev + 1) % activeProject.images.length);
  };

  return (
    <div className="container">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <div>
          <div>OCLIS BALTZ ARCHIVE</div>
          <div style={{ fontSize: "12px" }}>documents collected by G. Baltz</div>
          <div style={{ fontSize: "12px" }}>some records may be incomplete or misplaced</div>
        </div>
      </div>

      <div className="nav">
        <a onClick={() => setPage("main")}>Home</a>
        <a onClick={() => setPage("work")}>Work / Projects</a>
        <a onClick={() => setPage("blog")}>Blog</a>
      </div>

      {/* Main Page */}
      {page === "main" && <div>Welcome to the archive.</div>}

      {/* Projects List */}
      {page === "work" && (
        <div>
          {projects.map((p, i) => (
            <div key={i}>
              <a
                style={{ color: "blue" }}
                onClick={() => {
                  setActiveProject(p);
                  setImageIndex(0);
                  setPage("project");
                }}
              >
                {p.title}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Single Project Page */}
      {page === "project" && activeProject && (
        <div>
          <a className="back-link" onClick={() => setPage("work")}>
            ← back
          </a>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>{activeProject.title}</div>
          <div>
            <img
              src={activeProject.images[imageIndex].src}
              alt={activeProject.images[imageIndex].caption}
              onClick={nextImage}
            />
            <div className="project-caption">{activeProject.images[imageIndex].caption}</div>
          </div>

          <div className="dots">
            {activeProject.images.map((_, i) => (
              <div
                key={i}
                className={`dot ${i === imageIndex ? "active" : ""}`}
                onClick={() => setImageIndex(i)}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Blog List */}
      {page === "blog" && (
        <div>
          {posts.map((post, i) => (
            <div key={i}>
              <a
                style={{ color: "blue" }}
                onClick={() => {
                  setActivePost(post);
                  setPage("post");
                }}
              >
                {post.title}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Single Blog Post */}
      {page === "post" && activePost && (
        <div>
          <a className="back-link" onClick={() => setPage("blog")}>
            ← back
          </a>
          <div style={{ marginTop: "10px", fontSize: "11px" }}>{activePost.date}</div>
          <div style={{ marginBottom: "10px" }}>{activePost.title}</div>
          {activePost.content.map((block, i) =>
            block.type === "text" ? (
              <p key={i} style={{ marginBottom: "12px" }}>
                {block.value}
              </p>
            ) : (
              <div key={i}>
                <img src={block.value} alt={block.caption} />
                <div className="post-caption">{block.caption}</div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default App;