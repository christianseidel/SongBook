import '../styles/references.css';
import '../styles/landingPage.css';
import React, {FormEvent, useState} from "react";
import {upload} from "@testing-library/user-event/dist/upload";

function References() {

    const [searchWord, setSearchWord] = useState('');
    let toggleUpload = false;

    const searchSong = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        alert('oups, dann schaue ich mal nach: \"' + searchWord + '\"');
        setSearchWord('');

        const uploader = document.createElement("div");
        const form =

        // @ts-ignore
        document.getElementById('uploadNewCollection').appendChild(uploader)
    }
/*
    function getFiles(ev) {
        let files = ev.target.files;

        for (let i = 0, f; f = files[i]; i++) {
            if (!f.type.match('text/plain')) {
                continue;
            }

            let reader = new FileReader();

            reader.onload = (function(theFile) {
                return function(e) {
                    // creates thumbnails
                    let preview = document.createElement('p');
                    preview.className = 'thumb';
                    preview.src = e.target.result;
                    preview.title = theFile.name;
                        document.getElementById('uploadNewCollection').insertBefore(preview, null);
                };
            })(f);

            // Bilder als Data URL auslesen.
            reader.readAsDataURL(f);
        }

    // Auf neue Auswahl reagieren und gegebenenfalls Funktion dateiauswahl neu ausführen.
    document.getElementById('uploadNewCollection').addEventListener('change', getFiles, false);


    }
*/
    return (
        <div>

            <div className={'flex-parent'}>
                <div className={'flex-child'}>

                    <h2>Song Collections</h2>
                    <div className={'forAStarter'}>
                        Hier steht jetzt schon mal was
                    </div>

                </div>

                <div className={'flex-child'}>
                    <span id={"searchForASong"} className={"doSomething"} >&ndash;&#129174; search for a song</span>
                    <div>
                        <form onSubmit={ev => searchSong(ev)}>
                            <div className={'header'}>
                                <input className={"title"} id={'inputSearchWord'} type="text" value={searchWord} placeholder={'your search word here...'}
                                       onChange={ev => setSearchWord(ev.target.value)} required/><br/>

                            </div>

                        </form>
                    </div>

                    <span id={"addNewCollection"} className={"doSomething"}>+ add new collection</span>
                    {toggleUpload &&
                    <div>
                        <span id={'uploadNewCollection'}>upload</span>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default References