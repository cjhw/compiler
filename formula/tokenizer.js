const {
  NUMBER,
  PLUS,
  MULTIPLY,
  MINUS,
  DIVIDE,
  LEFT_PARA,
  RIGHT_PARA,
} = require('./tokenTypes')
const tokensNames = [
  NUMBER,
  PLUS,
  MULTIPLY,
  MINUS,
  DIVIDE,
  LEFT_PARA,
  RIGHT_PARA,
]

let RegExpObject = /(-?[0-9]+)|(\+)|(\*)|(\-)|(\/)|(\()|(\))/g

function* tokenizer(script) {
  let result
  while (true) {
    result = RegExpObject.exec(script)
    if (!result) break
    // 返回匹配项的索引
    let index = result.findIndex((item, index) => index > 0 && !!item)
    let token = { type: tokensNames[index - 1], value: result[0] }
    yield token
  }
}

function tokenize(script) {
  let tokens = []
  for (let token of tokenizer(script)) {
    tokens.push(token)
  }
  return new TokenReader(tokens)
}

class TokenReader {
  constructor(tokens) {
    this.tokens = tokens
    this.pos = 0 // 索引
  }
  // 读取一个token
  read() {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos++]
    }
    return null
  }
  // 偷瞄一眼
  peek() {
    if (this.pos < this.tokens.length) {
      //取完token pos+1 相当于消耗了这个token
      return this.tokens[this.pos]
    }
    return null
  }

  //倒退
  unread() {
    if (this.pos > 0) {
      this.pos--
    }
  }
}

let tokenReader = tokenize('5-1+3*4/2')

module.exports = tokenize
