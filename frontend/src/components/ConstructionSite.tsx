import '././styles/message.css'
import React, {useEffect} from "react";
import {feedback} from "./feedbackModel";

interface FeedProps {
    feed: feedback | null;
    onCreateFeedback: () => void;
    onDeleteFeedback: () => void;
}

function ConstructionSite(props: FeedProps) {

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
                    /*props.onClose()*/},
                3000);
        }
    }, [/*props*/]);


    return (
        <div>
            <label>
                {props.feed?.message != null
                && <span>{props.feed?.message} + <button onClick={props.onDeleteFeedback}>delete</button></span>}
            </label>

            {props.feed?.message == null && <button onClick={props.onCreateFeedback}>button</button>}

            {/*
            <label>{((props.song.description !== null
                && props.song.description!.length > 0) && true)
                ? <span>Edit your </span>
                : <span>Add a </span>} Comment or Description:</label><br/>
*/}


            {/*<div className={'Container'} id={'messageContainer'}>
                <div id={'messageIcon'}>{props.feedback.icon}</div>
                <div className={'message'}>
                    {props.message}
                    <div id={'buttonOKContainer'}>
                        <button id={'buttonOK'} type={'button'} >OK</button>
                    </div>
                </div>
            </div>*/}
        </div>
    )
}

export default ConstructionSite