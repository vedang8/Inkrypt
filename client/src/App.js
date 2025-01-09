import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Dashboard  from './components/Dashboard/Dashboard';
import {useSelector} from "react-redux";
import Spinner from './utils/Spinner';
import NoteDisplay from './components/NoteDisplay/NoteDisplay';
import NoteEditor from './components/NoteEditor/NoteEditor';

function App() {
  const loading = useSelector(state=>state.loader.value);
  return (
    <>
    {loading && <Spinner/>}
    <BrowserRouter>
      <Routes>
        <Route path="/login" element = {<Login />} />
        <Route path="/register" element = {<Register />} />
        <Route path="/home" element = {<Dashboard />}  />
        <Route path="/note-display/:noteId" element = {<NoteDisplay />} />
        <Route path="/note/edit/:noteId" element = {<NoteEditor />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
