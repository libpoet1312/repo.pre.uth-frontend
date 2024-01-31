import { Component } from '@angular/core';
import { AboutContentComponent as BaseComponent } from '../../../../../../app/info/about/about-content/about-content.component';

@Component({
  selector: 'ds-about-content',
  templateUrl: './about-content.component.html',
  styleUrls: ['./about-content.component.scss']
})
/**
 * Component displaying the contents of the Privacy Statement
 */
export class AboutContentComponent extends BaseComponent{
}
