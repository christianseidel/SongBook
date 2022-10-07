import '../styles/references.css';
import '../styles/commons.css';
import React, {FormEvent, useEffect, useState} from "react";
import ReferenceItem from "./ReferenceItem";
import {ReferencesDTO} from "./ReferenceModels";

function References() {

    const [searchWord, setSearchWord] = useState('');
    const [toggleUpload, setToggleUpload] = useState(true);

    const [referencesDTO, setReferencesDTO] = useState({} as ReferencesDTO);

    useEffect(() => {
        fetch('api/collections/', {
            method: 'GET',
        })
            .then(response => response.json())
            .then((responseBody: ReferencesDTO) => setReferencesDTO(responseBody))
    }, []);

    const searchSong = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch('api/collections/' + searchWord, {
            method: 'GET',
        })
            .then(response => response.json())
            .then((responseBody: ReferencesDTO) => setReferencesDTO(responseBody))
            .then(() => {

            })
        setSearchWord('');
    }

    const openUpload = () => {
        toggleUpload
            ? setToggleUpload(false)
            : setToggleUpload(true);
    }

    function uploadFile(files: FileList | null) {

        if (files === null) {
            alert('Somehow the FormData Object did not work properly.')
        } else if (!files[0].name.endsWith('.txt')) {
            alert('Sorry, the file "' + files[0].name + '" will not work...\nPlease, choose a regular text file.')
        } else {

            const formData = new FormData();
            formData.append('file', files[0]);

            let message = '';

            fetch('api/collections/upload/', {
                method: 'POST',
                body: formData,
            })
                .then((response) => {
                    if (response.status === 400) {
                        message = ('Sorry, the server does not accept your request (Bad Request).')
                    } else if (response.status === 404) {
                        message = ('Sorry, the server is unable to respond to your request.')
                    } else if (response.status === 500) {
                        message = ('Sorry, the server is unable to handle your request (Internal Server Error).');
                    } else if (response.status !== 201) {
                        message = ('Unfortunately, something went wrong.')
                    } else {
                        return response.json();
                    }})
                .then ((responseBody) => {
                    message = ('Backend received your file "' + files[0].name + '".\n' +
                        responseBody.message);
                    console.log('-> Your file "' + files[0].name + '" successfully received by backend!');


                    setMessage(message);
                });
        }
    }

    function setMessage(message: string) {
        const displayMessage = document.getElementById('displayMessageReferences');
        const p = document.createElement("p");
        p.textContent = message;
        p.style.marginTop = "3px";
        p.style.marginBottom = "3px";
        displayMessage?.appendChild(p);
        setTimeout(function () {
            displayMessage?.removeChild(p);
        }, 9000);
    }


    return (
        <div>

            <div className={'flex-parent'}>
                <div className={'flex-child'}>
                    <h2>Song Collections</h2>
                </div>

                <div className={'flex-child'}>

                    <div>
                        <form onSubmit={ev => searchSong(ev)}>
                            <div className={'header'}>
                                <input className={"title"} id={'inputSearchWord'} type="text" value={searchWord} placeholder={'your search word here...'}
                                       onChange={ev => setSearchWord(ev.target.value)} required/><br/>
                            </div>
                        </form>
                    </div>

                    <div>
                        {referencesDTO.referenceList
                            ? referencesDTO.referenceList.map(item =>
                                <ReferenceItem key={item.id} reference={item}
                                />)
                            : <span>... loading</span>
                        }

                    </div>

                    <span id={"addNewCollection"} className={"doSomething"} onClick={openUpload}>+ add a new collection</span>

                    <div>{toggleUpload &&
                        <form id={'formAddFile'} encType={'multipart/form-data'}>
                            <label id={'labelAddFile'}>Choose your file: </label><br />
                            <input type={'file'}  id={'inputAddFile'}
                                   onChange={event => uploadFile(event.target.files)}/>
                        </form>}
                        <div id={"displayMessageReferences"}></div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default References
