import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/projects.json").then(res => res.json()).then(setProjects);
    fetch("/posts.json").then(res => res.json()).then(setPosts);
  }, []);

  return (
    <>
      <Header />

      <div className="container">
        <Routes>
          <Route path="/" element={<Work projects={projects} posts={posts} />} />
          <Route path="/project/:id" element={<Project projects={projects} />} />
          <Route path="/blog" element={<Blog posts={posts} />} />
          <Route path="/blog/:id" element={<BlogPost posts={posts} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

function Header() {
  return (
    <div className="header">
      <img src="/images/logo1.png" alt="" className="logo" />

      <div>
        <div>OCLIS BALTZ ARCHIVE</div>
        <div className="sub">documents collected by G. Baltz</div>
        <div className="sub">some records may be incomplete or misplaced</div>
      </div>

      <nav>
        <Link to="/">Work</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/about">About</Link>
      </nav>

      <div className="divider"></div>
    </div>
  );
}

function Work({ projects, posts }) {
  const randomPost = posts[Math.floor(Math.random() * posts.length)];

  const featuredImage =
    randomPost?.blocks?.find(b => b.type === "image");

  return (
    <div>
      {featuredImage && (
        <Link to={`/blog/${randomPost.id}`}>
          <img src={featuredImage.src} className="featured" alt="" />
        </Link>
      )}

      <div className="project-list">
        {projects.map(p => (
          <div key={p.id}>
            <Link to={`/project/${p.id}`}>{p.title}</Link>
            <div className="note">{p.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Project({ projects }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  const [index, setIndex] = useState(0);
  const [currentSrc, setCurrentSrc] = useState("");
  const [nextSrc, setNextSrc] = useState("");
  const [loaded, setLoaded] = useState(false);

  if (!project) return null;

  const currentImage = project.images[index];

  // PRELOAD CURRENT IMAGE
  useEffect(() => {
    if (!currentImage) return;

    const img = new Image();
    img.src = currentImage.src;

    img.onload = () => {
      setNextSrc(currentImage.src);
      setLoaded(true);
    };
  }, [index, currentImage]);

  // SWAP IMAGES AFTER LOAD
  useEffect(() => {
    if (loaded) {
      setCurrentSrc(nextSrc);
      setLoaded(false);
    }
  }, [loaded, nextSrc]);

  // PRELOAD NEXT IMAGE AHEAD OF TIME (NEW)
  useEffect(() => {
    if (!project) return;

    const nextIndex = (index + 1) % project.images.length;
    const img = new Image();
    img.src = project.images[nextIndex].src;
  }, [index, project]);

  const nextImage = () => {
    setIndex(prev => (prev + 1) % project.images.length);
  };

  return (
    <div>
      <div className="back" onClick={() => navigate(-1)}>← back</div>

      <div className="image-wrapper" onClick={nextImage}>
        {currentSrc && (
          <img src={currentSrc} className="image active" alt="" />
        )}

        {nextSrc && nextSrc !== currentSrc && (
          <img src={nextSrc} className="image fade-in" alt="" />
        )}
      </div>

      <div className="meta">
        <div>#{index + 1}/{project.images.length}</div>
        <div>{currentImage.caption}</div>
      </div>
    </div>
  );
}

function Blog({ posts }) {
  return (
    <div>
      {posts.map(p => (
        <div key={p.id}>
          <Link to={`/blog/${p.id}`}>{p.title}</Link>
          <div className="note">{p.date}</div>
        </div>
      ))}
    </div>
  );
}

function BlogPost({ posts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(p => p.id === id);

  if (!post) return null;

  return (
    <div>
      <div className="back" onClick={() => navigate(-1)}>← back</div>

      <h1>{post.title}</h1>
      <div className="note">{post.date}</div>

      {post.blocks.map((b, i) => {
        if (b.type === "text") return <p key={i}>{b.content}</p>;

        if (b.type === "image") {
          return (
            <div key={i}>
              <img src={b.src} alt="" />
              <div className="note">{b.caption}</div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

function About() {
  return <div>About page</div>;
}