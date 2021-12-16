import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Link
} from "react-router-dom";
import Home from "../features/home/home";

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />}></Route>
        </Routes>
    </BrowserRouter>
);

export default Router;