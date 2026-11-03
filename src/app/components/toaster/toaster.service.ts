import { Injectable, inject } from '@angular/core';
import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';

export type ToastOptions = Partial<IndividualConfig>;

/**
 * App-level facade over ngx-toastr. Inject this class instead of `ToastrService`
 * so the underlying library can be swapped without touching consumers.
 *
 * @example
 * private readonly toaster = inject(ToasterService);
 * this.toaster.success('Saved successfully', 'Done');
 */
@Injectable({ providedIn: 'root' })
export class ToasterService {
  private readonly toastr = inject(ToastrService);

  success(message: string, title?: string, options?: ToastOptions): ActiveToast<unknown> {
    return this.toastr.success(message, title, options);
  }

  error(message: string, title?: string, options?: ToastOptions): ActiveToast<unknown> {
    return this.toastr.error(message, title, options);
  }

  info(message: string, title?: string, options?: ToastOptions): ActiveToast<unknown> {
    return this.toastr.info(message, title, options);
  }

  warning(message: string, title?: string, options?: ToastOptions): ActiveToast<unknown> {
    return this.toastr.warning(message, title, options);
  }

  /** Clears a single toast by id, or all toasts when no id is given. */
  clear(toastId?: number): void {
    this.toastr.clear(toastId);
  }

  remove(toastId: number): boolean {
    return this.toastr.remove(toastId);
  }
}
