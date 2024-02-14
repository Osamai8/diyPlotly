import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilereaderComponent } from './filereader.component';

describe('FilereaderComponent', () => {
  let component: FilereaderComponent;
  let fixture: ComponentFixture<FilereaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilereaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilereaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
