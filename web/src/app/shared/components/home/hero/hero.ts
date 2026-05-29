import { NgOptimizedImage } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { HugeiconsIconComponent } from '@hugeicons/angular'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'

@Component({
	selector: 'app-hero',
	imports: [NgOptimizedImage, RouterLink, HugeiconsIconComponent],
	templateUrl: './hero.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block' },
})
export class Hero {
	readonly arrowRightIcon = ArrowRight02Icon
}
