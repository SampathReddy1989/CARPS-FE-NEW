import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from 'src/app/ui-support/alerts/toast.service';
import { AuthenticationService } from './authentication.service';
import { CustomErrorResponse } from './../../models/custom-error-response';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
        private toast: ToastService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.authenticationService.logout();
            }
            if (err.status === 500) {
                this.toast.error('Internal server error');
            }
            const cErr: CustomErrorResponse = err.error;
            this.toast.error(cErr.status + ' : ' + cErr.error + ' ; ' + cErr.message);

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
