import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketEventComponent } from './ticket-event.component';

describe('TicketEventComponent', () => {
  let component: TicketEventComponent;
  let fixture: ComponentFixture<TicketEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
