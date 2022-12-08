import AuthContext from "./AuthContext";
import {useContext, useState} from "react";

/*
interface Token {
    token: string;
}
*/

interface Param {
    children?: any;
}

export default function AuthProvider({children}: Param) {

    const [token, setToken] = useState(localStorage.getItem('jwt') ?? '');

    const register = (username: string, password: string, passwordAgain: string) => {
        /*return fetch(`${process.env.REACT_APP_BASE_URL}/api/user/register`, {*/
        return fetch(`/api/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    username: username,
                    password: password,
                    passwordAgain: passwordAgain
                }
            )
        })
    }

    const login = (username: string, password: string) => {
        return fetch(`${process.env.REACT_APP_BASE_URL}/api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
    }


    const logout = () => {
        setToken('');
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
//        nav("/users/logout");
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                register,
                login,
                logout
            }} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)