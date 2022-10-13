import '../styles/references.css';
import '../styles/common.css';
import React, {FormEvent, useEffect, useState} from "react";
import ReferenceItem from "./ReferenceItem";
import {ReferencesDTO, UploadResult} from "./ReferenceModels";
import DisplayMessage from "../DisplayMessage";
import EditReferenceItem from "./EditReferenceItem";
import DisplayUploadResult from "./DisplayUploadResult";

function References() {

    const [toggleDisplaySearchResultsButNotReference, setToggleDisplaySearchResultsButNotReference] = useState(true);
    const [toggleDisplayUploadFunction, setToggleDisplayUploadFunction] = useState(false);
    const [toggleDisplayUploadResult, setToggleDisplayUploadResult] = useState(false);

    const [searchWord, setSearchWord] = useState('');
    const [message, setMessage] = useState('');
    const [uploadResult, setUploadResult] = useState({} as UploadResult);
    const [referencesDTO, setReferencesDTO] = useState({} as ReferencesDTO);

    useEffect(() => {
        getAllReferences()
    }, []);

    const getAllReferences = () => {
        fetch('api/collections/', {
            method: 'GET',
        })
            .then(response => response.json())
            .then((responseBody: ReferencesDTO) => setReferencesDTO(responseBody))
            .then(() => {

            });
        setToggleDisplaySearchResultsButNotReference(true);
        setMessage(sessionStorage.getItem('message') ?? '')
    };

    const searchSong = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch('api/collections/' + searchWord, {
            method: 'GET',
        })
            .then(response => response.json())
            .then((responseBody: ReferencesDTO) => setReferencesDTO(responseBody));
        setSearchWord('');
    }

    const undoSearch = () => {
        getAllReferences();
        setSearchWord('');
    }

    const openUpload = () => {
        toggleDisplayUploadFunction
            ? setToggleDisplayUploadFunction(false)
            : setToggleDisplayUploadFunction(true);
    }

    const editItem = (id: string) => {
        fetch('api/collections/edit/' + id, {
            method: 'GET',
        })
            .then(response => response.json())
            .then((responseBody: ReferencesDTO) => setReferencesDTO(responseBody))
            .then(() => setToggleDisplaySearchResultsButNotReference(false));
    }

    function uploadFile(files: FileList | null) {
        sessionStorage.setItem('messageType', 'red');
        if (files === null) {
            alert('Somehow the FormData Object did not work properly.')
        } else if (!files[0].name.endsWith('.txt')) {
            setMessage('Sorry, file "' + files[0].name + '" will not work...\nPlease, choose a regular text file.')
        } else {
            const formData = new FormData();
            formData.append('file', files[0]);
            let responseStatus = 0;
            fetch('api/collections/upload/', {
                method: 'POST',
                body: formData,
            })
                .then((response) => {
                    responseStatus = response.status;
                    return response.json();
                })
                .then((responseBody) => {
                    if (responseStatus === 200) {
                        setUploadResult(responseBody);
                        setToggleDisplayUploadResult(true);
                        console.log('File "' + files[0].name + '" successfully transmitted to backend!');
                        console.log(responseBody);
                    } else if (responseStatus === 400) {
                        setMessage('Sorry, the server does not accept your request (Bad Request).')
                    } else if (responseStatus === 404) {
                        setMessage('Sorry, the server is unable to respond to your request.')
                    } else if (responseStatus === 406) {
                        setMessage(responseBody.message);
                    } else if (responseStatus === 500) {
                        setMessage(responseBody.message);
                    } else if (responseStatus !== 201) {
                        setMessage('Unfortunately, something went wrong.')
                    } else {
                        alert(responseBody);
                    }
                });
        }
    }

    const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        alert("Hurra! Angekommen.")
    }

    return (
        <div>
            <div className={'flex-parent'}>
                <div className={'flex-child'}>
                    <h2>Song Collections</h2>
                    <div id={''} onDragOver={enableDropping}>Just drop here!</div>
                </div>
                <div className={'flex-child'}>
                    {toggleDisplaySearchResultsButNotReference
                        ?   <div>
                            <div id={'searchForm'}>
                                    <form onSubmit={ev => searchSong(ev)}>
                                        <div className={'header'}>
                                            <input className={"title"} id={'inputSearchWord'} type="text" value={searchWord}
                                                   placeholder={'your search word here...'}
                                                   onChange={(ev) =>
                                                       setSearchWord(ev.target.value)
                                                   }
                                                   onKeyDown={(event) => {
                                                       if (event.key === "Escape") {
                                                           undoSearch()
                                                       }
                                                   }}
                                                   required/>
                                        </div>
                                    </form>
                                    <div>
                                        <button id={'undoSearch'} onClick={undoSearch}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") {
                                                        undoSearch()
                                                    }
                                                }}>clear
                                        </button>
                                    </div>
                                </div>

                                <div id={"referenceSearchResult"}>
                                    {referencesDTO.referenceList
                                        ? referencesDTO.referenceList.map(item =>
                                            <ReferenceItem key={item.id} reference={item}
                                                           onItemClick={editItem}
                                            />)
                                        : <span>... loading</span>
                                    }
                                </div>
                            <span id={"addNewCollection"} className={"doSomething"}
                                  onClick={openUpload}>+ add a new collection</span>
                        </div>
                        :
                            referencesDTO.referenceList.map(item =>
                            <EditReferenceItem key={item.id} reference={item}
                                               doCancel={getAllReferences}
                            />)
                    }

                    <div>{toggleDisplayUploadFunction &&
                        <form id={'formAddFile'} encType={'multipart/form-data'}>
                            <label id={'labelAddFile'}>Choose your file: </label>
                            <input type={'file'} id={'inputAddFile'}
                                   onChange={event => uploadFile(event.target.files)}/>
                        </form>}
                    </div>

                    <div>
                        {message && <DisplayMessage
                            message={message}
                            onClose={() => {
                                setMessage('');
                                sessionStorage.setItem('message', '');
                                sessionStorage.removeItem('messageType')
                            }}
                        />}
                    </div>

                    <div>
                        {toggleDisplayUploadResult && <DisplayUploadResult
                            uploadResult={uploadResult}
                            onClose={() => {
                                setToggleDisplayUploadResult(false);
                            }}
                        />}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default References
