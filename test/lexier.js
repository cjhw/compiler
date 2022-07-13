// 词法分析
// 有限状态机

const Numeric = 'Numeric'
const Punctuator = 'Punctuator'

let NUMBERS = /[0-9]/
let tokens = []
let currentToken

/**
 * start表示开始状态
 * 它是一个函数，接收一个字符，返回下一个状态函数
 * @param {String} char
 */
function start(char) {
  //如果这个char是一个数字
  if (NUMBERS.test(char)) {
    currentToken = { type: Numeric, value: '' }
  }
  //进入新的状态了 收集或者捕获number数字的状态
  return number(char)
}

function number(char) {
  if (NUMBERS.test(char)) {
    currentToken.value += char
    return number
  } else if (char === '+' || char === '-') {
    emit(currentToken)
    emit({ type: Punctuator, value: char })
    currentToken = { type: Numeric, value: '' }
    return number
  } else {
    return start
  }
}

/**
 * 确定一个新token了
 * @param {*} token
 */
function emit(token) {
  currentToken = { type: '', value: '' }
  tokens.push(token)
}

/**
 * 分词
 * @param {String} input
 */

function tokenizer(input) {
  //刚开始的时候是start状态
  let state = start
  for (let char of input) {
    console.log(state)
    state = state(char)
  }
  if (currentToken.value) {
    emit(currentToken)
  }
}

tokenizer('10+20')
console.log(tokens)

/**
 * tokens: [
    { type: 'Numeric', value: '10' },
    { type: 'Punctuator', value: '+' },
    { type: 'Numeric', value: '20' }
  ]
 */
