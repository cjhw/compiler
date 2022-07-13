const {
  LeftPunctuator,
  JSXIdentifier,
  AttributeKey,
  AttributeStringValue,
  RightPunctuator,
  JSXText,
  BackSlashPunctuator,
  EquatorPunctuator,
} = require('./tokenTypes')

const LEFTERS = /[a-z0-9]/

let currentToken = { type: '', value: '' }
let tokens = []

/**
 * 确定一个新token了
 * @param {*} token
 */
function emit(token) {
  // 发射完token之后currentToken就可以清空了
  currentToken = { type: '', value: '' }
  tokens.push(token)
}

/**
 * 开始状态
 * @param {String} char
 */
function start(char) {
  if (char === '<') {
    emit({ type: LeftPunctuator, value: char })
    return foundLeftPunctuator //找到了 <
  }
  throw new TypeError('first char must be <')
}

function foundLeftPunctuator(char) {
  if (LEFTERS.test(char)) {
    //如果char是一个小写字母或数字
    currentToken.type = JSXIdentifier
    currentToken.value += char
    return jSXIdentifier //继续收集标识符
  } else if (char === '/') {
    emit({ type: BackSlashPunctuator, value: char })
    return foundLeftPunctuator
  }
  throw new TypeError('TypeError foundLeftPunctuator')
}

function jSXIdentifier(char) {
  if (LEFTERS.test(char)) {
    //如果char是一个小写字母或者数字
    currentToken.value += char
    return jSXIdentifier
  } else if (char === ' ') {
    //遇到空格 标识符结束
    emit(currentToken)
    return attribute
  } else if (char === '>') {
    //说明次标签没有属性 直接结束
    emit(currentToken)
    emit({ type: RightPunctuator, value: char })
    return foundRightPunctuator
  }
  throw new TypeError('TypeError jSXIdentifier')
}

function attribute(char) {
  if (LEFTERS.test(char)) {
    currentToken.type = AttributeKey //属性的key
    currentToken.value += char //属性key的名字
    return attributeKey
  }
  throw new TypeError('TypeError AttributeKey')
}

function attributeKey(char) {
  if (LEFTERS.test(char)) {
    currentToken.value += char
    return attributeKey
  } else if (char === '=') {
    //属性key的名字 结束
    emit(currentToken)
    emit({ type: EquatorPunctuator, value: char })
    return attributeValue
  }
  throw new TypeError('TypeError attributeKey')
}

function attributeValue(char) {
  // char="
  if (char === '"') {
    currentToken.type = AttributeStringValue
    return attributeStringValue //开始读字符串属性的值
  }
  throw new TypeError('TypeError attributeValue')
}

function attributeStringValue(char) {
  if (LEFTERS.test(char)) {
    currentToken.value += char
    return attributeStringValue
  } else if (char === '"') {
    //属性的值 结束
    emit(currentToken)
    return tryLevelAttribute
  }
  throw new TypeError('TypeError attributeStringValue')
}

// 可能是新属性也可能是开始标签的结束
function tryLevelAttribute(char) {
  if (char === ' ') {
    return attribute
  } else if (char === '>') {
    //开始标签结束 找到了 >
    emit({ type: RightPunctuator, value: char })
    return foundRightPunctuator
  }
  throw new TypeError('TypeError tryLevelAttribute')
}

function foundRightPunctuator(char) {
  if (char === '<') {
    emit({ type: LeftPunctuator, value: char })
    return foundLeftPunctuator //找到了 <
  } else {
    currentToken.type = JSXText
    currentToken.value += char
    return jSXText
  }
}

function jSXText(char) {
  if (char === '<') {
    emit(currentToken)
    emit({ type: LeftPunctuator, value: char })
    return foundLeftPunctuator
  } else if (LEFTERS.test(char)) {
    currentToken.value += char
    return jSXText
  }
  throw new TypeError('TypeError tryLevelAttribute')
}

function tokenizer(input) {
  let state = start
  for (let char of input) {
    state = state(char)
  }
  return tokens
}

module.exports = {
  tokenizer,
}

// let sourceCode = `<h1 id="title"><span>hello</span>world</h1>`
// console.log(tokenizer(sourceCode))

// [
//   { type: 'LeftPunctuator', value: '<' },
//   { type: 'JSXIdentifier', value: 'h1' },
//   { type: 'AttributeKey', value: 'id' },
//   { type: 'EquatorPunctuator', value: '=' },
//   { type: 'AttributeKey', value: 'title' },
//   { type: 'RightPunctuator', value: '>' },
//   { type: 'LeftPunctuator', value: '<' },
//   { type: 'JSXIdentifier', value: 'span' },
//   { type: 'RightPunctuator', value: '>' },
//   { type: 'JSXText', value: 'hello' },
//   { type: 'LeftPunctuator', value: '<' },
//   { type: 'BackSlashPunctuator', value: '/' },
//   { type: 'JSXIdentifier', value: 'span' },
//   { type: 'RightPunctuator', value: '>' },
//   { type: 'JSXText', value: 'world' },
//   { type: 'LeftPunctuator', value: '<' },
//   { type: 'BackSlashPunctuator', value: '/' },
//   { type: 'JSXIdentifier', value: 'h1' },
//   { type: 'RightPunctuator', value: '>' }
// ]
