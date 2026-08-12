import { DestaqueLidoDirective } from './destaque-lido.directive';
import { ElementRef } from '@angular/core';

describe('DestaqueLidoDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = new ElementRef(document.createElement('div'));
    const directive = new DestaqueLidoDirective(mockElementRef, {} as any);
    expect(directive).toBeTruthy();
  });
});