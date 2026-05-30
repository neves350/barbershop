import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router'
import { HugeiconsIconComponent } from '@hugeicons/angular'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'

interface Stat {
  label: string
  value: string
  prefix?: string
  suffix?: string
}


@Component({
  selector: 'app-content',
  imports: [RouterLink, HugeiconsIconComponent],
  templateUrl: './content.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Content {
  readonly arrowRightIcon = ArrowRight02Icon

  readonly stats: Stat[] = [
    { label: 'DESDE', value: '2024' },
    { label: 'CLIENTES', prefix: '+', value: '950' },
    { label: 'AVALIAÇÃO', value: '4.5', suffix: '/ 5' },
  ]
}
