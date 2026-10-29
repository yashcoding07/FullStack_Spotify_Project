import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ArtistDashboard from '../pages/ArtistDashboard'
import UploadMusic from '../pages/UploadMusic'
import CreatePlaylist from '../pages/CreatePlaylist'
import PlaylistDetail from '../pages/PlaylistDetail'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/artist/dashboard" element={<ArtistDashboard />} />
      <Route path="/artist/upload-music" element={<UploadMusic />} />
      <Route path="/artist/create-playlist" element={<CreatePlaylist />} />
      <Route path="/playlist/:id" element={<PlaylistDetail />} />
    </Routes>
  )
}

export default AppRoutes
