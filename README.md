# The flow middleware

The `flow` middleware is responsible for controlling visual flow in the HTML view.

- name: flow
- middleware dependencies: [attributes](https://github.com/nx-js/attributes-middleware)
- all middleware dependencies: [observe](https://github.com/nx-js/observe-middleware), [attributes](https://github.com/nx-js/attributes-middleware)
- type: component or content middleware
- ignores: text nodes
- [docs](http://nx-framework.com/docs/middlewares/flow)

## Installation

`npm install @nx-js/flow-middleware`

## Usage

```js
const component = require('@nx-js/core')
const observe = require('@nx-js/observe-middleware')
const attributes = require('@nx-js/attributes-middleware')
const flow = require('@nx-js/flow-middleware')

component()
  .useOnContent(observe)
  .useOnContent(attributes)
  .useOnContent(flow)
  .register('flow-comp')
```

```html
<flow-comp @repeat="names" repeat-value="name">
  <p>The name is ${name}</p>
</flow-comp>
```
