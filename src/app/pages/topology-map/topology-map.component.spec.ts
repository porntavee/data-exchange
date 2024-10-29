import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopologyMapComponent } from './topology-map.component';

describe('TopologyMapComponent', () => {
  let component: TopologyMapComponent;
  let fixture: ComponentFixture<TopologyMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopologyMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopologyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
