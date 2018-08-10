
const s = process.argv[2];

let out = '';
for(let i = 0; i < s.length; i++ )
{
  out += '[' + s[i].toLowerCase() + s[i].toUpperCase() + ']';
}

console.log(out);
