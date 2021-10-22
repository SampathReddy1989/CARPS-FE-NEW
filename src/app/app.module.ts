import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BootstrapModule } from "./bootstap.module";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HomeComponent } from "./components/home/home.component";
import { ImportsComponent } from "./components/inventory/imports/imports.component";
import { LoginComponent } from "./components/login/login.component";
import { ActionCodesComponent } from "./components/masters/action-codes/action-codes.component";
import { ClientMappingComponent } from "./components/masters/client-mapping/client-mapping.component";
import { ClientComponent } from "./components/masters/client/client.component";
import { ScenarioComponent } from "./components/masters/scenario/scenario.component";
import { StatusCodesComponent } from "./components/masters/status-codes/status-codes.component";
import { UsersComponent } from "./components/masters/users/users.component";
import { CommonDetailsComponent } from "./components/workalloc/common-details/common-details.component";
import { CommonTemplateComponent } from "./components/workalloc/common-template/common-template.component";
import { WorkallocComponent } from "./components/workalloc/workalloc.component";
import { MaterialModule } from "./material.module";
import { ErrorInterceptor } from "./services/auth/error.interceptor";
import { JwtInterceptor } from "./services/auth/jwt.interceptor";
import { AlertsComponent } from "./ui-support/alerts/alerts.component";
import { FileUploadComponent } from "./ui-support/file-upload/file-upload.component";
import { NavBarComponent } from "./ui-support/nav-bar/nav-bar.component";
import { AgentReallocationComponent } from "./components/workalloc/agent-reallocation/agent-reallocation.component";
import { AgentInboxComponent } from "./components/workalloc/agent-inbox/agent-inbox.component";
import { StatusAndAgingSummaryComponent } from "./ui-support/status-and-aging-summary/status-and-aging-summary.component";
import { InboxTransactionComponent } from "./components/workalloc/inbox-transaction/inbox-transaction.component";
import { AuditReallocationComponent } from "./components/audit/audit-reallocation/audit-reallocation.component";
import { AuditallocationComponent } from "./components/audit/audit-allocation/auditallocation.component";
import { AuditTemplateDetailsComponent } from "./components/audit/audit-template-details/audit-template-details.component";
import { AuditAuditcommonDetailsComponent } from "./components/audit/audit-auditcommon-details/audit-auditcommon-details.component";
import { TransactionFormComponent } from "./components/workalloc/transaction-form/transaction-form.component";
import { AuditInboxComponent } from "./components/audit/audit-inbox/audit-inbox.component";
import { AuditTransactionComponent } from "./components/audit/audit-transaction/audit-transaction.component";
import { AuditTransactionFormComponent } from "./components/audit/audit-transaction-form/audit-transaction-form.component";
import { AlertDialogComponent } from "./ui-support/alert-dialog/alert-dialog.component";
import { ProductionReportComponent } from "./components/reports/production-report/production-report.component";
import { HoulyReportComponent } from "./components/reports/houly-report/houly-report.component";
import { DateRangePickerModule } from "@syncfusion/ej2-angular-calendars";
@NgModule({
  declarations: [
    NavBarComponent,
    FileUploadComponent,
    AlertsComponent,

    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    ImportsComponent,

    WorkallocComponent,
    CommonTemplateComponent,
    CommonDetailsComponent,

    ScenarioComponent,
    StatusCodesComponent,
    ActionCodesComponent,
    ClientComponent,
    ClientMappingComponent,
    UsersComponent,
    AgentReallocationComponent,
    AgentInboxComponent,
    StatusAndAgingSummaryComponent,
    InboxTransactionComponent,
    AuditReallocationComponent,
    AuditallocationComponent,
    AuditTemplateDetailsComponent,
    AuditAuditcommonDetailsComponent,
    TransactionFormComponent,
    AuditInboxComponent,
    AuditTransactionComponent,
    AuditTransactionFormComponent,
    AlertDialogComponent,
    HoulyReportComponent,
    ProductionReportComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    HttpClientModule,
    MaterialModule,
    BootstrapModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    DateRangePickerModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [AlertDialogComponent],
})
export class AppModule {}
