import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [RouterModule],
  template: '<router-outlet></router-outlet>',
})
export class UserDataComponent {

}
