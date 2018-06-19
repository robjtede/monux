import { Injectable } from '@angular/core'
import { Router, CanActivate, CanActivateChild } from '@angular/router'

@Injectable()
export class ApiAccessGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate() {
    // this.router.navigate(['login']);
    console.log('CanActivate')
    return true
  }
}
