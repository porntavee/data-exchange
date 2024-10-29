import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ThroughputreportComponent } from "@app/pages/throughputreport/throughputreport.component";

describe("ThroughputreportComponent", () => {
  let component: ThroughputreportComponent;
  let fixture: ComponentFixture<ThroughputreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThroughputreportComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThroughputreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
