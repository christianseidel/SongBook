import React, {Suspense} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SongBook from "./SongBook";
import AuthProvider from "./UserManagement/AuthProvider";
import CreateUser from "./UserManagement/CreateUser";
import LoginUser from "./UserManagement/LoginUser";
import LogoutUser from "./UserManagement/LogoutUser";
import InfoUser from "./UserManagement/InfoUser";

function App() {

    return (
        <div>
            <Suspense fallback={"Loading..."}>
                <BrowserRouter>
                    <AuthProvider>
                    <Routes>
                        <Route path={'/*'} element={<SongBook />} />
                        <Route path={'/songbook'} element={<SongBook />} />

                        <Route path={'/users/register'} element={<CreateUser />} />
                        <Route path={'/users/login'} element={<LoginUser />} />
                        <Route path={'/users/info'} element={<InfoUser />} />
                        <Route path={'/users/logout'} element={<LogoutUser />}/>
                    </Routes>
                    </AuthProvider>
                </BrowserRouter>
            </Suspense>
        </div>
    )
}

export default App;