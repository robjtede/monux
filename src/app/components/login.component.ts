import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'monux-login',
  template: `
    <h1>Login</h1>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {
    console.log('login started')
  }
}
