import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTransactionFormComponent } from './audit-transaction-form.component';

describe('AuditTransactionFormComponent', () => {
  let component: AuditTransactionFormComponent;
  let fixture: ComponentFixture<AuditTransactionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTransactionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
