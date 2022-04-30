import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor() { }

  getDishes(): Promise<Dish[]> {
    return new Promise(resolve => {
      //Simulated server latency of 2 seconds
      setTimeout(() => resolve(DISHES),2000)
    });
  }
  getDish(id: string): Promise<Dish>{
    return new Promise(resolve => {
      //Simulated server latency of 2 seconds
      setTimeout(()=> resolve(DISHES.filter((dish) => (dish.id === id))[0]),2000)     // => is equivalent of function {}
  });
  }
  getFeaturedDish(): Promise<Dish>{
    return new Promise(resolve => {
      //Simulated server latency of 2 seconds
      setTimeout(() => resolve(DISHES.filter((dish) => (dish.featured))[0]),2000)
  });
  }
}
