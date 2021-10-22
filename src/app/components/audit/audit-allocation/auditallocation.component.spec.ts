import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditallocationComponent } from './auditallocation.component';

describe('AuditallocationComponent', () => {
  let component: AuditallocationComponent;
  let fixture: ComponentFixture<AuditallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
