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
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error loading projects.json", err));

    fetch("/posts.json")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error loading posts.json", err));
  }, []);

  // Set a random main page image from posts
  useEffect(() => {
    if (!posts.length) return;
    let imagesWithPosts = [];
    posts.forEach((post, index) => {
      post.content.forEach((block) => {
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
    if (!activeProject) return;
    setImageIndex((prev) => (prev + 1) % activeProject.images.length);
  };

  return (
    <div className="app-container">
      <div className="site-container">
        {/* Header */}
        <div className="header">
          <img src="/logo-placeholder.png" alt="Logo" className="logo" />
          <div>
            <div className="header-title">OCLIS BALTZ ARCHIVE</div>
            <div className="header-subtitle">documents collected by G. Baltz</div>
            <div className="header-note">some records may be incomplete or misplaced</div>
          </div>
        </div>

        {/* Nav */}
        <div className="nav">
          <button onClick={() => setPage("work")}>work</button>
          <button onClick={() => setPage("blog")}>blog</button>
          <button onClick={() => setPage("about")}>about</button>
        </div>

        {/* WORK / Main Page */}
        {page === "work" && (
          <div className="page-content">
            {mainImage.src && (
              <div className="main-image-container" onClick={() => openPost(mainImage.postIndex)}>
                <img src={mainImage.src} alt={mainImage.caption} className="main-image" />
                {mainImage.caption && <div className="image-caption">{mainImage.caption}</div>}
              </div>
            )}

            <div className="projects-list">
              {projects.map((p, i) => (
                <div key={i} className="project-entry" onClick={() => openProject(p)}>
                  <div className="project-title">{p.title}</div>
                  <div className="project-note">{p.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECT PAGE */}
        {page === "project" && activeProject && (
          <div className="page-content">
            <button className="back-button" onClick={() => setPage("work")}>← back</button>
            <div className="project-main-title">{activeProject.title}</div>

            <div className="project-main-image-container" onClick={nextImage}>
              <img
                src={activeProject.images[imageIndex].src}
                alt={activeProject.images[imageIndex].caption}
                className="project-main-image"
              />
              <div className="image-caption">{activeProject.images[imageIndex].caption}</div>
            </div>

            <div className="project-thumbnails">
              {activeProject.images.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={img.caption}
                  className={`thumbnail ${i === imageIndex ? "active-thumbnail" : ""}`}
                  onClick={() => setImageIndex(i)}
                />
              ))}
            </div>
          </div>
        )}

        {/* BLOG */}
        {page === "blog" && (
          <div className="page-content">
            {posts.map((p, i) => (
              <div key={i} className="blog-entry" onClick={() => openPost(i)}>
                <div className="blog-date">{p.date}</div>
                <div className="blog-title">{p.title}</div>
              </div>
            ))}
          </div>
        )}

        {/* POST PAGE */}
        {page === "post" && activePost && (
          <div className="page-content">
            <button className="back-button" onClick={() => setPage("blog")}>← back</button>
            <div className="blog-date">{activePost.date}</div>
            <div className="blog-title">{activePost.title}</div>

            {activePost.content.map((block, i) =>
              block.type === "text" ? (
                <p key={i} className="blog-text">{block.value}</p>
              ) : (
                <div key={i} className="post-image-container">
                  <img src={block.value} alt={block.caption} className="post-image" />
                  {block.caption && <div className="image-caption">{block.caption}</div>}
                </div>
              )
            )}
          </div>
        )}

        {/* ABOUT */}
        {page === "about" && (
          <div className="page-content">
            <p>Grigory Baltz is believed to have compiled these materials.</p>
          </div>
        )}

        <div className="footer">
          © {new Date().getFullYear()} — filed by G. Baltz
        </div>
      </div>
    </div>
  );
}