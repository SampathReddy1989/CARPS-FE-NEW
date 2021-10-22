import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditInboxComponent } from './audit-inbox.component';

describe('AuditInboxComponent', () => {
  let component: AuditInboxComponent;
  let fixture: ComponentFixture<AuditInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
