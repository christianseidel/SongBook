import React, {Suspense} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SongBook from "./SongBook";

function App() {

    return (
        <div>
            <Suspense fallback={"Loading..."}>
                <BrowserRouter>
                    <Routes>
                        <Route path={'/*'} element={<SongBook />} />

                    </Routes>
                </BrowserRouter>
            </Suspense>
        </div>
    )
}

export default App;