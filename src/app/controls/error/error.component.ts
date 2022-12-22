import { Component, Input } from '@angular/core';
import { faWarning } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  @Input() error: null | string = null;

  faWarning = faWarning;
}
