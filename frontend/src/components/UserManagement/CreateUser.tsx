import React, {FormEvent, useEffect, useState} from "react";
import {useAuth} from "./AuthProvider";
import {message, MessageType, NewMessage} from "../messageModel";
import DisplayMessage from "../DisplayMessage";
import icon_eyes from "../media/images/eyes.png"
import '../styles/users.css'
import {useNavigate} from "react-router-dom";
import ukulele from "../media/images/ukulele.png";

function CreateUser() {

    const nav = useNavigate();

    const [username, setUsername] = useState(localStorage.getItem('registerUsername') ?? '');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [passwordToggle, setPasswordToggle] = useState('password');
    const [message, setMessage] = useState<message | undefined>(undefined);

    useEffect(() => {
        localStorage.setItem('registerUsername', username);
    }, [username]);

    const {register} = useAuth();

    function doRegister (ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        register(username, password, passwordAgain)
            .then(response => {
                if (response.status === 201) {
                    clearForm();
                    setMessage(NewMessage.createAndWait(
                        'You successfully created your personal user account. Your username is "' + username + '".',
                        '/songbook'));
                } else if (response.status === 400) {
                    setMessage(NewMessage.create(
                        'Passwords are not identical.',
                        MessageType.RED));
                    clearForm();
//                    nav('/users/login');
                } else if (response.status === 409) {
                    setMessage(NewMessage.create(
                        'User name already exists.',
                        MessageType.RED))
                    clearForm();
//                    nav('/users/login');
                } else if (response.status === 404) {
                    setMessage(NewMessage.create(
                        'Server currently unable to create new user.',
                        MessageType.RED));
                    clearForm();
                } else {
                    setMessage(NewMessage.create(
                        'Something unexpected happened (error code: ' + response.status + ').',
                        MessageType.RED));
                    clearForm();
                }
            })
    }

    const clearForm = () => {
        localStorage.removeItem('registerUsername');
        setUsername('');
        setPassword('');
        setPasswordAgain('');
    }

    const cancelCreation = () => {
        clearForm();
        nav('/users/login');
    }


    return(
        <div id={'welcomeContainer'}>
            <div id={'welcomeTitle'}>
                <div id={'welcomeTitleLeft'}>
                    <img src={ukulele} alt="Ukulele" id={'ukuleleLogin'}/>
                </div>
                <h1 id={'welcomeTitleRight'}>
                    <div> My Song Book <span className={'italic'}> App</span></div>
                </h1>
            </div>

            <h3 id={'plsCreate'}>Please, create your personal user account:</h3>
            <form onSubmit={ev => doRegister(ev)}>
                <span className={'nextLineUsers'}>
                    <input type="text" placeholder={'user name'} value={username} autoFocus required
                           onChange={ev => setUsername(ev.target.value)} tabIndex={1}/>
                    <button id={"buttonCreateUser"} className={'buttonUserMgt'} type="submit">
                    &#10004; create</button>
                </span>
                <span id={'lineBeforePassword'}>
                    <input type={passwordToggle} placeholder={'password'} value={password} required
                           onChange={ev => setPassword(ev.target.value)} tabIndex={2}/>
                    <button id={"buttonCoverPassword"} className={'buttonUserMgt'} type="button"
                            onClick={() => ((passwordToggle==='text')
                                ? setPasswordToggle('password')
                                : setPasswordToggle("text"))}>
                        {passwordToggle==='text' && <><span id={'coverPassword'}> &#10005;&#10005;&nbsp;</span> hide</>}
                            {passwordToggle==='password' && <><img id={'iconUncoverPassword'} src={icon_eyes} alt={'eyes closed'} />
                                show </>}
                    </button>
                </span>
                <span className={'nextLineUsers'}>
                    <input type={passwordToggle} placeholder={'password again'} value={passwordAgain} required
                           onChange={ev => setPasswordAgain(ev.target.value)} tabIndex={3}/>
                    <button id={"buttonCancelRegistration"} className={'buttonUserMgt'} type="button"
                            onClick={cancelCreation}>
                    &#10008; cancel
                </button>

                </span>
            </form>



            <DisplayMessage message={message}/>
        </div>
    )

}

export default CreateUser