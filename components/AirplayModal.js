import { useState, useRef, useEffect } from 'react'

export default function AirplayModal({ 
  isOpen, 
  onClose, 
  onSave,
  initialBg,
  initialCover,
  initialAudio,
  initialTitle,
  initialArtist
}) {
  const [bgUrl, setBgUrl] = useState(initialBg)
  const [coverUrl, setCoverUrl] = useState(initialCover)
  const [audioUrl, setAudioUrl] = useState(initialAudio)
  const [title, setTitle] = useState(initialTitle)
  const [artist, setArtist] = useState(initialArtist)
  
  const [bgFileName, setBgFileName] = useState('')
  const [coverFileName, setCoverFileName] = useState('')
  const [musicFileName, setMusicFileName] = useState('')
  
  const bgFileInputRef = useRef(null)
  const coverFileInputRef = useRef(null)
  const musicFileInputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setBgUrl(initialBg)
      setCoverUrl(initialCover)
      setAudioUrl(initialAudio)
      setTitle(initialTitle)
      setArtist(initialArtist)
      setBgFileName('')
      setCoverFileName('')
      setMusicFileName('')
    }
  }, [isOpen, initialBg, initialCover, initialAudio, initialTitle, initialArtist])

  const handleFileUpload = (file, setUrl, setFileName) => {
    if (file) {
      setFileName(`📁 ${file.name.slice(0, 35)}`)
      const reader = new FileReader()
      reader.onload = (ev) => setUrl(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSave({
      bgUrl: bgUrl.trim(),
      coverUrl: coverUrl.trim(),
      audioUrl: audioUrl.trim(),
      title: title.trim() || "Liquid Tune",
      artist: artist.trim() || "iOS Artist"
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/68 backdrop-blur-[36px] flex items-center justify-center z-[2000]">
      <div className="bg-[rgba(30,30,38,0.75)] backdrop-blur-[48px] rounded-[52px] w-[90%] max-w-[420px] max-h-[85vh] overflow-y-auto p-[26px_22px] border border-white/35 shadow-[0_32px_56px_-16px_black]">
        <h3 className="text-white font-semibold text-xl text-center mb-4 tracking-tight">
          🎧 Customize Player 🎨
        </h3>
        
        <div className="mb-3">
          <div className="text-white/80 text-[11px] flex justify-between items-center">
            <span>✨ Background (Image/GIF/Video)</span>
            <span className="text-[9px]">*Video/GIF auto-loop</span>
          </div>
          <div 
            onClick={() => bgFileInputRef.current?.click()}
            className="bg-white/12 rounded-[44px] p-[10px_0] text-center text-[13px] font-medium cursor-pointer transition-all active:scale-97 border border-white/30 mt-1"
          >
            📤 Upload Background
          </div>
          <input 
            ref={bgFileInputRef}
            type="file" 
            accept="image/jpeg,image/png,image/jpg,image/webp,video/mp4,video/quicktime,video/webm" 
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files[0], setBgUrl, setBgFileName)}
          />
          {bgFileName && <div className="text-[9px] text-white/45 mt-1 px-3 break-all">{bgFileName}</div>}
        </div>
        
        <input 
          type="text" 
          value={bgUrl}
          onChange={(e) => setBgUrl(e.target.value)}
          className="bg-white/12 border border-white/30 rounded-[44px] p-[12px_18px] text-white text-sm w-full outline-none focus:border-white focus:bg-white/20"
          placeholder="URL Background (jpg/png/gif/mp4)"
        />
        
        <div className="mt-3 mb-3">
          <div className="text-white/80 text-[11px]">🎨 Cover Lagu (Gambar/GIF/Video)</div>
          <div 
            onClick={() => coverFileInputRef.current?.click()}
            className="bg-white/12 rounded-[44px] p-[10px_0] text-center text-[13px] font-medium cursor-pointer transition-all active:scale-97 border border-white/30 mt-1"
          >
            📤 Upload Cover
          </div>
          <input 
            ref={coverFileInputRef}
            type="file" 
            accept="image/jpeg,image/png,image/jpg,image/webp,video/mp4,video/quicktime,video/webm" 
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files[0], setCoverUrl, setCoverFileName)}
          />
          {coverFileName && <div className="text-[9px] text-white/45 mt-1 px-3 break-all">{coverFileName}</div>}
        </div>
        
        <input 
          type="text" 
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          className="bg-white/12 border border-white/30 rounded-[44px] p-[12px_18px] text-white text-sm w-full outline-none focus:border-white focus:bg-white/20"
          placeholder="URL Cover (jpg/png/gif/mp4/webm)"
        />
        
        <div className="mt-3 mb-3">
          <div 
            onClick={() => musicFileInputRef.current?.click()}
            className="bg-white/12 rounded-[44px] p-[10px_0] text-center text-[13px] font-medium cursor-pointer transition-all active:scale-97 border border-white/30"
          >
            🎵 Upload Musik MP3
          </div>
          <input 
            ref={musicFileInputRef}
            type="file" 
            accept="audio/mpeg,audio/mp3,audio/wav" 
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files[0], setAudioUrl, setMusicFileName)}
          />
          {musicFileName && <div className="text-[9px] text-white/45 mt-1 px-3 break-all">{musicFileName}</div>}
        </div>
        
        <input 
          type="text" 
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
          className="bg-white/12 border border-white/30 rounded-[44px] p-[12px_18px] text-white text-sm w-full outline-none focus:border-white focus:bg-white/20"
          placeholder="URL MP3"
        />
        
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white/12 border border-white/30 rounded-[44px] p-[12px_18px] text-white text-sm w-full outline-none mt-3 focus:border-white focus:bg-white/20"
          placeholder="Judul Lagu"
        />
        
        <input 
          type="text" 
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="bg-white/12 border border-white/30 rounded-[44px] p-[12px_18px] text-white text-sm w-full outline-none mt-3 focus:border-white focus:bg-white/20"
          placeholder="Nama Artis"
        />
        
        <div className="flex gap-3 mt-6">
          <button 
            onClick={handleSave}
            className="flex-1 bg-white/20 backdrop-blur border border-white/30 rounded-full py-3 text-white text-sm font-semibold transition-all active:scale-96"
          >
            ✅ Simpan & Terapkan
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-white/10 rounded-full py-3 text-white/80 text-sm font-medium border border-white/20"
          >
            Tutup
          </button>
        </div>
        
        <p className="text-[10px] text-white/30 text-center mt-4">
          ⚡ GIF/Video akan otomatis looping & autoplay (muted)
        </p>
      </div>
    </div>
  )
              }
