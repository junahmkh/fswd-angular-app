import { Comment } from './comment';

export class Dish {
    id: string = '';
    name: string = '';
    image: string = '';
    category: string = '';
    featured!: boolean;				//either this
    label: string = '';				//or this
    price: string = '';				// its because of strict type def of javascript
    description: string = '';
    comments!: Comment[];
}