import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReallocationComponent } from './audit-reallocation.component';

describe('AuditReallocationComponent', () => {
  let component: AuditReallocationComponent;
  let fixture: ComponentFixture<AuditReallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditReallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditReallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
