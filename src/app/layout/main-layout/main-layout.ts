import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { KekaIconComponent } from '../../components/icons/keka-icon/keka-icon.component';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, KekaIconComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📈' },
    { label: 'Employee', path: '/employees', icon: '👥' },
    { label: 'Task', path: '/tasks', icon: '📝' },
  ];

  protected readonly userEmail = computed(() => this.auth.currentUser()?.email ?? '');

  protected async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/login');
  }
}
