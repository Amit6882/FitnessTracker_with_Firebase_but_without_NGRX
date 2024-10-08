import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable()

export class AuthService {

    constructor(
        private router: Router, 
        private afAuth: AngularFireAuth, 
        private trainingService: TrainingService, 
        private uiService: UIService
    ){}
    
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    initAuthListner(){
        this.afAuth.authState.subscribe(user => {
            if(user){
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            }else{
                this.trainingService.cancelSubscription();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;
            }
        })
    }

    registerUser(authData: AuthData){
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.auth.createUserWithEmailAndPassword(
            authData.email,
            authData.password
        )
        .then(result =>{
            console.log(result);
            this.uiService.loadingStateChanged.next(false);
        })
        .catch(error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackBar(error.message, null, 3000);
        });
        
    }

    login(authData: AuthData){
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.auth
        .signInWithEmailAndPassword(
            authData.email,
            authData.password
        )
        .then(result => {
            this.uiService.loadingStateChanged.next(false);
            console.log(result);
        })
        .catch(error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackBar(error.message, null, 3000);
        });
    }

    logout(){
        this.afAuth.auth.signOut();
    }

    isAuth(){
        return this.isAuthenticated;
    }
}