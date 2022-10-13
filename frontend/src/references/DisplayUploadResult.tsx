import '../styles/message.css'
import {useEffect} from "react";
import {UploadResult} from "./ReferenceModels";

interface ResultProps {
    uploadResult: UploadResult
    onClose: () => void;
}

function DisplayMessage(props: ResultProps) {

    useEffect(() => {
        let messageContainer = document.getElementById('messageContainer') as HTMLDivElement | null;
        if (messageContainer !== null) {
            messageContainer.style.borderColor = 'blue';
        }
        let messageIcon = document.getElementById('messageIcon') as HTMLDivElement | null;
        if (messageIcon !== null) {
            messageIcon.style.color = 'blue';
            }
        }, [])

    return (
        <div>
            <div id={'messageContainer'}>
                <div id={'messageIcon'}>&#10003;</div>
                <div className={'message'}>
                    {props.uploadResult.totalNumberOfReferences}
                    <div id={'buttonOKContainer'}>
                        <button id={'buttonOK'} onClick={props.onClose}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayMessage