import { Pipe, PipeTransform } from '@angular/core'
import { TitleCasePipe } from '@angular/common'

@Pipe({ name: 'category' })
export class CategoryPipe implements PipeTransform {
  constructor(private titleCasePipe: TitleCasePipe) {}

  transform(category: string): string {
    const stripped = category.replace('_', ' ')
    return this.titleCasePipe.transform(stripped)
  }
}
