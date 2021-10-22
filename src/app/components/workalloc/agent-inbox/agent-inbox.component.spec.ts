import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentInboxComponent } from './agent-inbox.component';

describe('AgentInboxComponent', () => {
  let component: AgentInboxComponent;
  let fixture: ComponentFixture<AgentInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
