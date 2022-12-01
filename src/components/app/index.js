// import './app.css';
import { Routes, Route } from 'react-router-dom'
// context
import { AuthProvider } from '../../context/loginContext';

import Protected from '../../util/protected';
import PageNotFound from '../pageNotFound';
// login
import Login from '../Login/index'
import Home from '../home/index';
import Welcome from '../welcome';
import Users from '../user/Users';
import Roles from '../roles/Roles';
import Rights from '../rights/Rights';
import Cate from '../goods/Cate';


import './App.css'
import Params from '../goods/Params';
import List from '../goods/List';
import Add from '../goods/Add';


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
            <Route path='categories' element={<Cate />} />
            <Route path='attributes' element={<Params />} />
            <Route path='goods' element={<List />} />
            <Route path='goods/add' element={<Add />} />
          </Route>
        </Route>
        <Route path='*' element={<PageNotFound />} />
      </Routes>


    </AuthProvider>
  );
}

export default App;
