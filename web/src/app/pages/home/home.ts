import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Hero } from '@shared/components/home/hero/hero'

@Component({
	selector: 'app-home',
	imports: [Hero],
	templateUrl: './home.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
