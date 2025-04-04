import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketQrCodesComponent } from './ticket-qr-codes.component';

describe('TicketQrCodesComponent', () => {
  let component: TicketQrCodesComponent;
  let fixture: ComponentFixture<TicketQrCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketQrCodesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketQrCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
