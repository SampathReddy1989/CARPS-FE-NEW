import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { AppComponent } from "src/app/app.component";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { AuditInboxService } from "src/app/services/audit/audit-inbox/audit-inbox.service";

@Component({
  selector: "app-audit-transaction",
  templateUrl: "./audit-transaction.component.html",
  styleUrls: ["./audit-transaction.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class AuditTransactionComponent implements OnInit, OnChanges {
  @Input() name: string;
  @Input() tabledata: any;
  @Output() reloadRequest = new EventEmitter<any>();
  @Output() paginationLogic = new EventEmitter<any>();

  isShowTable = false;
  columns = [];
  displayedColumns: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;

  isExpansionDetailRow = (i: number, row: Object) => {
    row.hasOwnProperty("detailRow");
  };

  expandedElement: MatTableDataSource<any>;
  selectedAccountDetails: any;
  tempSavedData: any;
  noOfRows: number;

  constructor(private http: AuditInboxService) {}

  ngOnInit() {
    this.isShowTable = false;
    this.noOfRows = 0;
  }

  onReloadRequest(data: any) {
    this.reloadRequest.emit(true);
  }

  ngOnChanges() {
    this.columns = [];

    if (this.tabledata && this.tabledata.length && this.tabledata.length > 1) {
      this.isShowTable = this.loadAccountTableData(this.processTableData());
      this.noOfRows = this.tabledata.length - 1;
    } else {
      this.dataSource = new MatTableDataSource();
      this.noOfRows = 0;
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
        propertyName.forEach((pName, index) => {
          this.columns.push({
            columnDef: pName,
            header: pName,
            cell: (element: any) => element[pName],
            isExpanded: false,
            rowNumber: index,
          });
        });
        this.displayedColumns = this.columns
          .map((c) => c.columnDef)
          .concat("actions");

        let actions = this.displayedColumns.pop();
        this.displayedColumns.unshift(actions);

        this.dataSource = new MatTableDataSource(processedData);
        this.dataSource.paginator = this.paginator;
      }
      return true;
    }
    return false;
  }

  onAccountSelection(row: any, i: any) {
    if (this.dataSource.data[i].isExpanded) {
      this.dataSource.data[i].isExpanded = false;
      this.tempSavedData = row;
    } else {
      this.dataSource.data[i].isExpanded = true;
      this.tempSavedData = row;
    }
  }

  handlePage(event){
    console.log("Clicked");
    
    const data = {
      pageSize : event.pageSize,
      pageIndex : event.pageIndex + 1
    }
    this.paginationLogic.emit(data);
  }
}
