import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoriesComponent from './components/Categories/Categories';
import './App.css';
import ItemsComponent from './components/Items/Items';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CategoriesComponent/>} />
        <Route path="/items/:categoryId" element={<ItemsComponent/>} />
      </Routes>
    </Router>
  );
}

export default App;
