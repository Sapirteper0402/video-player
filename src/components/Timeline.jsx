
export function Timeline({ currentTime, duration, thumbnails, onClickTimeline }) {
    const progress = (currentTime / duration) * 100

    // Handles user click on the timeline and find the time
    function onClick(ev) {
        const rect = ev.currentTarget.getBoundingClientRect()
        const clickX = ev.clientX - rect.left
        const percentage = clickX / rect.width
        const time = percentage * duration
        onClickTimeline(time)
    }
    
    return (
        <div className="timeline" onClick={onClick}>
            <div className="thumbnail-strip">
                {thumbnails.map((src, idx) => (
                    <img key={idx} src={src} alt={`thumb-${idx}`} />
                ))}
            </div>
            <div className="playhead" style={{ left: `${progress}%` }} />
        </div>
    )
}

