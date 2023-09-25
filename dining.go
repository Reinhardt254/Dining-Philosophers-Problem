package main

import (
    "fmt"
    "math/rand"
    "sync"
    "time"
)

const numPhilosophers = 5

var (
    forks   [numPhilosophers]sync.Mutex
    wg      sync.WaitGroup
    eating  [numPhilosophers]bool
    randGen = rand.New(rand.NewSource(time.Now().UnixNano()))
)

type Philosopher struct {
    id int
}

func (p *Philosopher) think() {
    fmt.Printf("Philosopher %d is thinking...\n", p.id)
    time.Sleep(time.Duration(randGen.Intn(5)) * time.Second)
}

func (p *Philosopher) eat() {
    fmt.Printf("Philosopher %d is eating...\n", p.id)
    time.Sleep(time.Duration(randGen.Intn(5)) * time.Second)
}

func (p *Philosopher) takeForks(leftFork, rightFork int) {
    forks[leftFork].Lock()
    forks[rightFork].Lock()
}

func (p *Philosopher) putForks(leftFork, rightFork int) {
    forks[leftFork].Unlock()
    forks[rightFork].Unlock()
}

func (p *Philosopher) dine() {
    for {
        p.think()

        leftFork := p.id
        rightFork := (p.id + 1) % numPhilosophers

        p.takeForks(leftFork, rightFork)

        p.eat()

        p.putForks(leftFork, rightFork)
    }
}

func main() {
    for i := 0; i < numPhilosophers; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            philosopher := &Philosopher{id: id}
            philosopher.dine()
        }(i)
    }

    wg.Wait()
}
