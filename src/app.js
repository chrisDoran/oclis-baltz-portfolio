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

  useEffect(() => {
    fetch("/projects.json")
      .then(res => res.json())
      .then(data => setProjects(data));

    fetch("/posts.json")
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

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
    <div className="page">

      {/* HEADER */}
      <div className="header">
        <img src="/images/logo.png" alt="logo" className="logo" />

        <div className="header-text">
          <div>OCLIS BALTZ ARCHIVE</div>
          <div>documents collected by G. Baltz</div>
          <div>some records may be incomplete or misplaced</div>
        </div>
      </div>

      {/* NAV */}
      <div className="nav">
        <span onClick={() => setPage("work")}>work</span>
        <span onClick={() => setPage("blog")}>blog</span>
        <span onClick={() => setPage("about")}>about</span>
      </div>

      <div className="content">

        {/* WORK */}
        {page === "work" && (
          <>
            {mainImage.src && (
              <div className="main-image" onClick={() => openPost(mainImage.postIndex)}>
                <img src={mainImage.src} alt="main" />
                <div className="caption">{mainImage.caption}</div>
              </div>
            )}

            {projects.map((p, i) => (
              <div key={i} className="project-item">
                <span className="link" onClick={() => openProject(p)}>
                  {p.title}
                </span>
                <div className="note">{p.note}</div>
              </div>
            ))}
          </>
        )}

        {/* PROJECT */}
        {page === "project" && activeProject && (
          <>
            <span className="link back" onClick={() => setPage("work")}>
              ← back
            </span>

            <div className="project-title">{activeProject.title}</div>

            <img
              src={activeProject.images[imageIndex].src}
              alt="project"
              onClick={nextImage}
              className="project-image"
            />

            <div className="image-meta">
              <div className="image-counter">
                #{imageIndex + 1}/{activeProject.images.length}
              </div>

              <div className="caption">
                {activeProject.images[imageIndex].caption}
              </div>
            </div>
          </>
        )}

        {/* BLOG */}
        {page === "blog" && (
          <>
            {posts.map((p, i) => (
              <div key={i} className="blog-item">
                <span className="link" onClick={() => openPost(i)}>
                  {p.title}
                </span>
                <div className="note">{p.date}</div>
              </div>
            ))}
          </>
        )}

        {/* POST */}
        {page === "post" && activePost && (
          <>
            <span className="link back" onClick={() => setPage("blog")}>
              ← back
            </span>

            <div className="note">{activePost.date}</div>
            <div className="post-title">{activePost.title}</div>

            {activePost.content.map((block, i) =>
              block.type === "text" ? (
                <p key={i}>{block.value}</p>
              ) : (
                <div key={i}>
                  <img src={block.value} alt="post" />
                  <div className="caption">{block.caption}</div>
                </div>
              )
            )}
          </>
        )}

        {/* ABOUT */}
        {page === "about" && (
          <p>Grigory Baltz is believed to have compiled these materials.</p>
        )}

      </div>

      <div className="footer">
        © {new Date().getFullYear()} — filed by G. Baltz
      </div>

    </div>
  );
}