import React, { useState, useEffect } from "react";
import projectsData from "./projects.json";
import postsData from "./posts.json";

export default function App() {
  const [page, setPage] = useState("work");
  const [activeProject, setActiveProject] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [mainImage, setMainImage] = useState({ src: "", caption: "", postIndex: 0 });

  const [projects, setProjects] = useState(projectsData);
  const [posts, setPosts] = useState(postsData);

  useEffect(() => {
    let imagesWithPosts = [];
    posts.forEach((post, index) => {
      post.content.forEach((block) => {
        if (block.type === "image") imagesWithPosts.push({ src: block.value, caption: block.caption, postIndex: index });
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
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#eae7df", fontFamily: "Courier New, monospace" }}>
      <div style={{ width: "1000px", background: "#fdfbf7", border: "1px solid black", position: "relative" }}>

        {/* Header */}
        <div style={{ padding: "24px", borderBottom: "1px dashed black" }}>
          <div style={{ fontSize: "13px", letterSpacing: "2px" }}>OCLIS BALTZ ARCHIVE</div>
          <div style={{ fontSize: "11px" }}>documents collected by G. Baltz</div>
          <div style={{ fontSize: "12px", marginTop: "10px" }}>some records may be incomplete or misplaced</div>
        </div>

        {/* Nav */}
        <div style={{ padding: "10px 24px", borderBottom: "1px dashed black", fontSize: "12px" }}>
          <a href="#" onClick={() => setPage("work")}>work</a> {" "}
          <a href="#" onClick={() => setPage("blog")}>blog</a> {" "}
          <a href="#" onClick={() => setPage("about")}>about</a>
        </div>

        {/* WORK / Main Page */}
        {page === "work" && (
          <div style={{ padding: "24px" }}>
            {mainImage.src && (
              <div style={{ cursor: "pointer", marginBottom: "20px" }} onClick={() => openPost(mainImage.postIndex)}>
                <img src={mainImage.src} style={{ width: "100%", border: "1px solid black", transition: "opacity 0.4s" }} />
                <div style={{ fontSize: "12px", color: "red", textAlign: "right", marginTop: "6px" }}>
                  {mainImage.caption}
                </div>
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

            <div>
              <img
                src={activeProject.images[imageIndex].src}
                onClick={nextImage}
                style={{ width: "100%", border: "1px solid black", cursor: "pointer", transition: "opacity 0.4s" }}
              />
              <div style={{ textAlign: "right", fontSize: "12px", color: "red", marginTop: "6px" }}>
                {activeProject.images[imageIndex].caption}
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
              {activeProject.images.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  onClick={() => setImageIndex(i)}
                  style={{ width: "60px", border: "1px solid black", cursor: "pointer" }}
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

        {/* POST PAGE */}
        {page === "post" && activePost && (
          <div style={{ padding: "24px" }}>
            <a href="#" onClick={() => setPage("blog")}>← back</a>
            <div style={{ marginTop: "10px", fontSize: "11px" }}>{activePost.date}</div>
            <div style={{ marginBottom: "10px" }}>{activePost.title}</div>

            {activePost.content.map((block, i) => (
              block.type === "text" ? (
                <p key={i} style={{ marginBottom: "12px" }}>{block.value}</p>
              ) : (
                <div key={i}>
                  <img src={block.value} style={{ width: "100%", marginBottom: "6px", border: "1px solid black" }} />
                  <div style={{ fontSize: "12px", color: "red", textAlign: "right", marginBottom: "12px" }}>
                    {block.caption}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* ABOUT */}
        {page === "about" && (
          <div style={{ padding: "24px" }}>
            <p>Grigory Baltz is believed to have compiled these materials.</p>
          </div>
        )}

        <div style={{ padding: "10px", borderTop: "1px dashed black", fontSize: "11px", textAlign: "center" }}>
          © {new Date().getFullYear()} — filed by G. Baltz
        </div>
      </div>

      <style>{`
        a { color: blue; }
        a:hover { color: red; }
      `}</style>
    </div>
  );
}