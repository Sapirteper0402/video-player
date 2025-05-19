import { useRef, useState } from 'react'

export function TrimBar({ duration, start, end, onStartChange, onEndChange }) {
    
    const barRef = useRef(null)
    const [dragging, setDragging] = useState(null) // 'start' | 'end' | null
  

    //the user starts dragging either the start or end handle
    function handleMouseDown(type) {
        setDragging(type)
    }

    //the user moves the mouse while dragging a handle
    function handleMouseMove(ev) {
        if (!dragging || !barRef.current) return

        const rect = barRef.current.getBoundingClientRect()
        const x = ev.clientX - rect.left
        const percent = Math.min(Math.max(x / rect.width, 0), 1)
        const time = percent * duration

        if (dragging === 'start') {
            onStartChange(Math.min(time, end - 0.1))
        } else if (dragging === 'end') {
            onEndChange(Math.max(time, start + 0.1))
        }
    }

    //the user releases the mouse button to stop dragging
    function handleMouseUp() {
        setDragging(null)
    }

    // Converts a time value in seconds to a MM:SS format string
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }


    return (
        <div className="trim-bar" ref={barRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} >
            <div className="range" style={{
                left: `${(start / duration) * 100}%`,
                width: `${((end - start) / duration) * 100}%`
            }} ></div>
            <div className="handle start" style={{ left: `${(start / duration) * 100}%` }} onMouseDown={() => handleMouseDown('start')}>
                <div className="time-label">{formatTime(start)}</div>
            </div>
            <div className="handle end" style={{ left: `${(end / duration) * 100}%` }} onMouseDown={() => handleMouseDown('end')}>
                <div className="time-label">{formatTime(end)}</div>
            </div>
        </div>
    )
}
