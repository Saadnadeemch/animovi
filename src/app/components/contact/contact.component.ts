import { Component } from '@angular/core';
import { EmailService } from '../../service/email.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  name: string = '';
  email: string = '';
  message: string = '';
  showSuccessMessage = false;
  showFailureMessage = false;

  constructor(private emailService: EmailService) {}

  onSubmit() {
    if (this.name && this.email && this.message) {
      this.emailService.sendEmail(this.name, this.email, this.message).then(
        () => {
          this.showSuccessMessage = true;
          this.showFailureMessage = false;
          // Hide success message after 5 seconds
          setTimeout(() => this.showSuccessMessage = false, 5000);
          this.name = '';
          this.email = '';
          this.message = '';
        },
        () => {
          this.showFailureMessage = true;
          this.showSuccessMessage = false;
          // Hide failure message after 5 seconds
          setTimeout(() => this.showFailureMessage = false, 5000);
        }
      );
    } else {
      alert('Please fill in all fields.');
    }
  }
}
