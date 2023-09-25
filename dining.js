class Semaphore {
   constructor(initialCount = 1) {
     this.count = initialCount;
     this.queue = [];
   }
 
   acquire() {
     return new Promise((resolve) => {
       if (this.count > 0) {
         this.count--;
         resolve();
       } else {
         this.queue.push(resolve);
       }
     });
   }
 
   release() {
     if (this.queue.length > 0) {
       const next = this.queue.shift();
       next();
     } else {
       this.count++;
     }
   }
 }
 
 // Define the number of philosophers and forks
 const num_philosophers = 5;
 const num_forks = num_philosophers;
 
 // Define semaphores for the forks and the mutex
 const forks = Array.from({ length: num_forks }, () => new Semaphore(1));
 const mutex = new Semaphore(1);
 
 // Define the philosopher class
 class Philosopher {
   constructor(index) {
     this.index = index;
   }
 
   async think() {
     console.log(`Philosopher ${this.index} is thinking...`);
     await sleep(randomInt(1000, 5000));
   }
 
   async eat() {
     console.log(`Philosopher ${this.index} is eating...`);
     await sleep(randomInt(1000, 5000));
   }
 
   async dine() {
     while (true) {
       await this.think();
 
       await mutex.acquire();
 
       const leftForkIndex = this.index;
       const rightForkIndex = (this.index + 1) % num_forks;
 
       await forks[leftForkIndex].acquire();
       await forks[rightForkIndex].acquire();
 
       mutex.release();
 
       await this.eat();
 
       forks[leftForkIndex].release();
       forks[rightForkIndex].release();
     }
   }
 }
 
 // Utility function to sleep for a given number of milliseconds
 function sleep(ms) {
   return new Promise((resolve) => setTimeout(resolve, ms));
 }
 
 // Utility function to generate a random integer between min and max (inclusive)
 function randomInt(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
 }
 
 // Create philosopher instances and start dining
 const philosophers = Array.from({ length: num_philosophers }, (_, i) => new Philosopher(i));
 philosophers.forEach((philosopher) => philosopher.dine());
 