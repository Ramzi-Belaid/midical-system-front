import './App.css';
import Header from './Component/Header'
import Sidebar from './Component/Sidbar'  // ✅ تصحيح الاسم
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ CSS الخاص بـ Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ JavaScript الخاص بـ Bootstrap
import "remixicon/fonts/remixicon.css";
import Menu from './Component/Menu';
import Patient from './Component/Patient'
import Appointments from './Component/Appointments';
import { Routes,Route } from 'react-router-dom';
import MyCalendar from './Component/MyCalendar';
import Notifications from './Component/Notifications';


function App() {
  return (
    <>
      <Sidebar />
      <Header />
      <div className='main-container'>
        <Routes>
          <Route path='/' element={ <Menu />} />
          <Route path='/patients' element={<Patient />}/>
          <Route path='/appointments' element={<Appointments />}/>
          <Route path='/Schedule' element={<MyCalendar/>}/>
          <Route path='/Notifications' element={<Notifications/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
