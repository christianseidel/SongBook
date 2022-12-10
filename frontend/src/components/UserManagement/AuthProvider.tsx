import AuthContext from "./AuthContext";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

interface Token {
    token: string;
}

interface Param {
    children?: any;
}

export default function AuthProvider({children}: Param) {

    const [token, setToken] = useState(localStorage.getItem('jwt') ?? '');
    let loginResponse: Response;
    const nav = useNavigate();

    useEffect(() =>{
        localStorage.setItem('jwt', token);
    }, [token])


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
    .then(response => {
            loginResponse = response;
            if (response.status === 401 || response.status === 403) {
                throw Error ('Benutzername oder Passwort ist nicht korrekt');
            }
            return response.json();
        })
            .then((token: Token) => {
                setToken(token.token);
                localStorage.setItem('jwt', token.token);
                localStorage.setItem('username', username)
                return loginResponse;
            })
    }


    const logout = () => {
        setToken('');
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
        nav('/users/logout');
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