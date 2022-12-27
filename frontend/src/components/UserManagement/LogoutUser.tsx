import {useNavigate} from "react-router-dom";
import React from "react";
import ukulele from "../media/images/ukulele.png";

function LogoutUser() {

    const nav = useNavigate();

    return (
        <div id={'welcomeContainer'}>
            <div id={'welcomeTitle'}>
                <div id={'welcomeTitleLeft'}>
                    <img src={ukulele} alt="Ukulele" id={'ukuleleUserPage'}/>
                </div>
                <h1 id={'welcomeTitleRight'}>
                    <div id={'titleLogout'}> My Song Book </div>
                </h1>

            </div>

            <div>
                <h3>You Have Logged Out!</h3>
            </div>

            <div>
                <button id={"buttonLoginAgain"} className={'buttonUserMgt'}
                        type={'button'} onClick={() => nav('/users/login')}>
                    &#10140; return</button>
            </div>
        </div>
    );
}

export default LogoutUser;
