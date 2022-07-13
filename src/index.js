const { parser } = require('./parser')
const { transformer } = require('./transformer')
const { codeGenerator } = require('./codeGenerator')

let source = '<div id="aa" name="bb"><span>lxy</span>222</div>'
let ast = parser(source)
transformer(ast)
console.log(JSON.stringify(ast, null, 2))
console.log(codeGenerator(ast))
