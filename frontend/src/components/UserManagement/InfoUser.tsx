import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import ukulele from "../media/images/ukulele.png";
import {useAuth} from "./AuthProvider";
import {message, MessageType, NewMessage} from "../messageModel";
import MessageBox from "../MessageBox";
import {DayOfCreation} from "../Songs/modelsSong";
import '../styles/users.css';
import '../styles/common.css';
import {UserDTO} from "./modelsUser";

function InfoUser() {

    const nav = useNavigate();
    const {token} = useAuth();
    const [userDTO, setUserDTO] = useState({} as UserDTO);
    const [dateCreated, setDateCreated] = useState('');
    const [message, setMessage] = useState<message | undefined>(undefined);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/user/info/` + localStorage.getItem('username'), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
            if (response.status === 200) {
                return response.json()
            } else if (response.status === 500) {
                throw Error ('Server unavailable (error code 500)');
            } else {
                throw Error ('Something unexpected happened. Error code: ' + response.status + '.')
            }})
            .then(userDTO => {
                setUserDTO(userDTO);
                let date = new DayOfCreation(userDTO.dateCreated);
                setDateCreated(date.day + '.' + date.month + '.' + date.year);
            })
            .catch(e => setMessage(NewMessage.create(e.message, MessageType.RED)))
    }, [token])

    return (
        <div id={'userInfoContainer'}>
            <div>
                <div id={'welcomeTitleLeft'}>
                    <img src={ukulele} alt="Ukulele" id={'ukuleleUserPage'}/>
                </div>
                <h1 id={'welcomeTitleRight'}>
                    <div id={'titleUserInfo'}> My Song Book </div>
                </h1>
            </div>

            <h3 id={'displayUsername'}>
                User Name: <span id={'userName'}>{localStorage.getItem('username')}</span>
            </h3>

            <div className={'userInfoBox'}>
                <label>account created:</label> <span id={'dateUserCreated'}>{dateCreated}</span>
                <div className={'labelUserInfo'}>number of references: <span id={'userNumberOfReferences'}>{userDTO.numberOfReferences}</span></div>
                <div className={'labelUserInfo'}>number of songs: <span id={'userNumberOfSongs'}>{userDTO.numberOfSongs}</span></div>
                <div className={'labelUserInfo'}>number of song sheets: <span id={'userNumberOfSongSheetFiles'}>{userDTO.numberOfSongSheetFiles}</span></div>
                <div id={'deleteUserLine'}>
                    <button id={'buttonDeleteUser'} onClick={() => nav('/users/delete')}>
                        delete</button> this user account
                </div>
            </div>

            <div>
                <button id={"buttonReturn"} className={'buttonUserMgt'}
                        type={'button'} onClick={() => nav('/songbook')}>
                    <span id={'textButtonReturn'}>
                        <span className={'leftArrowOnLeft'}>&#10140; </span>
                        return</span>
                </button>
            </div>

            <MessageBox message={message}/>
        </div>
    );
}

export default InfoUser;
