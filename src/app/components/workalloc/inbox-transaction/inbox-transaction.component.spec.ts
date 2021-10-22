import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxTransactionComponent } from './inbox-transaction.component';

describe('InboxTransactionComponent', () => {
  let component: InboxTransactionComponent;
  let fixture: ComponentFixture<InboxTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboxTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
