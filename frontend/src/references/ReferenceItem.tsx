import {Reference} from "./ReferenceModels";

interface ReferenceItemProps {
    reference: Reference
}

function ReferenceItem(props: ReferenceItemProps) {


    return (
        <div>
            <div id={props.reference.id} className={'referenceItem'}>
                {props.reference.title}
            </div>

        </div>
    )
}

export default ReferenceItem