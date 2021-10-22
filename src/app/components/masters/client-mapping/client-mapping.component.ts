import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { AppComponent } from "src/app/app.component";
import { ClientMappingDropdown } from "src/app/models/client-mapping-dropdown";
import { ClientMappingOperations } from "src/app/models/client-mapping-operations";
import { UiCacheStore } from "src/app/models/ui-cache-store";
import { UiFileInfo } from "src/app/models/ui-meta-data";
import { ClientMappingService } from "src/app/services/client/client-mapping.service";
import { DialogService } from "src/app/services/dialog/dialog.service";

@Component({
  selector: "app-client-mapping",
  templateUrl: "./client-mapping.component.html",
  styleUrls: ["./client-mapping.component.scss"],
})
export class ClientMappingComponent implements OnInit {
  private static FILE_LIMIT: number = 5;
  uiFileInfo: UiFileInfo;
  filesInfo: UiFileInfo[] = [];
  isAdd: boolean = false;
  issubmit: boolean = false;
  uploadFileUrlPath: string;
  displayedColumns = [
    "aliasName",
    "dBFieldName",
    "ordinalPosition",
    "mandatoryField",
    "duplicateField",
    "filterField",
    "sortField",
  ];
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<ClientMappingOperations>;

  clientMappingDropdown: ClientMappingDropdown[] = [];
  clientMappingOperations: ClientMappingOperations[] = [];
  uiDataClMaps: ClientMappingOperations[] = [];

  constructor(
    private clientMappingService: ClientMappingService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.isAdd = false;
    this.issubmit = false;
    this.currFileInfo(UiCacheStore.fromCache("ClientMappingFilesInfoTime"));
    this.uploadFileUrlPath = this.clientMappingService.postUploadFileUrl(
      AppComponent.getCurrentClient().clientId
    );
    this.refreshDBFieldData();
    this.refreshTemplateFieldsData();
  }

  isFileInfoShow(): boolean {
    return this.filesInfo.length > 0;
  }

  onFileComplete(data: Array<ClientMappingOperations>) {
    this.dialogService.openSuccessModal(
      "File Uploaded Successfully. Total attributes found :" + data.length
    );
    this.isAdd = true;

    // data?this.issubmit=true:this.issubmit=false
    this.issubmit = false;
    this.uiDataClMaps = [];
    this.clientMappingOperations = data;
    this.refreshClientMappedData(true);
    this.addUiRows(this.clientMappingOperations[this.uiDataClMaps.length]); // First Row
  }

  onFileLoad(fl: File) {
    if (this.filesInfo.length > ClientMappingComponent.FILE_LIMIT) {
      this.removeFileInfo(this.filesInfo[this.filesInfo.length - 1]);
    }
    const uiFileInfo: UiFileInfo = new Object();
    uiFileInfo.fileName = fl.name;
    uiFileInfo.infoTime = AppComponent.currentTimeStamp();

    this.filesInfo.push(uiFileInfo);
    UiCacheStore.toCache("ClientMappingFilesInfoTime", this.filesInfo);
    this.currFileInfo(UiCacheStore.fromCache("ClientMappingFilesInfoTime"));
    this.uiDataClMaps = [];
  }

  clearFiles() {
    this.filesInfo = [];
    UiCacheStore.toCache("ClientMappingFilesInfoTime", this.filesInfo);
  }

  removeFileInfo(finfo: UiFileInfo) {
    const index = this.filesInfo.indexOf(finfo, 0);
    if (index > -1) {
      this.filesInfo.splice(index, 1);
    }
  }

  mapField() {
    let data = {};
    if (this.uiDataClMaps && this.uiDataClMaps.length > 0) {
      data = this.uiDataClMaps[this.uiDataClMaps.length - 1];
    }

    this.clientMappingService.postMapfield(this.processData(data)).subscribe(
      (data) => {
        this.refreshClientMappedDataOnAddConfig(true);
        this.uiDataClMaps[this.uiDataClMaps.length - 1].uiFlag = false;
        if (this.uiDataClMaps.length === this.clientMappingOperations.length) {
          this.isAdd = false;
          this.issubmit = true;
          return;
        }
        this.addUiRows(this.clientMappingOperations[this.uiDataClMaps.length]);
      },
      (error) => {
        this.dialogService.openErrorModal(
          "Internal server error : postMapfield"
        );
      }
    );
  }

  saveConfiguration() {
    this.clientMappingService
      .saveConfiguration(AppComponent.getCurrentClient().clientId)
      .subscribe(
        (data) => {
          this.ngOnInit();
          this.dialogService.openSuccessModal(
            "Configuration Saved Successfully"
          );
        },
        (error) => {
          this.ngOnInit();
          this.dialogService.openErrorModal("Failed Saving Configuration");
        }
      );
  }

  addNewConfig(event) {
    if (this.uiDataClMaps && this.uiDataClMaps.length > 0) {
      if (!this.uiDataClMaps[this.uiDataClMaps.length - 1].dBFieldName) {
        this.dialogService.openErrorModal("DB Field Name is required.");
        return;
      } else {
        this.mapField();
      }
    }
  }

  onChange(event, clMap: ClientMappingOperations) {
    clMap.ordinalPosition = event.value;
    clMap.dBFieldName = this.clientMappingDropdown.find(
      (x) => x.ordinalPosition === clMap.ordinalPosition
    ).dBFieldName;
  }

  doDisableOption(ordinalPosition: number): boolean {
    return (
      this.uiDataClMaps.filter(
        (x) => x.ordinalPosition === ordinalPosition.toString()
      ).length > 0
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

  private refreshDBFieldData() {
    this.clientMappingService
      .getDBFieldName(AppComponent.getCurrentClient().clientId)
      .subscribe((data: ClientMappingDropdown[]) => {
        this.clientMappingDropdown = data;
      });
  }

  private refreshTemplateFieldsData() {
    this.clientMappingService
      .getTemplateFields(AppComponent.getCurrentClient().clientId)
      .subscribe((data) => {
        this.clientMappingOperations = data;
        this.refreshClientMappedData(false);
        this.uiDataClMaps = this.loadOnlySubmittedFields(
          this.clientMappingOperations
        );
        this.dataSource = new MatTableDataSource(this.uiDataClMaps);
        // this.dataSource.paginator = this.paginator;
      });
  }

  loadOnlySubmittedFields(data) {
    let newData = [];
    for (let i = 0; i < data.length; i++) {
      if (!data[i].dBFieldName) {
        data[i].uiFlag = true;
        newData.push(data[i]);
        this.isAdd = true;
        return newData;
      } else {
        newData.push(data[i]);
      }
    }
    return data;
  }

  private addUiRows(clAdd: ClientMappingOperations): ClientMappingOperations {
    if (clAdd && !clAdd.dBFieldName) {
      clAdd.uiFlag = true;
    }
    this.uiDataClMaps.push(clAdd);
    this.dataSource = new MatTableDataSource(this.uiDataClMaps);
    // this.dataSource.paginator = this.paginator;
    return clAdd;
  }

  private processData(obj: ClientMappingOperations): ClientMappingOperations {
    obj.mandatoryField = obj.uiMandatory ? 1 : 0;
    obj.duplicateField = obj.uiDuplicate ? 1 : 0;
    obj.filterField = obj.uiFilter ? 1 : 0;
    obj.sortField = obj.uiSort ? 1 : 0;
    delete obj.uiMandatory;
    delete obj.uiDuplicate;
    delete obj.uiFilter;
    delete obj.uiSort;
    delete obj.uiFlag;
    return obj;
  }

  private refreshClientMappedData(flag: boolean) {
    this.clientMappingOperations.forEach((clMapOp) => {
      clMapOp.uiMandatory = clMapOp.mandatoryField === 1;
      clMapOp.uiDuplicate = clMapOp.duplicateField === 1;
      clMapOp.uiFilter = clMapOp.filterField === 1;
      clMapOp.uiSort = clMapOp.sortField === 1;
      clMapOp.uiFlag = flag;
    });
  }

  private refreshClientMappedDataOnAddConfig(flag: boolean) {
    this.clientMappingOperations.forEach((clMapOp) => {
      clMapOp.uiMandatory = clMapOp.mandatoryField === 1;
      clMapOp.uiDuplicate = clMapOp.duplicateField === 1;
      clMapOp.uiFilter = clMapOp.filterField === 1;
      clMapOp.uiSort = clMapOp.sortField === 1;
    });
  }
}
