import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

//meu mozao é perfeito
import styles from './home.module.scss'
import { useContext, useEffect } from 'react'
import { PlayerContext } from '../context/PlayerContext'

type Episodes = {
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  thumbnail: string,
  description: string,
  duration: number,
  durationAsString: string,
  type: string,
  url: string,
  playNow: boolean
}
//meu mozao é fofo
type HomeProps = {
  latesEpisodes: Episodes[],
  allEpisodes: Episodes[]
}

export default function Home({ latesEpisodes, allEpisodes }: HomeProps) {
  const { playList,
    currentEpisodeIndex,
    beforeEpisodeIndex,
    isPlaying,
    togglePlay,
    play } = useContext(PlayerContext)

  const episodeList = [...latesEpisodes, ...allEpisodes]


  function togglePlayNow(episode: Episodes, index: number) {
    const epA = episodeList[index]

    epA.playNow ? [togglePlay()] : [playList(episodeList, index), epA.playNow = true]

    episodeList.map((episode) => { episode.playNow = false })

    if (isPlaying) {
      episode.playNow ? togglePlay() : [playList(episodeList, index), episode.playNow = true]
    } else {
      playList(episodeList, index)
      epA.playNow = true
    }

  }
  //meu mozao é gostoso
  useEffect(() => {
    !isPlaying ? episodeList[currentEpisodeIndex].playNow = true : episodeList[currentEpisodeIndex].playNow = false

  }, [isPlaying])

  return (
    <div className={styles.homePage}>
      <section className={styles.latesEpisodes}>
        <h2>Ultimos Lançamentos</h2>

        <ul>
          {
            latesEpisodes.map((episode, index) => {
              return (
                <li key={episode.id}>
                  <Image
                    width={192}
                    height={192}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />

                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button type="button" onClick={() => togglePlayNow(episode, index)}>
                    <img className={episode.playNow ? styles.isActive : ''} src="/play-green.svg" alt="Tocar episodio"></img>
                  </button>
                </li>
              )
            })
          }
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episodios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duraçao</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button" onClick={() => togglePlayNow(episode, index + 2)}>
                        <img className={episode.playNow ? styles.isActive : ''} src="/play-green.svg" alt="Tocar episodio"></img>
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes',
    {
      params: {
        _limit: 12,
        _sort: 'published_at',
        _order: 'asc'
      }
    })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      thumbnail: episode.thumbnail,
      description: episode.description,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
      type: episode.file.type
    }
  })

  const latesEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latesEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
