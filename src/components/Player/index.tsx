import Image from 'next/image'
import { useContext, useRef, useEffect, useState } from 'react'
import { PlayerContext } from '../../context/PlayerContext'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0)

    const { episodeList,
        currentEpisodeIndex,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        isPlaying,
        isLooping,
        isShuffling
    } = useContext(PlayerContext)

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }

    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando Agora" />
                <strong>Tocando agora</strong>
            </header>

            {
                episode ? (
                    <div className={styles.currentEpisode}>
                        <Image width={592}
                            height={592}
                            src={episode.thumbnail}
                            objectFit="cover" />
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>
                    </div>
                ) : (
                    <div className={styles.emptyPlayer}>
                        <strong>Selecione um podcast par ouvir</strong>
                    </div>)
            }


            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ background: '#04d361' }}
                                railStyle={{ background: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}

                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        loop={isLooping}
                        onEnded={playNext}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    ></audio>
                )}

                <div className={styles.buttons} >

                    <button
                        type="button"
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar"></img>
                    </button>

                    <button type="button" onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"></img>
                    </button>

                    <button type="button"
                        className={styles.playButton}
                        onClick={togglePlay}>
                        {isPlaying ? (<img src="/pause.svg" alt="Pause"></img>) : (<img src="/play.svg" alt="Tocar"></img>)}
                    </button>

                    <button type="button" onClick={playNext} >
                        <img src="/play-next.svg" alt="Tocar proxima"></img>
                    </button>

                    <button type="button" onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="Repeat"></img>
                    </button>

                </div>
            </footer>
        </div>
    )
}