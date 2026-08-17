import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicRoutes from './routes/PublicRoutes'
import PrivateRoutes from './routes/PrivateRoutes'

function App() {
  return <BrowserRouter><Routes>
    <Route path="/*" element={<PublicRoutes />} />
    <Route path="/app/*" element={<PrivateRoutes />} />
  </Routes></BrowserRouter>
}

export default App
