import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import ukulele from "../media/images/ukulele.png";
import {useAuth} from "./AuthProvider";
import {message, MessageType, NewMessage} from "../messageModel";
import MessageBox from "../MessageBox";
import '../styles/users.css';
import '../styles/common.css';
import {UserDTO} from "./modelsUser";

function InfoUser() {

    const nav = useNavigate();
    const {token} = useAuth();
    const [userDTO, setUserDTO] = useState({} as UserDTO);
    const [username, setUsername] = useState(userDTO.username);
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
            } else if (response.status === 403) {
                nav('/users/login')
            } else {
                throw Error ('Something unexpected happened. Error code: ' + response.status + '.');
            }})
            .then(userDTO => {
                setUserDTO(userDTO);
                setUsername(userDTO.username);
            })
            .catch(e => setMessage(NewMessage.create(e.message, MessageType.RED)))
    }, [token, nav])

    function deleteUser() {
        if (userDTO.username === 'test') {
            setMessage(NewMessage.create('This is a test account. You can do anything using it, except deleting the account itself. However, you may set up your own account and then delete it.', MessageType.RED));
        } else if (userDTO.username === 'christian') {
            setMessage(NewMessage.create('No. You do not want to do this!', MessageType.RED));
        } else {
            fetch(`${process.env.REACT_APP_BASE_URL}/api/user/info/` + localStorage.getItem('username'), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.status !== 200) {
                        if (response.status === 404) {
                            throw Error('User could not be found.');
                        } else {
                            throw Error('Something unexpected happened! Error type: "' + response.statusText + '". Error code: ' + response.status + '.');
                        }
                    }
                })
                .then(() => {
                    localStorage.removeItem('jwt');
                    localStorage.removeItem('username');
                    document.getElementById('deleteUserContainer')!.style.animation = 'none';
                    document.getElementById('deleteUserBox')!.style.animation = 'none';
                    setMessage(NewMessage.createAndWait(
                        'User account "' + username + '" has been deleted. ' +
                        'Thank you for using "My Song Book" App.',
                        'user/login'))
                })
                .catch(e => {
                    localStorage.removeItem('jwt');
                    localStorage.removeItem('username');
                    setMessage(NewMessage.create(e.message, MessageType.RED));
                });
        }
    }

    return (
        <div id={'deleteUserContainer'}>
            <div>
                <div id={'welcomeTitleLeft'}>
                    <img src={ukulele} alt="Ukulele" id={'ukuleleUserPage'}/>
                </div>
                <h1 id={'welcomeTitleRight'}>
                    <div id={'titleUserInfo'}> Danger Zone </div>
                </h1>
            </div>

            <div id={'deleteUserBox'}>
                <p>You are about to <span className={'bold'}>delete</span> your account <span className={'bold'}>{username}</span> ...</p>
                <p className={'expandedLineHeight'}>
                    This account  has
                    <span className={'bold'}> {userDTO.numberOfSongs} songs</span> and
                    <span className={'bold'}> {userDTO.numberOfSongSheetFiles} song sheet files </span>
                    attached to it.<br/> All these items will be lost.
                </p>

                <p id={'plsConfirm'}>Please confirm: </p>

                <div id={'deleteUserLine'}>
                    <button id={'buttonCancelUserDeletion'} onClick={() => nav('/songbook')}>
                        cancel</button>

                    <button id={'buttonConfirmUserDeletion'} onClick={deleteUser}>
                        delete</button>
                </div>
            </div>


            <MessageBox message={message}/>
        </div>
    );
}

export default InfoUser;
