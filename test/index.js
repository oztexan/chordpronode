const expect = require('must');
const assert = require('assert');
const chordpro = require('../lib/ChordProNode');

describe('chordpro', function() {

  describe('chords', function() {

    it('should parse one-letter chord', function() {
      var chord = chordpro.parse('[C]');
      console.log(JSON.stringify(chord));
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

    it('should ignore multiple value-less directives on one line', function() {
      var parsedLine = chordpro.parse('{soh}some text{eoh}');

      console.log(JSON.stringify(parsedLine,0,2));
      expect(parsedLine[0].type).to.equal('NL');

      expect(parsedLine.length).to.equal(5);
      expect(parsedLine[0].directive.type).to.equal('soh');
      expect(parsedLine[1].lyrics).to.equal('some');
      expect(parsedLine[2].lyrics).to.equal(' ');
      expect(parsedLine[3].lyrics).to.equal('text');
      expect(parsedLine[4].directive.type).to.equal('eoh');
    });

    it('should parse multiple valued directives on one line', function() {
      var parsedLine = chordpro.parse('{c: comment1}some text{c: comment2}');

      console.log(JSON.stringify(parsedLine,0,2));
      expect(parsedLine[0].type).to.equal('NL');

      expect(parsedLine.length).to.equal(5);
      expect(parsedLine[0].directive.type).to.equal('comment');
      expect(parsedLine[0].directive.value).to.equal('comment1');
      expect(parsedLine[1].lyrics).to.equal('some');
      expect(parsedLine[2].lyrics).to.equal(' ');
      expect(parsedLine[3].lyrics).to.equal('text');
      expect(parsedLine[4].directive.type).to.equal('comment');
      expect(parsedLine[4].directive.value).to.equal('comment2');
    });

    it('should allow colon in directive value', function() {
      var parsedLine = chordpro._parseLine('{c: comment:}');

      expect(parsedLine.length).to.equal(1);
      expect(parsedLine[0].directive.type).to.equal('comment');
      expect(parsedLine[0].directive.value).to.equal('comment:');
    });
  });

  describe('parse', function() {

    it('should handle multiple lines', function() {
      var parseResult = chordpro.parse('[C]one\n[D]two');

      console.log(JSON.stringify(parseResult,0,2));

      expect(parseResult.parsedLines.length).to.equal(2);
      expect(parseResult.parsedLines[0][0].chord).to.equal('C');
      expect(parseResult.parsedLines[0][0].lyrics).to.equal('one');
      expect(parseResult.parsedLines[1][0].chord).to.equal('D');
      expect(parseResult.parsedLines[1][0].lyrics).to.equal('two');
    });

    it('should ignore comments at beginning of line', function() {
      var parseResult = chordpro.parse('one\n# comment\ntwo');
      console.log(JSON.stringify(parseResult,0,2));

      expect(parseResult.parsedLines.length).to.equal(2);
      expect(parseResult.parsedLines[0][0].lyrics).to.equal('one');
      expect(parseResult.parsedLines[1][0].lyrics).to.equal('two');
    });

    it('should ignore comments preceded by whitespace only', function() {
      var parseResult = chordpro.parse('one\n   # comment\ntwo');
      console.log(JSON.stringify(parseResult,0,2));

      expect(parseResult.parsedLines.length).to.equal(2);
      expect(parseResult.parsedLines[0][0].lyrics).to.equal('one');
      expect(parseResult.parsedLines[1][0].lyrics).to.equal('two');
    });

    it('should maintain text as is between sot/eot', function() {
      var parseResult = chordpro.parse('{sot}\n_ _ _ 1 _ _\n{eot}');
      console.log(JSON.stringify(parseResult,0,2));

      expect(parseResult.parsedLines.length).to.equal(3);
      expect(parseResult.parsedLines[0][0].directive.type).to.equal('sot');
      expect(parseResult.parsedLines[1][0].lyrics).to.equal('_ _ _ 1 _ _');
      expect(parseResult.parsedLines[2][0].directive.type).to.equal('eot');
    });

    it('should return title when present', function() {
      var parseResult = chordpro.parse('{t: The Title}');
      console.log(JSON.stringify(parseResult,0,2));

      expect(parseResult.title).to.equal('The Title');
    });

    it('should return subtitle when present', function() {
      var parseResult = chordpro.parse('{st: The Subtitles}');
      console.log(JSON.stringify(parseResult,0,2));

      expect(parseResult.subTitle).to.equal('The Subtitles');
    });

    it('should return both title and subtitle when present', function() {
      var parseResult = chordpro.parse('{t: The Title}\n{st: The Subtitles}');
      console.log(JSON.stringify(parseResult,0,2));

      expect(parseResult.title).to.equal('The Title');
      expect(parseResult.subTitle).to.equal('The Subtitles');
    });
  });

});
