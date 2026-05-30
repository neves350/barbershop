import { ChangeDetectionStrategy, Component } from '@angular/core';

interface PartnerInterface {
  slug: string
  name: string
  role: string
  years: number
  image: string
}

@Component({
  selector: 'app-partner',
  imports: [],
  templateUrl: './partner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Partner {
  readonly partners: PartnerInterface[] = [
    {
      slug: 'rute-santos',
      name: 'Rute Santos',
      role: 'CO-FUNDADORA & COLOR DIRECTOR',
      years: 15,
      image: '/w1.svg',
    },
    {
      slug: 'sandra-botelho',
      name: 'Sandra Botelho',
      role: 'CO-FUNDADORA & MASTER STYLIST',
      years: 12,
      image: '/w2.svg',
    },
  ]
}
