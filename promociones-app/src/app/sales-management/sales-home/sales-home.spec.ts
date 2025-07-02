import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHome } from './sales-home';

describe('SalesHome', () => {
  let component: SalesHome;
  let fixture: ComponentFixture<SalesHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
