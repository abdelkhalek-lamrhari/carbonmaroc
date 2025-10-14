import { Instagram, Facebook, Youtube, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-primary/20 bg-black/80 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-10 pointer-events-none">
        <img
          src="/images/design-mode/ChatGPT%20Image%20Oct%2011%2C%202025%2C%2008_29_53%20PM.png"
          alt=""
          className="w-full h-full object-contain object-bottom-right"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          <div className="space-y-4 md:space-y-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary flex items-center justify-center">
                <span className="font-display text-xl md:text-2xl text-black">CM</span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold tracking-wider">
                <span className="text-white">CARBON</span>
                <br />
                <span className="text-primary">MAROC</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Premium car wrapping and customization in Casablanca. Transform your ride into art.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="font-display text-lg md:text-xl tracking-wider text-white">QUICK LINKS</h3>
            <ul className="space-y-2 md:space-y-3 text-gray-400 text-sm md:text-base">
              <li>
                <a href="#services" className="hover:text-primary transition-colors animated-underline">
                  Services
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-primary transition-colors animated-underline">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition-colors animated-underline">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition-colors animated-underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h3 className="font-display text-lg md:text-xl tracking-wider text-white">SERVICES</h3>
            <ul className="space-y-2 md:space-y-3 text-gray-400 text-sm md:text-base">
              <li>Full Wraps</li>
              <li>Custom Graphics</li>
              <li>Paint Protection</li>
              <li>Chrome Delete</li>
              <li>Ceramic Coating</li>
            </ul>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h3 className="font-display text-lg md:text-xl tracking-wider text-white">CONNECT</h3>
            <div className="space-y-3 md:space-y-4 text-gray-400 text-sm md:text-base">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <span className="break-all">+212 609 544 774</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <span className="break-all">soufianeharkati8@gmail.com</span>
              </div>
            </div>
            <div className="flex gap-3 md:gap-4 pt-2 md:pt-4">
              <a
                href="https://www.instagram.com/carbonmaroc/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-12 md:h-12 bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all border border-white/10 hover:border-primary group"
              >
                <Instagram className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-primary transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 md:w-12 md:h-12 bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all border border-white/10 hover:border-primary group"
              >
                <Facebook className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-primary transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 md:w-12 md:h-12 bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all border border-white/10 hover:border-primary group"
              >
                <Youtube className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-gray-400 text-sm md:text-base">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Carbon Maroc. All rights reserved.
          </p>
          <p className="text-xs md:text-sm text-center md:text-right">Designed for the streets of Casa Blanca</p>
        </div>
      </div>
    </footer>
  )
}
