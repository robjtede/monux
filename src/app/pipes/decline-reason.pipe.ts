import { Pipe, PipeTransform } from '@angular/core'
import { TitleCasePipe } from '@angular/common'

@Pipe({ name: 'declineReason' })
export class DeclineReasonPipe implements PipeTransform {
  constructor(private titleCasePipe: TitleCasePipe) {}

  transform(string: string): string {
    const stripped = string.replace(/_/g, ' ')
    const titlecase = this.titleCasePipe.transform(stripped)
    const specialCases = titlecase.replace('Cvc', 'CVC')
    return specialCases
  }
}
