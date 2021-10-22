import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCodesComponent } from './action-codes.component';

describe('ActionCodesComponent', () => {
  let component: ActionCodesComponent;
  let fixture: ComponentFixture<ActionCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
