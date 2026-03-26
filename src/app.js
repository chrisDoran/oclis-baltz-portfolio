import React, { useState, useEffect } from "react";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("work");
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [mainImage, setMainImage] = useState({ src: "", caption: "", postIndex: 0 });

  // Load JSON from public folder
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

  // Random homepage image from blog
  useEffect(() => {
    if (!posts.length) return;

    let images = [];
    posts.forEach((post, index) => {
      post.content.forEach((block) => {
        if (block.type === "image") {
          images.push({
            src: block.value,
            caption: block.caption,
            postIndex: index
          });
        }
      });
    });

    if (images.length) {
      const random = images[Math.floor(Math.random() * images.length)];
      setMainImage(random);
    }
  }, [posts]);

  const openProject = (proj) => {
    setActiveProject(proj);
    setImageIndex(0);
    setPage("project");
  };

  const openPost = (index) => {
    setActivePost(posts[index]);
    setPage("post");
  };

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % activeProject.images.length);
  };

  return (
    <div className="container">

      {/* Header */}
      <div className="header">
        <img src="/images/logo.png" alt="Logo" className="logo" />
        <div>
          <div>OCLIS BALTZ ARCHIVE</div>
          <div style={{ fontSize: "12px" }}>documents collected by G. Baltz</div>
          <div style={{ fontSize: "12px" }}>some records may be incomplete or misplaced</div>
        </div>
      </div>

      {/* Nav */}
      <div className="nav">
        <a onClick={() => setPage("work")}>work</a>
        <a onClick={() => setPage("blog")}>blog</a>
        <a onClick={() => setPage("about")}>about</a>
      </div>

      {/* WORK (Homepage) */}
      {page === "work" && (
        <div>

          {mainImage.src && (
            <div
              style={{ cursor: "pointer", marginBottom: "20px" }}
              onClick={() => openPost(mainImage.postIndex)}
            >
              <img src={mainImage.src} alt="main" />
              <div className="project-caption">{mainImage.caption}</div>
            </div>
          )}

          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: "20px" }}>
              <a
                style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                onClick={() => openProject(p)}
              >
                {p.title}
              </a>
              <div style={{ fontSize: "11px" }}>{p.note}</div>
            </div>
          ))}
        </div>
      )}

      {/* PROJECT PAGE */}
      {page === "project" && activeProject && (
        <div>
          <a className="back-link" onClick={() => setPage("work")}>← back</a>

          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            {activeProject.title}
          </div>

          <img
            src={activeProject.images[imageIndex].src}
            alt="project"
            onClick={nextImage}
            style={{ cursor: "pointer" }}
          />

          <div className="project-caption">
            {activeProject.images[imageIndex].caption}
          </div>

          {/* Dots navigation */}
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

      {/* BLOG LIST */}
      {page === "blog" && (
        <div>
          {posts.map((p, i) => (
            <div key={i} style={{ marginBottom: "14px" }}>
              <a
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => openPost(i)}
              >
                {p.title}
              </a>
              <div style={{ fontSize: "11px" }}>{p.date}</div>
            </div>
          ))}
        </div>
      )}

      {/* BLOG POST */}
      {page === "post" && activePost && (
        <div>
          <a className="back-link" onClick={() => setPage("blog")}>← back</a>

          <div style={{ marginTop: "10px", fontSize: "11px" }}>
            {activePost.date}
          </div>

          <div style={{ marginBottom: "10px" }}>
            {activePost.title}
          </div>

          {activePost.content.map((block, i) =>
            block.type === "text" ? (
              <p key={i} style={{ marginBottom: "12px" }}>
                {block.value}
              </p>
            ) : (
              <div key={i}>
                <img src={block.value} alt="post" />
                <div className="post-caption">{block.caption}</div>
              </div>
            )
          )}
        </div>
      )}

      {/* ABOUT */}
      {page === "about" && (
        <div>
          <p>Grigory Baltz is believed to have compiled these materials.</p>
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: "10px",
        borderTop: "1px dashed black",
        fontSize: "11px",
        textAlign: "center",
        marginTop: "20px"
      }}>
        © {new Date().getFullYear()} — filed by G. Baltz
      </div>

    </div>
  );
}