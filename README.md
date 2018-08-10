chordpronode
===============

chordpronode

## Installation

`yarn add chordpronode`

## Usage

This module parses [chordpro](https://www.chordpro.org) files into JSON format with elements of the form:

```json
[
  {
    "type": "directive",
    "value": "t",
    "text": "t",
    "offset": 4,
    "lineBreaks": 0,
    "line": 1,
    "col": 5,
    "children": [
      {
        "type": "value",
        "value": "April Sun In Cuba",
        "text": ":April Sun In Cuba",
        "offset": 5,
        "lineBreaks": 0,
        "line": 1,
        "col": 6
      }
    ]
  }
]
```

|ChordPro|JSON element type|
|--|--|
|#text|"comment" with value text|
|sot/eot|"sot" children elements of type "tabline" and on "eot"|
|[x]|"chord" with value x|
|{x:y}|x directive with value x and child element with "value" y|
|define|"define" <br>children "base_fret", "frets", "fingers"|
|chords|map to "chordline" with children of type "chord"|
|lyrics|map to "lyricline" with children of type "lyric"|

## Dependencies
https://github.com/no-context/moo

## Testing
```
npm test
yarn test
gulp test
```

## Notes
- Complete tests
  - Tests provide better docs than docs
- Force precommit testing & linter?
- Choose a build tool for the module?
  - Probably don't need this.  Just write the module with the code in the lib directory. Adopt npm/yarn scripts and git/husky pre commit approach
  - Pulled gulp scaffold from chordprojs repository (clone)
    - Also tested using Travis just for experience, not necessary for this
    - Commit with this in then remove if want to revisit
 - Go live checklist
   - Publish to github
   - Complete Tests
   - Publish to npm
   - Replace
## License

MIT

## Other Reading
[Chordpro](http://chordpro.org)

[Chordpro Reference](http://tenbyten.com/software/songsgen/help/HtmlHelp/files_reference.htm)
