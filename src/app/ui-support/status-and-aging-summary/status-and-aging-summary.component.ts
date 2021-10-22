import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { AgingWiseSummaryInfo } from "src/app/models/agentwise-info";
import { StatusWiseInfo } from "src/app/models/statuswise-info";

@Component({
  selector: "app-status-and-aging-summary",
  templateUrl: "./status-and-aging-summary.component.html",
  styleUrls: ["./status-and-aging-summary.component.scss"],
})
export class StatusAndAgingSummaryComponent implements OnInit, OnChanges {
  @Input() name: string;
  @Input() agingSummaryData: any;
  @Input() statusSummaryData: any;

  //chart data
  pieData = [];
  // options
  pieView: any[] = [350, 250];
  legendTitle: string = "";
  legendPosition: string = "below";
  pieColorScheme = {
    domain: ["#0d47a1", "#1565c0", "#1e88e5", "#82b1ff", "#ffc107"],
  };
  hbData = [];

  agingWiseSummaryInfo: AgingWiseSummaryInfo;

  constructor() {}

  ngOnInit() {
    if (this.agingSummaryData && this.agingSummaryData.length > 0) {
      this.evalAgingSummary(this.agingSummaryData);
    }
    if (this.statusSummaryData && this.statusSummaryData.length > 0) {
      this.evalStatusSummary(this.statusSummaryData);
    }
  }

  ngOnChanges() {
    if (this.agingSummaryData && this.agingSummaryData.length > 0) {
      this.evalAgingSummary(this.agingSummaryData);
    }
    if (this.statusSummaryData && this.statusSummaryData.length > 0) {
      this.evalStatusSummary(this.statusSummaryData);
    }
  }

  private evalAgingSummary(data: AgingWiseSummaryInfo[]) {
    if (data) {
      let aging: AgingWiseSummaryInfo = data.pop();
      this.pieData = [
        {
          name: "0-30",
          value: Number(aging.info0to30 !== undefined ? aging.info0to30 : 0),
        },
        {
          name: "31-60",
          value: Number(aging.info31to60 !== undefined ? aging.info31to60 : 0),
        },
        {
          name: "61-90",
          value: Number(aging.info61to90 !== undefined ? aging.info61to90 : 0),
        },
        {
          name: "91-120",
          value: Number(
            aging.info91to120 !== undefined ? aging.info91to120 : 0
          ),
        },
        {
          name: "> 120",
          value: Number(
            aging.infoAbove120 !== undefined ? aging.infoAbove120 : 0
          ),
        },
      ];
    }
  }

  private evalStatusSummary(data: StatusWiseInfo[]) {
    if (data) {
      this.hbData = [];
      data.forEach((obj) => {
        let currCss: string = "";
        switch (obj.wfstatus) {
          case "Allotted":
            currCss = "bg-success";
            break;

          case "Callback":
            currCss = "bg-warning";
            break;

          case "Rework":
            currCss = "bg-danger";
            break;

          case "Reported":
            currCss = "bg-secondary";
            break;
        }
        this.hbData.push({
          name: obj.wfstatus,
          value: Number(obj.count),
          css: currCss,
        });
      });
    }
  }

  onSelect(data): void {}

  onActivate(data): void {}

  onDeactivate(data): void {}
}
