# Chords
[<text>] - Regular & Nashville notation

# Directives
{<text>[:<text>]}

## Measure Boundary Extension
- The pipe delimiting measures (enabling grids)
- |
- ||

## Key only directives
- new_song

## Key/Value Directives (done)
- title (short: t)
- subtitle (short: st)
- artist
- composer
- lyricist
- copyright
- album
- year
- key
- time
- tempo
- duration
- capo
- meta
- comment
- x_ (extensions)

## Directive Pairs, start and end markers (Environment)
- start_of_tab(short: sot), end_of_tab(short: eot)
- start_of_grid, end_of_grid
- start_of_chorus, end_of_chorus
- start_of_verse, end_of_verse


## Extension
- The pipe delimiting measures (enabling grids)

## Fonts, sizes & colours (Styling directives)
- textfont
- textsize
- textcolour
- chordfont
- chordsize
- chordcolour
- tabfont
- tabsize
- tabcolour

## Output
- new_page (short: np)
- new_physical_page (short: npp)
- column_break (short: cb)
The following directives are legacy from the old chord program. The modern reference implementation uses much more powerful configuration files for this purpose.
- grid (short: g)
- no_grid (short: ng)
- titles
- columns (short: col)
