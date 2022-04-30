import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }
  getLeaders(): Promise<Leader[]>{
    return new Promise(resolve =>{
      //Simulated server latency of 2 seconds
      setTimeout(()=>resolve(LEADERS),2000)
    });
  }
  getFeaturedLeader(): Promise<Leader> {
    return new Promise(resolve =>{
      //Simulated server latency of 2 seconds
      setTimeout(()=>resolve(LEADERS.filter((leader) => leader.featured)[0]),2000)
    });
  }
}
