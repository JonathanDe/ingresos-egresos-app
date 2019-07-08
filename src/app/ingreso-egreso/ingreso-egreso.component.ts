import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.scss']
})
export class IngresoEgresoComponent implements OnInit {
  ingresoForm: FormGroup;
  tipo = 'ingreso';

  constructor(private store: Store<AppState>, private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.ingresoForm = new FormGroup({
      'description': new FormControl('', Validators.required),
      'monto': new FormControl(0, Validators.min(0)),
    })
  }

  crearIngresoEgreso() {

    const ingresoEgreso = new IngresoEgreso({...this.ingresoForm.value, tipo: this.tipo});


    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
          .then( () => {

            Swal.fire('Creado', ingresoEgreso.description, 'success');
            this.ingresoForm.reset({ monto: 0 });

          });
  }
}
