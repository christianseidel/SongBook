import './styles/message.css'
import {useEffect} from "react";

interface MessageProps {
    message: string
    onClose: () => void;
}

function DisplayMessage(props: MessageProps) {

    useEffect(() => {
        let messageMarker = sessionStorage.getItem('messageMarker');
        if (messageMarker === 'red' || messageMarker === 'blue') {

            let messageContainer = document.getElementById('messageContainer') as HTMLDivElement | null;
            if (messageContainer !== null) {
                messageContainer.style.borderColor = messageMarker;
            }

            let messageIcon = document.getElementById('messageIcon') as HTMLDivElement | null;
            if (messageIcon !== null) {
                if (messageMarker === 'red') {
                    messageIcon.innerHTML = '!';
                } else {
                    messageIcon.innerHTML = '?';
                }
                messageIcon.style.color = messageMarker;
            }
        } else if (messageMarker === 'blue') {
            alert("okay, das muss noch...")
        } else {
            setTimeout(() => {
                let messageContainer = document.getElementById('messageContainer') as HTMLDivElement | null;
                if (messageContainer !== null) {
                    messageContainer.style.animation = 'fadeOut ease 1s'
                }}, 2000);
            setTimeout(() => {
                    props.onClose()},
                3000);
        }
    }, []);


    return (
        <div>
            <div id={'messageContainer'}>
                <div id={'messageIcon'}>&#10003;</div>
                <div className={'message'}>
                    {props.message}
                    <div id={'buttonOKContainer'}>
                        <button id={'buttonOK'} onClick={props.onClose}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayMessage