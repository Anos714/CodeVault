import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ViewSnippet from "./pages/snippets/ViewSnippet";
import Protected from "./components/protected-route/Protected";
import AddSnippet from "./pages/snippets/AddSnippet";
import EditSnippet from "./pages/snippets/EditSnippet";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/snippet/:id" element={<ViewSnippet />} />
        </Route>

        <Route element={<Protected />}>
          <Route path="snippet/add" element={<AddSnippet />} />
          <Route path="snippet/edit/:id" element={<EditSnippet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
