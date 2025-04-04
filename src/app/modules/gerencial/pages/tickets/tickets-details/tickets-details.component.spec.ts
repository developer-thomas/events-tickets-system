import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsDetailsComponent } from './tickets-details.component';

describe('TicketsDetailsComponent', () => {
  let component: TicketsDetailsComponent;
  let fixture: ComponentFixture<TicketsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
