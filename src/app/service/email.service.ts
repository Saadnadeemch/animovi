import { Injectable } from '@angular/core';

import emailjs from 'emailjs-com';
@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() {}

  sendEmail(name: string, email: string, message: string): Promise<void> {
    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    return emailjs.send('service_1ielf55', 'template_orvy53m', templateParams, 'egdrkjAXtGDelevdy')
      .then(response => {
        console.log('Email sent successfully', response);
      })
      .catch(error => {
        console.error('Error sending email', error);
        throw error; // Re-throw the error to handle it in the component
      });
  }
}
