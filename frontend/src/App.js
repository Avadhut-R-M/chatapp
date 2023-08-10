import logo from './logo.svg';
import './App.css';
import Home from './components/app_components/Home';
import Header from './components/base_components/Header';
import New from './components/app_components/New';
import NewGroup from './components/app_components/NewGroup';

function App() {
  return (
    <div className="App">
      <Header/>
      <NewGroup/>
      <Home/>
    </div>
  );
}

export default App;
