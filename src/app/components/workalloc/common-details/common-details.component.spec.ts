import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDetailsComponent } from './common-details.component';

describe('CommonDetailsComponent', () => {
  let component: CommonDetailsComponent;
  let fixture: ComponentFixture<CommonDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
