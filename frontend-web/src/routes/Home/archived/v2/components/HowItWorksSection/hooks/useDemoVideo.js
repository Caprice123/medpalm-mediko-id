import { useState } from 'react'
import { extractYoutubeId } from '@routes/Home/utils/youtube'

export function useDemoVideo(youtubeUrl) {
  const [playing, setPlaying] = useState(false)
  const videoId = extractYoutubeId(youtubeUrl)

  const play = () => {
    if (videoId) setPlaying(true)
  }

  return { playing, videoId, play }
}
