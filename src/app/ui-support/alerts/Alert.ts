
export class Alert {
    type: AlertType;
    msg: string;
    timeout: number;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }

}

export enum AlertType {
    success,
    warning,
    danger,
    info
}
