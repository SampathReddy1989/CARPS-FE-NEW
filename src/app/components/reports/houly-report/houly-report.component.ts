import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Reports } from "src/app/models/reports.model";
import { HourlyProductionService } from "src/app/services/reports/hourly-production.service";
import "rxjs/Rx";

@Component({
  selector: "app-houly-report",
  templateUrl: "./houly-report.component.html",
  styleUrls: ["./houly-report.component.scss"],
})
export class HoulyReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  hourlydata: any;
  Reports: Reports;
  displayedColumns = [
    // "clientName",
    // "statusCode",
    // "actionCode",
    // "billable",
    // "internalAccountable",
    // "externalAccountable",
    // "active",
    // "configurationFlag",
  ]

  constructor(private http: HourlyProductionService) {}

  ngOnInit(): void {
    this.http.accountsforhourlyproductin(this.Reports).subscribe((data) => {
      this.hourlydata = data.hourlydata;
      console.log("data", this.hourlydata);
    });
  }
}

// accountsforhourlyproductin() {
//   this.accountsforhourlyproductin().subscribe((data: Reports[]) => {
//     this.properties = data.properties;
//   });
// }
