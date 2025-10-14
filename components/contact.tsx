"use client"
import { MapPin, Phone, Instagram, MessageCircle } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="absolute right-0 top-1/4 w-[700px] h-[450px] opacity-20 hidden xl:block pointer-events-none">
        <img src="/images/design-mode/image-removebg-preview.png" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center space-y-4 md:space-y-6 mb-16 md:mb-20">
          <div className="inline-block px-4 md:px-6 py-2 bg-primary/10 border border-primary/30">
            <span className="font-display text-primary text-xs md:text-sm tracking-widest">GET IN TOUCH</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            CONTACT US
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">Ready to transform your ride? Hit us up.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* WhatsApp Button */}
          <a href="https://wa.me/212604393431" target="_blank" rel="noopener noreferrer" className="block">
            <div className="glow-card p-6 md:p-8 flex items-center gap-4 md:gap-6 hover:scale-[1.02] transition-all cursor-pointer group hover:border-[#25D366]">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#25D366]/20 flex-shrink-0 group-hover:bg-[#25D366]/30 transition-colors">
                <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-[#25D366]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-2xl md:text-3xl mb-1 tracking-wider">WHATSAPP</h3>
                <p className="text-gray-400 text-lg md:text-xl truncate">0604-393431</p>
              </div>
              <div className="text-primary text-xl md:text-2xl opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                →
              </div>
            </div>
          </a>

          {/* Call Buttons */}
          <a href="tel:+212609544774" className="block">
            <div className="glow-card p-6 md:p-8 flex items-center gap-4 md:gap-6 hover:scale-[1.02] transition-all cursor-pointer group hover:border-primary">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-primary/20 flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                <Phone className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-2xl md:text-3xl mb-1 tracking-wider">CALL US</h3>
                <p className="text-gray-400 text-lg md:text-xl truncate">+212 609 544 774</p>
              </div>
              <div className="text-primary text-xl md:text-2xl opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                →
              </div>
            </div>
          </a>

          <a href="tel:+212620050948" className="block">
            <div className="glow-card p-6 md:p-8 flex items-center gap-4 md:gap-6 hover:scale-[1.02] transition-all cursor-pointer group hover:border-primary">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-primary/20 flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                <Phone className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-2xl md:text-3xl mb-1 tracking-wider">CALL US</h3>
                <p className="text-gray-400 text-lg md:text-xl truncate">☎️ +212 620 050 948</p>
              </div>
              <div className="text-primary text-xl md:text-2xl opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                →
              </div>
            </div>
          </a>

          {/* Instagram Button */}
          <a href="https://www.instagram.com/carbonmaroc/" target="_blank" rel="noopener noreferrer" className="block">
            <div className="glow-card p-6 md:p-8 flex items-center gap-4 md:gap-6 hover:scale-[1.02] transition-all cursor-pointer group hover:border-[#E4405F]">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#E4405F]/20 flex-shrink-0 group-hover:bg-[#E4405F]/30 transition-colors">
                <Instagram className="w-6 h-6 md:w-8 md:h-8 text-[#E4405F]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-2xl md:text-3xl mb-1 tracking-wider">INSTAGRAM</h3>
                <p className="text-gray-400 text-lg md:text-xl truncate">@carbonmaroc</p>
              </div>
              <div className="text-[#E4405F] text-xl md:text-2xl opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                →
              </div>
            </div>
          </a>

          {/* Location Info */}
          <a
            href="https://maps.app.goo.gl/3hqaft64YaUZbCyd9"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="glow-card p-6 md:p-8 flex items-center gap-4 md:gap-6 hover:scale-[1.02] transition-all cursor-pointer group hover:border-primary">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-primary/20 flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                <MapPin className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-2xl md:text-3xl mb-1 tracking-wider">LOCATION</h3>
                <p className="text-gray-400 text-lg md:text-xl">Casablanca, Morocco</p>
              </div>
              <div className="text-primary text-xl md:text-2xl opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                →
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
