import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { AuthGuard } from "./services/auth/authguard";
import { HomeComponent } from "./components/home/home.component";
import { ImportsComponent } from "./components/inventory/imports/imports.component";
import { ScenarioComponent } from "./components/masters/scenario/scenario.component";
import { StatusCodesComponent } from "./components/masters/status-codes/status-codes.component";
import { ActionCodesComponent } from "./components/masters/action-codes/action-codes.component";
import { ClientComponent } from "./components/masters/client/client.component";
import { ClientMappingComponent } from "./components/masters/client-mapping/client-mapping.component";
import { UsersComponent } from "./components/masters/users/users.component";
import { WorkallocComponent } from "./components/workalloc/workalloc.component";
import { AuditallocationComponent } from "./components/audit/audit-allocation/auditallocation.component";
import { ProductionReportComponent } from "./components/reports/production-report/production-report.component";
import { HoulyReportComponent } from "./components/reports/houly-report/houly-report.component";

const routes: Routes = [
  { path: "", component: AppComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },

  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "import",
        component: ImportsComponent,
      },
      {
        path: "work-allocation",
        component: WorkallocComponent,
      },
      {
        path: "audit-allocation",
        component: AuditallocationComponent,
      },
      {
        path: "scenario",
        component: ScenarioComponent,
      },
      {
        path: "status-codes",
        component: StatusCodesComponent,
      },
      {
        path: "action-codes",
        component: ActionCodesComponent,
      },
      {
        path: "client",
        component: ClientComponent,
      },
      {
        path: "client-mapping",
        component: ClientMappingComponent,
      },
      {
        path: "users",
        component: UsersComponent,
      },
      {
        path: "hourly-report",
        component: HoulyReportComponent,
      },
      {
        path: "production-report",
        component: ProductionReportComponent,
      },
    ],
  },

  // otherwise redirect to home
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
