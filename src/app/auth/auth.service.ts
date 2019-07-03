import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
  ) {}

  crearUsuario(nombre, email, password) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((resp) => {
        const { email, uid } = resp.user;
        const user: User = {
          nombre,
          email,
          uid
        };

        this.afDB.doc(`${user.uid}/usuario`)
          .set(user)
          .then(()=>{
            this.router.navigate(['/']);
          })

      })
      .catch((error) => {
        Swal.fire('Error en el registro', error.message, 'error');
      });
  }

  login(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then((resp) => {
        this.router.navigate(['/']);
      })
      .catch((error) => {
        Swal.fire('Error en el login', error.message, 'error');
      });
  }

  logout() {
    this.router.navigate(['login']);
    this.afAuth.auth.signOut();
  }

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {});
  }

  isAuth() {
    return this.afAuth.authState.pipe(
      map((fbUser) => {
        if (fbUser === null) {
          this.router.navigate(['/login']);
        }
        return fbUser != null;
      }),
    );
  }
}
