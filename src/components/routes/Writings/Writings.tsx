import React, { useEffect, useRef, useState } from "react";
import { createNoise2D } from "simplex-noise";
import Post from "../../../types";
import NavBar from "../../NavBar";
import "../../../assets/styles/writings.css";
import { Link } from "react-router-dom";
import { apiUrl } from "../../../assets/env-var";

const Writings: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 720);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    const fetchLatestPosts = async () => {
      const response = await fetch(apiUrl + "/posts/tag/writing/latest");
      const data = await response.json();
      console.log(data);
      setLatestPosts(data);
    };
    fetchLatestPosts();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawTexture();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        drawTexture();
      }
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const drawTexture = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const baseScale = 0.045;
    const highlightScale = 0.108;
    const brightness = 0.9;
    const highlightIntensity = 4.4;
    const highlightThreshold = 0.57;
    const highlightPower = 2.4;

    const baseNoise = createNoise2D();
    const highlightNoise = createNoise2D();

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    function getFleshColor(value: number): [number, number, number] {
      const v = (value + 1) / 2;
      let color: [number, number, number];
      if (v < 0.25) {
        color = [255, 170, 170];
      } else if (v < 0.5) {
        color = [255, 100, 100];
      } else if (v < 0.75) {
        color = [200, 60, 60];
      } else {
        color = [150, 30, 30];
      }
      return color.map((c) => Math.max(0, Math.min(255, c * brightness))) as [
        number,
        number,
        number,
      ];
    }

    function mix(a: number, b: number, alpha: number): number {
      return a * (1 - alpha) + b * alpha;
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const baseVal = baseNoise(x * baseScale, y * baseScale);
        let [r, g, b] = getFleshColor(baseVal);

        let highlightVal = highlightNoise(
          x * highlightScale,
          y * highlightScale,
        );
        highlightVal = (highlightVal + baseVal) / 2;
        const hv = (highlightVal + 1) / 2;

        if (hv > highlightThreshold) {
          let highlightFactor =
            (hv - highlightThreshold) / (1 - highlightThreshold);
          highlightFactor = Math.pow(highlightFactor, highlightPower);
          highlightFactor *= highlightIntensity;

          const alpha = Math.min(1, highlightFactor);
          const highlightColor: [number, number, number] = [255, 80, 80];
          r = mix(r, highlightColor[0], alpha);
          g = mix(g, highlightColor[1], alpha);
          b = mix(b, highlightColor[2], alpha);
        }

        const idx = (y * width + x) * 4;
        data[idx + 0] = Math.min(255, r);
        data[idx + 1] = Math.min(255, g);
        data[idx + 2] = Math.min(255, b);
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        className="animated-background"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(100, 10, 40, 0.5)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.6) 90%)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <NavBar />
      <div
        className="title-container"
        style={{
          color: "rgba(199, 119, 119, 0.9)",
          fontSize: `${isMobile ? "4rem" : "8rem"}`,
          fontFamily: "Lithops, sans-serif",
          textAlign: "center",
          padding: "20px 0",
          cursor: "default",
        }}
      >
        {Array.from("WRITINGS").map((char, index) => (
          <span
            key={index}
            className="wobble-letter"
            style={
              {
                fontFamily: "Lithops, sans-serif",
                "--char-index": index,
                "--random-x": Math.random() * 2 + 1,
                "--random-y": Math.random() * 2 + 1,
                "--random-duration": `${Math.random() * 1 + 1}s`,
              } as React.CSSProperties
            }
          >
            {char}
          </span>
        ))}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "20px",
          paddingBottom: "100px",
        }}
      >
        <div
          className="flex flex-row flex-wrap pb-8"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "flex-start",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {[
            {
              title: "POETRY",
              imgSrc:
                "https://media.tenor.com/BKNAEquzeXEAAAAi/heart-heartbeat.gif",
              route: "poetry",
              description:
                "Through each contraction a world is shattered, movement is created, flows lose their stasis. As a heart that has been broken many times the blood, in fractal solidarity, becomes more and more corrupted, until everything that is left is a putrid fluid that never stops. The heart moves as a perpetual motion machine, lingering in the deepest abysses of the excesses of reality",
            },
            {
              title: "FICTION",
              imgSrc: "https://i.gifer.com/S6es.gif",
              route: "fiction",
              description:
                "Mainly composed of fat tissue and water, the brain serves as the core of the body, capable of translating spikes of electrical current across its surface and inside into phenomenological experiences, its machinations, whether conscious or unconscious, earn it the title of the great dictator of the body, controling: paralysis, acceleration, synthesis...etc. The ultimate protein based machine with the outermost electrical efficiency, capable of creating entirely new realities.",
            },
            {
              title: "NON FICTION",
              imgSrc:
                "https://animalbiosciences.uoguelph.ca/~swatland/s140.gif",
              route: "non-fiction",
              description:
                "The intestines hold, retract, puke, respond to the vicious whims of the anxious body as they crumble in pain. They extract as much information from what should not be called food at this point to transform it into energy, they are a translator that subtracts, they subtract everything until all that is left is feces. An everlasting transformation that offers the reflection of reality",
            },
          ].map((item, index) => (
            <Link key={index} to={item.route}>
              <div
                key={index}
                className="flex flex-col items-center p-5 px-10 pt-7 rounded-lg section-card"
                style={{
                  backgroundColor: "rgba(40, 10, 20, 0.8)",
                  transition: "background-color 0.3s, transform 0.3s",
                  minHeight: "46rem",
                  maxHeight: "46rem",
                }}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={item.imgSrc}
                    alt={item.title}
                    style={{
                      height: "200px",
                      objectFit: "contain",
                      display: "block",
                      opacity: 0.8,
                    }}
                  />
                  <div
                    className="text-6xl w-64 lithops-text text-center text-white pt-3 content-center"
                    style={{ color: "rgba(255, 200, 200, 0.6)" }}
                  >
                    {item.title}
                  </div>
                </div>
                <div
                  className="flex text-xl w-80 pt-4 ph-2 items-center text-left"
                  style={{ color: "rgba(255, 200, 200, 1)" }}
                >
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {latestPosts.map((post) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            style={{
              display: "block",
              textDecoration: "none",
              transition: "transform 0.3s ease",
            }}
          >
            <div
              style={
                {
                  marginBottom: "20px",
                  padding: "15px",
                  backgroundColor: "rgba(40, 10, 20, 0.8)",
                  borderRadius: "8px",
                  color: "rgba(255, 230, 230, 0.9)",
                  cursor: "pointer",
                  ":hover": {
                    transform: "scale(1.02)",
                    backgroundColor: "rgba(60, 20, 30, 0.9)",
                  },
                } as React.CSSProperties
              }
            >
              <h2 style={{ marginBottom: "10px" }}>{post.title}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  marginBottom: "10px",
                  maxHeight: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                <span>{post.date}</span> | <span>{post.type}</span> |{" "}
                <span>{post.tags.join(", ")}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <footer
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "10px 0",
          color: "rgba(255, 200, 200, 0.8)",
          fontSize: "0.9rem",
          backgroundColor: "black",
        }}
      >
        Font Lithops by Anne-Dauphine Borione. Distributed by{" "}
        <a
          href="https://velvetyne.fr"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "rgba(255, 200, 200, 0.9)" }}
        >
          velvetyne.fr
        </a>
        .
      </footer>
    </div>
  );
};

export default Writings;
