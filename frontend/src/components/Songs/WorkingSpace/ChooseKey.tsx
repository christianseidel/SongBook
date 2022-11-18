import {keys} from "../../literals/keys";
import React, {useEffect, useState} from "react";
import "../../styles/songDetails.css"

interface SetKeyProps {
    onCancel: () => void;
    escalateKey: (key: string) => void;
}

function ChooseKey(props: SetKeyProps) {

    const [key, setKey] = useState('');
    const [mood, setMood] = useState(0);

    useEffect(() => props.escalateKey(key));

///    useEffect(() => setMood(Mood.checkIfMajorOrEmpty(key) ? 0 : 1));

    return(
        <span className={'nextLine'}>
                        <label htmlFor={'inputKey'}>Key:</label>
                            <select name={'inputKey'} id={'inputKey'}
                                    value={key} onChange={ev => setKey(ev.target.value)}
                                    tabIndex={5}>{keys.map((key) => (
                                <option value={key.mood[mood].value}
                                        key={key.mood[mood].value}>{key.mood[mood].label}</option>
                            ))}
                        </select>
                        <input type={'radio'} id={'major'} name={'majorOrMinor'}
                               value={0} className={'inputMajorOrMinor'} checked={mood === 0}
                               onChange={ev => {
                                   setMood(Number(ev.target.value));
                                   setKey('');
                               }} tabIndex={6}/>
                        <label htmlFor={'major'} className={'labelInputMajorOrMinor'}>major</label>
                        <input type={'radio'} id={'minor'} name={'majorOrMinor'}
                               value={1} className={'inputMajorOrMinor'} checked={mood === 1}
                               onChange={ev => {
                                   setMood(Number(ev.target.value));
                                   setKey('');
                               }}/>
                        <label htmlFor={'minor'} className={'labelInputMajorOrMinor'}>minor</label>

            <button className={'buttonFloatRight'} type='button' onClick={() => {
                            props.onCancel()
                        }}
                                tabIndex={8}>
                            cancel
                        </button>
                    </span>
    )
}

export default ChooseKey