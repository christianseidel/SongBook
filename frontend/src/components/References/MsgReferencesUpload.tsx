import '../styles/msgRefUpload.css'
import {useEffect} from "react";
import {UploadResult} from "./modelsReference";


interface ResultProps {
    uploadResult: UploadResult
    onClose: () => void;
    filename: string;
}

function MessageBox(props: ResultProps) {

    useEffect(() => {
        let messageIcon = document.getElementById('messageIcon') as HTMLDivElement | null;
        if (messageIcon !== null) {
            messageIcon.style.color = 'blue';
            }
        }, [])

    return (
        <div>
            <div className={'Container'} id={'uploadResultContainer'}>
                <div id={'resultIcon'}>&#10003;</div>
                <div className={'message'}>
                    <p>
                        Your file {props.filename} was successfully uploaded.
                    </p>
                    <p>
                        Your song list contains a <span className={"bold"}>
                        total of {props.uploadResult.totalNumberOfReferences} </span>
                        song references, out of which:</p>
                    <p>
                        <span className={"bold"}> {props.uploadResult.numberOfReferencesAccepted} </span>
                        <span className={"bold"}> were added</span>
                        {props.uploadResult.numberOfReferencesRejected !== 0
                                || props.uploadResult.numberOfExistingReferences !== 0
                            ? <span>,</span>
                            : <span>.</span>}
                    </p>
                    <p>
                        {props.uploadResult.numberOfReferencesRejected !== 0 && <span className={"bold"}>
                            {props.uploadResult.numberOfReferencesRejected} were rejected</span>}
                        {props.uploadResult.numberOfReferencesRejected !== 0
                            && props.uploadResult.numberOfExistingReferences !== 0
                            && <span>,</span>}
                        {props.uploadResult.numberOfReferencesRejected !== 0
                            && props.uploadResult.numberOfExistingReferences === 0
                            && <span>.</span>}
                    </p>
                    <p>
                        {props.uploadResult.numberOfExistingReferences !== 0 && <span><span className={"bold"}>
                            {props.uploadResult.numberOfExistingReferences} already exist</span>.</span>}

                    </p>

                    <div>
                        <p>{props.uploadResult.listOfLinesWithInvalidCollectionName.length > 0
                            && <span>These references have <span className={"bold"}>incorrect volume information:</span></span>}
                        </p>
                        <div className={'listOfErrorItems'}>
                            {props.uploadResult.listOfLinesWithInvalidCollectionName.map(item1 => <p key={item1}>{item1}</p>)}
                        </div>
                    </div>

                    <div>
                        <p>{props.uploadResult.listOfLinesWithInvalidPageData.length > 0
                            && <span>These references have <span className={"bold"}>incorrect page data:</span></span>}
                        </p>
                    </div>
                    <div className={'listOfErrorItems'}>
                        {props.uploadResult.listOfLinesWithInvalidPageData.map(item2 => <p key={item2}>{item2}</p>)}
                    </div>


                    <div id={'buttonOKContainer'}>
                        <button id={'buttonOK'} type={'button'} onClick={props.onClose}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageBox