import { Injectable } from '@angular/core'

import { DomService, ChildConfig } from './dom.service'

@Injectable()
export class ModalService {
  constructor(private domService: DomService) {}

  private modalSelector = '.modal'
  private overlaySelector = '.modal-wrapper'

  init(
    component: any,
    inputs: ChildConfig['inputs'] = {},
    outputs: ChildConfig['outputs'] = {}
  ) {
    let componentConfig: ChildConfig = {
      inputs,
      outputs
    }

    this.domService.appendComponentTo(
      this.modalSelector,
      component,
      componentConfig
    )

    const modalElement = document.querySelector(this.modalSelector)
    if (modalElement) modalElement.classList.add('show')

    const overlayElement = document.querySelector(this.overlaySelector)
    if (overlayElement) {
      overlayElement.setAttribute('open', '')
      overlayElement.classList.add('show')
    }
  }

  destroy() {
    this.domService.removeComponent()

    const modalElement = document.querySelector(this.modalSelector)
    if (modalElement) modalElement.classList.remove('show')

    const overlayElement = document.querySelector(this.overlaySelector)
    if (overlayElement) {
      overlayElement.removeAttribute('open')
      overlayElement.classList.remove('show')
    }
  }
}
