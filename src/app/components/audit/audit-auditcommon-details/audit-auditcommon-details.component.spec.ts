import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditAuditcommonDetailsComponent } from './audit-auditcommon-details.component';

describe('AuditAuditcommonDetailsComponent', () => {
  let component: AuditAuditcommonDetailsComponent;
  let fixture: ComponentFixture<AuditAuditcommonDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditAuditcommonDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditAuditcommonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
