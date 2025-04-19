import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'combineBrokenWords'
})
export class CombineBrokenWordsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    // Regular expression to find patterns like:
    // "text - text", "text- text", "text -text"
    // but NOT matching patterns that look like year ranges (four digits - four digits)
    const combined = value.replace(/(\w+)\s*-\s*(\w+)/g, '$1$2');

    return combined;
  }
}