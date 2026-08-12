import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resumoTitulo',
  standalone: true
})
export class ResumoTituloPipe implements PipeTransform {
  transform(value: string, limite: number = 20, maiusculo: boolean = false): string {
    if (!value) return '';
    let resultado = value.length > limite ? value.substring(0, limite) + '...' : value;
    return maiusculo ? resultado.toUpperCase() : resultado;
  }
}