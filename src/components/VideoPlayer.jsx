import { Timeline } from "./Timeline";
import { TrimBar } from "./TrimBar";
import { useEffect, useRef, useState } from 'react'

export function VideoPlayer() {
    const videoRef = useRef(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [thumbnails, setThumbnails] = useState([])
    const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false)

    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(duration)

    //new start time when the start state changes
    // useEffect(() => {
    //     if (videoRef.current) {
    //         videoRef.current.currentTime = start
    //     }
    // }, [start])
    

    // Updates current time and ensures playback stays within the trim range
    function handleTimeUpdate() {
        const time = videoRef.current.currentTime
        console.log(videoRef.current.currentTime)
        setCurrentTime(time)
        

        if (time > end) {
            videoRef.current.pause()
            videoRef.current.currentTime = start
        }
        if (time < start) {
            videoRef.current.currentTime = start
        }
    }
    
    // change the video to the clicked time on the timeline
    function onClickTimeline(time) {
        console.log('onClickTimeline time', time);
        videoRef.current.currentTime = time
        setCurrentTime(time)
        console.log('onClickTimeline .currentTime', videoRef.current.currentTime);

        // if (videoRef.current) {
        //     videoRef.current.currentTime = time
        //     setCurrentTime(time)
        // }
    }

    // Handles video metadata load and generates thumbnails
    async function handleLoadedMetadata() {
        const videoDuration = videoRef.current.duration
        setDuration(videoDuration)
        setEnd(videoDuration)

        setIsGeneratingThumbnails(true)
        const thumbs = await generateThumbnails(videoRef.current, 20)
        setThumbnails(thumbs)
        setIsGeneratingThumbnails(false)

        // // Reset currentTime to start after loading and generating thumbnails
        // videoRef.current.currentTime = start
        // setCurrentTime(start)
    }

    // Generates evenly spaced thumbnails from the video
    async function generateThumbnails(videoElement, count = 10) {
        const thumbnails = []
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        for (let i = 0; i < count; i++) {
            const time = (videoElement.duration / count) * i
            videoElement.currentTime = time

            await new Promise(resolve => {
                videoElement.onseeked = () => {
                    canvas.width = videoElement.videoWidth / 4
                    canvas.height = videoElement.videoHeight / 4
                    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
                    thumbnails.push(canvas.toDataURL())
                    resolve()
                }
            })
        }

        return thumbnails
    }


    return (
        <div className="video-player">
            <h1>CyberSheli Assignment - Video Player</h1>
            <section className="video-erea">
                <video ref={videoRef} src="/coverr-video-beach.mp4" style={{ visibility: isGeneratingThumbnails ? "hidden" : "visible" }} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} controls/>
            </section>
            { !isGeneratingThumbnails &&  <section className="editor">
                <Timeline currentTime={currentTime} duration={duration} thumbnails={thumbnails} onClickTimeline={onClickTimeline} />
                <TrimBar duration={duration} start={start} end={end} onStartChange={setStart} onEndChange={setEnd} />
            </section>}
        </div>
    )
}
