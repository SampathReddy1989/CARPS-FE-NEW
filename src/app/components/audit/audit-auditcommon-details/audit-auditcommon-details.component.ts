import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatTableDataSource } from "@angular/material";
@Component({
  selector: "app-audit-auditcommon-details",
  templateUrl: "./audit-auditcommon-details.component.html",
  styleUrls: ["./audit-auditcommon-details.component.scss"],
})
export class AuditAuditcommonDetailsComponent implements OnInit, OnChanges {
  @Input() name: string;
  @Input() tabledata: any;

  isShowTable = false;
  columns = [];
  displayedColumns: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  noOfRows: number;

  constructor() {}

  ngOnInit() {
    this.isShowTable = false;
    this.noOfRows = 0;
    console.log(this.tabledata, 4567);
  }

  ngOnChanges() {
    this.columns = [];
    console.log(this.tabledata, 4567);
    this.isShowTable = this.loadAccountTableData(this.processTableData());
    if (this.tabledata && this.tabledata.length > 0) {
      this.noOfRows = this.tabledata.length - 1;
    }
  }

  private processTableData(): Object[] {
    if (this.tabledata) {
      const tData: string[][] = this.tabledata;
      if (tData.length > 1) {
        let objArrProcessed: Object[] = [];
        for (let i = 1; i < tData.length; i++) {
          let processedData: Object = new Object();
          for (let j = 0; j < tData[i].length; j++) {
            processedData[tData[0][j]] = tData[i][j];
          }
          objArrProcessed.push(processedData);
        }
        return objArrProcessed;
      }
    }
  }

  private loadAccountTableData(processedData: Object[]): boolean {
    if (processedData) {
      if (processedData.length > 0) {
        let propertyName: string[] = Object.keys(processedData[0]);
        propertyName.forEach((pName) => {
          this.columns.push({
            columnDef: pName,
            header: pName,
            cell: (element: any) => element[pName],
          });
        });
        console.log("processedData", processedData);
        this.displayedColumns = this.columns.map((c) => c.columnDef);
        this.dataSource = new MatTableDataSource(processedData);
        this.dataSource.paginator = this.paginator;
      }
      return true;
    }
    return false;
  }
}
