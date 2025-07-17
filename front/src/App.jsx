import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/header'
import './index.css'
import UploadPage from './pages/UploadPage'
import NationalDashboard from './pages/NationalDashboard'
import StatePage from './pages/StatePage'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<NationalDashboard />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/state/:stateName" element={<StatePage />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
