import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { musicApi } from '../config/api'
import Navbar from '../components/Navbar'

const CreatePlaylist = () => {
  const navigate = useNavigate()
  const [songs, setSongs] = useState([])
  const [fetchError, setFetchError] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [fetchingSongs, setFetchingSongs] = useState(true)
  const [selectedSongIds, setSelectedSongIds] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      musics: [],
    },
  })

  // Fetch the artist's uploaded songs to populate the selector
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setFetchingSongs(true)
        const res = await musicApi.get('/artist-musics')
        setSongs(res.data?.musics ?? [])
      } catch (err) {
        console.error('Failed to load songs:', err)
        setFetchError('Could not load your tracks. Please ensure you are logged in as an artist.')
      } finally {
        setFetchingSongs(false)
      }
    }
    fetchSongs()
  }, [])

  const toggleSong = (id) => {
    const updated = selectedSongIds.includes(id)
      ? selectedSongIds.filter((s) => s !== id)
      : [...selectedSongIds, id]

    setSelectedSongIds(updated)
    setValue('musics', updated, { shouldValidate: true })
  }

  const selectedCount = selectedSongIds.length

  const onSubmit = async (data) => {
    setApiError(null)
    try {
      await musicApi.post('/playlist', {
        title: data.title,
        musics: data.musics,
      })

      navigate('/artist/dashboard')
    } catch (err) {
      console.error('Create playlist failed:', err)
      const msg =
        err.response?.data?.message ||
        'Failed to create playlist. Make sure you are logged in as an artist.'
      setApiError(msg)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col pb-24">
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          <Link
            to="/artist/dashboard"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-6 transition-colors"
          >
            ← Back to Artist Dashboard
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Create a Playlist
            </h1>
            <p className="text-neutral-400 mt-1 text-sm sm:text-base">
              Give your playlist a title and pick which tracks to include.
            </p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Playlist Title */}
            <div>
              <label htmlFor="playlistTitle" className="block text-sm font-semibold mb-1.5 text-neutral-200">
                Playlist Title <span className="text-red-400">*</span>
              </label>
              <input
                id="playlistTitle"
                type="text"
                placeholder="e.g. Late Night Vibes"
                {...register('title', {
                  required: 'Playlist title is required',
                })}
                className={`w-full px-4 py-2.5 rounded-lg bg-neutral-900 border text-white placeholder-neutral-500 text-sm focus:outline-none transition-colors ${
                  errors.title
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-neutral-700 focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]'
                }`}
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1.5">{errors.title.message}</p>
              )}
            </div>

            {/* Songs Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-neutral-200">
                  Select Tracks
                  <span className="ml-2 text-xs font-normal text-neutral-500">(Optional — add more later)</span>
                </label>
                {selectedCount > 0 && (
                  <span className="text-xs font-semibold text-[#1DB954]">
                    {selectedCount} selected
                  </span>
                )}
              </div>

              {/* Hidden field */}
              <input type="hidden" {...register('musics')} />

              {fetchingSongs ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex items-center justify-center gap-3 text-neutral-400 text-sm">
                  <svg className="animate-spin w-5 h-5 text-[#1DB954]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading your tracks…
                </div>
              ) : fetchError ? (
                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-red-400 text-sm">
                  {fetchError}
                </div>
              ) : songs.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center text-neutral-400 text-sm">
                  <p className="font-medium">No tracks uploaded yet.</p>
                  <Link
                    to="/artist/upload-music"
                    className="inline-block mt-2 text-[#1DB954] hover:underline font-semibold text-sm"
                  >
                    Upload your first track →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {songs.map((song) => {
                    const isSelected = selectedSongIds.includes(song._id)
                    return (
                      <button
                        key={song._id}
                        type="button"
                        onClick={() => toggleSong(song._id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 text-left ${
                          isSelected
                            ? 'bg-[#1DB954]/10 border-[#1DB954] ring-1 ring-[#1DB954]'
                            : 'bg-neutral-900 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800'
                        }`}
                      >
                        {song.coverImageUrl ? (
                          <img
                            src={song.coverImageUrl}
                            alt={song.title}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-neutral-700 flex items-center justify-center flex-shrink-0 text-neutral-500 font-bold text-lg">
                            ♫
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{song.title}</p>
                          <p className="text-xs text-neutral-400 truncate">{song.artist || "Unknown Artist"}</p>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-colors ${
                            isSelected
                              ? 'bg-[#1DB954] border-[#1DB954]'
                              : 'border-neutral-600'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-full bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] text-black font-bold text-sm tracking-wide transition-all duration-200 shadow-md"
            >
              {isSubmitting ? 'Creating Playlist...' : `Create Playlist${selectedCount > 0 ? ` (${selectedCount} track${selectedCount > 1 ? 's' : ''})` : ''}`}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreatePlaylist
