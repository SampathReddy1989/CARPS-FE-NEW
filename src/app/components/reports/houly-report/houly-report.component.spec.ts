import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoulyReportComponent } from './houly-report.component';

describe('HoulyReportComponent', () => {
  let component: HoulyReportComponent;
  let fixture: ComponentFixture<HoulyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoulyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoulyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
