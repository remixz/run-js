;(function bundleError (template) {
    if (typeof document === 'undefined') {
      return
    } else if (!document.body) {
      document.addEventListener('DOMContentLoaded', print)
    } else {
      print()
    }
    function print () {
      var container = document.createElement('div')
      container.innerHTML = template
      document.body.appendChild(container)
    }
  })("<style>\n  .error {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    font-family: monospace;\n    font-size: 16px;\n    display: flex;\n    align-items: flex-start;\n    justify-content: center;\n    background-color: #ffefef;\n  }\n\n  .error .container {\n    max-width: 80%;\n    padding-top: 50px;\n  }\n\n  .error .container pre {\n    width: 100%;\n    word-wrap: break-word;\n    background-color: #000000;\n    color: #ffffff;\n    padding: 10px;\n  }\n</style>\n\n<div class=\"error\">\n  <div class=\"container\">\n    <h1> SyntaxError </h1>\n\n    <pre>/Users/zach/Documents/github/remixz/run-js/test/scenarios/bundle-error/input/foo.js: Unterminated string constant (1:10) while parsing file: /Users/zach/Documents/github/remixz/run-js/test/scenarios/bundle-error/input/foo.js\n\n> 1 | var foo = 'bar\n    |           ^\n  2 | </pre>\n  </div>\n</div>\n")
