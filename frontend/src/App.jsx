import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ViewSnippet from "./pages/snippets/ViewSnippet";
import Protected from "./components/protected-route/Protected";
import AddSnippet from "./pages/snippets/AddSnippet";
import EditSnippet from "./pages/snippets/EditSnippet";
import Snippets from "./pages/snippets/Snippets";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { checkUserStatus } from "./store/thunks/auth.thunks";
import Loader from "./components/loader/Loader";
import NotFound from "./components/not-found/NotFound";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isCheckingAuth = useSelector((state) => state.auth.isCheckingAuth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserStatus());
  }, [dispatch]);

  if (isCheckingAuth) return <Loader />;
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/snippets" element={<Snippets />} />
          <Route path="/snippet/:id" element={<ViewSnippet />} />
        </Route>

        <Route element={<Protected />}>
          <Route path="snippets/add" element={<AddSnippet />} />
          <Route path="snippets/edit/:id" element={<EditSnippet />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
