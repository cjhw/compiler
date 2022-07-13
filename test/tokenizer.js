let esprima = require('esprima')
let estraverse = require('estraverse-fb')
let sourceCode = `<h1 id="title"><span>hello</span>world</h1>`
let ast = esprima.parseModule(sourceCode, { jsx: true, tokens: true })

console.log(ast)

// 1.把源代码分词，得到一个token的数组
// 2.把token数组转化成抽象语法树
{
  /* <h1 id="title"><span>hello</span>world</h1> */
}
// Module {
//   type: 'Program',
//   body: [
//     ExpressionStatement {
//       type: 'ExpressionStatement',
//       expression: [JSXElement]
//     }
//   ],
//   sourceType: 'module',
//   tokens: [
//     { type: 'Punctuator', value: '<' },
//     { type: 'JSXIdentifier', value: 'h1' },
//     { type: 'JSXIdentifier', value: 'id' },
//     { type: 'Punctuator', value: '=' },
//     { type: 'String', value: '"title"' },
//     { type: 'Punctuator', value: '>' },
//     { type: 'Punctuator', value: '<' },
//     { type: 'JSXIdentifier', value: 'span' },
//     { type: 'Punctuator', value: '>' },
//     { type: 'JSXText', value: 'hello' },
//     { type: 'Punctuator', value: '<' },
//     { type: 'Punctuator', value: '/' },
//     { type: 'JSXIdentifier', value: 'span' },
//     { type: 'Punctuator', value: '>' },
//     { type: 'JSXText', value: 'world' },
//     { type: 'Punctuator', value: '<' },
//     { type: 'Punctuator', value: '/' },
//     { type: 'JSXIdentifier', value: 'h1' },
//     { type: 'Punctuator', value: '>' }
//   ]
// }

// [Done] exited with code=0 in 0.111 seconds

// [Running] node "c:\轮子\compiler\src\tokenizer.js"
// Module {
//   type: 'Program',
//   body: [
//     ExpressionStatement {
//       type: 'ExpressionStatement',
//       expression: [JSXElement]
//     }
//   ],
//   sourceType: 'module',
//   tokens: [
//     { type: 'Punctuator', value: '<' },
//     { type: 'JSXIdentifier', value: 'h1' },
//     { type: 'JSXIdentifier', value: 'id' },
//     { type: 'Punctuator', value: '=' },
//     { type: 'String', value: '"title"' },
//     { type: 'Punctuator', value: '>' },
//     { type: 'Punctuator', value: '<' },
//     { type: 'JSXIdentifier', value: 'span' },
//     { type: 'Punctuator', value: '>' },
//     { type: 'JSXText', value: 'hello' },
//     { type: 'Punctuator', value: '<' },
//     { type: 'Punctuator', value: '/' },
//     { type: 'JSXIdentifier', value: 'span' },
//     { type: 'Punctuator', value: '>' },
//     { type: 'JSXText', value: 'world' },
//     { type: 'Punctuator', value: '<' },
//     { type: 'Punctuator', value: '/' },
//     { type: 'JSXIdentifier', value: 'h1' },
//     { type: 'Punctuator', value: '>' }
//   ]
// }

// 遍历语法树 深度优先
let ident = 0
function padding() {
  return '  '.repeat(ident)
}

// visitor访问者 访问器
estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + '进入')
    ident += 2
  },
  leave(node) {
    ident -= 2
    console.log(padding() + node.type + '离开')
  },
})

// Program进入
//     ExpressionStatement进入
//         JSXElement进入
//             JSXOpeningElement进入
//                 JSXIdentifier进入
//                 JSXIdentifier离开
//                 JSXAttribute进入
//                     JSXIdentifier进入
//                     JSXIdentifier离开
//                     Literal进入
//                     Literal离开
//                 JSXAttribute离开
//             JSXOpeningElement离开
//             JSXClosingElement进入
//                 JSXIdentifier进入
//                 JSXIdentifier离开
//             JSXClosingElement离开
//             JSXElement进入
//                 JSXOpeningElement进入
//                     JSXIdentifier进入
//                     JSXIdentifier离开
//                 JSXOpeningElement离开
//                 JSXClosingElement进入
//                     JSXIdentifier进入
//                     JSXIdentifier离开
//                 JSXClosingElement离开
//                 JSXText进入
//                 JSXText离开
//             JSXElement离开
//             JSXText进入
//             JSXText离开
//         JSXElement离开
//     ExpressionStatement离开
// Program离开
