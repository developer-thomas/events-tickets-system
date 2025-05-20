import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { GetAllLocations } from '../location/models/GetAllLocations.interface';

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [RouterModule],
  template: '<router-outlet></router-outlet>',
})
export class BannersComponent {
  
}
