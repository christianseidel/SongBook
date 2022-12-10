import '../styles/references.css';
import '../styles/common.css';
import React, {FormEvent, useEffect, useState} from "react";
import ReferenceItemWithinList from "./ReferenceItemWithinList";
import ReferenceToEdit from "./ReferenceToEdit";
import DisplayUploadResult from "./MsgReferencesUpload";
import DisplayMessage from "../DisplayMessage";
import {message, MessageType, NewMessage} from "../messageModel";
import {ReferencesDTO, UploadResult} from "./modelsReference";
import {useAuth} from "../UserManagement/AuthProvider";

interface Props {
    receiverRerenderSignal: (getAllReferences: () => void) => void;
}

function References(props: Props) {

    const {token} = useAuth();
    const [toggleDisplaySearchResultsButNotReference, setToggleDisplaySearchResultsButNotReference] = useState(true);
    const [toggleDisplayUploadFunction, setToggleDisplayUploadFunction] = useState(false);
    const [toggleDisplayUploadResult, setToggleDisplayUploadResult] = useState(false);

    const [searchWord, setSearchWord] = useState('');
    const [message, setMessage] = useState<message | undefined>(undefined);
    const [uploadResult, setUploadResult] = useState({} as UploadResult);
    const [referencesDTO, setReferencesDTO] = useState({} as ReferencesDTO);

    var fileName = '';

    useEffect(() => {
        getAllReferences()
    }, []);

    const getAllReferences = () => {
        fetch('api/collections/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then((responseBody: ReferencesDTO) => setReferencesDTO(responseBody));
        setToggleDisplaySearchResultsButNotReference(true);
    }

    props.receiverRerenderSignal(getAllReferences)

    const searchReference = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch('api/collections/' + searchWord, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
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
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    throw Error (response.statusText + '". Error code: ' + response.status + '.')
                }
        })
            .then((responseBody: ReferencesDTO) => setReferencesDTO(responseBody))
            .then(() => setToggleDisplaySearchResultsButNotReference(false))
            .catch(e => setMessage(NewMessage.create(e.message, MessageType.RED)))
        }


    function uploadFile(files: FileList | null) {       // ToDo: Introduce Check Sum
        if (files === null) {
            alert('Somehow the FormData Object did not work properly.')
        } else if (!files[0].name.endsWith('.txt')) {
            setMessage(NewMessage.create(
                'Unfortunately, file "' + files[0].name + '" will not work...\nPlease, choose a regular text file.',
                MessageType.RED
            ));
        } else {
            const formData = new FormData();
            formData.append('file', files[0]);
            fileName = files[0].name
            fetch('api/collections/upload/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            })
                .then((response) => {
                    if (response.status === 201) {
                        return response.json();
                    } else if (response.status === 400) {
                        throw Error('Server does not accept your request (error message: Bad Request, error code: ' + response.status + ').');
                    } else if (response.status === 404) {
                        throw Error('Server is unable to respond to your request (error code: ' + response.status + ').')
                    } else if (response.status === 500) {
                            throw Error('Server is unable to respond to your request (error code: ' + response.status + ').')
                    } else {
                        throw Error(response.statusText + ' (error code: ' + response.status + ').');
                    }
                })
                .then((responseBody) => {
                    setUploadResult(responseBody);
                    setToggleDisplayUploadResult(true);
                })
                .then(getAllReferences)
                .catch(e => setMessage(NewMessage.create(e.message, MessageType.RED)));
        }
    }

    return (
        <div>
                    <h2>List of References</h2>

                    {toggleDisplaySearchResultsButNotReference
                        ?   <div>
                            <div id={'searchForm'}>
                                    <form onSubmit={ev => searchReference(ev)}>
                                        <div className={'header'}>
                                            <input id={'inputSearchWord'} type="text" value={searchWord}
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
                                        <button id={'undoSearch'} type={'button'} onClick={undoSearch}
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
                                            <ReferenceItemWithinList key={item.id} reference={item}
                                                                     onItemClick={editItem}
                                            />)
                                        : <span>... loading</span>
                                    }
                                </div>
                            <span className={"doSomething"} id={"addNewCollection"}
                                  onClick={openUpload}>
                                {toggleDisplayUploadFunction
                                    ? <span>&lt;</span>
                                    : <span>+</span>}
                                &nbsp;add a new collection</span>
                        </div>
                        :
                            referencesDTO.referenceList.map(item =>
                            <ReferenceToEdit key={item.id} reference={item}
                                             doCancel={getAllReferences}
                                             displayMsg={(msg) => setMessage(msg)}
                            />)
                    }

                    <div>{toggleDisplayUploadFunction && toggleDisplaySearchResultsButNotReference &&
                        <form id={'formAddFile'} encType={'multipart/form-data'}>
                            <label id={'labelAddFile'}>Choose your file: </label>
                            <input type={'file'} id={'inputAddFile'}
                                   onChange={event => uploadFile(event.target.files)}/>
                        </form>}
                    </div>

                    <div>
                        {toggleDisplayUploadResult && <DisplayUploadResult
                            uploadResult={uploadResult}
                            fileName={fileName}
                            onClose={() => {
                                setToggleDisplayUploadResult(false);
                            }}
                        />}
                    </div>

                <DisplayMessage message={message}/>

                </div>

    )
}

export default References
