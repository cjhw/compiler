const { tokenizer } = require('./tokenizer')
const tokenTypes = require('./tokenTypes')
const nodeTypes = require('./nodeTypes')

function parser(sourceCode) {
  let tokens = tokenizer(sourceCode)
  let pos = 0
  function walk(parent) {
    let token = tokens[pos]
    let nextToken = tokens[pos + 1]
    if (
      token.type === tokenTypes.LeftPunctuator &&
      nextToken.type === tokenTypes.JSXIdentifier
    ) {
      //JSXElement
      let node = {
        type: nodeTypes.JSXElement,
        openingElement: null,
        closingElement: null,
        children: [],
      }
      //第一步 给开始元素赋值
      token = tokens[++pos] //h1
      node.openingElement = {
        type: nodeTypes.JSXOpeningElement,
        name: {
          type: nodeTypes.JSXIdentifier,
          name: token.value, //h1
        },
        attributes: [],
      }
      token = tokens[++pos]
      while (token.type === tokenTypes.AttributeKey) {
        node.openingElement.attributes.push(walk())
        token = tokens[pos]
      }

      //pos指向 <h1 id="title" name="caijianhao"><span>hello</span>world</h1>的第一个 >
      token = tokens[++pos] //直接跳过 > 取 <
      nextToken = tokens[pos + 1]
      //循环元素的子节点
      while (
        token.type != tokenTypes.LeftPunctuator || //文本子节点
        (token.type === tokenTypes.LeftPunctuator &&
          nextToken.type != tokenTypes.BackSlashPunctuator) //元素子节点
      ) {
        node.children.push(walk())
        token = tokens[pos]
        nextToken = tokens[pos + 1]
      }
      node.closingElement = walk(node)
      return node
    } else if (token.type === tokenTypes.AttributeKey) {
      //JSXAttribute
      pos++ //跳过 =
      let nextToken = tokens[++pos] //value
      let node = {
        type: nodeTypes.JSXAttribute,
        name: {
          type: nodeTypes.JSXIdentifier,
          name: token.value, // id
        },
        value: {
          type: nodeTypes.Literal,
          name: nextToken.value,
        },
      }
      pos++
      return node
    } else if (token.type === tokenTypes.JSXText) {
      //JSXText
      pos++
      return {
        type: nodeTypes.JSXText,
        value: token.value,
      }
    } else if (
      parent &&
      token.type === tokenTypes.LeftPunctuator && //<
      nextToken.type === tokenTypes.BackSlashPunctuator // /
    ) {
      pos++ //跳过 <
      pos++ //跳过 /
      token = tokens[pos]
      pos++ // 跳过 span
      pos++ // 跳过 >
      if (parent.openingElement.name.name !== token.value) {
        throw new TypeError(
          `开始标签${parent.openingElement.name.name}和结束标签${token.value}不匹配`
        )
      }
      return {
        type: nodeTypes.JSXClosingElement,
        name: {
          type: nodeTypes.JSXIdentifier,
          name: token.value,
        },
      }
    }
    throw new TypeError('不合法 token')
  }

  let ast = {
    type: nodeTypes.Program,
    body: [
      {
        type: nodeTypes.ExpressionStatement,
        expression: walk(),
      },
    ],
  }
  return ast
}

module.exports = { parser }

// let sourceCode = `<h1 id="title" name="caicai"><span>hello</span>world</h1>`
// console.log(JSON.stringify(parser(sourceCode), null, 2))

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
