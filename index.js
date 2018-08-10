const {parse} = require('./lib/ChordProNode.js');

console.log(JSON.stringify(parse(`[C]`),0,2));
/*
console.log(JSON.stringify(parse(`
  {t: Deer Stand}
  {ipodid:2080676742384775562}
  {a: Chris Robertson}

  {c: Verse}
  |[Eb]Out in the county
  9|11's on the moon
  My |[Gb]gun keeps the peace
  My |[Ab]neighbors are few

  |[Eb]Just the way I like it
  I |don't wanna know 'em
  They could |[Gb]be up to stuff
  God |[Ab]never intended

  {c:Chorus}
  |[Eb]Dee|[Eb]eerr |[Gb]Stand |[Ab]

  {c: Verse}
  |[Eb]Here in Texas
  the |law's on my side
  Just an |[Gb]eighth of an acre
  I can |[Ab]hunt on a dime

  |[Eb]Only one restriction
  Pro|jectiles remain
  With|[Gb]in the property
  [Ab]|Challenge some say

  {c: Chorus}
  |[Eb]Dee|[Eb]eerr |[Gb]Stand
  (Gonna [Ab] get me a |deer stand)
  |[Eb]Dee|[Eb]eerr |[Gb]Stand
  (Gonna [Ab] get me a |deer stand)

  {c: Verse}
  |[Eb]Built me a deer stand
  On the |chimney it's perched
  So |[Gb]when I take aim
  |[Ab]Behind is the earth

  |[Eb]Deer come wounded
  By |Dennis the Menace
  I take |[Gb]pity on them
  And |[Ab]get me some venison

  {c: Solo}
  |[Eb]||[Gb]|[Ab]|
  |[Eb]||[Gb]|[Ab]|
  |[Eb]||[Gb]|[Ab]|
  |[Eb]||[Gb]|[Ab]|

  {c: Outro}
  Deer.......... Stand..........
 `),null,2));*/
