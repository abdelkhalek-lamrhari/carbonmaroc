"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { QuoteFormModal } from "@/components/quote-form-modal"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#services", label: "SERVICES" },
    { href: "#gallery", label: "GALLERY" },
    { href: "#about", label: "ABOUT" },
    { href: "#contact", label: "CONTACT" },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/98 backdrop-blur-xl border-b-4 border-primary/30" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <a href="#" className="flex items-center gap-4 group transform hover:rotate-1 transition-transform">
              <img
                src="/images/design-mode/c1a70eb0-334e-4488-9409-8508bd6e6f47__1_-removebg-preview.png"
                alt="CARBON MAROC"
                className="h-12 w-auto brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300 md:h-56"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`font-display text-base text-gray-300 hover:text-primary transition-all relative group ${
                    index % 2 === 0 ? "hover:-rotate-2" : "hover:rotate-2"
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <Button
                size="lg"
                onClick={() => setIsQuoteModalOpen(true)}
                className="font-display tracking-[0.2em] text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-black border-4 border-primary transform rotate-2 hover:rotate-0 hover:scale-110 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)]"
              >
                GET QUOTE
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white hover:text-primary transition-colors transform hover:rotate-90 duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={32} strokeWidth={3} /> : <Menu size={32} strokeWidth={3} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-8 border-t-4 border-primary/30">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="font-display text-2xl text-gray-300 hover:text-primary transition-colors transform hover:translate-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <Button
                  size="lg"
                  onClick={() => {
                    setIsQuoteModalOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full font-display tracking-[0.2em] text-lg py-6 bg-primary hover:bg-primary/90 text-black border-4 border-primary"
                >
                  GET QUOTE
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Quote Form Modal */}
      <QuoteFormModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </>
  )
}
