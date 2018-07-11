import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef
} from '@angular/core'

@Injectable()
export class DomService {
  private childComponentRef: any

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  public appendComponentTo(
    parentSelector: string,
    child: any,
    childConfig: ChildConfig = { inputs: {}, outputs: {} }
  ) {
    // Create a component reference from the component
    const childComponentRef = this.componentFactoryResolver
      .resolveComponentFactory(child)
      .create(this.injector)

    // Attach the config to the child (inputs and outputs)
    this.attachConfig(childComponentRef, childConfig)

    this.childComponentRef = childComponentRef
    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(childComponentRef.hostView)

    // Get DOM element from component
    const childDomElem = (childComponentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement

    // Append DOM element to the body
    const parentEl = document.querySelector(parentSelector)
    if (parentEl) parentEl.appendChild(childDomElem)
  }

  public removeComponent() {
    this.appRef.detachView(this.childComponentRef.hostView)
    this.childComponentRef.destroy()
  }

  private attachConfig(componentRef: any, { inputs, outputs }: ChildConfig) {
    const props = [...Object.entries(outputs), ...Object.entries(inputs)]

    props.forEach(([key, val]) => {
      componentRef.instance[key] = val
    })
  }
}

export interface ChildConfig {
  inputs: { [input: string]: any }
  outputs: { [output: string]: any }
}
