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

  describe('_parseDirective', function() {

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

    it('should parse directives with no value', function() {
      var directive = chordpro.parse(`{soc}
        Crap
        {eoc}`);
      console.log(JSON.stringify(directive,0,2));
      expect(directive[0].type).to.equal('directive');
      expect(directive[0].value).to.equal('soc');
    });

    it('should return undefined for not directive', function() {
      var directive = chordpro.parse('not a directive');

      expect(directive).to.equal(undefined);
    });

  });

  describe('_parseWord', function() {

    it('should parse word', function() {
      var word = chordpro._parseWord("some words")

      expect(word).to.equal("some");
    });

    it('should parse word', function() {
      var word = chordpro._parseWord("[")

      expect(word).to.equal("[");
    });

    it('should return empty for whitespace', function() {
      var word = chordpro._parseWord(" some words")

      expect(word).to.equal('');
    });

    it('should return undefined for chord', function() {
      var word = chordpro._parseWord("[A]some words")

      expect(word).to.equal(undefined);
    });

    it('should return undefined for directive', function() {
      var word = chordpro._parseWord("{soc}")

      expect(word).to.equal(undefined);
    });
  });

  describe('_parseWhitespace', function() {

    it('should parse whitespace', function() {
      var word = chordpro._parseWhitespace("   some words")

      expect(word).to.equal('   ');
    });

    it('should return empty for word', function() {
      var word = chordpro._parseWhitespace("some words")

      expect(word).to.equal('');
    });

    it('should return empty for chord', function() {
      var word = chordpro._parseWhitespace("[A]some words")

      expect(word).to.equal('');
    });

    it('should return empty for directive', function() {
      var word = chordpro._parseWhitespace("{soc}")

      expect(word).to.equal('');
    });
  });

  describe('_parseLine', function() {

    it('should parse usual mix of lyrics and chords', function() {
      var parsedLine = chordpro._parseLine('[C]one [D]two');

      expect(parsedLine.length).to.equal(3);
      expect(parsedLine[0].lyrics).to.equal('one');
      expect(parsedLine[0].chord).to.equal('C');
      expect(parsedLine[0].directive).to.equal(undefined);
      expect(parsedLine[1].lyrics).to.equal(' ');
      expect(parsedLine[1].chord).to.equal(undefined);
      expect(parsedLine[1].directive).to.equal(undefined);
      expect(parsedLine[2].lyrics).to.equal('two');
      expect(parsedLine[2].chord).to.equal('D');
      expect(parsedLine[2].directive).to.equal(undefined);
    });

    it('should maintain whitespace at front of line', function() {
      var parsedLine = chordpro._parseLine('   [C]one');

      expect(parsedLine.length).to.equal(2);
      expect(parsedLine[0].lyrics).to.equal('   ');
      expect(parsedLine[0].chord).to.equal(undefined);
      expect(parsedLine[0].directive).to.equal(undefined);
      expect(parsedLine[1].lyrics).to.equal('one');
      expect(parsedLine[1].chord).to.equal('C');
      expect(parsedLine[1].directive).to.equal(undefined);
    });

    it('should maintain whitespace before chords at end of line', function() {
      var parsedLine = chordpro._parseLine('one   [C]   [D]');

      expect(parsedLine.length).to.equal(4);
      expect(parsedLine[0].lyrics).to.equal('one');
      expect(parsedLine[0].chord).to.equal(undefined);
      expect(parsedLine[1].lyrics).to.equal('   ');
      expect(parsedLine[1].chord).to.equal(undefined);
      expect(parsedLine[2].lyrics).to.equal('   ');
      expect(parsedLine[2].chord).to.equal('C');
      expect(parsedLine[3].lyrics).to.equal(undefined);
      expect(parsedLine[3].chord).to.equal('D');
    });

    it('should parse two chords following each other', function() {
      var parsedLine = chordpro._parseLine('[C][D]');

      expect(parsedLine.length).to.equal(2);
      expect(parsedLine[0].chord).to.equal('C');
      expect(parsedLine[1].chord).to.equal('D');
    });

    it('should return lyrics field with one non-breaking space for empty line', function() {
      var parsedLine = chordpro._parseLine('');

      expect(parsedLine.length).to.equal(1);
      expect(parsedLine[0].lyrics).to.equal('&nbsp;');
      expect(parsedLine[0].chord).to.equal(undefined);
    });

    it('should parse multiple value-less directives on one line', function() {
      var parsedLine = chordpro._parseLine('{soh}some text{eoh}');

      expect(parsedLine.length).to.equal(5);
      expect(parsedLine[0].directive.type).to.equal('soh');
      expect(parsedLine[1].lyrics).to.equal('some');
      expect(parsedLine[2].lyrics).to.equal(' ');
      expect(parsedLine[3].lyrics).to.equal('text');
      expect(parsedLine[4].directive.type).to.equal('eoh');
    });

    it('should parse multiple valued directives on one line', function() {
      var parsedLine = chordpro._parseLine('{c: comment1}some text{c: comment2}');

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

      expect(parseResult.parsedLines.length).to.equal(2);
      expect(parseResult.parsedLines[0][0].chord).to.equal('C');
      expect(parseResult.parsedLines[0][0].lyrics).to.equal('one');
      expect(parseResult.parsedLines[1][0].chord).to.equal('D');
      expect(parseResult.parsedLines[1][0].lyrics).to.equal('two');
    });

    it('should ignore comments at beginning of line', function() {
      var parseResult = chordpro.parse('one\n# comment\ntwo');

      expect(parseResult.parsedLines.length).to.equal(2);
      expect(parseResult.parsedLines[0][0].lyrics).to.equal('one');
      expect(parseResult.parsedLines[1][0].lyrics).to.equal('two');
    });

    it('should ignore comments preceded by whitespace only', function() {
      var parseResult = chordpro.parse('one\n   # comment\ntwo');

      expect(parseResult.parsedLines.length).to.equal(2);
      expect(parseResult.parsedLines[0][0].lyrics).to.equal('one');
      expect(parseResult.parsedLines[1][0].lyrics).to.equal('two');
    });

    it('should maintain text as is between sot/eot', function() {
      var parseResult = chordpro.parse('{sot}\n_ _ _ 1 _ _\n{eot}');

      expect(parseResult.parsedLines.length).to.equal(3);
      expect(parseResult.parsedLines[0][0].directive.type).to.equal('sot');
      expect(parseResult.parsedLines[1][0].lyrics).to.equal('_ _ _ 1 _ _');
      expect(parseResult.parsedLines[2][0].directive.type).to.equal('eot');
    });

    it('should return title when present', function() {
      var parseResult = chordpro.parse('{t: The Title}');

      expect(parseResult.title).to.equal('The Title');
    });

    it('should return subtitle when present', function() {
      var parseResult = chordpro.parse('{st: The Subtitles}');

      expect(parseResult.subTitle).to.equal('The Subtitles');
    });

    it('should return both title and subtitle when present', function() {
      var parseResult = chordpro.parse('{t: The Title}\n{st: The Subtitles}');

      expect(parseResult.title).to.equal('The Title');
      expect(parseResult.subTitle).to.equal('The Subtitles');
    });
  });

  describe('format', function() {

    it('should display title directive with proper class', function() {
      var source = '{t: The Title}';

      var result = chordpro.format(source);
      expect(result.html).to.equal('<span class="song-line"><span class="song-linesegment"><span class="song-title">The Title</span></span></span>');
    });

    it('should not add chord span if no chords on line', function() {
      var source = 'Lyrics';

      var result = chordpro.format(source);
      expect(result.html).to.equal('<span class="song-line"><span class="song-linesegment"><span class="song-lyrics">Lyrics</span></span></span>');
    });

    it('should add chord spans for all segments if there are chords on line', function() {
      var source = 'Lyrics [C]here';

      var result = chordpro.format(source);
      expect(result.html).to.equal(
        '<span class="song-line"><span class="song-linesegment"><span class="song-chord"> </span><span class="song-lyrics">Lyrics</span></span><span class="song-linesegment"><span class="song-chord"> </span><span class="song-lyrics song-lyrics-whitespace"> </span></span><span class="song-linesegment"><span class="song-chord">C</span><span class="song-lyrics">here</span></span></span>');
    });

    it('should use spans with nolyrics class if only chords on a line', function() {
      var source = '[Am7][B]';

      var result = chordpro.format(source);
      expect(result.html).to.equal('<span class="song-line"><span class="song-linesegment"><span class="song-chord-nolyrics">Am7</span><span class="song-lyrics song-lyrics-whitespace"> </span></span><span class="song-linesegment"><span class="song-chord-nolyrics">B</span><span class="song-lyrics song-lyrics-whitespace"> </span></span></span>');
    });

    it('should use spans with nolyrics class on chords at end of a line', function() {
      var source = 'one[A]    [B]';

      var result = chordpro.format(source);
      expect(result.html).to.equal(
        '<span class="song-line"><span class="song-linesegment"><span class="song-chord"> </span><span class="song-lyrics">one</span></span><span class="song-linesegment"><span class="song-chord-nolyrics">A</span><span class="song-lyrics song-lyrics-whitespace">    </span></span><span class="song-linesegment"><span class="song-chord-nolyrics">B</span><span class="song-lyrics song-lyrics-whitespace"> </span></span></span>');
    });

    it('should maintain empty lines', function() {
      var source = 'line1\n\nline2';

      var result = chordpro.format(source);
      expect(result.html).to.equal(
        '<span class="song-line"><span class="song-linesegment"><span class="song-lyrics">line1</span></span></span><span class="song-line"><span class="song-linesegment"><span class="song-lyrics">&nbsp;</span></span></span><span class="song-line"><span class="song-linesegment"><span class="song-lyrics">line2</span></span></span>');
    });

  });
});
