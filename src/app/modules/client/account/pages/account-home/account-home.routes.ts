import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { LocationDetailsComponent } from './list/location-details/location-details.component';
import { EventDetailsComponent } from './list/location-details/event-details/event-details.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './shopping-cart/checkout/checkout.component';



export const routes: Routes = [
  {
    path: '',
    component: MapComponent,
  },
  {
    path: 'location/:id',
    component: LocationDetailsComponent
  },
  {
    path: 'location/:id/event/:eventId',
    component: EventDetailsComponent
  },
  {
    path: 'cart',
    component: ShoppingCartComponent
  },
  {
    path: 'cart/checkout',
    component: CheckoutComponent
  }
];
