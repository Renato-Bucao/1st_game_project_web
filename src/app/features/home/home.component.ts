import { Component } from '@angular/core'; // Import decorator gikan sa Angular core library

@Component({                                // Decorator nga nag‑define sa metadata sa component
  selector: 'app-home',                     // HTML tag nga gamiton para i‑render ang component
  templateUrl: './home.component.html',     // Path sa HTML template file
  styleUrls: ['./home.component.css']       // Path sa CSS styles specific sa component
})
export class HomeComponent {}               // Class definition sa HomeComponent, mao ni ang logic container
