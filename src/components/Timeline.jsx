
export function Timeline({ currentTime, duration, thumbnails, onClickTimeline }) {
    const progress = (currentTime / duration) * 100

    // Handles user click on the timeline and find the time
    function onClick(ev) {
        const rect = ev.currentTarget.getBoundingClientRect()
        const clickX = ev.clientX - rect.left
        const percentage = clickX / rect.width
        const time = percentage * duration
        console.log('time', time);
        
        onClickTimeline(time)
    }
    
    return (
        <div className="timeline">
            <div className="thumbnail-strip" onClick={onClick}>
                {thumbnails.map((src, idx) => (
                    <img key={idx} src={src} alt={`thumb-${idx}`} />
                ))}
            </div>
            <div className="playhead" style={{ left: `${progress}%` }} />
        </div>
    )
}

