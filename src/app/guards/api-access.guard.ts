import { Injectable } from '@angular/core'
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router'

@Injectable()
export class ApiAccessGuard implements CanActivate, CanActivateChild {
  constructor(private readonly router: Router, private route: ActivatedRoute) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!!0) this.router.navigate(['login'])
    console.log('CanActivate')
    console.log(route, state, this.route)
    return true
  }

  canActivateChild() {
    console.log('CanActivateChild')
    return true
  }
}
