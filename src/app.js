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

  // Load JSON
  useEffect(() => {
    fetch("/projects.json")
      .then(res => res.json())
      .then(data => setProjects(data));

    fetch("/posts.json")
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  // Random homepage image
  useEffect(() => {
    if (!posts.length) return;

    let images = [];
    posts.forEach((post, index) => {
      post.content.forEach(block => {
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
        <div className="header-text">
          <div>OCLIS BALTZ ARCHIVE</div>
          <div>documents collected by G. Baltz</div>
          <div>some records may be incomplete or misplaced</div>
        </div>
      </div>

      {/* Nav */}
      <div className="nav">
        <a onClick={() => setPage("work")}>work</a>
        <a onClick={() => setPage("blog")}>blog</a>
        <a onClick={() => setPage("about")}>about</a>
      </div>

      {/* WORK */}
      {page === "work" && (
        <div>
          {mainImage.src && (
            <div className="main-image" onClick={() => openPost(mainImage.postIndex)}>
              <img src={mainImage.src} alt="main" />
              <div className="caption">{mainImage.caption}</div>
            </div>
          )}

          {projects.map((p, i) => (
            <div key={i} className="project-item">
              <a onClick={() => openProject(p)}>{p.title}</a>
              <div className="note">{p.note}</div>
            </div>
          ))}
        </div>
      )}

      {/* PROJECT PAGE */}
      {page === "project" && activeProject && (
        <div>
          <a className="back" onClick={() => setPage("work")}>← back</a>

          <div className="project-title">{activeProject.title}</div>

          <img
            src={activeProject.images[imageIndex].src}
            alt="project"
            onClick={nextImage}
            className="project-image"
          />

          <div className="caption">
            {activeProject.images[imageIndex].caption}
          </div>

          <div className="image-counter">
            #{imageIndex + 1}/{activeProject.images.length}
          </div>
        </div>
      )}

      {/* BLOG */}
      {page === "blog" && (
        <div>
          {posts.map((p, i) => (
            <div key={i} className="blog-item">
              <a onClick={() => openPost(i)}>{p.title}</a>
              <div className="note">{p.date}</div>
            </div>
          ))}
        </div>
      )}

      {/* POST */}
      {page === "post" && activePost && (
        <div>
          <a className="back" onClick={() => setPage("blog")}>← back</a>

          <div className="note">{activePost.date}</div>
          <div className="post-title">{activePost.title}</div>

          {activePost.content.map((block, i) =>
            block.type === "text" ? (
              <p key={i}>{block.value}</p>
            ) : (
              <div key={i}>
                <img src={block.value} alt="post" className="post-image" />
                <div className="caption">{block.caption}</div>
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
      <div className="footer">
        © {new Date().getFullYear()} — filed by G. Baltz
      </div>

    </div>
  );
}