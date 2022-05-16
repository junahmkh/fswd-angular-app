import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { MatSliderChange } from '@angular/material/slider';
import { visibility, flyInOut, expand } from '../animations/app.animation';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
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
export class DishdetailComponent implements OnInit {

  dishIds!: string[];
  errMess!: string;
  prev!: string;
  next!: string;

  commentForm!: FormGroup;
  comment!: Comment;
  dishcopy!: Dish;

  visibility = 'shown';

  @ViewChild('cform') commentFormDirective;

  formErrors = {
    'comment': '',
    'author': ''
  };


  validationMessages = {
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 2 characters long.',
      'maxlength':     'Comment cannot be more than 25 characters long.'
    },
    'author': {
      'required':      'Name is required.',
      'minlength':     'Your name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    }
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL) {
      this.createForm();
    }

  dish!: Dish;

  ngOnInit(): void {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) =>  { this.visibility = 'hidden'; return this.dishservice.getDish(params['id']); }))
    .subscribe({next: dish => { this.dish = dish; this.dishcopy = dish, this.setPrevNext(dish.id); this.visibility = 'shown'; },
     error: errmess => this.errMess = <any>errmess});
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating: 5,
      comment: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      author: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();  //(re)set form validators messages
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
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
  onInputChange(event: MatSliderChange) {
    console.log(event.value);
  }
  dishnull(dish:Dish){
    dish.id = '';
    dish.name = '';
    dish.image = '';
    dish.category = '';
    dish.featured = false;				//either this
    dish.label = '';				//or this
    dish.price = '';				// its because of strict type def of javascript
    dish.description = '';
    dish.comments = [];
  };

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishcopy)
      .subscribe({ next: dish=>{
        this.dish = dish; this.dishcopy = dish;
      },
      error: errmess => {this.dishnull(this.dish); this.dishnull(this.dishcopy); this.errMess = <any>errmess; }});
    this.commentForm.reset({
      rating: 5,
      comment: '',
      author: '',
    });
    this.commentFormDirective.resetForm();
  }


}
