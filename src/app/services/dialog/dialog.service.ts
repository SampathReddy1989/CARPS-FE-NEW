import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import {
  AlertDialogComponent,
  ModalAlertData,
  AlertType,
} from "../../ui-support/alert-dialog/alert-dialog.component";
// import {
//   ConfirmComponent,
//   ModalConfirmData,
// } from "../components/confirm/confirm.component";

@Injectable({
  providedIn: "root",
})
export class DialogService {

  
  // warning(arg0: string) {
  //   throw new Error("Method not implemented.");
  // }
  constructor(public dialog: MatDialog) {}

  getAlertTitle(alertType: AlertType) {
    switch (alertType){
      case AlertType.SUCCESS:
        return "SUCCESS";
    }
    switch (alertType) {
      case AlertType.INFO:
        return "INFO"; 
      case AlertType.WARNING:
        return "WARNING";
      case AlertType.ERROR:
        return "ERROR";
    }
  }

  openAlertModal(message: string, alertType: AlertType) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: "400px",
      data: new ModalAlertData({
        title: this.getAlertTitle(alertType),
        content: message,
        closeButtonLabel: "OK",
        alertType: alertType,
      }),
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("After Close Modal", result);
    });
  }

  openSuccessModal(message: string) {
    this.openAlertModal(message, AlertType.SUCCESS);
  }

  openInfoModal(message: string) {
    this.openAlertModal(message, AlertType.INFO);
  }

  openWarningModal(message: string) {
    this.openAlertModal(message, AlertType.WARNING);
  }

  openErrorModal(message: string) {
    this.openAlertModal(message, AlertType.ERROR);
  }

  // openConfirmModal(message: string, callBackFunction: Function) {
  //   const dialogRef = this.dialog.open(ConfirmComponent, {
  //     width: "300px",
  //     data: new ModalConfirmData({
  //       title: "CONFIRM",
  //       content: message,
  //       confirmButtonLabel: "Confirm",
  //       closeButtonLabel: "Close",
  //     }),
  //   });

  //   dialogRef.afterClosed().subscribe((result) => callBackFunction(result));
  // }
}
