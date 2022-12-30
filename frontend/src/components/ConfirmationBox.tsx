import React from "react";
import "./styles/message.css"

interface MessageProps {
    message: string;
    doDelete: () => void;
    cancelDelete: () => void;
}

function ConfirmationBox(props: MessageProps) {

    return (
        <div>
            {props.message
                && <div id={'ConfirmationContainer'} className={'red'}>
                        <div id={'messageIcon'} className={'red'}>?</div>
                        <div className={'message'}>
                            Do you really want to delete your song? {props.message}
                            Please confirm:
                        <div id={'buttonOKContainer'}>
                            <button id={'buttonConfirmDeleteSong'} type={'button'}
                                    onClick={props.doDelete}>
                                delete
                            </button>
                            <button id={'buttonCancelDeleteSong'} type={'button'}
                                    onClick={props.cancelDelete}>
                                cancel
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ConfirmationBox