import '../styles/references.css';
import '../styles/commons.css';
import React, {FormEvent, useState} from "react";

function References() {

    const [searchWord, setSearchWord] = useState('');
    const [toggleUpload, setToggleUpload] = useState(true);


    const searchSong = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        alert('oups, dann schaue ich mal nach:"' + searchWord + '"');
        setSearchWord('');

        const uploader = document.createElement("div");


        // @ts-ignore
        document.getElementById('uploadNewCollection').appendChild(uploader)
    }

    const openUpload = () => {
        toggleUpload
            ? setToggleUpload(false)
            : setToggleUpload(true);
    }

    function uploadFile(files: FileList | null) {

        if (files === null) {
            alert('Wow, this didn\'t work. It never happened bevor!')
        } else if (!files[0].name.endsWith('.txt')) {
            alert('Sorry, the file "' + files[0].name + '" will not work...\nPlease, choose a regular text file instead.')

        } else {
        console.log('"' + files[0].name + '" was sent to backend!')

        fetch('api/collections/upload/', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: files[0],
            })
            .then((response) => {
                if (response.status === 404) {
                    alert('Sorry, the server is unable to respond to your request.')}
                else if (response.status === 200) {
                    alert("ERFOLG!!");
                }else if (response.status === 500) {
                    alert('Sorry, the server is unable to handle your request (Internal Server Error).');
                } else {
                        alert("naja: " + response.status + " – " + response.statusText)
                }
                });
        }
    }


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

                    <span id={"addNewCollection"} className={"doSomething"} onClick={openUpload}>+ add a new collection</span>

                    <div>{toggleUpload &&
                        <form id={'formChooseFile'} encType={'multipart/form-data'}>
                            <label id={'labelChooseFile'}>Choose your file: </label><br />
                            <input type={'file'}  id={'inputChooseFile'}
                                   onChange={event => uploadFile(event.target.files)}/>
                        </form>}
                    </div>


                </div>
            </div>
        </div>
    )
}

export default References
