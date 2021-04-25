import { createContext, useState, ReactNode } from "react"

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string,
    playNow: boolean
}

type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number,
    beforeEpisodeIndex: number,
    isPlaying: boolean,
    isLooping: boolean,
    isShuffling: boolean,
    play: (episode: Episode) => void,
    playList: (list: Episode[], index: number) => void,
    togglePlay: () => void,
    toggleLoop: () => void,
    toggleShuffle: () => void,
    playNext: () => void,
    playPrevious: () => void,
    setPlayingState: (state: Boolean) => void

}
export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
    children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {

    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrenEpisodeIndex] = useState(0)
    const [beforeEpisodeIndex, setBeforeEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    function play(episode: Episode) {
        setEpisodeList([episode])
        setCurrenEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list)
        setCurrenEpisodeIndex(index)
        setIsPlaying(true)

    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
        setBeforeEpisodeIndex(currentEpisodeIndex)
    }

    function toggleLoop() {
        setIsLooping(!isLooping)
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    function playNext() {
        let nextEpisodeIndex = currentEpisodeIndex + 1

        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrenEpisodeIndex(nextRandomEpisodeIndex)
        } else {
            if (nextEpisodeIndex > episodeList.length) {
                nextEpisodeIndex = 0
            } else {
                setCurrenEpisodeIndex(nextEpisodeIndex)
            }
        }
    }

    function playPrevious() {
        const previousEpisodeIndex = currentEpisodeIndex - 1
        if (previousEpisodeIndex < 0) {
            setCurrenEpisodeIndex(episodeList.length)
        } else {
            setCurrenEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            beforeEpisodeIndex,
            play,
            playList,
            isPlaying,
            togglePlay,
            setPlayingState,
            playNext,
            playPrevious,
            toggleLoop,
            toggleShuffle,
            isLooping,
            isShuffling
        }}>
            {children}
        </PlayerContext.Provider>)
}