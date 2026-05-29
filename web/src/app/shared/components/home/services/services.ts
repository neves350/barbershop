import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HugeiconsIconComponent } from '@hugeicons/angular'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { ServicesService } from '@shared/services/services.service'

@Component({
	selector: 'app-services',
	imports: [HugeiconsIconComponent],
	templateUrl: './services.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block' },
})
export class Services {
	readonly arrowRightIcon = ArrowRight02Icon

	private readonly servicesService = inject(ServicesService)

	readonly services = this.servicesService.services
	readonly loading = this.servicesService.loading
	readonly categoryLabel: Record<string, string> = {
		HAIR: 'CABELO',
		COLORING: 'COR',
		TREATMENTS: 'TRATAMENTOS',
		AESTHETICS: 'ESTÉTICA',
	}
	readonly skeletons = Array(4)

	constructor() {
		this.servicesService.loadFeatured().pipe(takeUntilDestroyed()).subscribe()
	}
}
