import { BrowserRouter, Routes, Route } from 'react-router-dom';


import ProjectList from './pages/ProjectList';
import UsersList from './pages/UserList';
import Settings from './pages/Settings';
import Drafts from './pages/Drafts';
import ProjectPage from './components/ProjectPage';
import Tasks from './pages/Tasks';
import AddUser from './pages/AddUser';



// import ProjectData from './components/ProjectData';


function App() {
  return (
    <BrowserRouter>
 
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/drafts" element={<Drafts />} />
        {/* <Route path="/project-data" element={<ProjectData />} /> */}
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/Tasks" element={<Tasks />} />
         <Route path="/AddUser" element={<AddUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;