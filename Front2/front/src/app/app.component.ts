import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GestorComponent } from './components/gestor/gestor.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,GestorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone:true,
})
export class AppComponent {
  title = 'front';
}
