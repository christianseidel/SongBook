import React, {FormEvent, useEffect, useState} from "react";

import ChooseKey from "../ChooseKey";
import {message, MessageType, NewMessage} from "../../messageModel";
import {SongSheet} from "./modelsSongSheet";
import {Mood} from "../modelsSong";
import {useAuth} from "../../UserManagement/AuthProvider";

interface SongSheetProps {
    toggleCreateOrUpdate: string;
    songSheets: SongSheet[] | undefined;
    sheetIndex: number;
    returnAndSave: () => void;
    save: () => void;
    displayMsg: (msg: message | undefined) => void;
    onCancel: () => void;
    onClear: () => void;
    onDeleteSongSheetFile: (fileId: string) => void;
    downloadSheet: (fileId: string) => void;
}

function EditSongSheet(props: SongSheetProps) {

    const {token} = useAuth();
    const [name, setName] = useState('');
    const [source, setSource] = useState('');
    const [description, setDescription] = useState('');
    const [songKey, setSongKey] = useState('');
    const [songKeyReturned, setSongKeyReturned] = useState('')
    const [songMood, setSongMood] = useState(0);
    const [fileId, setFileId] =  useState('');
    const [filename, setFilename] =  useState('');

    const clearSheet = () => {
        setName('');
        setSource('');
        setDescription('');
        setFileId('');
        setFilename('');
        setSongMood(0);
        setSongKey('');
    }

    useEffect(() => {
        if (props.toggleCreateOrUpdate === 'update' && props.songSheets) {
            setName(props.songSheets[props.sheetIndex].name);
            setSource(props.songSheets[props.sheetIndex].source ?? ``);
            setDescription(props.songSheets[props.sheetIndex].description ?? ``);
            setSongKey(props.songSheets[props.sheetIndex].key ?? ``);
            setSongMood(Mood.checkIfMajorOrEmpty(songKey) ? 0 : 1);
            setFileId(props.songSheets[props.sheetIndex].fileId ?? ``);
            setFilename(props.songSheets[props.sheetIndex].filename ?? ``);
        }
    }, [props.sheetIndex, props.songSheets, props.toggleCreateOrUpdate, songKey]);

    function uploadSongSheet(files: FileList | null) {
        if (files === null) {
            alert('Ops, somehow the FormData Object produced a glitch.')
        } else {
            let fileExt = files[0].name.slice(files[0].name.length-3, files[0].name.length);
            if (fileExt !== 'pdf' && fileExt !== 'jpg') {
                props.displayMsg(NewMessage.create(
                    'Please, choose a PDF or a JPG file.',
                    MessageType.RED
                ))
                } else {
                    const formData = new FormData();
                    formData.append('file', files[0]);
                    let responseStatus = 0;
                    fetch(`${process.env.REACT_APP_BASE_URL}/api/sheets/upload/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData,
                    })
                        .then((response) => {
                            responseStatus = response.status;
                            return response.json();
                        })
                        .then((responseBody) => {
                            if (responseStatus === 200) {
                                if (props.toggleCreateOrUpdate === 'update' && props.songSheets !== undefined) {
                                    props.songSheets[props.sheetIndex].fileId = responseBody.id;
                                    props.songSheets[props.sheetIndex].filename = responseBody.filename;
                                }
                                props.save();
                                setFileId(responseBody.id);
                                setFilename(responseBody.filename);
                            } else if (responseStatus === 400) {
                                props.displayMsg(NewMessage.create(
                                    'The server did not accept your request (Bad Request).',
                                    MessageType.RED
                                ))
                            } else if (responseStatus === 500) {
                                props.displayMsg(NewMessage.create(responseBody.message, MessageType.RED));
                            } else {
                                props.displayMsg(NewMessage.create('The server is unable to respond to your request – (error code: ' + responseStatus + ')', MessageType.RED));
                            }
                        })
            }
        }
    }

    const doCancel = () => {
        if (fileId !== '' && props.toggleCreateOrUpdate === 'create') {
            props.onDeleteSongSheetFile(fileId);
        }
        props.onCancel();
    }

    const doCreateSongSheet = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        let songSheet = new SongSheet(name, source, description, songKeyReturned, fileId, filename);
        if (props.songSheets !== undefined) {
            let next: number;
            next = props.songSheets.length;
            props.songSheets[next] = songSheet;
        }
        clearSheet();
        props.returnAndSave();
    }

    const doUpdateSongSheet = () => {
        if (props.songSheets !== undefined) {
            let songSheet: SongSheet = props.songSheets[props.sheetIndex];
            songSheet.name = name;
            songSheet.source = source;
            songSheet.description = description;
            songSheet.key = songKeyReturned;
            songSheet.fileId = fileId;
            songSheet.filename = filename;
            props.songSheets[props.sheetIndex] = songSheet;
        }
        clearSheet();
        props.returnAndSave();
    }

    const doClearSongSheet = () => {
        if (fileId !== '') {
            props.onDeleteSongSheetFile(fileId);
        }
        clearSheet();
        props.onClear();
    }

    const deleteSongSheet = () => {
        if (fileId !== '') {
            props.onDeleteSongSheetFile(fileId);
        }
        props.songSheets!.splice(props.sheetIndex, 1);
        clearSheet();
        props.returnAndSave();
    }

    const doDiscardSongSheetFile = () => {
        props.onDeleteSongSheetFile(fileId);
        if (props.toggleCreateOrUpdate === 'update') {
                props.songSheets![props.sheetIndex].fileId = ``;
                props.songSheets![props.sheetIndex].filename = ``;
        }
        setFileId('');
        setFilename('');
    }

    return(
        <div className={'workingSpaceElement'}>
            <form onSubmit={ev => {
                props.toggleCreateOrUpdate === 'create' ? doCreateSongSheet(ev) : doUpdateSongSheet();
            }}>
                <label className={'editSongSheetTitle'}>{props.toggleCreateOrUpdate === 'create'
                    ? <span>Add a</span>
                    : <span>Edit your</span>} Song Sheet File</label><label>:</label>
                <span className={'nextLine'}>
                    <label>Name:</label>
                    <input id={'inputSongSheetName'} type='text' value={filename} placeholder={'Name'}
                           onChange={ev => setFilename(ev.target.value)} autoFocus tabIndex={1}/>
                    <label className={'labelSecondInLine'}>Source:</label>
                    <input id={'inputSongSheetSource'} type='text' value={source} placeholder={'Source'}
                           onChange={ev => setSource(ev.target.value)} tabIndex={2}/>
                    <button className={'buttonFloatRight'} type='submit' tabIndex={7}>
                        &#10004; {props.toggleCreateOrUpdate === 'create'
                        ? <span>create</span>
                        : <span>update</span>}
                    </button>
                </span>

                <span className={'nextLine'}>
                    <label>Descr.:</label>
                    <input id={'inputSongSheetDescription'} type='text' value={description} placeholder={'Description'}
                           onChange={ev => setDescription(ev.target.value)} tabIndex={3}/>
                </span>

                <div id={'ContainerInsertingDateUploaded'}>
                    <ChooseKey
                    songKey={songKey}
                    songMood={songMood}
                    onCancel={doCancel}
                    sendUpKey={(key: string) => setSongKeyReturned(key)}
                    />
                    {props.toggleCreateOrUpdate === 'update' &&
                        <span id={'dateUploaded'}>
                            created: {props.songSheets![props.sheetIndex].dateUploaded}
                        </span>}
                </div>

            </form>

            {props.toggleCreateOrUpdate === 'create'
                ? <button id={'buttonClearSongSheet'} type='button' onClick={() => {
                    doClearSongSheet()
                }} tabIndex={9}>
                    ! clear
                </button>
                :
                <button id={'buttonDeleteSongSheet'} type='button' onClick={() => {
                    deleteSongSheet()
                }} tabIndex={10}>
                    &#10008; delete
                </button>}

            {fileId === ''
                ?   <form encType={'multipart/form-data'} id={'uploadSongSheetForm'}>
                        <label id={'labelUploadSongSheetForm'}>Add file:</label>
                        <input type={'file'} id={'inputAddSongSheet'} accept={'application/pdf'}
                               onChange={event => uploadSongSheet(event.target.files)}/>
                    </form>
                : <span id={'filenameContainer'}>
                    <span id={'filename'} className={'coloredSongSheetLink'} onClick={() => props.downloadSheet(fileId)}>
                    {filename}</span>
                    <button onClick={doDiscardSongSheetFile} id={'buttonDiscardSongSheetFile'}
                        >&#9986; discard</button>
                  </span>
            }
        </div>
    )
}

export default EditSongSheet