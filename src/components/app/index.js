// import './app.css';
import { Routes, Route, Navigate } from 'react-router-dom'
// context
import { AuthProvider } from '../../context/loginContext';

import Protected from '../../util/protected';
import PageNotFound from '../pageNotFound';
// login
import Login from '../Login/index'
import Home from '../home/index';
import Welcome from '../home/components/welcome';
import Users from '../home/components/user/Users';
import Roles from '../home/components/Roles';
import Rights from '../home/components/Rights';

import './App.css'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Protected />}>

          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} >
            <Route index element={<Welcome />} />
            <Route path='users' element={<Users />} />
            <Route path='roles' element={<Roles />} />
            <Route path='rights' element={<Rights />} />
          </Route>
        </Route>
        <Route path='*' element={<PageNotFound />} />
      </Routes>


    </AuthProvider>
  );
}

export default App;
