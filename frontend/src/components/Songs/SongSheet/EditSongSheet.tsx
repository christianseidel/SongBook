import React, {FormEvent, useEffect, useState} from "react";

import ChooseKey from "../ChooseKey";
import {message, MessageType, NewMessage} from "../../messageModel";
import {SongSheet, SongSheetUploadResponse} from "./modelsSongSheet";
import {Mood} from "../modelsSong";

interface SongSheetProps {
    toggleCreateOrUpdate: string;
    songSheets: SongSheet[] | undefined;
    sheetIndex: number;
    returnAndSave: () => void;
    displayMsg: (msg: message | undefined) => void;
    onCancel: () => void;
    onClear: () => void;
}

function EditSongSheet(props: SongSheetProps) {

    const [name, setName] = useState('');
    const [source, setSource] = useState('');
    const [description, setDescription] = useState('');
    const [songKey, setSongKey] = useState('');
    const [songKeyReturned, setSongKeyReturned] = useState('')
    const [songMood, setSongMood] = useState(0);
    const [fileId, setFileId] =  useState('');
    const [fileName, setFileName] =  useState('');
    const [fileUrl, setFileUrl] =  useState('');


    const clearSheet = () => {
        setName('');
        setSource('');
        setDescription('');
        setSongMood(0);
    }

    useEffect(() => {
        if (props.toggleCreateOrUpdate === 'update' && props.songSheets) {
            setName(props.songSheets[props.sheetIndex].name);
            setSource(props.songSheets[props.sheetIndex].source ?? ``);
            setDescription(props.songSheets[props.sheetIndex].description ?? ``);
            setSongKey(props.songSheets[props.sheetIndex].key ?? ``);
            setSongMood(Mood.checkIfMajorOrEmpty(songKey) ? 0 : 1);
            setFileId(props.songSheets[props.sheetIndex].fileId ?? ``);
            setFileName(props.songSheets[props.sheetIndex].fileName ?? ``);
            setFileUrl(props.songSheets[props.sheetIndex].fileUrl ?? '');
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
                    fetch('api/sheets/upload/', {
                        method: 'POST',
                        body: formData,
                    })
                        .then((response) => {
                            responseStatus = response.status;
                            return response.json();
                        })
                        .then((responseBody: SongSheetUploadResponse) => {
                            if (responseStatus === 200) {
                                console.log('File "' + files[0].name + '" successfully transmitted to backend.');
                                console.log(responseBody);
                                setFileId(responseBody.id);
                                setFileName(responseBody.fileName);
                                setFileUrl(responseBody.url);
                            } else if (responseStatus === 400) {
                                props.displayMsg(NewMessage.create(
                                    'The server did not accept your request (Bad Request).',
                                    MessageType.RED
                                ))
                            } else {
                                props.displayMsg(NewMessage.create('The server is unable to respond to your request – error code: ' + responseStatus, MessageType.RED));
                            }
                        })
            }
        }
    }

    const doCancel = () => {
        if (fileId !== '') {
            deleteSongSheetFile();
        }
        props.onCancel();
    }

    const deleteSongSheetFile = () => {
        fetch('api/sheets/' + fileId, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.status !== 200) {
                    props.displayMsg(NewMessage.create(
                        'Song Sheet File could not be deleted!', MessageType.RED
                    ));
                }
            })
    }

    const doCreateSongSheet = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        let songSheet = new SongSheet(name, source, description, songKeyReturned, fileId, fileName, fileUrl);
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
            songSheet.fileName = fileName;
            songSheet.fileUrl = fileUrl;
            props.songSheets[props.sheetIndex] = songSheet;
        }
        clearSheet();
        props.returnAndSave();
    }

    const doClearSongSheet = () => {
        clearSheet();
        props.onClear();
    }

    const deleteSongSheet = () => {
        props.songSheets!.splice(props.sheetIndex, 1);
        clearSheet();
        props.returnAndSave();
    }

    return(
        <div className={'workingSpaceElement'}>
            <form onSubmit={ev => {
                props.toggleCreateOrUpdate === 'create' ? doCreateSongSheet(ev) : doUpdateSongSheet();
            }}>
                <label>{props.toggleCreateOrUpdate === 'create'
                    ? <span>Add a</span>
                    : <span>Edit your</span>} Song Sheet:</label>
                <span className={'nextLine'}>
                    <label>Name:</label>
                    <input id={'inputSongSheetName'} type='text' value={name} placeholder={'Name'}
                           onChange={ev => setName(ev.target.value)} autoFocus tabIndex={1} required/>
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



            <button id={'buttonClearLink'} type='button' onClick={() => {
                doClearSongSheet()
            }} tabIndex={9}>
                ! clear
            </button>
            {props.toggleCreateOrUpdate === 'update' &&
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
                : <span id={'fileId'}><a href={fileUrl} target={'_blank'} rel={'noreferrer'}>
                    {fileName}</a>
                    <button onClick={() => {
                        deleteSongSheetFile();
                        setFileId('');
                        setFileName('');
                        setFileUrl('');}} id={'buttonDiscardSongSheetFile'}
                        >&#9986; discard</button>
                  </span>
            }
        </div>
    )
}

export default EditSongSheet