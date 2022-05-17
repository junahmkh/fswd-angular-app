import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { visibility, flyInOut, expand } from '../animations/app.animation';

import { FeedbackService } from '../services/feedback.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      visibility(),
      flyInOut(),
      expand()
    ]
})
export class ContactComponent implements OnInit {
  
  feedbackForm!: FormGroup;
  feedback!: Feedback;
  contactType = ContactType;
  errMess!: string;
  showFeedbackForm = true;
  showSubmittedFeedback: boolean = false;
  showLoading!: boolean;
  feedbackcopy!:Feedback;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': '',
    'message':'',
  };


  validationMessages = {
    'firstName': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
    'message': {
      'required':      'Feedback message is required.',
    },
  };

  constructor(private feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL) {
    this.createForm();
  }

  feedbackIds!: string[];

  ngOnInit(): void {
    this.feedbackService.getFeedbackIds().subscribe(feedbackIds => this.feedbackIds = feedbackIds);
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0,[Validators.required, Validators.pattern]],
      email: ['',[Validators.required,Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ['',Validators.required]
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();  //(re)set form validators messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  feedbacknull(feedback:Feedback){
    feedback.id! = '';
    feedback.firstname! = '';
    feedback.lastname! = '';
    feedback.telnum!= null;
    feedback.email!= null;
    feedback.agree!=null;
    feedback.contacttype!=null;
    feedback.message!= null;
  };

  
 
  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackcopy = this.feedback;
    this.showLoading = true;
    this.showSubmittedFeedback = false;
    this.showFeedbackForm = false;
    this.feedbackService.postFeedback(this.feedback)
    .subscribe({ next: feedback=>{
      this.showLoading = false;
      this.showSubmittedFeedback = true
      this.feedbackcopy = feedback;
      setTimeout(()=>{
        this.showSubmittedFeedback = false;
        this.showFeedbackForm = true;
      }, 5000);
    },
    error: errmess => { this.errMess = <any>errmess; }}, 
    );
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

}
