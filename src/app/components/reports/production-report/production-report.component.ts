import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Reports } from "src/app/models/reports.model";
import { FormGroup, FormControl } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-production-report",
  templateUrl: "./production-report.component.html",
  styleUrls: ["./production-report.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ProductionReportComponent implements OnInit {
  public today: Date = new Date();
  public currentYear: number = this.today.getFullYear();
  public currentMonth: number = this.today.getMonth();
  public currentDay: number = this.today.getDate();
  public minDate: Object = new Date(
    this.currentYear,
    this.currentMonth,
    this.currentDay
  );

  constructor(private http: HttpClient) {}

  ngOnInit() {}
}
