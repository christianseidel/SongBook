import AuthContext from "./AuthContext";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {MessageType, NewMessage} from "../messageModel";

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
            .then(response => {
            loginResponse = response;
            return response.json();
        })
        .then((token: Token) => {
            setToken(token.token);
            localStorage.setItem('jwt', token.token);
            localStorage.setItem('username', username)
            return loginResponse;
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
            if (response.status === 401 || response.status === 403) {
                throw Error ('User name or user password is invalid.');
            } else if (response.status === 404) {
                throw Error('Server currently unable to check user data.');
            } else if (response.status !== 200) {
                throw Error ('Something unexpected happened! Error type: "' + response.statusText + '". Error code: ' + response.status + ').');
            } else {
                return response.json();
            }
        })
            .then((token: Token) => {
                setToken(token.token);
                localStorage.setItem('jwt', token.token);
                localStorage.setItem('username', username)
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