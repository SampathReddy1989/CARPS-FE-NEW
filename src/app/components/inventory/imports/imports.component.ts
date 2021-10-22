import { Component, OnInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";
import { RecordsInfo } from "src/app/models/invalid-records-info";
import { UiCacheStore } from "src/app/models/ui-cache-store";
import { UiFileInfo } from "src/app/models/ui-meta-data";
import { ImportService } from "src/app/services/inventory/import.service";
import { DialogService } from "src/app/services/dialog/dialog.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-imports",
  templateUrl: "./imports.component.html",
  styleUrls: ["./imports.component.scss"],
})
export class ImportsComponent implements OnInit {
  private static FILE_LIMIT: number = 5;
  uiFileInfo: UiFileInfo;
  filesInfo: UiFileInfo[] = [];
  uploadFileUrlPath: string;
  invalidRecords: any;
  //charting data
  recordsInfo: RecordsInfo;
  percentValid: string;
  pieData: any = [];

  // options
  view: any[] = [300, 300];
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  arcWidth: number = 0.3;
  legendTitle: string = "Records";
  legendPosition: string = "below";
  colorScheme = {
    domain: ["#4caf50", "#f44336"],
  };

  constructor(
    private importService: ImportService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.currFileInfo(UiCacheStore.fromCache("InventoryImportFilesInfoTime"));
    this.evalRecord(UiCacheStore.fromCache("RecordsInfo"));
    this.invalidRecords = UiCacheStore.fromCache(
      "InventoryImportInvalidRecords"
    );
    this.uploadFileUrlPath = this.importService.postUploadFileUrl(
      AppComponent.getCurrentClient().clientId,
      AppComponent.getCurrentUser().ntlg
    );
  }

  isFileInfoShow(): boolean {
    return this.filesInfo.length > 0;
  }

  onFileComplete(data: any) {
    this.dialogService.openSuccessModal("File extracted successfully.");
    this.onExtract();
    this.listInvalidRecords();
  }

  onFileLoad(fl: File) {
    if (this.filesInfo.length > ImportsComponent.FILE_LIMIT) {
      this.removeFileInfo(this.filesInfo[this.filesInfo.length - 1]);
    }
    const uiFileInfo: UiFileInfo = new Object();
    uiFileInfo.fileName = fl.name;
    uiFileInfo.infoTime = AppComponent.currentTimeStamp();

    this.filesInfo.push(uiFileInfo);
    UiCacheStore.toCache("InventoryImportFilesInfoTime", this.filesInfo);
    this.currFileInfo(UiCacheStore.fromCache("InventoryImportFilesInfoTime"));
  }

  isValidData(): boolean {
    return (
      this.recordsInfo &&
      this.recordsInfo.hasOwnProperty("totalRecords") &&
      this.recordsInfo.totalRecords > 0 &&
      this.recordsInfo.hasOwnProperty("validRecords") &&
      this.recordsInfo.validRecords > 0
    );
  }

  isInValidData(): boolean {
    return (
      this.recordsInfo &&
      this.recordsInfo.hasOwnProperty("inValidRecords") &&
      this.recordsInfo.inValidRecords > 0
    );
  }

  isSaveData(): boolean {
    return (
      this.recordsInfo !== undefined &&
      this.recordsInfo.hasOwnProperty("totalRecords") &&
      this.recordsInfo.hasOwnProperty("validRecords") &&
      this.recordsInfo.totalRecords === this.recordsInfo.validRecords
    );
  }

  getDownloadLink(): string {
    return (
      `${environment.apiUrl}/download/invalidRecords/User/` +
      AppComponent.getCurrentUser().ntlg +
      `/Client/` +
      AppComponent.getCurrentClient().clientId
    );
  }

  getInvalidRecordCell(row: number, col: number): string {
    if (row < this.invalidRecords.length)
      return this.invalidRecords[row][col] ? this.invalidRecords[row][col] : "";
  }

  onSaveAll() {
    if (!this.isValidData()) return;

    this.importService
      .saveInventoryConfiguration(
        AppComponent.getCurrentClient().clientId,
        AppComponent.getCurrentUser().ntlg,
        this.filesInfo[this.filesInfo.length - 1].fileName,
        null
      )
      .subscribe(
        (data) => {
          this.dialogService.openSuccessModal(
            "Inventory uploaded successfully"
          );
        },
        (error) => {
          this.dialogService.openErrorModal("Inventory upload failed");
        }
      );
  }

  clearFiles() {
    this.filesInfo = [];
    UiCacheStore.toCache("InventoryImportFilesInfoTime", this.filesInfo);
  }

  removeFileInfo(finfo: UiFileInfo) {
    const index = this.filesInfo.indexOf(finfo, 0);
    if (index > -1) {
      this.filesInfo.splice(index, 1);
    }
  }

  private onExtract() {
    this.importService
      .getInValidRecordCount(
        AppComponent.getCurrentClient().clientId,
        AppComponent.getCurrentUser().ntlg,
        this.filesInfo[this.filesInfo.length - 1].fileName
      )
      .subscribe(
        (data: RecordsInfo) => {
          UiCacheStore.toCache("RecordsInfo", data);
          this.evalRecord(data);
        },
        (error) => {
          this.dialogService.openErrorModal("Error retrieving records");
        }
      );
  }

  private listInvalidRecords() {
    this.importService
      .getInValidRecords(
        AppComponent.getCurrentClient().clientId,
        AppComponent.getCurrentUser().ntlg,
        this.filesInfo[this.filesInfo.length - 1].fileName
      )
      .subscribe(
        (data) => {
          if (data && data.length > 0) {
            this.invalidRecords = data;
            UiCacheStore.toCache(
              "InventoryImportInvalidRecords",
              this.invalidRecords
            );
          }
        },
        (error) => {
          this.dialogService.openErrorModal("Error retrieving invalid records");
        }
      );
  }

  private currFileInfo(data: UiFileInfo[]) {
    if (data) {
      this.filesInfo = data;
      if (this.filesInfo.length > 0) {
        this.uiFileInfo = this.filesInfo[0];
      }
    }
  }

  private evalRecord(data: RecordsInfo) {
    if (data) {
      this.recordsInfo = data;
      this.pieData = [
        { name: "valid", value: this.recordsInfo.validRecords },
        { name: "invalid", value: this.recordsInfo.inValidRecords },
      ];
      this.percentValid = Number(
        (this.recordsInfo.validRecords / this.recordsInfo.totalRecords) * 100
      ).toFixed(1);
    }
  }
}
