import logo from './logo.svg';
import './App.css';
import Home from './components/app_components/Home';
import Header from './components/base_components/Header';
import New from './components/app_components/New';
import NewGroup from './components/app_components/NewGroup';
import { useNotificationCenter } from "react-toastify/addons/use-notification-center";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <Header/>
      <NewGroup/>
      <ToastContainer />
      <Home/>
    </div>
  );
}

export default App;
