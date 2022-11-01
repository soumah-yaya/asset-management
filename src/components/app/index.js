import './app.css';
import { Routes, Route } from 'react-router-dom'
// context
import { AuthProvider } from '../../context/loginContext';

import Protected from '../../util/protected';
import PageNotFound from '../pageNotFound';
// login
import Login from '../Login/index'
import Home from '../home/index';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Protected />}>
          <Route index element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
        </Route>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>


    </AuthProvider>
  );
}

export default App;
