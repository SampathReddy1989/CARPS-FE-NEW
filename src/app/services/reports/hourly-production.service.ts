import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Reports } from "src/app/models/reports.model";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class HourlyProductionService {
  constructor(private Http: HttpClient) {}

  getDBFieldName(id: number): Observable<any> {
    const endpoint = `${environment.apiUrl}/report/dbFieldName/` + id;
    return this.Http.get(endpoint);
  }
  accountsforhourlyproductin(data: Reports): Observable<any> {
    return this.Http.post(
      `${environment.apiUrl}/report/getHourlyProduction/`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }
  accountsproductindetails(data: Reports): Observable<any> {
    return this.Http.post(
      `${environment.apiUrl}/report/getProductionDetails/`,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }
  downloadhourlyRecords(cid: number, uid: number | string): Observable<any> {
    return this.Http.get(
      `${environment.apiUrl}/report/downloadreport/getHourlyProduction/` +
        uid +
        `/Client/` +
        cid,
      { headers: { accept: "*/*", "Content-Type": "application/octet-stream" } }
    );
  }
  downloadproductionRecords(
    cid: number,
    uid: number | string
  ): Observable<any> {
    return this.Http.get(
      `${environment.apiUrl}/report/downloadreport/getProductionDetails/` +
        uid +
        `/Client/` +
        cid,
      { headers: { accept: "*/*", "Content-Type": "application/octet-stream" } }
    );
  }
}
