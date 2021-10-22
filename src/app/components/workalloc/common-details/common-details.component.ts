import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator, MatTableDataSource } from "@angular/material";

@Component({
  selector: "app-common-details",
  templateUrl: "./common-details.component.html",
  styleUrls: ["./common-details.component.scss"],
})
export class CommonDetailsComponent implements OnInit, OnChanges {
  @Input() name: string;
  @Input() tabledata: any;
  @Output() allocpaginationLogic = new EventEmitter<any>();
  isShowTable = false;
  columns = [];
  displayedColumns: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  noOfRows: number;

  constructor() {}

  ngOnInit() {
    this.noOfRows = 0;
    this.isShowTable = false;
  }

  ngOnChanges() {
    this.columns = [];
    this.isShowTable = this.loadAccountTableData(this.processTableData());
    if (this.tabledata && this.tabledata.length > 0) {
      this.noOfRows = this.tabledata[1][this.tabledata[1].length - 1];
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
        this.displayedColumns = this.columns.map((c) => c.columnDef);
        this.dataSource = new MatTableDataSource(processedData);
        // this.dataSource.paginator = this.paginator;
      }
      return true;
    }
    return false;
  }

  handlePage(event){
    // console.log(event);
    
    const data = {
      pageSize : event.pageSize,
      pageIndex : event.pageIndex + 1
    }
    this.allocpaginationLogic.emit(data);
  }
}
