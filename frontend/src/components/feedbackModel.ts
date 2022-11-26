export class feedback {

    message: string;
    icon: string;
    lifetime: number;

    constructor (message: string, icon: string, lifetime: number) {
        this.message = message;
        this.icon = icon;
        this.lifetime = lifetime;
    }
}
