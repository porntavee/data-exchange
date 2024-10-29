import { TestBed } from "@angular/core/testing";

import { ScriptTemplateService } from "@app/pages/script-template/script-template.service";

describe("ScriptTemplateService", () => {
  let service: ScriptTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptTemplateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
