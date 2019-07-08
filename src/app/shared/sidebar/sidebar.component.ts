import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IngresoEgresoService } from 'src/app/ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  profilename: string;
  subscription: Subscription = new Subscription();

  constructor( private authService: AuthService, private store:Store<AppState>, public ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('auth').pipe(
      filter(data => data.user != null )
    ).subscribe(data => {
      this.profilename = data && data.user.nombre;
    })
  }

  logout() {
    this.authService.logout();
    this.ingresoEgresoService.cancelarSubscription();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
