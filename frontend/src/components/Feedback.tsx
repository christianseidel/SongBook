import {feedback} from "./feedbackModel";
import React, {useEffect, useState} from "react";

interface FeedbackProps {
    feedback: feedback | undefined;
}

function Feedback(props: FeedbackProps) {

    const [message, setMessage] = useState(props.feedback?.message);

    let lifetime = 0;
    if (props.feedback) {
        lifetime = props.feedback.lifetime * 1000
    }

    useEffect(() => {
        setMessage(props.feedback?.message);
        const timeoutFeedback = setTimeout(() => {
                setMessage(undefined)},
            lifetime);
        return () => clearTimeout(timeoutFeedback);
    }, [props.feedback, lifetime])

    const deleteFeedback = () => {
        setMessage(undefined);
    }

    return (
        <div>
            <label>
                {message !== undefined
                    && <span>{message} + <button onClick={deleteFeedback}>OK</button></span>}
            </label>
        </div>
    )
}

export default Feedback