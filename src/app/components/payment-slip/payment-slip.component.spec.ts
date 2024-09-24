import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSlipComponent } from './payment-slip.component';

describe('PaymentSlipComponent', () => {
  let component: PaymentSlipComponent;
  let fixture: ComponentFixture<PaymentSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentSlipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
