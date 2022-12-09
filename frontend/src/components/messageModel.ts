export class message {

    text: string;
    icon: string;
    color: string;
    lifetime: number;
    forward: string;

    constructor (text: string, icon: string, color: string, lifetime: number, forward: string) {
        this.text = text;
        this.icon = icon;
        this.color = color;
        this.lifetime = lifetime;
        this.forward = forward;
    }
}

export enum MessageType {
    GREEN = "green",
    RED = "red"
}

export class NewMessage {
    static create(text: string, type: MessageType) {
        let icon: string;
        let color: string = type;
        let lifetime: number;
        if (type === MessageType.GREEN) {
            icon = '\u2713';
            lifetime = 1.6;
        } else if (type === MessageType.RED) {
            icon = "!";
            lifetime = 60 * 60 * 24;
        } else {
            icon = "??";
            lifetime = 60 * 60;
        }
        return new message(text, icon, color, lifetime, '');
    }

    static createAndWait(text: string, forward: string) {
        return new message(text, '\u2713', "green", -1, forward);
    }
}


