import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'

const UploadMusic = () => {
  const navigate = useNavigate()
  const [coverPreview, setCoverPreview] = useState(null)
  const [musicFileName, setMusicFileName] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      // Build multipart/form-data — matches upload.fields(['music','coverImage'])
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('music', data.music[0])
      formData.append('coverImage', data.coverImage[0])

      await axios.post('http://localhost:3002/api/music/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      navigate('/artist/dashboard')
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleMusicChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setMusicFileName(file.name)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-[#181818] border-b border-neutral-800 sticky top-0 z-10">
        <Link to="/artist/dashboard" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <span className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-black text-xl">
            ♫
          </span>
          <span>Spotify</span>
        </Link>
        <span className="text-xs font-semibold uppercase tracking-wider bg-neutral-800 text-[#1DB954] px-2.5 py-1 rounded-full border border-neutral-700 hidden sm:inline-block">
          Upload Music
        </span>
        <Link
          to="/artist/dashboard"
          className="text-sm text-neutral-400 hover:text-white font-semibold transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </header>

      {/* Form Container */}
      <main className="flex-1 flex items-start justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Upload a New Track
            </h1>
            <p className="text-neutral-400 mt-1.5 text-sm sm:text-base">
              Fill in the details below and upload your music and cover art.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-1.5 text-neutral-200">
                Track Title <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Midnight Waves"
                {...register('title', {
                  required: 'Track title is required',
                  minLength: { value: 1, message: 'Title cannot be empty' },
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

            {/* Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-semibold mb-1.5 text-neutral-200">
                Cover Image <span className="text-red-400">*</span>
              </label>

              <label
                htmlFor="coverImage"
                className={`flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed cursor-pointer transition-colors overflow-hidden ${
                  errors.coverImage
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-neutral-700 bg-neutral-900 hover:border-[#1DB954] hover:bg-[#1DB954]/5'
                }`}
              >
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
                    <svg className="w-10 h-10 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-sm text-neutral-400 font-medium">Click to upload cover image</p>
                    <p className="text-xs text-neutral-500">PNG, JPG, WEBP — recommended 1:1 ratio</p>
                  </div>
                )}
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register('coverImage', {
                    required: 'Cover image is required',
                    validate: (files) => {
                      if (!files?.[0]) return 'Cover image is required'
                      if (files[0].size > 10 * 1024 * 1024) return 'Image must be smaller than 10 MB'
                      return true
                    },
                  })}
                  onChange={(e) => {
                    register('coverImage').onChange(e)
                    handleCoverChange(e)
                  }}
                />
              </label>
              {errors.coverImage && (
                <p className="text-red-400 text-xs mt-1.5">{errors.coverImage.message}</p>
              )}
            </div>

            {/* Music File */}
            <div>
              <label htmlFor="music" className="block text-sm font-semibold mb-1.5 text-neutral-200">
                Music File <span className="text-red-400">*</span>
              </label>

              <label
                htmlFor="music"
                className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                  errors.music
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-neutral-700 bg-neutral-900 hover:border-[#1DB954] hover:bg-[#1DB954]/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-neutral-300">
                      {musicFileName ?? 'Click to select audio file'}
                    </p>
                    <p className="text-xs text-neutral-500">MP3, WAV, FLAC, AAC — max 100 MB</p>
                  </div>
                </div>
                <span className="text-xs text-[#1DB954] font-semibold flex-shrink-0">Browse</span>
                <input
                  id="music"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  {...register('music', {
                    required: 'Music file is required',
                    validate: (files) => {
                      if (!files?.[0]) return 'Music file is required'
                      if (files[0].size > 100 * 1024 * 1024) return 'File must be smaller than 100 MB'
                      return true
                    },
                  })}
                  onChange={(e) => {
                    register('music').onChange(e)
                    handleMusicChange(e)
                  }}
                />
              </label>
              {errors.music && (
                <p className="text-red-400 text-xs mt-1.5">{errors.music.message}</p>
              )}
            </div>

            {/* Info note about auto-filled fields */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-xs text-neutral-400 leading-relaxed">
              <span className="font-semibold text-neutral-300">Auto-filled from your profile: </span>
              Artist name and Artist ID are automatically set from your logged-in session.
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-full bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] text-black font-bold text-sm tracking-wide transition-all duration-200 shadow-md"
            >
              {isSubmitting ? 'Uploading...' : 'Upload Track'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default UploadMusic

