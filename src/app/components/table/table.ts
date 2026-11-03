import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { TextFieldComponent } from '../text-field/text-field';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  template?: (value: unknown) => string;
}

export interface TableFilter {
  [key: string]: string;
}

@Component({
  selector: 'app-table',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TextFieldComponent],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TableComponent<T extends Record<string, unknown>> implements OnInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() rowHeight = '48px';
  @Input() striped = true;
  @Input() hoverable = true;
  @Input() bordered = true;

  @Output() rowClick = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();
  @Output() filterChange = new EventEmitter<TableFilter>();

  protected filters = signal<TableFilter>({});
  protected filterControls = signal<{ [key: string]: FormControl<string> }>({});
  protected sortColumn = signal<string | null>(null);
  protected sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.initializeFilters();
  }

  protected getFilterableColumns(): TableColumn[] {
    return this.columns.filter((col) => col.filterable !== false);
  }

  protected getSortableColumns(): TableColumn[] {
    return this.columns.filter((col) => col.sortable !== false);
  }

  protected getFilteredAndSortedData(): T[] {
    let result = [...this.data];
    const currentFilters = this.filters();
    if (Object.keys(currentFilters).length > 0) {
      result = result.filter((row) =>
        Object.entries(currentFilters).every(([key, value]) => {
          if (!value) return true;
          const rowValue = String(row[key] || '').toLowerCase();
          return rowValue.includes(value.toLowerCase());
        })
      );
    }

    const column = this.sortColumn();
    if (column) {
      result.sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return this.sortDirection() === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        const comparison = aStr.localeCompare(bStr);
        return this.sortDirection() === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }

  protected initializeFilters(): void {
    const initialFilters: TableFilter = {};
    const controls: { [key: string]: FormControl<string> } = {};
    
    this.getFilterableColumns().forEach((col) => {
      initialFilters[col.key] = '';
      controls[col.key] = new FormControl('', { nonNullable: true });
    });
    
    this.filters.set(initialFilters);
    this.filterControls.set(controls);
  }

  protected onFilterChange(key: string, value: string): void {
    const currentFilters = this.filters();
    this.filters.set({
      ...currentFilters,
      [key]: value,
    });
    this.filterChange.emit(this.filters());
  }

  protected onSort(columnKey: string): void {
    if (!this.isSortable(columnKey)) return;

    if (this.sortColumn() === columnKey) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(columnKey);
      this.sortDirection.set('asc');
    }

    this.sortChange.emit({
      column: this.sortColumn()!,
      direction: this.sortDirection(),
    });
  }

  protected isSortable(columnKey: string): boolean {
    return this.getSortableColumns().some((col) => col.key === columnKey);
  }

  protected getColumnWidth(column: TableColumn): string {
    return column.width || 'auto';
  }

  protected getCellValue(row: T, column: TableColumn): string {
    const value = row[column.key];
    if (column.template) {
      return column.template(value);
    }
    return value == null ? '' : String(value);
  }

  protected getSortIcon(columnKey: string): string {
    if (this.sortColumn() !== columnKey) return '⇅';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  getFilterControl(columnKey: string): FormControl<string> {
    return this.filterControls()[columnKey] || new FormControl('', { nonNullable: true });
  }

  protected onRowClick(row: T): void {
    this.rowClick.emit(row);
  }
}

