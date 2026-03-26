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

  // Fetch JSON files from public folder
  useEffect(() => {
    fetch("/projects.json")
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error loading projects.json", err));

    fetch("/posts.json")
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Error loading posts.json", err));
  }, []);

  // Set a random main page image from posts
  useEffect(() => {
    if (!posts.length) return;
    let imagesWithPosts = [];
    posts.forEach((post, index) => {
      post.content.forEach(block => {
        if (block.type === "image")
          imagesWithPosts.push({ src: block.value, caption: block.caption, postIndex: index });
      });
    });
    if (imagesWithPosts.length) {
      const random = imagesWithPosts[Math.floor(Math.random() * imagesWithPosts.length)];
      setMainImage(random);
    }
  }, [posts]);

  const openProject = (proj) => {
    setActiveProject(proj);
    setImageIndex(0);
    setPage("project");
  };

  const openPost = (postIndex) => {
    setActivePost(posts[postIndex]);
    setPage("post");
  };

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % activeProject.images.length);
  };

  return (
    <div className="app-container">
      <div className="main-wrapper">
        {/* Header */}
        <div className="header">
          <div className="logo"></div>
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

        <div className="page-content">
          {/* WORK / Main Page */}
          {page === "work" && (
            <>
              {mainImage.src && (
                <div className="main-image" onClick={() => openPost(mainImage.postIndex)}>
                  <img src={mainImage.src} alt="main" />
                  <div className="main-image-caption">{mainImage.caption}</div>
                </div>
              )}
              <div className="project-list">
                {projects.map((p, i) => (
                  <div key={i}>
                    <div className="title" onClick={() => openProject(p)}>{p.title}</div>
                    <div className="note">{p.note}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PROJECT PAGE */}
          {page === "project" && activeProject && (
            <>
              <a onClick={() => setPage("work")}>← back</a>
              <div style={{ margin: "10px 0" }}>{activeProject.title}</div>
              <div className="project-main-image">
                <img src={activeProject.images[imageIndex].src} onClick={nextImage} alt="project main" />
                <div className="main-image-caption">{activeProject.images[imageIndex].caption}</div>
              </div>
              <div className="project-thumbnails">
                {activeProject.images.map((img, i) => (
                  <div key={i} className="thumbnail-container" onClick={() => setImageIndex(i)}>
                    <img src={img.src} alt={`thumb ${i}`} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* BLOG */}
          {page === "blog" && posts.map((p, i) => (
            <div key={i} className="blog-post" onClick={() => openPost(i)} style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "11px" }}>{p.date}</div>
              <div>{p.title}</div>
            </div>
          ))}

          {/* POST */}
          {page === "post" && activePost && (
            <>
              <a onClick={() => setPage("blog")}>← back</a>
              <div style={{ margin: "10px 0", fontSize: "11px" }}>{activePost.date}</div>
              <div style={{ marginBottom: "10px" }}>{activePost.title}</div>
              {activePost.content.map((block, i) =>
                block.type === "text" ? (
                  <p key={i} style={{ marginBottom: "12px" }}>{block.value}</p>
                ) : (
                  <div key={i}>
                    <img src={block.value} alt={`post img ${i}`} />
                    <div className="main-image-caption">{block.caption}</div>
                  </div>
                )
              )}
            </>
          )}

          {/* ABOUT */}
          {page === "about" && (
            <div className="about">
              <p>Grigory Baltz is believed to have compiled these materials.</p>
            </div>
          )}
        </div>

        <div className="footer">
          © {new Date().getFullYear()} — filed by G. Baltz
        </div>
      </div>
    </div>
  );
}