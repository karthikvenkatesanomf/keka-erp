import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table';

describe('TableComponent', () => {
  let component: TableComponent<{ [key: string]: unknown }>;
  let fixture: ComponentFixture<TableComponent<{ [key: string]: unknown }>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
