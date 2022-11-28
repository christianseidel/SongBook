import {message} from "./messageModel";
import "./styles/message.css"
import React, {useEffect, useState} from "react";

interface MessageProps {
    message: message | undefined;
}

function DisplayMessage(props: MessageProps) {

    const [textLine, setTextLine] = useState(props.message?.text);
    const [icon, setIcon] = useState(props.message?.icon);
    const [color, setColor] = useState(props.message?.color)

    let lifetime = 0;
    if (props.message) {
        lifetime = props.message.lifetime * 1000
    }

    useEffect(() => {
        setColor(props.message?.color);
    }, [props.message])

    useEffect(() => {
        setTextLine(props.message?.text);
        setIcon(props.message?.icon)
        const timeoutFeedback = setTimeout(() => {
                setTextLine(undefined);
                setIcon(undefined);
            },
            lifetime);
        return () => clearTimeout(timeoutFeedback);
    }, [props.message, lifetime])

    const deleteFeedback = () => {
        setTextLine(undefined);
        setIcon(undefined);
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