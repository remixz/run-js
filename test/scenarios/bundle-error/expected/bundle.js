;(function bundleError () {
    var template = "<style>\n  .error {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    font-family: monospace;\n    font-size: 16px;\n    display: flex;\n    align-items: flex-start;\n    justify-content: center;\n    background-color: #ffefef;\n    z-index: 99999;\n  }\n\n  .error .container {\n    max-width: 80%;\n    padding-top: 50px;\n  }\n\n  .error .container pre {\n    width: 100%;\n    word-wrap: break-word;\n    background-color: #000000;\n    color: #ffffff;\n    padding: 10px;\n  }\n</style>\n\n<div class=\"error\">\n  <div class=\"container\">\n    <h1> SyntaxError </h1>\n\n    <pre>/Users/zach/run-js/foo.js: Unterminated string constant (1:10) while parsing file: /Users/zach/run-js/foo.js\n\n&gt; 1 | <span style=\"color:rgb(0, 187, 187)\">var</span> foo = <span style=\"color:rgb(255, 85, 85)\">&#39;bar</span>\n    |           ^\n  2 | </pre>\n  </div>\n</div>\n"
    if (typeof document === 'undefined') return
    document.addEventListener('DOMContentLoaded', function print () {
      var container = document.createElement('div')
      container.innerHTML = template
      document.body.appendChild(container)
    })
  })()
