import '../styles/message.css'
import {useEffect} from "react";

interface MessageProps {
    message: string
    onClose: () => void;
}

function DisplayMessageReferences(props: MessageProps) {

    useEffect(() => {
        let messageContainer = document.getElementById('messageContainer') as HTMLDivElement | null;
        let messageIcon = document.getElementById('messageIcon') as HTMLDivElement | null;
        let messageType = sessionStorage.getItem('messageType');

      if (messageType !== null) {
            if (messageContainer !== null) {
                messageContainer.style.borderColor = messageType;
            }
            if (messageIcon !== null) {
                messageIcon.style.color = messageType;
                if (messageType === 'red') {
                    messageIcon.innerHTML = '!';
                }
                if (messageType === 'green') {
                    messageIcon.innerHTML = '&#10003;';
                }
            }
        }
       if (messageType === 'green') {
            setTimeout(() => {
                let messageContainer = document.getElementById('messageContainer') as HTMLDivElement | null;
                if (messageContainer !== null) {
                    messageContainer.style.animation = 'fadeOut ease 1s'
                }}, 2000);
            setTimeout(() => {
                    props.onClose()},
                3000);
       }
    }, [props]);


    return (
        <div>
            <div className={'Container'} id={'messageContainer'}>
                <div id={'messageIcon'}></div>
                <div className={'message'}>
                    {props.message}
                    <div id={'buttonOKContainer'}>
                        <button id={'buttonOK'} type={'button'} onClick={props.onClose}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayMessageReferences