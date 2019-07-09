import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import * as fromIngresoEgreso from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit, OnDestroy {
  items: IngresoEgreso[];
  subscription: Subscription = new Subscription();

  constructor(private store:Store<fromIngresoEgreso.AppState>, public ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso').subscribe((ingresoEgreso)=>{
      this.items = ingresoEgreso.items;
    });
  }

  borrarItem(e: IngresoEgreso){
    this.ingresoEgresoService.borrarIngresoEgreso(e).then(()=>{
      Swal.fire('Item Eliminado', e.description, 'success');
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
