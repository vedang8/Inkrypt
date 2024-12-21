import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './components/Login/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route default path="/login" element = {<Login />} />
        <Route path="/home" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
