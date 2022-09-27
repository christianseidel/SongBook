import {Song} from './models'
import './styles/songs.css'

interface SongItemProps {
    song: Song
}

function SongDetails(props: SongItemProps) {



    return (
        <div>
            <div>
                <div>{props.song.title} </div>
                by {props.song.author}
            </div>
        </div>
    )
}

export default SongDetails