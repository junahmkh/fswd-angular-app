import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Feedback, ContactType } from '../shared/feedback';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(baseURL + 'feedback')
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  getFeedback(id: string): Observable<Feedback> {
    return this.http.get<Feedback>(baseURL + 'feedback/' + id)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  getFeedbackIds(): Observable<string[] | any> {
    return this.getFeedbacks().pipe(map(feedbacks => feedbacks.map(feedback => feedback.id)))
    .pipe(catchError(error => error));
  }
  postFeedback(feedback: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Feedback>(baseURL + 'feedback', feedback, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
