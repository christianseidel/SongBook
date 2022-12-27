import React, {FormEvent, useState} from "react";
import {message, MessageType, NewMessage} from "../messageModel";
import DisplayMessage from "../DisplayMessage";
import "../styles/users.css";
import {useAuth} from "./AuthProvider";
import {useNavigate} from "react-router-dom";
import icon_eyes from "../media/images/eyes.png";
import ukulele from "../media/images/ukulele.png";

function LoginUser() {

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [passwordToggle, setPasswordToggle] = useState('password');
    const [message, setMessage] = useState<message | undefined>(undefined);

    const nav = useNavigate();
    const {login} = useAuth();

    const doLogin = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        login(loginUsername, loginPassword)
            .then(() => nav('/songbook'))
            .catch(e => setMessage(NewMessage.create(e.message, MessageType.RED)))
    }


    return (
        <div id={'welcomeContainer'}>
            <div id={'welcomeTitle'}>
                <div id={'welcomeTitleLeft'}>
                    <img src={ukulele} alt="Ukulele" id={'ukuleleUserPage'}/>
                </div>
                    <h1 id={'welcomeTitleRight'}>
                        <span className={'italic'}>Welcome to </span>
                        <div id={'titleSecondPart'}> My Song Book <span className={'italic'}> App</span></div>
                    </h1>
            </div>

            <h3>Login User</h3>
            <form onSubmit={ev => doLogin(ev)}>
                <input type="text" placeholder={'user name'} value={loginUsername} autoFocus required
                       onChange={ev => setLoginUsername(ev.target.value)} tabIndex={1}/>
                <button id={'buttonLogin'} className={'buttonUserMgt'} type="submit">
                    &#10004; login</button>
                <span id={'lineBeforePassword'}>
                    <input type={passwordToggle} placeholder={'password'} value={loginPassword} required
                           onChange={ev => setLoginPassword(ev.target.value)} tabIndex={2}/>
                    <button id={'buttonCoverPassword'} className={'buttonUserMgt'} type='button'
                            onClick={() => ((passwordToggle==='text')
                                ? setPasswordToggle('password')
                                : setPasswordToggle('text'))}>
                        {passwordToggle==='text' && <span id={'coverPassword'}>
                            <span id={'sign01CoverPassword'}>( </span><span id={'sign02CoverPassword'}> ( </span>
                                hide</span>}
                        {passwordToggle==='password' && <><img id={'iconUncoverPassword'} src={icon_eyes} alt={'eyes closed'} />
                            show </>}
                    </button>
                </span>
            </form>
            <div>

            </div>

            <h3 id={'notRegistered'}>Not yet registered?</h3>
            <div>
                Please, create your personal user account:
                <button className={'buttonUserMgt'} id={'buttonRegister'} type={'button'}
                        onClick={() => nav('/users/register')}>&#10140; register</button>
            </div>



            <DisplayMessage message={message}/>
        </div>
    )
}

export default LoginUser