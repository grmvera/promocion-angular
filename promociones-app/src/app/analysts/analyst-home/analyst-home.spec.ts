import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystHome } from './analyst-home';

describe('AnalystHome', () => {
  let component: AnalystHome;
  let fixture: ComponentFixture<AnalystHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalystHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalystHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
