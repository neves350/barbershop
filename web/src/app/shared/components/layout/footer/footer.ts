import { NgOptimizedImage } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { HugeiconsIconComponent, IconSvgObject } from '@hugeicons/angular'
import {
	Facebook01Icon,
	InstagramIcon,
	TiktokIcon,
} from '@hugeicons/core-free-icons'

interface FooterLink {
	label: string
	href: string
}
interface FooterSection {
	title: string
	links: FooterLink[]
}
interface SocialLink {
	label: string
	icon: IconSvgObject
	href: string
}

@Component({
	selector: 'app-footer',
	imports: [RouterLink, HugeiconsIconComponent, NgOptimizedImage],
	templateUrl: './footer.html',
})
export class Footer {
	readonly year = new Date().getFullYear()

	readonly socials: SocialLink[] = [
		{
			label: 'Instagram',
			icon: InstagramIcon,
			href: 'https://www.instagram.com/',
		},
		{
			label: 'TikTok',
			icon: TiktokIcon,
			href: 'https://www.tiktok.com/',
		},
		{
			label: 'Facebook',
			icon: Facebook01Icon,
			href: 'https://www.facebook.com/',
		},
	]

	readonly sections: FooterSection[] = [
		{
			title: 'Navegar',
			links: [
				{ label: 'Início', href: '/' },
				{ label: 'Serviços', href: '#' },
				{ label: 'Sobre', href: '#' },
			],
		},
		{
			title: 'Área de Cliente',
			links: [
				{ label: 'Avalia a tua visita', href: '#' },
				{ label: 'Livro de reclamações', href: '#' },
				{ label: 'Livro de elogios', href: '#' },
			],
		},
		{
			title: 'Informações Legais',
			links: [
				{ label: 'Política de privacidade', href: '#' },
				{ label: 'Política de cookies', href: '#' },
				{ label: 'Termos e condições', href: '#' },
				{ label: 'Declaração de acessibilidade', href: '#' },
				{ label: 'Aviso legal', href: '#' },
				{ label: 'Contactos', href: '#' },
			],
		},
	]
}
