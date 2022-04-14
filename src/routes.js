import React from "react";
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

import Main from "./pages/Main";
import Repository from "./pages/Repository";

export default function RoutesApp() {
    return(
        <Router>
            <Routes>
                <Route exact path="/" element={<Main />} />
                <Route exact path="/repository" element={<Repository />} />
            </Routes>
        </Router>
    )
}