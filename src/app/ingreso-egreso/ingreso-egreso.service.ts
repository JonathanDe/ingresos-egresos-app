import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso-actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  ingresoEgresoListenerSubscription: Subscription = new Subscription();
  ingresoEgresoItemSubscription: Subscription = new Subscription();

  constructor(
    private afDB: AngularFirestore,
    public authService: AuthService,
    private store: Store<AppState>,
  ) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const user = this.authService.getUsuario();

    return this.afDB.doc(`${ user.uid }/ingresos-egresos`)
            .collection('items').add({...ingresoEgreso});
  }

  private ingresoEgresoItems(uid: string) {
    this.ingresoEgresoItemSubscription = this.afDB
      .collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map((docData) => {
          return docData.map((doc) => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data(),
            };
          });
        }),
      )
      .subscribe((coleccion: any[]) => {
        this.store.dispatch(new SetItemsAction(coleccion));
      });
  }

  initIngresoEgresoListener() {
    this.ingresoEgresoListenerSubscription = this.store
      .select('auth')
      .pipe(filter((auth) => auth.user != null))
      .subscribe((data) => {
        this.ingresoEgresoItems(data.user.uid);
      });
  }

  cancelarSubscription() {
    this.ingresoEgresoItemSubscription.unsubscribe();
    this.ingresoEgresoListenerSubscription.unsubscribe();
    this.store.dispatch(new UnsetItemsAction());
  }

  borrarIngresoEgreso(item: IngresoEgreso) {
    const user = this.authService.getUsuario();
    return this.afDB.doc(`${user.uid}/ingresos-egresos/items/${item.uid}`).delete();
  }
}
