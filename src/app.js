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
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error loading projects.json", err));

    fetch("/posts.json")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error loading posts.json", err));
  }, []);

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
    setImageIndex((prev) => (prev + 1) % activeProject.images.length);
  };

  return (
    <div className="site-container">
      {/* Header */}
      <div style={{ padding: "24px", borderBottom: "1px dashed black" }}>
        <div style={{ fontSize: "13px", letterSpacing: "2px" }}>OCLIS BALTZ ARCHIVE</div>
        <div style={{ fontSize: "11px" }}>documents collected by G. Baltz</div>
        <div style={{ fontSize: "12px", marginTop: "10px" }}>some records may be incomplete or misplaced</div>
      </div>

      {/* Nav */}
      <div style={{ padding: "10px 24px", borderBottom: "1px dashed black", fontSize: "12px" }}>
        <a href="#" onClick={() => setPage("work")}>work</a>
        <a href="#" onClick={() => setPage("blog")}>blog</a>
        <a href="#" onClick={() => setPage("about")}>about</a>
      </div>

      {/* WORK */}
      {page === "work" && (
        <div style={{ padding: "24px" }}>
          {mainImage.src && (
            <div className="home-main-image" onClick={() => openPost(mainImage.postIndex)}>
              <img src={mainImage.src} alt={mainImage.caption} />
              <div className="caption">{mainImage.caption}</div>
            </div>
          )}

          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: "20px" }}>
              <div onClick={() => openProject(p)} style={{ cursor: "pointer" }}>{p.title}</div>
              <div style={{ fontSize: "11px" }}>{p.note}</div>
            </div>
          ))}
        </div>
      )}

      {/* PROJECT PAGE */}
      {page === "project" && activeProject && (
        <div style={{ padding: "24px" }}>
          <a href="#" onClick={() => setPage("work")}>← back</a>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>{activeProject.title}</div>

          <div className="project-main-image">
            <img
              src={activeProject.images[imageIndex].src}
              onClick={nextImage}
              alt={activeProject.images[imageIndex].caption}
            />
            <div style={{ textAlign: "right", fontSize: "12px", color: "red", marginTop: "6px" }}>
              {activeProject.images[imageIndex].caption}
            </div>
          </div>

          <div className="project-thumbnails">
            {activeProject.images.map((img, i) => (
              <img
                key={i}
                src={img.src}
                onClick={() => setImageIndex(i)}
                alt={img.caption}
              />
            ))}
          </div>
        </div>
      )}

      {/* BLOG */}
      {page === "blog" && (
        <div style={{ padding: "24px" }}>
          {posts.map((p, i) => (
            <div key={i} style={{ marginBottom: "14px" }} onClick={() => openPost(i)}>
              <div style={{ fontSize: "11px" }}>{p.date}</div>
              <div>{p.title}</div>
            </div>
          ))}
        </div>
      )}

      {/* POST */}
      {page === "post" && activePost && (
        <div style={{ padding: "24px" }}>
          <a href="#" onClick={() => setPage("blog")}>← back</a>
          <div style={{ marginTop: "10px", fontSize: "11px" }}>{activePost.date}</div>
          <div style={{ marginBottom: "10px" }}>{activePost.title}</div>
          {activePost.content.map((block, i) =>
            block.type === "text" ? (
              <p key={i} style={{ marginBottom: "12px" }}>{block.value}</p>
            ) : (
              <div key={i}>
                <img src={block.value} alt={block.caption} />
                <div style={{ fontSize: "12px", color: "red", textAlign: "right", marginBottom: "12px" }}>
                  {block.caption}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ABOUT */}
      {page === "about" && (
        <div style={{ padding: "24px" }}>
          <p>Grigory Baltz is believed to have compiled these materials.</p>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "10px", borderTop: "1px dashed black", fontSize: "11px", textAlign: "center" }}>
        © {new Date().getFullYear()} — filed by G. Baltz
      </div>
    </div>
  );
}