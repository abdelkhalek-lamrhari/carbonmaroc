"use client"

import { useState } from "react"
import { X } from "lucide-react"

const galleryImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Oct%2011%2C%202025%2C%2008_29_53%20PM-hUejUq3d0nXaaKAyF0L9FSekPmL4Ig.png",
    title: "Audi Quattro Custom Wrap",
    category: "Full Wrap",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-removebg-preview-2WwTlSGo86ZncwUDeV4lVmSzH9udDe.png",
    title: "Mercedes C63 AMG",
    category: "Chrome Delete",
  },
  {
    src: "https://i.ibb.co/fzqbx8FM/Fd9axep.png",
    title: "Custom Motorcycle",
    category: "Custom Graphics",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/maxresdefault-removebg-preview-lsfyRkeoUie5oMXU2Jo2ZSjcDLT2Gc.png",
    title: "Audi SUV Wrap",
    category: "Full Wrap",
  },
  {
    src: "https://i.ibb.co/jkF0zZMY/KXSY01-F-1.gif",
    title: "LED Ambient Lighting",
    category: "Interior Customization",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/golf8-gtd-XUnAKwV4NRrrdrUgg147gbVjWcal1x.jpeg",
    title: "VW Golf 8 GTD - Full Wrap & Wheel Paint",
    category: "Full Wrap",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/seat-leon-fr-SdVctfkoagPKwZdbSBmPsanDJlV3Rz.jpeg",
    title: "Seat Leon FR - Full Wrap",
    category: "Full Wrap",
  },
]

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [lightboxImage, setLightboxImage] = useState<number | null>(null)
  const filters = ["All", "Full Wrap", "Chrome Delete", "Custom Graphics", "Interior Customization"]

  const filteredImages =
    activeFilter === "All" ? galleryImages : galleryImages.filter((img) => img.category === activeFilter)

  const openLightbox = (index: number) => setLightboxImage(index)
  const closeLightbox = () => setLightboxImage(null)
  const nextImage = () => setLightboxImage((prev) => (prev !== null ? (prev + 1) % filteredImages.length : null))
  const prevImage = () =>
    setLightboxImage((prev) => (prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null))

  return (
    <section id="gallery" className="py-20 md:py-32 relative overflow-hidden bg-black/50">
      <div className="absolute inset-0 stripe-bg" />

      <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-secondary/5 blur-[100px] rounded-full" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="mb-16 md:mb-24 space-y-6 md:space-y-8">
          <div className="inline-block transform rotate-2 px-6 md:px-8 py-2 md:py-3 bg-secondary/10 border-r-4 md:border-r-8 border-secondary">
            <span className="font-display text-secondary text-sm md:text-lg tracking-[0.3em]">OUR WORK</span>
          </div>
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tight leading-none">
            <span className="block text-white transform -rotate-1 inline-block">GALLERY</span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-400 max-w-2xl transform rotate-1 inline-block ml-4 md:ml-8">
            Check out some of our recent transformations
          </p>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-4 mb-12 md:mb-16">
          {filters.map((filter, index) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 md:px-8 py-3 md:py-4 font-display tracking-[0.2em] text-base md:text-lg transition-all transform ${
                index % 2 === 0 ? "rotate-1" : "-rotate-1"
              } hover:rotate-0 hover:scale-110 ${
                activeFilter === filter
                  ? "bg-primary text-black border-4 border-primary shadow-[0_0_30px_rgba(var(--primary),0.5)]"
                  : "bg-white/5 text-gray-300 border-4 border-white/20 hover:border-primary/50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className={`group relative aspect-[4/3] overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                index % 2 === 0 ? "md:-rotate-2 hover:rotate-0" : "md:rotate-2 hover:rotate-0"
              }`}
              style={{
                clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0 100%)",
              }}
            >
              <div className="absolute inset-0 border-4 border-primary/0 group-hover:border-primary/100 transition-all z-10" />
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-3"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="inline-block px-4 md:px-6 py-1 md:py-2 bg-primary border-4 border-primary mb-3 md:mb-4 transform -rotate-2">
                    <span className="font-display text-black text-xs md:text-sm tracking-[0.2em]">
                      {image.category}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-4xl text-white transform rotate-1">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Dramatic light beams effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-primary/30 via-primary/10 to-transparent blur-xl" />
            <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-secondary/30 via-secondary/10 to-transparent blur-xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
          </div>

          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-3 md:p-4 bg-white/10 hover:bg-primary border-2 border-white/20 hover:border-primary transition-all group"
          >
            <X className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-black transition-colors" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-4 md:left-8 z-50 p-3 md:p-4 bg-white/10 hover:bg-primary border-2 border-white/20 hover:border-primary transition-all group"
          >
            <span className="text-2xl md:text-4xl text-white group-hover:text-black font-display">‹</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-4 md:right-8 z-50 p-3 md:p-4 bg-white/10 hover:bg-primary border-2 border-white/20 hover:border-primary transition-all group"
          >
            <span className="text-2xl md:text-4xl text-white group-hover:text-black font-display">›</span>
          </button>

          {/* Image container with spotlight effect */}
          <div className="relative max-w-7xl max-h-[90vh] mx-4 md:mx-8" onClick={(e) => e.stopPropagation()}>
            {/* Spotlight glow */}
            <div className="absolute -inset-20 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl" />

            <img
              src={filteredImages[lightboxImage].src || "/placeholder.svg"}
              alt={filteredImages[lightboxImage].title}
              className="relative max-w-full max-h-[90vh] object-contain shadow-[0_0_100px_rgba(var(--primary),0.3)] border-4 border-primary/50"
            />

            {/* Image info with dramatic styling */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 md:p-8">
              <div className="inline-block px-4 md:px-6 py-1 md:py-2 bg-primary border-4 border-primary mb-2 md:mb-3 transform -rotate-1">
                <span className="font-display text-black text-xs md:text-sm tracking-[0.2em]">
                  {filteredImages[lightboxImage].category}
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-5xl text-white transform rotate-1 inline-block">
                {filteredImages[lightboxImage].title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
