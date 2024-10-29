import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptTemplateComponent } from '@app/pages/script-template/script-template.component';

describe('ScriptTemplateComponent', () => {
  let component: ScriptTemplateComponent;
  let fixture: ComponentFixture<ScriptTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
