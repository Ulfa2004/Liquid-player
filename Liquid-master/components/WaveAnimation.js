export default function WaveAnimation() {
  return (
    <div className="flex items-center gap-[3.5px] h-[22px]">
      <div className="wave-stroke w-[2.8px] bg-white/90 rounded-[4px] animate-wave h-[7px] [animation-delay:0s]"></div>
      <div className="wave-stroke w-[2.8px] bg-white/90 rounded-[4px] animate-wave h-[12px] [animation-delay:0.1s]"></div>
      <div className="wave-stroke w-[2.8px] bg-white/90 rounded-[4px] animate-wave h-[9px] [animation-delay:0.25s]"></div>
      <div className="wave-stroke w-[2.8px] bg-white/90 rounded-[4px] animate-wave h-[15px] [animation-delay:0.05s]"></div>
      <div className="wave-stroke w-[2.8px] bg-white/90 rounded-[4px] animate-wave h-[8px] [animation-delay:0.2s]"></div>
    </div>
  )
}
