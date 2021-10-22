import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTransactionComponent } from './audit-transaction.component';

describe('AuditTransactionComponent', () => {
  let component: AuditTransactionComponent;
  let fixture: ComponentFixture<AuditTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
