import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Partner } from './partner/partner'
import { Content } from './content/content'

@Component({
  selector: 'app-about',
  imports: [Content, Partner],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class About {

}
