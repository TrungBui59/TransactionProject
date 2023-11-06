import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./containers/Layout";
import Home from "./containers/Home";
import People from "./containers/People";
import NoPage from "./containers/NoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="people" element={<People />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
