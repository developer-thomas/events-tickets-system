import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodesViewComponent } from './qr-codes-view.component';

describe('QrCodesViewComponent', () => {
  let component: QrCodesViewComponent;
  let fixture: ComponentFixture<QrCodesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrCodesViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QrCodesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
