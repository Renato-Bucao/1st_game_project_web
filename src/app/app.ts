import { Component } from '@angular/core';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent] // ✅ declare imports
})
export class AppComponent {}
