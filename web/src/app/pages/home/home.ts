import { NgOptimizedImage } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { HugeiconsIconComponent } from '@hugeicons/angular'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'

@Component({
	selector: 'app-home',
	imports: [NgOptimizedImage, RouterLink, HugeiconsIconComponent],
	templateUrl: './home.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block' },
})
export class Home {
	readonly arrowRightIcon = ArrowRight02Icon
}
