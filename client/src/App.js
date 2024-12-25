import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard  from './components/Dashboard/Dashboard';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route default path="/login" element = {<Login />} />
        <Route path="/home" element = {<Dashboard/>}  />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
