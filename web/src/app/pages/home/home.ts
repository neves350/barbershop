import { ChangeDetectionStrategy, Component } from '@angular/core'
import { About } from '@shared/components/home/about/about'
import { Hero } from '@shared/components/home/hero/hero'
import { Services } from '@shared/components/home/services/services'

@Component({
	selector: 'app-home',
	imports: [Hero, Services, About],
	templateUrl: './home.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
