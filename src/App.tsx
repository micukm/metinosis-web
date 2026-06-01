import { useRef, useEffect, useState } from 'react'
import { Globe, Instagram, Twitter } from 'lucide-react'

const VIDEO_URL = '/hero.mp4'

const FADE_DURATION = 500
const FADE_OUT_THRESHOLD = 0.55

const NAV_LINKS = ['Features', 'Pricing', 'Science', 'Plans', 'About']

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadingOutRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const [activeNav, setActiveNav] = useState('Features')

  function cancelRaf() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  function fadeIn(video: HTMLVideoElement) {
    cancelRaf()
    const start = performance.now()
    const startOpacity = video.style.opacity ? parseFloat(video.style.opacity) : 0

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / FADE_DURATION, 1)
      video.style.opacity = String(startOpacity + (1 - startOpacity) * progress)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function fadeOut(video: HTMLVideoElement, onComplete: () => void) {
    cancelRaf()
    const start = performance.now()
    const startOpacity = video.style.opacity ? parseFloat(video.style.opacity) : 1

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / FADE_DURATION, 1)
      video.style.opacity = String(startOpacity * (1 - progress))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
        onComplete()
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.style.opacity = '0'

    function handleCanPlay() {
      if (!video) return
      video.play().catch(() => {})
    }

    function handlePlaying() {
      if (!video) return
      fadingOutRef.current = false
      fadeIn(video)
    }

    function handleTimeUpdate() {
      if (!video) return
      const remaining = video.duration - video.currentTime
      if (!fadingOutRef.current && isFinite(remaining) && remaining <= FADE_OUT_THRESHOLD) {
        fadingOutRef.current = true
        fadeOut(video, () => {})
      }
    }

    function handleEnded() {
      if (!video) return
      video.style.opacity = '0'
      cancelRaf()
      setTimeout(() => {
        if (!video) return
        video.currentTime = 0
        fadingOutRef.current = false
        video.play().catch(() => {})
      }, 100)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      cancelRaf()
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black overflow-hidden flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0 }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-20 px-6 py-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
            <Globe size={16} className="text-white" />
          </div>
        </div>

        {/* Center pill nav */}
        <div className="hidden md:flex items-center bg-black/70 border border-white/10 backdrop-blur-md rounded-full px-1.5 py-1.5 gap-0.5">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => setActiveNav(link)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeNav === link
                  ? 'bg-white text-black'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {link}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button className="hidden md:flex items-center gap-2 bg-black/70 border border-white/10 backdrop-blur-md rounded-full px-5 py-2 text-white text-sm font-medium hover:bg-white/10 transition-colors">
          <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          Get Started
        </button>

        {/* Mobile menu placeholder */}
        <button className="md:hidden text-white/70 hover:text-white transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-4">Educación y Aprendizaje</p>
        <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap font-bold">
          METINOSIS
        </h1>
      </div>

      {/* Social icons */}
      <div className="relative z-10 flex justify-center gap-4 pb-12">
        <button
          aria-label="Instagram"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <Instagram size={20} />
        </button>
        <button
          aria-label="Twitter"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <Twitter size={20} />
        </button>
        <button
          aria-label="Website"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <Globe size={20} />
        </button>
      </div>
    </div>
  )
}
