import React, { useState, useEffect } from "react";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("work");
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    fetch("/projects.json").then(res => res.json()).then(setProjects);
    fetch("/posts.json").then(res => res.json()).then(setPosts);
  }, []);

  // Restore main image (first blog image)
  const getMainImage = () => {
    if (!posts.length) return null;
    const imgBlock = posts[0].content.find(b => b.type === "image");
    return imgBlock || null;
  };

  const openProject = (proj) => {
    setActiveProject(proj);
    setImageIndex(0);
    setPage("project");
  };

  const openPost = (i) => {
    setActivePost(posts[i]);
    setPage("post");
  };

  // FIXED FADE LOGIC
  const nextImage = () => {
    setFade(false);
    setTimeout(() => {
      setImageIndex((prev) => (prev + 1) % activeProject.images.length);
    }, 150);
  };

  useEffect(() => {
    if (page === "project") {
      setFade(true);
    }
  }, [imageIndex]);

  const mainImage = getMainImage();

  return (
    <>
      {/* HEADER */}
      <div className="header">
        <img src="/images/logo.png" alt="logo" className="logo" />
        <div className="header-text">
          <div>OCLIS BALTZ ARCHIVE</div>
          <div>documents collected by G. Baltz</div>
          <div>some records may be incomplete or misplaced</div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="page">

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
              {mainImage && (
                <div className="main-image" onClick={() => openPost(0)}>
                  <img src={mainImage.value} alt="" />
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
                alt=""
                className={`project-image ${fade ? "fade-in" : "fade-out"}`}
                onClick={nextImage}
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
                    <img src={block.value} alt="" />
                    <div className="caption">{block.caption}</div>
                  </div>
                )
              )}
            </>
          )}

        </div>

        <div className="footer">
          © {new Date().getFullYear()} — filed by G. Baltz
        </div>

      </div>
    </>
  );
}