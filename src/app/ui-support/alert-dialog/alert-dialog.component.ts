import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-alert-dialog",
  templateUrl: "./alert-dialog.component.html",
  styleUrls: ["./alert-dialog.component.scss"],
})
export class AlertDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ModalAlertData,

  ) {}

  ngOnInit() {}

  getAlertIcon() {
    switch (this.data.alertType) {
      case AlertType.SUCCESS:
        return "success";
      case AlertType.INFO:
        return "info";
      case AlertType.WARNING:
        return "warning";
      case AlertType.ERROR:
        return "error";
    }
  }
}

export class ModalAlertData {
  title: string;
  content: string;
  alertType: AlertType;
  closeButtonLabel: string;

  constructor(data?) {
    if (data) {
      this.title = data.title;
      this.content = data.content;
      this.alertType = data.alertType;
      this.closeButtonLabel = data.closeButtonLabel;
    }
  }
}

export enum AlertType {
  INFO,
  WARNING,
  ERROR,
  SUCCESS
}
