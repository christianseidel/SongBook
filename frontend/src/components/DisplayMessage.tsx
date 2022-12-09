import {message} from "./messageModel";
import "./styles/message.css"
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

interface MessageProps {
    message: message | undefined;
}

function DisplayMessage(props: MessageProps) {

    const [textLine, setTextLine] = useState(props.message?.text);
    const [icon, setIcon] = useState(props.message?.icon);
    const [color, setColor] = useState(props.message?.color)

    const nav = useNavigate();

    let lifetime = 0;
    if (props.message) {
        lifetime = props.message.lifetime * 1000
    }

    useEffect(() => {
        setTextLine(props.message?.text);
        setIcon(props.message?.icon)
        setColor(props.message?.color)
        if (props.message?.lifetime !== -1) {
            const timeoutFeedback = setTimeout(() => {
                    setTextLine(undefined);
                    setIcon(undefined);
                },
                lifetime);
            return () => clearTimeout(timeoutFeedback);
        }

    }, [props.message, lifetime])

    const deleteFeedback = () => {
        setTextLine(undefined);
        setIcon(undefined);
        if (props.message !== undefined) {
            nav(props.message.forward);
        }
    }

    return (
        <div>
            {textLine !== undefined
                && <div id={'Container'} className={color}>
                        <div id={'messageIcon'} className={color}>{icon}</div>
                        <div className={'message'}>
                            {textLine}
                        <div id={'buttonOKContainer'}>
                            <button id={'buttonOK'} type={'button'} onClick={deleteFeedback}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default DisplayMessage