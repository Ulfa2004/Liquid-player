import { useState, useRef, useEffect, useCallback } from 'react'
import WaveAnimation from './WaveAnimation'
import AirplayModal from './AirplayModal'

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(210)
  const [volume, setVolume] = useState(0.65)
  const [track, setTrack] = useState({
    title: "dj sakit nya tu disini",
    artist: "EsaaRMX 🎧 Bassline",
    img: "https://img.sanishtech.com/u/0f93024cf982f23a474a91649cba47cf.png",
    src: "https://www.image2url.com/r2/default/audio/1777204220968-e8bf0838-c886-430c-8e4a-f0b5cb04aab6.mp3"
  })
  
  const [bgMedia, setBgMedia] = useState({
    url: "https://img.sanishtech.com/u/0f93024cf982f23a474a91649cba47cf.png",
    isVideo: false
  })
  
  const [coverMedia, setCoverMedia] = useState({
    url: "https://img.sanishtech.com/u/0f93024cf982f23a474a91649cba47cf.png",
    isVideo: false
  })
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const bgVideoRef = useRef(null)
  const coverVideoRef = useRef(null)

  const isVideoOrGifUrl = useCallback((url) => {
    if (!url) return false
    const lower = url.toLowerCase()
    return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov') || 
           lower.includes('.mp4?') || lower.includes('video') || lower.includes('.gif')
  }, [])

  const formatTime = (sec) => {
    if (isNaN(sec) || !isFinite(sec) || sec === Infinity) return "0:00"
    const mins = Math.floor(sec / 60)
    const secs = Math.floor(sec % 60)
    return `${mins}:${secs < 10 ? '0' + secs : secs}`
  }

  const applyCoverMedia = useCallback((url) => {
    const isVideo = isVideoOrGifUrl(url)
    setCoverMedia({ url, isVideo })
  }, [isVideoOrGifUrl])

  const applyBackgroundMedia = useCallback((url) => {
    const isVideo = isVideoOrGifUrl(url)
    setBgMedia({ url, isVideo })
  }, [isVideoOrGifUrl])

  const loadTrack = useCallback((newTrack, autoPlay = false) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = newTrack.src
      audioRef.current.load()
      audioRef.current.volume = volume
      
      setTrack(newTrack)
      applyCoverMedia(newTrack.img)
      
      if (autoPlay) {
        audioRef.current.play().catch(() => {})
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
      }
    }
  }, [volume, applyCoverMedia])

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => alert("Tap play untuk memutar audio"))
      }
    }
  }, [isPlaying])

  const handleNext = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      if (isPlaying) audioRef.current.play().catch(() => {})
    }
  }, [isPlaying])

  const handlePrev = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      if (isPlaying) audioRef.current.play().catch(() => {})
    }
  }, [isPlaying])

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const percent = (audioRef.current.currentTime / duration) * 100
      if (progressRef.current) {
        progressRef.current.style.width = `${percent}%`
      }
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [duration])

  const handleProgressClick = useCallback((e) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.parentElement.getBoundingClientRect()
      let percent = (e.clientX - rect.left) / rect.width
      percent = Math.min(1, Math.max(0, percent))
      if (duration && duration > 0) {
        audioRef.current.currentTime = percent * duration
      }
    }
  }, [duration])

  const handleVolumeChange = useCallback((e) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (audioRef.current) {
      audioRef.current.volume = val
    }
  }, [])

  const handleModalSave = useCallback((settings) => {
    applyBackgroundMedia(settings.bgUrl)
    const newTrack = {
      title: settings.title,
      artist: settings.artist,
      img: settings.coverUrl,
      src: settings.audioUrl
    }
    
    const wasPlaying = isPlaying
    loadTrack(newTrack, wasPlaying)
    
    setToastMessage('✅ Video/GIF Background & Cover Aktif (auto-loop)')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }, [applyBackgroundMedia, isPlaying, loadTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleLoadedMetadata = () => {
        if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration)
        }
      }
      
      const handleTimeUpdate = () => updateProgress()
      const handleEnded = () => {
        audio.currentTime = 0
        audio.play().catch(() => {})
      }
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [updateProgress])

  useEffect(() => {
    if (audioRef.current && !audioRef.current.src) {
      loadTrack(track, false)
    }
  }, [loadTrack, track])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background */}
      {bgMedia.isVideo ? (
        <video 
          ref={bgVideoRef}
          src={bgMedia.url}
          autoPlay 
          loop 
          muted 
          playsInline
          className="fixed top-0 left-0 w-full h-full object-cover -z-20"
        />
      ) : (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-cover bg-center -z-20 transition-all duration-400"
          style={{ backgroundImage: `url('${bgMedia.url}')` }}
        />
      )}
      <div className="fixed top-0 left-0 w-full h-full bg-black/45 backdrop-blur-[24px] saturate-180 -z-10" />
      
      {/* Glass Card */}
      <div className="bg-[rgba(30,30,40,0.28)] backdrop-blur-[48px] saturate-210 brightness-105 rounded-[52px] border border-white/38 shadow-[0_20px_38px_-12px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_48px_-14px_rgba(0,0,0,0.55)] hover:border-white/48 w-[325px] p-5">
        
        {/* Cover Image/Video */}
        <div className="w-full aspect-square rounded-[32px] overflow-hidden shadow-2xl shadow-black/30 mb-5 relative">
          {coverMedia.isVideo ? (
            <video 
              ref={coverVideoRef}
              src={coverMedia.url}
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover rounded-[32px]"
            />
          ) : (
            <img 
              src={coverMedia.url} 
              alt="cover" 
              className="w-full h-full object-cover rounded-[32px] shadow-[0_20px_32px_-12px_rgba(0,0,0,0.5)]"
            />
          )}
        </div>
        
        {/* Title & Wave */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 overflow-hidden pr-2">
            <h2 className="text-white font-extrabold text-[20px] tracking-tight whitespace-nowrap overflow-hidden">
              <span className="inline-block whitespace-nowrap animate-marquee pr-8">{track.title}</span>
            </h2>
            <p className="text-white/70 text-[13px] font-semibold mt-1.5 truncate">{track.artist}</p>
          </div>
          <WaveAnimation />
        </div>
        
        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-white/70 text-[11px] font-semibold mb-1.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div 
            className="w-full h-[7px] bg-white/30 rounded-[100px] cursor-pointer transition-all"
            onClick={handleProgressClick}
          >
            <div 
              ref={progressRef}
              className="w-0 h-full bg-gradient-to-r from-white to-[#f0f0ff] rounded-[100px] transition-all duration-75 shadow-[0_0_8px_rgba(255,255,240,0.7)]"
            />
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center items-center gap-7 mb-5">
          <div 
            onClick={handlePrev}
            className="w-14 h-14 inline-block transition-all duration-120 active:scale-88 active:opacity-85 cursor-pointer filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            style={{
              backgroundImage: "url('https://img.sanishtech.com/u/902c93ffc819575f7da3ad29058049d1.png')",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              transform: 'scaleX(-1)'
            }}
          />
          
          <div onClick={togglePlay} className="cursor-pointer inline-flex items-center justify-center">
            <div 
              className="w-[68px] h-[68px] transition-all duration-120 active:scale-88 active:opacity-85 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              style={{
                backgroundImage: isPlaying 
                  ? "url('https://img.sanishtech.com/u/598c933be0e72814c22b9da473f76a58.png')"
                  : "url('https://img.sanishtech.com/u/6cf15ebd49582e939d12444175edc128.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
          </div>
          
          <div 
            onClick={handleNext}
            className="w-14 h-14 inline-block transition-all duration-120 active:scale-88 active:opacity-85 cursor-pointer filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            style={{
              backgroundImage: "url('https://img.sanishtech.com/u/902c93ffc819575f7da3ad29058049d1.png')",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
        </div>
        
        {/* Volume */}
        <div className="flex items-center gap-3 mb-5 px-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="opacity-80">
            <path d="M3 9H7L12 4V20L7 15H3V9Z M16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12Z"/>
            <path d="M19 12C19 8.13 16.36 4.89 13 4V7.5C14.82 8.33 16 10.26 16 12.5C16 14.74 14.82 16.67 13 17.5V21C16.36 20.11 19 16.87 19 13Z"/>
          </svg>
          <input 
            type="range" 
            className="w-full h-[6px] bg-white/30 rounded-[100px] outline-none cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_12px_rgba(0,0,0,0.3)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/90 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:active:scale-125"
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={handleVolumeChange}
          />
          <span className="text-white/60 text-[11px] font-semibold w-10 text-right">{Math.round(volume * 100)}%</span>
        </div>
        
        {/* AirPlay Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white/16 backdrop-blur-[16px] border border-white/40 rounded-[42px] px-5 py-2 text-[12.5px] font-semibold text-white/95 transition-all active:scale-96 active:bg-white/26 flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
              <polygon points="12 15 17 21 7 21 12 15" fill="currentColor" fillOpacity="0.9" stroke="none" />
            </svg>
            <span className="tracking-wide">AirPlay</span>
          </button>
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-[110px] left-1/2 -translate-x-1/2 bg-[rgba(20,20,28,0.9)] backdrop-blur-[32px] text-white px-6 py-2.5 rounded-[44px] text-[13px] z-[2100] border border-white/30">
          {toastMessage}
        </div>
      )}
      
      {/* Audio Element */}
      <audio ref={audioRef} />
      
      {/* Modal */}
      <AirplayModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        initialBg={bgMedia.url}
        initialCover={coverMedia.url}
        initialAudio={track.src}
        initialTitle={track.title}
        initialArtist={track.artist}
      />
    </div>
  )
}
