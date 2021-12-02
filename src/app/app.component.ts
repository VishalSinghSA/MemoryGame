import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import { Card } from './card.models';
import { Cards } from './cards';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cards: Card[] = Cards;
  resetCards: Card[] = [];
  cardsFlipped: Card[] = [];
  totalTime: string = '';
  penalty: number = 0;
  totalMatches: number = 0;
  gameFinish: boolean = false;
  private timerSubscription!: Subscription;

  swapCards(newCardSet: Card[]): Card[] {
    for (let i = newCardSet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCardSet[i], newCardSet[j]] = [newCardSet[j], newCardSet[i]];
    }
    return newCardSet;
  }
  setUpCards(): void {
    let newCardSet: Card[] = [];
    while (newCardSet.length < 36) {
      let randomCard = Math.floor(Math.random() * this.cards.length - 1) + 1;
      let card1 = JSON.parse(JSON.stringify(this.cards[randomCard]));
      card1.id = new Date().getTime();
      newCardSet.push(card1);
      let card2 = JSON.parse(JSON.stringify(this.cards[randomCard]));
      card2.id = new Date().getTime();
      newCardSet.push(card2);
    }
    this.resetCards = this.swapCards(newCardSet);
  }

  checkCardsMatched(){
    setTimeout(() => {
      let status = this.cardsFlipped[0].type === this.cardsFlipped[1].type ? 'opened' : 'default'
      this.cardsFlipped[0].status = status;
      this.cardsFlipped[1].status = status;
      this.cardsFlipped = []
      status === 'default'?this.penalty += 5:++this.totalMatches;
      if(status === 'opened' && this.totalMatches === this.resetCards.length/2){
        this.gameFinish = true;
        this.timerSubscription.unsubscribe();
      }
    }, 600);
  }

  cardOpened(card: Card) {
    card.status = 'opened';
    if (this.cardsFlipped.length < 2) {
      this.cardsFlipped.push(card);
      if (this.cardsFlipped.length === 2) {
        this.checkCardsMatched();
      }
    }
  }

  updateTimer(sec: number): void{
    let totalSeconds = sec + this.penalty;
    this.totalTime = Math.floor(totalSeconds / 60) + ":" + (totalSeconds % 60 ? totalSeconds % 60 : '00');
  }
  

  resetTimer(): void{
    if(this.timerSubscription) this.timerSubscription.unsubscribe();
    let timer = interval(1000);
    this.timerSubscription = timer.subscribe(sec => {
      this.updateTimer(sec);
    });
  }

  resetGame(): void{
    this.totalTime = ''
    this.penalty = this.totalMatches = 0;
    this.gameFinish = false;
    this.ngOnInit();
  }

  constructor() {
    
  }

  ngOnInit(): void {
    this.setUpCards();
    this.resetTimer();
  }
}
