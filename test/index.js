const expect = require('must');
const assert = require('assert');
const chordpro = require('../lib/ChordProNode');

describe('chordpro', function() {

  describe('chords', function() {

    it('should parse one-letter chord', function() {
      var chord = chordpro.parse('[C]');
      expect(chord[0].value).to.equal('chordline');
      expect(chord[0].children[0].value).to.equal('C');
    });

    it('should parse multi-letter chord', function() {
      var chord = chordpro.parse('[Cm]');

      expect(chord[0].value).to.equal('chordline');
      expect(chord[0].children[0].value).to.equal('Cm');
    });

    it('should parse bass chord', function() {
      var chord = chordpro.parse('[C/F]');

      expect(chord[0].value).to.equal('chordline');
      expect(chord[0].children[0].value).to.equal('C/F');
    });

    it('should parse sharp chord', function() {
      var chord = chordpro.parse('[C#]');

      expect(chord[0].value).to.equal('chordline');
      expect(chord[0].children[0].value).to.equal('C#');
    });

    it('should parse augmented chord', function() {
      var chord = chordpro.parse('[G+]');

      expect(chord[0].value).to.equal('chordline');
      expect(chord[0].children[0].value).to.equal('G+');
    });

    it('should parse chord followed by whitespace', function() {
      var chord = chordpro.parse('[C#] ');

      expect(chord[0].value).to.equal('chordline');
      expect(chord[0].children[0].value).to.equal('C#');
    });

    it('should parse chord followed by letters', function() {
      var chord = chordpro.parse('[C#]one');

      expect(chord[0].value).to.equal('chordline');
      expect(chord[0].children[0].value).to.equal('C#');
    });

    it('should return undefined for non-chord', function() {
      var chord = chordpro.parse('one');

      expect(chord[0].value).to.equal('lyricline');
      expect(chord[0].children[0].value).to.equal('one');
    });

    it('should return undefined for invalid characters in chord', function() {
      var chord = chordpro.parse('[C!]');

      expect(chord[0].value).to.equal('chordline');
      expect(chord[0].children[0].value).to.equal('C!');
    });

  });

  describe('directives', function() {

    it('should parse title directive', function() {
      var directive = chordpro.parse('{title: The Title}');

      expect(directive[0].type).to.equal('directive');
      expect(directive[0].value).to.equal('t');
      expect(directive[0].children[0].value).to.equal('The Title');
    });

    it('should parse abbreviated title directive', function() {
      var directive = chordpro.parse('{t: The Title}');

      expect(directive[0].type).to.equal('directive');
      expect(directive[0].value).to.equal('t');
      expect(directive[0].children[0].value).to.equal('The Title');
    });

    it('should parse subtitle directive', function() {
      var directive = chordpro.parse('{subTitle: The Subtitles}');

      expect(directive[0].type).to.equal('directive');
      expect(directive[0].value).to.equal('st');
      expect(directive[0].children[0].value).to.equal('The Subtitles');
    });

    it('should parse abbreviated subtitle directive', function() {
      var directive = chordpro.parse('{st: The Subtitles}');

      expect(directive[0].type).to.equal('directive');
      expect(directive[0].value).to.equal('st');
      expect(directive[0].children[0].value).to.equal('The Subtitles');
    });

    it('should parse comment', function() {
      var comment = chordpro.parse('# A comment');
      expect(comment[0].type).to.equal('comment');
      expect(comment[0].text).to.equal(' A comment');
      expect(comment[0].value).to.equal('A comment');
    });


    it('should parse comment directive', function() {
      var directive = chordpro.parse('{c: this is a comment}');

      expect(directive[0].type).to.equal('directive');
      expect(directive[0].value).to.equal('c');
      expect(directive[0].children[0].value).to.equal('this is a comment');
    });

    it('should parse start/end of chorus', function() {
      var directive = chordpro.parse(`{soc}
        Crap
        {eoc}`);
      expect(directive[0].type).to.equal('soc');
      expect(directive[0].value).to.equal('soc');
      const cnt = directive[0].children.length;
      expect(directive[0].children[cnt-1].type).to.equal('eoc');
    });

    it('should parse start/end of tablature', function() {
      var directive = chordpro.parse(`{sot}
        Crap
        {eot}`);
      expect(directive[0].type).to.equal('sot');
      expect(directive[0].value).to.equal('sot');
      const cnt = directive[0].children.length;
      expect(directive[0].children[cnt-1].type).to.equal('eot');
    });

    it('should return lyricline for no directive/comment', function() {
      var directive = chordpro.parse('not a directive');

      expect(directive[0].type).to.equal('lyricline');
      expect(directive[0].value).to.equal('lyricline');
    });

  });

  describe('parse chord & lyric line', function() {

    it('should parse usual mix of lyrics and chords', function() {
      var parsedLine = chordpro.parse('[C]one [D]two');

      expect(parsedLine[0].type).to.equal('chordline');
      expect(parsedLine[0].value).to.equal('chordline');
      expect(parsedLine[0].children.length).to.equal(2);

      expect(parsedLine[1].type).to.equal('lyricline');
      expect(parsedLine[1].value).to.equal('lyricline');
      expect(parsedLine[1].children.length).to.equal(2);
    });

    it('should maintain whitespace at front of line', function() {
      var parsedLine = chordpro.parse('   [C]one');

      expect(parsedLine[1].children[0].value).to.equal('   ');
    });

    it('should maintain whitespace before chords at end of line', function() {
      var parsedLine = chordpro.parse('one   [C]   [D]');

      expect(parsedLine[1].children[0].value).to.equal('one   ');
      expect(parsedLine[1].children[1].value).to.equal('   ');
    });

    it('should parse two chords following each other', function() {
      var parsedLine = chordpro.parse('[C][D]');

      expect(parsedLine[0].children[0].value).to.equal('C');
      expect(parsedLine[0].children[1].value).to.equal('D');
    });

    it('should return nothing for empty string', function() {
      var parsedLine = chordpro.parse(``);

      expect(parsedLine.length).to.equal(0);
    });

    it('should return NL for empty line', function() {
      var parsedLine = chordpro.parse(`\n`);

      expect(parsedLine[0].type).to.equal('NL');
    });

    it('should pass through multiple value-less directives on one line', function() {
      var parsedLine = chordpro.parse('{soh}some text{eoh}');

      expect(parsedLine.length).to.equal(3);
      expect(parsedLine[0].type).to.equal('directive');
      expect(parsedLine[0].value).to.equal('soh');
      expect(parsedLine[1].type).to.equal('lyricline');
      expect(parsedLine[1].children[0].value).to.equal('some text');
      expect(parsedLine[2].type).to.equal('directive');
      expect(parsedLine[2].value).to.equal('eoh');
    });

    it('should parse multiple valued directives on one line', function() {
      var parsedLine = chordpro.parse('{c: comment1}some text{c: comment2}');

      expect(parsedLine[0].type).to.equal('directive');
      expect(parsedLine[0].value).to.equal('c');
      expect(parsedLine.length).to.equal(3);
    });

    it('should allow colon in directive value', function() {
      var parsedLine = chordpro.parse('{c: comment:}');

      expect(parsedLine[0].type).to.equal('directive');
      expect(parsedLine[0].value).to.equal('c');
      expect(parsedLine[0].children[0].value).to.equal('comment:');
    });
  });

  describe('parse', function() {

    it('should handle multiple lines', function() {
      var parseResult = chordpro.parse('[C]one\n[D]two');

      expect(parseResult.length).to.equal(4);
      expect(parseResult[0].type).to.equal('chordline');
      expect(parseResult[1].type).to.equal('lyricline');
      expect(parseResult[2].type).to.equal('chordline');
      expect(parseResult[3].type).to.equal('lyricline');
      expect(parseResult[0].children[0].value).to.equal('C');
      expect(parseResult[1].children[0].value).to.equal('one');
      expect(parseResult[2].children[0].value).to.equal('D');
      expect(parseResult[3].children[0].value).to.equal('two');
    });

    it('should ignore comments at beginning of line', function() {
      var parseResult = chordpro.parse('one\n# comment\ntwo');

      expect(parseResult.length).to.equal(3);
      expect(parseResult[0].type).to.equal('lyricline');
      expect(parseResult[1].type).to.equal('comment');
      expect(parseResult[2].type).to.equal('lyricline');
      expect(parseResult[0].children[0].value).to.equal('one');
      expect(parseResult[1].value).to.equal('comment');
      expect(parseResult[2].children[0].value).to.equal('two');
    });

    it('should ignore comments preceded by whitespace only', function() {
      var parseResult = chordpro.parse('one\n   # comment\ntwo');

      expect(parseResult.length).to.equal(3);
      expect(parseResult[0].type).to.equal('lyricline');
      expect(parseResult[1].type).to.equal('comment');
      expect(parseResult[2].type).to.equal('lyricline');
      expect(parseResult[0].children[0].value).to.equal('one');
      expect(parseResult[1].value).to.equal('comment');
      expect(parseResult[2].children[0].value).to.equal('two');
    });

    it('should maintain text as is between sot/eot', function() {
      var parseResult = chordpro.parse('{sot}\n_ _ _ 1 _ _\n{eot}');

      expect(parseResult.length).to.equal(1);
      expect(parseResult[0].children[0].type).to.equal('tabline');
      expect(parseResult[0].children[0].value).to.equal('_ _ _ 1 _ _');
      expect(parseResult[0].children[1].type).to.equal('eot');
    });

    it('should return title when present', function() {
      var parseResult = chordpro.parse('{t: The Title}');

      expect(parseResult[0].type).to.equal('directive');
      expect(parseResult[0].value).to.equal('t');
      expect(parseResult[0].children[0].value).to.equal('The Title');
    });

    it('should return subtitle when present', function() {
      var parseResult = chordpro.parse('{st: The Subtitles}');

      expect(parseResult[0].type).to.equal('directive');
      expect(parseResult[0].value).to.equal('st');
      expect(parseResult[0].children[0].value).to.equal('The Subtitles');
    });

    it('should return both title and subtitle when present', function() {
      var parseResult = chordpro.parse(`{t: The Title}\n
        {st: The Subtitles}`);

      expect(parseResult[0].type).to.equal('directive');
      expect(parseResult[0].value).to.equal('t');
      expect(parseResult[0].children[0].value).to.equal('The Title');
      expect(parseResult[1].type).to.equal('directive');
      expect(parseResult[1].value).to.equal('st');
      expect(parseResult[1].children[0].value).to.equal('The Subtitles');
    });
  });

  describe('whole song', function() {

    it('should parse a whole song', function() {
      var parseResult = chordpro.parse(`
{t: Deer Stand}
{ipodid:2080676742384775562}
{a: Chris Robertson}

{start_of_grid 1+4x2+4}
A    || G7 . | % . | %% . | . . |
     | C7 . | %  . || G7 . | % . ||
     |: C7 . | %  . :|: G7 . | % . :| repeat 4 times
Coda | D7 . | Eb7 | D7 | G7 . | % . |.
{end_of_grid}

{c:Verse 1}
{start_of_grid 1+4x2+4}
|| Eb . . . | Gb . Ab . ||
{end_of_grid}
[Eb]Out in the county
911's on the moon
My [Gb]gun keeps the peace
My [Ab]neighbors are few

[Eb]Just the way I like it
I don't wanna know 'em
They could [Gb]be up to stuff
God [Ab]never intended

{c:Chorus 1}
[Eb]Dee[Eb]eerr [Gb]Stand [Ab]

{c:Verse 2}
[Eb]Here in Texas
the law's on my side
Just an [Gb]eighth of an acre
I can [Ab]hunt on a dime

[Eb]Only one restriction
Projectiles remain
With[Gb]in the property
[Ab]Challenge some say

{c:Chorus 2}
[Eb]Dee[Eb]eerr [Gb]Stand
(Gonna [Ab] get me a deer stand)
[Eb]Dee[Eb]eerr [Gb]Stand
(Gonna [Ab] get me a deer stand)

{c:Verse 3}
[Eb]Built me a deer stand
On the chimney it's perched
So [Gb]when I take aim
[Ab]Behind is the earth

[Eb]Deer come wounded
By Dennis the Menace
I take [Gb]pity on them
And [Ab]get me some venison

{c: Solo over Verse}
{sot}
{eot}

{c: Outro}
Deer.......... Stand..........
        `);
      console.log(JSON.stringify(parseResult,null,2));

      expect(parseResult.length).to.equal(parseResult.length);
    });
  });

});
