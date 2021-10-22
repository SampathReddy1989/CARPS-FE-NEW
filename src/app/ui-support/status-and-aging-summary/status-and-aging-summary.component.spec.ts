import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusAndAgingSummaryComponent } from './status-and-aging-summary.component';

describe('StatusAndAgingSummaryComponent', () => {
  let component: StatusAndAgingSummaryComponent;
  let fixture: ComponentFixture<StatusAndAgingSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusAndAgingSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusAndAgingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
