import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ClientDetail } from "src/app/models/client-detail";
import { ClientMappingOperations } from "src/app/models/client-mapping-operations";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ClientMappingService {
  constructor(private Http: HttpClient) {}

  getTemplateFields(id: number): Observable<any> {
    const endpoint = `${environment.apiUrl}/getTemplateFields/Client/` + id;
    return this.Http.get(endpoint);
  }

  getDBFieldName(id: number): Observable<any> {
    const endpoint = `${environment.apiUrl}/getDBFieldName/Client/` + id;
    return this.Http.get(endpoint);
  }

  postMapfield(data: ClientMappingOperations): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/mapField`, data, {
      headers: { accept: "*/*", "Content-Type": "application/json" },
    });
  }

  saveConfiguration(id: number): Observable<any> {
    return this.Http.put(
      `${environment.apiUrl}/saveConfiguration/Client/` + id,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }

  postUploadFileUrl(id: number): string {
    return `${environment.apiUrl}/uploadFile/Client/` + id;
  }

  addClient(data: ClientDetail): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/addClient`, data, {
      headers: { accept: "*/*", "Content-Type": "application/json" },
    });
  }

  getAllClientDetails(id: number): Observable<any> {
    return this.Http.get(`${environment.apiUrl}/getClientDetail/Client/` + id);
  }

  updateClient(data: ClientDetail): Observable<any> {
    return this.Http.post(`${environment.apiUrl}/updateClient`, data, {
      headers: { accept: "*/*", "Content-Type": "application/json" },
    });
  }

  postUploadClient(cid: number, data: ClientDetail): Observable<any> {
    return this.Http.post(
      `${environment.apiUrl}/updateFile/Client/` + cid,
      data,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
  }
}
