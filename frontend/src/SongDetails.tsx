import {Song} from './models'
import './styles/songs.css'
import {useState} from "react";

interface SongItemProps {
    song: Song
    onItemDeletion: () => void;
}

function SongDetails(props: SongItemProps) {

    const [error, setError] = useState('')

    function deleteItem(id: string) {
        fetch('/api/songbook/' + id, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    alert("Your Item was successfully deleted.");
                } else {
                    throw Error("An item with Id no. " + id + " could not be found.")
                }
            })
            .then(() => props.onItemDeletion())
            .catch(e => setError(e.message));
    }


    return (
        <div>
            <div>
                <div>
                    {props.song.title}
                    <span onClick={() => deleteItem(props.song.id)}>- X -</span>
                </div>
                    by {props.song.author}
            </div>
        </div>
    )
}

export default SongDetails