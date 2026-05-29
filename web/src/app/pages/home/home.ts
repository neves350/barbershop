import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Hero } from '@shared/components/home/hero/hero'
import { Services } from '@shared/components/home/services/services'

@Component({
	selector: 'app-home',
	imports: [Hero, Services],
	templateUrl: './home.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
