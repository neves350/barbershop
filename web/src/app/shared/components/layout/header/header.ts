import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { HugeiconsIconComponent } from '@hugeicons/angular'
import { Cancel01Icon, Menu01Icon } from '@hugeicons/core-free-icons'
import { NavMenu } from '../nav-menu/nav-menu'

@Component({
	selector: 'app-header',
	imports: [HugeiconsIconComponent, NavMenu, RouterLinkActive, RouterLink],
	templateUrl: './header.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
	readonly cancelIcon = Cancel01Icon
	readonly menuIcon = Menu01Icon

	readonly isMenuOpen = signal(false)

	toggleMenu(): void {
		this.isMenuOpen.update((open) => !open)
	}
}
