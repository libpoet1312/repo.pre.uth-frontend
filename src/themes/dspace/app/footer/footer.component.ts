import { Component } from '@angular/core';
import { FooterComponent as BaseComponent } from '../../../../app/footer/footer.component';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html',
})
export class FooterComponent extends BaseComponent {
}
