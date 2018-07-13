import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import { DomService, ChildConfig } from './dom.service'
import { AppState } from '../store'
import {
  OpenModalAction,
  CloseModalAction
} from '../store/actions/modal.actions'

@Injectable()
export class ModalService {
  constructor(private store$: Store<AppState>, private dom: DomService) {}

  private modalSelector = '.modal'

  open(
    component: any,
    inputs: ChildConfig['inputs'] = {},
    outputs: ChildConfig['outputs'] = {}
  ) {
    let componentConfig: ChildConfig = {
      inputs,
      outputs
    }

    this.dom.appendComponentTo(this.modalSelector, component, componentConfig)

    this.store$.dispatch(new OpenModalAction())
  }

  close() {
    this.dom.removeComponent()

    this.store$.dispatch(new CloseModalAction())
  }
}
