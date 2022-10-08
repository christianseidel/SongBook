import './styles/message.css'

interface MessageProps {
    message: string
    onClose: () => void;
}

function DisplayMessage(props: MessageProps) {


    return(
        <div className={"displayMessage"}>
            {props.message}
            <div id={'buttonOKContainer'}>
                <button id={'buttonOK'} onClick={props.onClose}>OK</button>
            </div>
        </div>
    )
}

export default DisplayMessage