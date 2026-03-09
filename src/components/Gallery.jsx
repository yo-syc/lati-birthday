import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Gallery.css";

function Gallery({ isActive }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photosRevealed, setPhotosRevealed] = useState(false);

  const photosRef = useRef([]);
  const lightboxImgRef = useRef(null);

  const photos = [
    { src: "/images/b.jpg", alt: "Memory 1", caption: "Birthday Cake!", size: "large" },
    { src: "/images/1.jpg", alt: "Memory 1", caption: "Beautiful moments together", size: "large" },
    { src: "/images/2.jpg", alt: "Memory 2", caption: "Precious times", size: "medium" },
    { src: "/images/3.jpg", alt: "Memory 3", caption: "Unforgettable day", size: "medium" },
    { src: "/images/4.jpg", alt: "Memory 4", caption: "Sweet memories", size: "small" },
    { src: "/images/5.jpg", alt: "Memory 5", caption: "Cherished moments", size: "large" },
    { src: "/images/6.jpg", alt: "Memory 6", caption: "Happy times", size: "medium" },
    { src: "/images/7.jpg", alt: "Memory 7", caption: "Special memories", size: "small" },
    { src: "/images/8.jpg", alt: "Memory 8", caption: "Wonderful moments", size: "medium" },
    { src: "/images/9.jpg", alt: "Memory 9", caption: "Joyful times", size: "large" },
    { src: "/images/10.jpg", alt: "Memory 10", caption: "Sweet surprises", size: "small" },
    { src: "/images/11.jpg", alt: "Memory 11", caption: "Beautiful memories", size: "medium" },
    { src: "/images/12.jpg", alt: "Memory 12", caption: "Forever moments", size: "medium" },
    { src: "/images/13.jpg", alt: "Memory 13", caption: "Happy memories", size: "small" },
    { src: "/images/14.jpg", alt: "Memory 14", caption: "Special times", size: "medium" },
  ];

  // Reveal photos with GSAP when page becomes active
  useEffect(() => {
    if (isActive && !photosRevealed) {
      setTimeout(() => setPhotosRevealed(true), 10);

      // Stagger animation for photos
      gsap.fromTo(
        photosRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.4)",
          delay: 0.2,
        }
      );
    }
  }, [isActive, photosRevealed]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);

    // Animate lightbox appearance
    if (lightboxImgRef.current) {
      gsap.fromTo(
        lightboxImgRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.4)" }
      );
    }
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Handle body overflow in effect
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("lightbox-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("lightbox-open");
    }

    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("lightbox-open");
    };
  }, [lightboxOpen]);

  const showNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % photos.length;

    // Animate transition
    if (lightboxImgRef.current) {
      gsap.to(lightboxImgRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex(newIndex);
          gsap.fromTo(
            lightboxImgRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        },
      });
    }
  }, [currentIndex, photos.length]);

  const showPrev = useCallback(() => {
    const newIndex = (currentIndex - 1 + photos.length) % photos.length;

    // Animate transition
    if (lightboxImgRef.current) {
      gsap.to(lightboxImgRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex(newIndex);
          gsap.fromTo(
            lightboxImgRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        },
      });
    }
  }, [currentIndex, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      } else if (e.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, showNext, showPrev, closeLightbox]);

  return (
    <section className="gallery">
      <div className="gallery-header">
        <h2>💝 Beautiful Moments!! 💝</h2>
        <p className="gallery-subtitle">Every moment captured, every memory cherished</p>
      </div>
      
      <div className="masonry-grid">
        {photos.map((photo, index) => (
          <div
            key={index}
            ref={(el) => (photosRef.current[index] = el)}
            className={`photo-card ${photo.size}`}
            onClick={() => openLightbox(index)}
          >
            <div className="photo-wrapper">
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
              />
              <div className="photo-overlay">
                <div className="photo-caption">{photo.caption}</div>
                <div className="photo-icon">✨</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <img
            ref={lightboxImgRef}
            src={photos[currentIndex].src}
            alt={photos[currentIndex].alt}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ×
          </button>
          <button
            className="nav-btn nav-prev"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            className="nav-btn nav-next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

export default Gallery;
