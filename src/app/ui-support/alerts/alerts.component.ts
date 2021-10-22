import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { ToastService } from './toast.service';
import { Alert, AlertType } from './Alert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnDestroy {

  constructor(private toastService: ToastService) {
    this.subscription = this.toastService.onAlert().subscribe(alert => {
      if (!alert.msg) {
        this.alerts = [];
      }
      this.add(alert);
    });
  }

  subscription: Subscription;

  alerts: any[] = [];

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  add(alert: Alert): void {
    this.alerts.push({
      type: AlertType[alert.type],
      msg: alert.msg,
      timeout: alert.timeout
    });
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
