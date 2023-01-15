import React, {FormEvent, useEffect, useState} from "react";
import '../styles/common.css'
import '../styles/songDetails.css'
import EditSongTitle from "./TitleLine/EditSongTitle";
import CreateSongTitle from "./TitleLine/CreateSongTitle";
import DisplaySongTitle from "./TitleLine/DisplaySongTitle";
import {songCollectionToRealName} from "../literals/collectionNames";
import {keys} from "../literals/keys";
import EditLink from "./EditLink";
import EditSongSheet from "./SongSheet/EditSongSheet";
import {message, MessageType, NewMessage} from "../messageModel";
import {Mood, Song} from "./songModels";
import {Reference} from "../References/modelsReference";
import {useAuth} from "../UserManagement/AuthProvider";
import ConfirmationBox from "../ConfirmationBox";


interface SongItemProps {
    song: Song;
    onItemRevision: (song: Song) => void;
    doReturn: () => void;
    onClear: () => void;
    displayMsg: (msg: message | undefined) => void;
}

function SongItemDetails(props: SongItemProps) {

    const {token} = useAuth();
    const [songState, setSongState] = useState(props.song.status);
    useEffect(() => setSongState(props.song.status), [props.song.status]);
    const [description, setDescription] = useState(sessionStorage.getItem('description') ?? '');
    useEffect(() => sessionStorage.setItem('description', description), [description]);
    const [message, setMessage] = useState('');

    const [displayDescription, setDisplayDescription] = useState(true);
    const [toggleEditDescription, setToggleEditDescription] = useState(false);
    const [toggleEditReference, setToggleEditReference] = useState(false);
    const [toggleEditLink, setToggleEditLink] = useState(false);
    const [toggleEditSongSheet, setToggleEditSongSheet] = useState(false);
    // controls whether a new item will be created or an existing will be updated
    const [toggleCreateOrUpdate, setToggleCreateOrUpdate] = useState('create');


    useEffect(() => {
        setToggleEditDescription(false);
        setToggleEditReference(false);
        setToggleEditLink(false);
        setToggleEditSongSheet(false);
        setCollection('');
        setPage('');
        setKey('');
        setMood(0);
        setToggleCreateOrUpdate('create');
    }, [props.song.title]);

    // description will be hidden, whenever the Working Space is used, but visible if it's not
    useEffect(() => {
        if (!toggleEditDescription && !toggleEditReference && !toggleEditLink && !toggleEditSongSheet) {
            setDisplayDescription(true);
        } else {
            setDisplayDescription(false);
        }
    }, [toggleEditDescription, toggleEditReference, toggleEditLink, toggleEditSongSheet]);


    // controls rendering of the first two lines within Song Details View //
    let handleTitleLine;
    if (songState === 'display') {
        handleTitleLine = <DisplaySongTitle
            song={props.song}
            updateDetailsView={() => setSongState(props.song.status)}
            onClear={props.onClear}
        />;
    } else if (songState === 'edit') {
        handleTitleLine = <EditSongTitle
            song={props.song}
            updateDetailsView={() => setSongState(props.song.status)}
            onItemRevision={(song) => props.onItemRevision(song)}
            displayMsg={(msg) => props.displayMsg(msg)}
        />;
    } else if (songState === 'create') {
        handleTitleLine = <CreateSongTitle
            song={props.song}
            onItemCreation={(song) => props.onItemRevision(song)}
            displayMsg={(msg) => props.displayMsg(msg)}
            onClear={props.onClear}
        />;
    }

    const promptConfirmDeletionBox = () => {
        const numberOfSongSheets = props.song.songSheets!.length;
        const numberOfLinks = props.song.links!.length;
        let msgText = '';

        if (numberOfSongSheets + numberOfLinks > 0) {
            msgText = 'There ';
            if (numberOfSongSheets + numberOfLinks === 1) {
                msgText += 'is '
            } else {
                msgText += 'are '
            }
            if (numberOfSongSheets === 1) {
                msgText += 'one song sheet '
            } else if (numberOfSongSheets > 1) {
                msgText += numberOfSongSheets + ' song sheets '
            }
            if (numberOfSongSheets > 0 && numberOfLinks > 0) {
                msgText += 'and '
            }
            if (numberOfLinks === 1) {
                msgText += 'one link '
            } else if (numberOfLinks > 1) {
                msgText += numberOfLinks + ' links '
            }
            msgText += 'attached to this song. '
            if (numberOfSongSheets + numberOfLinks === 1) {
                msgText += 'This item will be lost. '
            } else {
                msgText += 'All attachments will be lost. '
            }
            setMessage(msgText);
        } else {
            setMessage(' ');
        }
    }

    function deleteSongItem(id: string) {
        props.song.songSheets?.forEach((file) => {
            if (file.fileId !== undefined) {
                deleteSongSheetFile(file.fileId)
            }
        });
        unhideAllReferencesAttached(id)
            .then(() => {
                    fetch(`${process.env.REACT_APP_BASE_URL}/api/songbook/` + id, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(response => {
                            if (response.ok) {
                                props.displayMsg(NewMessage.create(
                                    'Your song "' + props.song.title + '" was deleted!',
                                    MessageType.GREEN));
                            } else {
                                props.displayMsg(NewMessage.create(
                                    'Your song could not be deleted!',
                                    MessageType.RED));
                            }
                        })
                        .then(props.doReturn)
                }
            ).catch(() => {
            console.log("Unhiding references did not succeed.")
        })
    }

    const deleteSongSheetFile = (fileId: string) => {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/sheets/` + fileId, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.status !== 200) {
                    props.displayMsg(NewMessage.create(
                        'Song Sheet File could not be deleted!', MessageType.RED
                    ));
                }
            })
    }

    // References must be repatriated first before the song item can be deleted.
    // Hence, this Promise //
    const unhideAllReferencesAttached = (songId: string) => {
        return new Promise((resolve, failure) => {
            fetch(`${process.env.REACT_APP_BASE_URL}/api/songbook/unhideReferences/` + songId, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (response.ok) {
                        resolve('success');
                    } else {
                        failure('failure');
                    }
                })
        })
    }

    function saveSongItem() {
        let responseStatus: number;
        fetch(`${process.env.REACT_APP_BASE_URL}/api/songbook/` + props.song.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: props.song.id,
                title: props.song.title,
                author: props.song.author,
                year: props.song.year,
                dateCreated: props.song.dateCreated,
                description: props.song.description,
                references: props.song.references,
                links: props.song.links,
                songSheets: props.song.songSheets,
            })
        })
            .then(response => {
                responseStatus = response.status;
                return response.json();
            })
            .then((responseBody: Song) => {
                if (responseStatus === 200) {
                    responseBody.status = 'display';
                    props.onItemRevision(responseBody);
                } else {
                    props.displayMsg(NewMessage.create(
                        'The item Id no. ' + props.song.id + ' could not be saved.',
                        MessageType.RED));
                }
            });
    }


    // --- DESCRIPTION ELEMENTS --- //

    const openOrCloseAddDescription = () => {
        if (props.song.status === 'create') {
            props.displayMsg(NewMessage.create('Please, create song item first.', MessageType.RED));
        } else {
            setToggleEditDescription(!toggleEditDescription);
            setToggleEditReference(false);
            setToggleEditLink(false);
            setToggleEditSongSheet(false);
            setDescription(props.song.description ?? '');
        }
    }

    const doAddDescription = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        props.song.description = description;
        saveSongItem();
        setToggleEditDescription(false);
        setDescription('');
        sessionStorage.removeItem('description');
    }

    const clearDescription = () => {
        setDescription('');
        props.song.description = '';
        sessionStorage.removeItem('description');
        saveSongItem();
    }


    // --- REFERENCES ELEMENTS --- //

    const openOrCloseAddReference = () => {
        if (props.song.status === 'create') {
            props.displayMsg(NewMessage.create('Please, create song item first.', MessageType.RED));
        } else {
            setToggleEditDescription(false);
            setToggleEditLink(false);
            setToggleEditSongSheet(false);
            setToggleEditReference(!toggleEditReference);
            setToggleCreateOrUpdate('create');
        }
    }

    const [collection, setCollection] = useState('');
    const [page, setPage] = useState('');
    const [key, setKey] = useState('');
    const [mood, setMood] = useState(0);
    const [refIndex, setRefIndex] = useState(-1);
    const [readOnly, setReadOnly] = useState('')

    const createReference = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        let next: number;
        let reference = new Reference(props.song.title, collection, Number(page),
            props.song.author, props.song.year, key);
        if (props.song.references !== undefined) {
            next = props.song.references.length;
            props.song.references[next] = reference;
        } else {
            alert("The resources array is undefined!");
            console.log("The resources array is undefined!");
        }
        saveSongItem();
        setToggleEditReference(false);
        setCollection('');
        setPage('');
        setKey('');
    }

    const openUpdateReference = (index: number) => {
        setToggleEditDescription(false);
        setToggleEditReference(true);
        setToggleEditLink(false);
        setToggleEditSongSheet(false);
        setToggleCreateOrUpdate('update');
        setRefIndex(index);
        if (props.song.references !== undefined) {
            let ref: Reference = props.song.references[index];
            if (ref.songCollection === 'MANUALLY_ADDED_COLLECTION') {
                setCollection(ref.addedCollection);
                setReadOnly('');
            } else {
                setCollection(songCollectionToRealName(ref.songCollection) ?? '');
                setReadOnly('readOnly');
            }
            ref.page !== 0 ? setPage(String(ref.page)) : setPage('');
            Mood.checkIfMajorOrEmpty(ref.key) ? setMood(0) : setMood(1);
            ref.key === null || ref.key === undefined
                ? setKey('')
                : setKey(ref.key);
        }
    }

    const doUpdateReference = () => {
        if (props.song.references !== undefined) {
            let ref: Reference = props.song.references[refIndex];
            if (ref.songCollection === 'MANUALLY_ADDED_COLLECTION') {
                ref.addedCollection = collection;
            }
            ref.title = props.song.title
            ref.page = Number(page);
            ref.author = props.song.author;
            ref.year = props.song.year;
            ref.key = key;
        } else {
            console.log("ERROR: props.song.references is \"undefined\"!?")
        }
        saveSongItem();
        setToggleEditReference(false);
        setCollection('');
        setPage('');
        setKey('');
    }

    function deleteReference() {
        props.song.status = 'display';
        setToggleEditReference(false);
        if (refIndex !== -1) {
            props.song.references!.splice(refIndex, 1)
        }
        saveSongItem();
        setRefIndex(-1);
        clearReference();
        setToggleCreateOrUpdate('create');
    }

    function clearReference() {
        setRefIndex(-1);
        setCollection('');
        setPage('');
        setKey('');
        setMood(0);
        if (document.getElementById('inputRefCollection') !== null) {
            document.getElementById('inputRefCollection')!.className = '';
        }
        setToggleCreateOrUpdate('create');
    }


// --- LINK ELEMENTS --- //

    const [linkIndex, setLinkIndex] = useState(-1)

    const openOrCloseAddLink = () => {
        if (props.song.status === 'create') {
            props.displayMsg(NewMessage.create('Please, create song item first.', MessageType.RED));
        } else {
            setToggleEditDescription(false);
            setToggleEditReference(false);
            setToggleEditSongSheet(false);
            setToggleEditLink(!toggleEditLink);
            setToggleCreateOrUpdate('create');
        }
    }

    const openUpdateLink = (index: number) => {
        setLinkIndex(index);
        setToggleEditDescription(false);
        setToggleEditSongSheet(false);
        setToggleEditReference(false);
        setToggleEditLink(true);
        setToggleCreateOrUpdate('update')
    }


    // --- SONG SHEET FILES --- //

    const [sheetIndex, setSheetIndex] = useState(-1)

    const openOrCloseAddSongSheet = () => {
        if (props.song.status === 'create') {
            props.displayMsg(NewMessage.create('Please, create song item first.', MessageType.RED));
        } else {
            setToggleEditDescription(false);
            setToggleEditReference(false);
            setToggleEditSongSheet(!toggleEditSongSheet);
            setToggleEditLink(false);
            setToggleCreateOrUpdate('create');
        }
    }

    const openUpdateSongSheet = (index: number) => {
        if (toggleCreateOrUpdate === "create") {
            setSheetIndex(index);
            setToggleEditDescription(false);
            setToggleEditReference(false);
            setToggleEditLink(false);
            setToggleEditSongSheet(true);
            setToggleCreateOrUpdate('update')
        }
    }

    const downloadSongSheetFile = (id: string) => {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/sheets/download/` + id, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.blob();
                } else if (response.status === 404) {
                    throw Error('Unable to fetch this ressource (error code: ' + response.status + ').');
                } else {
                    throw Error(response.statusText + " : " + response.status);
                }
            })
            .then((blob) => {
                if (blob) {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    document.body.appendChild(a);
                    /*window.open(url, '_blank');*/
                    window.open(url, '_blank')
                    window.URL.revokeObjectURL(url);
                }
            })
            .catch(e => {
                props.displayMsg(NewMessage.create(e.message, MessageType.RED));
            })
    }


    return (
        <div>
            <div className={'dataSheetElement'} id={'songHead'}>
                <div>{handleTitleLine}</div>
            </div>

            <div id={'iconContainer'}>
                    <span className={'icon tooltip'} id={'iconInfo'} onClick={openOrCloseAddDescription}>
                        i
                        <span className="tooltipText">add a description</span>
                    </span>
                <span className={'icon tooltip'} id={'iconReference'} onClick={openOrCloseAddReference}>
                        R
                        <span className="tooltipText">add a song sheet reference</span>
                    </span>
                <span className={'icon tooltip'} id={'iconLink'} onClick={openOrCloseAddLink}>
                        &#8734;
                    <span className="tooltipText">add a link</span>
                    </span>
                <span className={'icon tooltip'} id={'iconSongSheetFile'} onClick={openOrCloseAddSongSheet}>
                        &#128195;
                    <span className="tooltipText">add a file</span>
                    </span>
            </div>

            <div className={'dataSheetElement'} id={'workingSpace'}>

                {props.song.description && !toggleEditDescription && displayDescription &&
                    <div id={'displayDescription'} className={'workingSpaceElement'}
                         onClick={openOrCloseAddDescription}>
                        {props.song.description}
                    </div>
                }

                {toggleEditDescription && <div>
                    <form className={'workingSpaceElement'}
                          onSubmit={ev => doAddDescription(ev)}>
                        <label id={'titleEditDescription'}>{((props.song.description !== null
                            && props.song.description!.length > 0) && true)
                            ? <span>Edit your </span>
                            : <span>Add a </span>}
                            Comment or Description</label><label>:</label><br/>
                        <textarea id={'inputDescription'} value={description}
                                  rows={3}
                                  cols={60}
                                  placeholder={'your description here...'}
                                  onChange={ev => setDescription(ev.target.value)} autoFocus required/>
                        <button id={'buttonAddDescription'} type='submit'>
                            &#10004; {(props.song.description !== null && props.song.description!.length > 0)
                            ? <span>update</span>
                            : <span>add</span>} </button>
                        <button id={'buttonCancelAddDescription'} type='button' onClick={openOrCloseAddDescription}>
                            cancel
                        </button>
                    </form>

                    <button id={'buttonClearDescription'} type='submit' onClick={clearDescription}>
                        ! clear
                    </button>
                </div>}

                {toggleEditReference && <div>
                    <form onSubmit={ev => {
                        toggleCreateOrUpdate === 'create' ? createReference(ev) : doUpdateReference();
                    }}>
                        <label className={'titleEditReference'}>{toggleCreateOrUpdate === 'create'
                            ? <span>Add a</span>
                            : <span>Edit your</span>}
                            Song Sheet Reference</label><label>:</label>
                        <div className={'nextLine'}>
                            <label>Coll.:</label>
                            <input id={'inputRefCollection'} type='text' value={collection}
                                   placeholder={'Song Collection'} className={readOnly}
                                   onChange={ev => setCollection(ev.target.value)} required autoFocus tabIndex={1}/>
                            <label id={'labelInputRefPage'}>Page:</label>
                            <input id={'inputRefPage'} type='number' value={page} placeholder={'Page'}
                                   onChange={ev => setPage(ev.target.value)} tabIndex={2}/>
                            <button id={'buttonAddReference'} type='submit'
                                    tabIndex={5}>
                                &#10004; {toggleCreateOrUpdate}
                            </button>
                        </div>
                        <div className={'nextLine'}>
                            <label>Author:</label>
                            <input id={'inputRefAuthor'} type='text'
                                   value={props.song.author !== null ? props.song.author : ''}
                                   placeholder={'(Author)'} className={'readOnly'} disabled/>
                            <label id={'labelInputRefYear'}>Year:</label>
                            <input id={'inputRefYear'} type='text' value={props.song.year !== 0 ? props.song.year : ''}
                                   placeholder={'(Year)'} className={'readOnly'} disabled readOnly/>
                        </div>
                        <span className={'nextLine'}>
                        <label htmlFor={'inputKey'}>Key:</label>
                            <select name={'inputKey'} id={'inputKey'}
                                    value={key} onChange={ev => setKey(ev.target.value)}
                                    tabIndex={3}>{keys.map((songKey) => (
                                <option value={songKey.mood[mood].value}
                                        key={songKey.mood[mood].value}>{songKey.mood[mood].label}</option>
                            ))}
                        </select>
                        <input type={'radio'} id={'major'} name={'majorOrMinor'}
                               value={0} className={'inputMajorOrMinor'} checked={mood === 0}
                               onChange={ev => {
                                   setMood(Number(ev.target.value));
                                   setKey('');
                               }} tabIndex={4}/>
                        <label htmlFor={'major'} className={'labelInputMajorOrMinor'}>major</label>
                        <input type={'radio'} id={'minor'} name={'majorOrMinor'}
                               value={1} className={'inputMajorOrMinor'} checked={mood === 1}
                               onChange={ev => {
                                   setMood(Number(ev.target.value));
                                   setKey('');
                               }}/>
                        <label htmlFor={'minor'} className={'labelInputMajorOrMinor'}>minor</label>
                        <button id={'buttonCancelAddReference'} type='button' onClick={() => {
                            props.song.status = 'display';
                            setToggleEditReference(false);
                            setRefIndex(-1)
                            clearReference();
                            setReadOnly('');
                        }
                        } tabIndex={6}>
                            cancel
                        </button>
                    </span>
                    </form>
                    <button id={'buttonClearReference'} type='button' onClick={() => {
                        clearReference()
                    }} tabIndex={9}>
                        ! clear
                    </button>
                    {toggleCreateOrUpdate === 'update' &&
                        <button id={'buttonDeleteReference'} type='button' onClick={() => {
                            deleteReference()
                        }}>
                            &#10008; delete
                        </button>
                    }
                </div>}

                {toggleEditLink && <EditLink
                    toggleCreateOrUpdate={toggleCreateOrUpdate}
                    links={props.song.links}
                    linkIndex={linkIndex}
                    returnAndSave={() => {
                        saveSongItem();
                        setToggleEditLink(false);
                    }}
                    onCancel={() => {
                        setToggleEditLink(false);
                        setLinkIndex(-1);
                    }}
                    onClear={() => {
                        setLinkIndex(-1);
                        setToggleCreateOrUpdate('create');
                    }}
                />}

                {toggleEditSongSheet && <EditSongSheet
                    toggleCreateOrUpdate={toggleCreateOrUpdate}
                    songSheets={props.song.songSheets}
                    sheetIndex={sheetIndex}
                    returnAndSave={() => {
                        saveSongItem();
                        setToggleEditSongSheet(false);
                        setToggleCreateOrUpdate('create');
                    }}
                    save={saveSongItem}
                    displayMsg={(msg) => {props.displayMsg(msg)}}
                    onCancel={() => {
                        setToggleEditSongSheet(false);
                        setSheetIndex(-1);
                        setToggleCreateOrUpdate('create');
                    }}
                    onClear={() => {
                        setSheetIndex(-1);
                        setToggleCreateOrUpdate('create');
                    }}
                    onDeleteSongSheetFile={(fileId) => deleteSongSheetFile(fileId)}
                    downloadSheet={(fileId) =>  downloadSongSheetFile(fileId)}
                />}
            </div>


            <div className={'dataSheetElement'} id={'displaySpace'}>
                <div>
                    {(props.song.links !== undefined && props.song.links?.length > 0)
                        && <div className={'elementContainer'} id={'withoutTopMargin'}>
                            {props.song.links.map((item, index) =>
                                <div key={index} className={'linkItem'}>
                                    <span className={'linkIndicator'}
                                          onClick={() => openUpdateLink(index)}>
                                        &nbsp; &#8734;</span> &nbsp;
                                    <a href={item.linkTarget} className={'linkText'} target={'_blank'} rel={'noreferrer'}>
                                        {item.linkText}</a><span className={'positionTextAfterClickableText'}></span>
                                    {item.linkKey &&
                                        <span> – <span className={'showKey'}>{item.linkKey}</span></span>}
                                    {item.linkAuthor && <span id={'showLinkAuthor'}> – {item.linkAuthor}</span>}
                                    {item.linkStrumming &&
                                        <span id={'showLinkStrumming'}> – {item.linkStrumming}</span>}
                                </div>)
                            }
                        </div>
                    }
                </div>

                <div>
                    {(props.song.songSheets !== undefined && props.song.songSheets?.length > 0)
                        && <div className={'elementContainer'}>
                            {props.song.songSheets.map((item, index) =>
                                <div key={index} className={toggleCreateOrUpdate === 'create'
                                    ? 'songSheet'
                                    : 'songSheetDeactivated'}>
                                        <span className={'songSheetIndicator'}
                                              onClick={() => openUpdateSongSheet(index)}>
                                            &nbsp; &nbsp;&#x266b;</span> &nbsp;
                                        <span className={'songSheetName'}
                                              onClick={() => downloadSongSheetFile(item.fileId!)}
                                        >{item.filename && <span>{item.filename}</span>}
                                        </span><span className={'positionTextAfterClickableText'}></span>
                                        {item.name}
                                    {item.key && <span> – <span className={'showKey'}>{item.key}</span></span>}
                                    {item.source && <span className={'songSheetSource'}> – {item.source}</span>}
                                    {item.description && <span> – {item.description}</span>}

                                </div>)}
                        </div>
                    }
                </div>

                {props.song.references !== undefined && props.song.references.length > 0
                    && <div className={'elementContainer'}>
                        {props.song.references.map((item, index) =>
                            <div key={index} className={'reference'}>
                                <span className={'referenceIndicator'}
                                      onClick={() => openUpdateReference(index)}>
                                    &nbsp; &ndash;&#129174;</span> &nbsp;
                                <span className={'referenceText'}>
                                    {(item.addedCollection === null) ?
                                    <span>{songCollectionToRealName(item.songCollection)}</span> :
                                    <span>{item.addedCollection}</span>}
                                    {item.page !== 0 && <span>, page {item.page} </span>}
                                </span>

                                {item.key && <span> – <span className={'showKey'}>{item.key}</span></span>}
                            </div>)}
                    </div>}

            </div>


            <div id={'songFooter'}>
                <span>created:</span> {props.song.dayOfCreation.day}.
                {props.song.dayOfCreation.month}.
                {props.song.dayOfCreation.year}
            </div>

            <span id={'buttonDeleteSong'}>
                <button type='button' onClick={() => {
                    if (props.song.songSheets?.length === 0
                        && props.song.links?.length === 0
                        && (props.song.description == null || props.song.description.length < 51)) {
                            deleteSongItem(props.song.id)
                    } else {
                        promptConfirmDeletionBox()
                    }
                }}>
                    &#10008; delete
                </button>
            </span>

            <ConfirmationBox
                message={message}
                doDelete={() => deleteSongItem(props.song.id)}
                cancelDelete={() => setMessage('')}
            />
        </div>
    )
}

export default SongItemDetails
