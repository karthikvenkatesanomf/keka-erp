import { EnvironmentProviders } from '@angular/core';
import { GlobalConfig, provideToastr } from 'ngx-toastr';

export type ToasterConfig = Partial<GlobalConfig>;

export const DEFAULT_TOASTER_CONFIG: ToasterConfig = {
  positionClass: 'toast-top-right',
  timeOut: 4000,
  extendedTimeOut: 1000,
  closeButton: true,
  progressBar: true,
  newestOnTop: true,
  preventDuplicates: true,
  maxOpened: 5,
  autoDismiss: true,
};

export function provideToaster(config: ToasterConfig = {}): EnvironmentProviders {
  return provideToastr({ ...DEFAULT_TOASTER_CONFIG, ...config });
}
