import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientFooterComponent } from '../shared/components/client-footer/client-footer.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterModule, ClientFooterComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

}
