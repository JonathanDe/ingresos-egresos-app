import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  profilename: string;
  subscription: Subscription = new Subscription();

  constructor(private store:Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('auth').pipe(
      filter(data => data.user != null )
    ).subscribe(data => {
      this.profilename = data && data.user.nombre;
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
