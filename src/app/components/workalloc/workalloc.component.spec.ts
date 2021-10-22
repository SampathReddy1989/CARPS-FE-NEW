import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkallocComponent } from './workalloc.component';

describe('WorkallocComponent', () => {
  let component: WorkallocComponent;
  let fixture: ComponentFixture<WorkallocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkallocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkallocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
