import '../styles/references.css';
import '../styles/common.css';
import React, {FormEvent, useEffect, useState} from "react";
import ReferenceItem from "./ReferenceItem";
import {ReferencesDTO} from "./ReferenceModels";
import DisplayMessage from "../DisplayMessage";
import EditReferenceItem from "./EditReferenceItem";

function References() {

    const [toggleDisplaySearchResultsButNotReference, setToggleDisplaySearchResultsButNotReference] = useState(true);
    const [toggleUpload, setToggleUpload] = useState(false);

    const [searchWord, setSearchWord] = useState('');
    const [message, setMessage] = useState('');
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
        toggleUpload
            ? setToggleUpload(false)
            : setToggleUpload(true);
    }

    const editItem = (id: string) => {
        fetch('api/collections/edit/' + id, {
            method: 'GET',
        })
            .then(response => response.json())
            .then((responseBody: ReferencesDTO) => setReferencesDTO(responseBody))
            .then(() => setToggleDisplaySearchResultsButNotReference(false));
    }

    const editDone = () => {
        setMessage("habe fertig!");  //ToDo
        getAllReferences();
    }


    function uploadFile(files: FileList | null) {
        if (files === null) {
            alert('Somehow the FormData Object did not work properly.')
        } else if (!files[0].name.endsWith('.txt')) {
            alert('Sorry, the file "' + files[0].name + '" will not work...\nPlease, choose a regular text file.')
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
                    console.log(responseStatus);
                    return response.json();
                })
                .then((responseBody) => {
                    if (responseStatus === 200) {
                        setMessage('Backend received your file "' + files[0].name + '". ' +
                            'Out of a total of ' + responseBody.totalNumberOfReferences + ' references, ' +
                            responseBody.numberOfReferencesAccepted + ' references where added.');
                        console.log('File "' + files[0].name + '" successfully transmitted to backend!');
                    } else if (responseStatus === 400) {
                        setMessage('Sorry, the server does not accept your request (Bad Request).')
                    } else if (responseStatus === 404) {
                        setMessage('Sorry, the server is unable to respond to your request.')
                    } else if (responseStatus === 406) {
                        setMessage(responseBody.message);
                    } else if (responseStatus === 500) {
                        setMessage('Sorry, the server is unable to handle your request (Internal Server Error).');
                    } else if (responseStatus !== 201) {
                        setMessage('Unfortunately, something went wrong.')
                    } else {
                        alert(responseBody);
                    }
                });
        }
    }

    return (
        <div>

            <div className={'flex-parent'}>
                <div className={'flex-child'}>
                    <h2>Song Collections</h2>
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
                            </div>
                        :
                            referencesDTO.referenceList.map(item =>
                            <EditReferenceItem key={item.id} reference={item}
                                               onCancel={getAllReferences}
                            />)
                    }

                    {toggleDisplaySearchResultsButNotReference &&
                        <span id={"addNewCollection"} className={"doSomething"}
                              onClick={openUpload}>+ add a new collection</span>
                    }

                    <div>{toggleUpload &&
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
                                sessionStorage.removeItem('messageMarker')
                            }}
                        />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default References
