import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AppComponent } from 'src/app/app.component';
import { AccessMasterOperations } from 'src/app/models/access-master-operations';
import { ClientDetail } from 'src/app/models/client-detail';
import { ToastService } from 'src/app/ui-support/alerts/toast.service';
import { UiCacheStore } from 'src/app/models/ui-cache-store';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('clientDialog', null) clientDialog: TemplateRef<any>;

  formGroup: FormGroup;
  aNameControl: FormControl = new FormControl();
  clients: ClientDetail[];
  currClient: ClientDetail;

  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private toast: ToastService) {
    this.formGroup = this.formBuilder.group({
      aName: this.aNameControl
    });
  }

  ngOnInit() {
    this.loadClientDialog();
  }

  onGoClient(event) {
    if (this.formGroup.invalid) {
      return;
    }
    if (this.currClient) {
      UiCacheStore.toCache('CurrentClient', this.currClient);
      this.dialog.closeAll();
      window.location.reload();
    }
  }

  onClientChange(event) {
    let client: ClientDetail = {
      clientId: event.value,
      clientName: this.clients.find(x => x.clientId === event.value).clientName
    };
    this.currClient = client;    
  }

  private loadClientDialog() {
    let clientData: ClientDetail = AppComponent.getCurrentClient();
    if (clientData && clientData.clientId) {
      //
    } else {
      this.clients = AppComponent.getClientsMapped();      
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      this.dialog.closeAll();
      this.dialog.open(this.clientDialog, dialogConfig);
    }
  }

}
