import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Alert, AlertType } from './Alert';
import { filter } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private subject = new Subject<Alert>();

    constructor() {

    }

    onAlert(): Observable<Alert> {
        return this.subject.asObservable().pipe(filter(x => x.msg !== null));
    }

    success(msg: string) {
        this.alert(new Alert({
            type: AlertType.success,
            msg,
            timeout: 5000
        }));
    }

    info(msg: string) {
        this.alert(new Alert({
            type: AlertType.info,
            msg,
            timeout: 5000
        }));
    }

    warning(msg: string) {
        this.alert(new Alert({
            type: AlertType.warning,
            msg,
            timeout: 5000
        }));
    }

    error(msg: string) {
        this.alert(new Alert({
            type: AlertType.danger,
            msg,
            timeout: 5000
        }));
    }

    private alert(alert: Alert): Alert {
        this.subject.next(alert);
        return alert;
    }
}
