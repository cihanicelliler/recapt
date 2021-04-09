import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoginGuard implements CanActivate {
  constructor(private authService:AuthService,private toastrService:ToastrService,private router:Router) {
    
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authService.isAuthenticated()) {
        this.router.navigate([""])
        this.toastrService.warning("Sisteme zaten giriş yapmışsınız")
        return false;
      } else {
        return true;
      }
  }
  
}
