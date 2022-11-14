import React from "react";
import '../../styles/songDetails.css'
import {Link} from "../songModels";

interface SongItemLinksProps {
    links: Link[] | undefined;
    doEditLink: (index: number) => void;
}

function DisplayLinks (props: SongItemLinksProps) {

    const editLink = (index: number) => {
        sessionStorage.setItem('linkText', props.links![index].linkText);
        sessionStorage.setItem('linkTarget', props.links![index].linkTarget);
        props.doEditLink(index);
    }

    return (
        <div>
            {(props.links !== undefined && props.links?.length > 0)
                && <div id={'displayLinks'}>
                    {props.links.map((item, index) =>
                        <div key={index} className={'link'}>
                            <span className={'linkDot'} onClick={() => editLink(index)}>&#8734;</span>&nbsp;
                            <a href={item.linkTarget} target={'_blank'} rel={'noreferrer'}>
                                <span className={'linkText'}>{item.linkText}</span></a>
                        </div>)
                    }
                </div>
            }
        </div>
    )
}

export default DisplayLinks