//2+3*4
// add => multiple | multiple+add
// multiple => NUMBER | NUMBER*multiple
// 右边是左边的产生式

let parse = require('./parse')
let evaluate = require('./evaluate')
let source = '1+-2+-3+-5'
let ast = parse(source)
let result = evaluate(ast)
console.log(JSON.stringify(ast, null, 2))
console.log(result)
