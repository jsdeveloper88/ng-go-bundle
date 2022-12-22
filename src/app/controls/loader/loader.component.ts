import { Component, Input } from '@angular/core';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  faSpinner = faSpinner;
  @Input() size: string = "1rem";
}
