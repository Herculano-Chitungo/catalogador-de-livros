import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDestaqueLido]',
  standalone: true
})
export class DestaqueLidoDirective implements OnInit {
  @Input() appDestaqueLido: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.appDestaqueLido) {
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '5px solid #4caf50');
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#f1f8e9');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '5px solid #ff9800');
    }
  }
}