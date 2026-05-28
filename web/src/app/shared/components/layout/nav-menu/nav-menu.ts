import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { HugeiconsIconComponent } from '@hugeicons/angular'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'

interface NavItem {
	number: string
	label: string
	url: string
}

@Component({
	selector: 'app-nav-menu',
	imports: [HugeiconsIconComponent, RouterLink, RouterLinkActive],
	templateUrl: './nav-menu.html',
	styleUrl: './nav-menu.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenu {
	readonly isOpen = input.required<boolean>()

	readonly arrowIcon = ArrowRight01Icon

	readonly navItems: NavItem[] = [
		{ number: '01', label: 'Início', url: '/' },
		{ number: '02', label: 'Serviços', url: '/services' },
		{ number: '03', label: 'Sobre', url: '/about-us' },
	]
}
