import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { potsRequest, MonzoPotsResponse, MonzoPotResponse } from 'monzolib'

import { MonzoService } from '../services/monzo.service'

@Component({
  selector: 'm-pots-pane',
  templateUrl: 'pots-pane.component.html',
  styleUrls: ['pots-pane.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PotsPaneComponent implements OnInit {
  pots!: Observable<MonzoPotResponse[]>

  constructor(private monzo: MonzoService) {}

  ngOnInit(): void {
    this.pots = this.monzo
      .request<MonzoPotsResponse>(potsRequest())
      .pipe(map(({ pots }) => pots))
  }
}
