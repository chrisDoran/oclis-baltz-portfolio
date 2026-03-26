import React, { useState, useEffect } from "react";

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
    setImageIndex((prev) => (prev + 1) % activeProject.images.length);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <img src="/images/logo.png" alt="Logo" className="logo" />
        <div>
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

      {/* Work / Main Page */}
      {page === "work" && (
        <div>
          {mainImage.src && (
            <div style={{ cursor: "pointer", marginBottom: "20px" }} onClick={() => openPost(mainImage.postIndex)}>
              <img src={mainImage.src} alt={mainImage.caption} />
              <div style={{ fontSize: "12px", color: "red", textAlign: "right", marginTop: "6px" }}>
                {mainImage.caption}
              </div>
            </div>
          )}

          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: "20px", cursor: "pointer" }} onClick={() => openProject(p)}>
              <div style={{ fontWeight: "bold", textDecoration: "underline" }}>{p.title}</div>
              <div style={{ fontSize: "11px" }}>{p.note}</div>
            </div>
          ))}
        </div>
      )}

      {/* Project Page */}
      {page === "project" && activeProject && (
        <div>
          <a onClick={() => setPage("work")}>← back</a>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>{activeProject.title}</div>
          <div>
            <img
              src={activeProject.images[imageIndex].src}
              alt={activeProject.images[imageIndex].caption}
              onClick={nextImage}
            />
            <div style={{ textAlign: "center", fontSize: "12px", color: "red", marginTop: "6px" }}>
              {activeProject.images[imageIndex].caption}
            </div>
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

      {/* Blog */}
      {page === "blog" && (
        <div>
          {posts.map((p, i) => (
            <div key={i} style={{ marginBottom: "14px", cursor: "pointer" }} onClick={() => openPost(i)}>
              <div style={{ fontSize: "11px" }}>{p.date}</div>
              <div>{p.title}</div>
            </div>
          ))}
        </div>
      )}

      {/* Post Page */}
      {page === "post" && activePost && (
        <div>
          <a onClick={() => setPage("blog")}>← back</a>
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

      {/* About */}
      {page === "about" && (
        <div>
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