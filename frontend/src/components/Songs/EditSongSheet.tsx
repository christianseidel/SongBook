import React, {FormEvent, useEffect, useState} from "react";
import {Mood, SongSheet} from "./songModels";
import ChooseKey from "./WorkingSpace/ChooseKey";

interface SongSheetProps {
    toggleCreateOrUpdate: string;
    songSheets: SongSheet[] | undefined;
    sheetIndex: number;
    returnAndSave: () => void;
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


    const clearSheet = () => {
        setName('')
        setSource('');
        setDescription('')
        setSongKey('');
    }

    useEffect(() => {
        if (props.toggleCreateOrUpdate === 'update' && props.songSheets) {
            setName(props.songSheets[props.sheetIndex].name);
            setSource(props.songSheets[props.sheetIndex].source ?? ``);
            setDescription(props.songSheets[props.sheetIndex].description ?? ``);
            setSongKey(props.songSheets[props.sheetIndex].key ?? ``);
            setSongMood(Mood.checkIfMajorOrEmpty(songKey) ? 0 : 1);
        }
    }, [props.sheetIndex, props.songSheets, props.toggleCreateOrUpdate, songKey]);


    function uploadSongSheet(files: FileList | null) {
        sessionStorage.setItem('messageType', 'red');
        if (files === null) {
            alert('Ops, somehow the FormData Object produced a glitch.')
        } else {
            const formData = new FormData();
            formData.append('file', files[0]);
            let responseStatus = 0;
            fetch('api/songbook/upload/', {
                method: 'POST',
                body: formData,
            })
                .then((response) => {
                    responseStatus = response.status;
                    return response.json();
                })
                .then((responseBody) => {
                    if (responseStatus === 200) {
                        // Todo: Do The Magic
                        // Yet to implement...
                        console.log('File "' + files[0].name + '" successfully transmitted to backend!');
                        console.log(responseBody);
                    } else if (responseStatus === 400) {
                        sessionStorage.setItem('message', 'Sorry, the server does not accept your request (Bad Request).');
                    } else if (responseStatus === 404) {
                        sessionStorage.setItem('message', 'Sorry, the server is unable to respond to your request.');
                    } else if (responseStatus === 405) {
                        console.log("sorry, the entire set of methods has yet to be written...")
                    } else if (responseStatus === 406) {
                        sessionStorage.setItem('message', responseBody.message);
                    } else if (responseStatus === 500) {
                        sessionStorage.setItem('message', responseBody.message);
                    } else if (responseStatus !== 201) {
                        sessionStorage.setItem('message', responseBody.message);
                    } else {
                        alert('Something Unexpected happened.');
                    }
                })

            console.log("uploading song sheets not yet working...")
        }
    }

    const doCreateSongSheet = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        let songSheet = new SongSheet(name, source, description, songKeyReturned);
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

                <ChooseKey
                    songKey={songKey}
                    songMood={songMood}
                    onCancel={props.onCancel}
                    sendUpKey={(key: string) => setSongKeyReturned(key)}
                />
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

            <label id={'labelUploadSongSheetForm'}>Add file:</label>

                <form encType={'multipart/form-data'} id={'uploadSongSheetForm'}>
                    <input type={'file'} id={'inputAddSongSheet'}
                           onChange={event => uploadSongSheet(event.target.files)}/>
                </form>

        </div>
    )
}

export default EditSongSheet