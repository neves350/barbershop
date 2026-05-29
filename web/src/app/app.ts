import { Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Footer } from '@shared/components/layout/footer/footer'
import { Header } from '@shared/components/layout/header/header'

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Header, Footer],
	templateUrl: './app.html',
	styleUrl: './app.css',
	host: { class: 'flex flex-col min-h-screen' },
})
export class App {
	protected readonly title = signal('web')
}
