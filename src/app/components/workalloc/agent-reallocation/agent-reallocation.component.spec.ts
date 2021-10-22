import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentReallocationComponent } from './agent-reallocation.component';

describe('AgentReallocationComponent', () => {
  let component: AgentReallocationComponent;
  let fixture: ComponentFixture<AgentReallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentReallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentReallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
