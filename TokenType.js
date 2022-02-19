const TokenTypes = (module.exports = {
  // Single-char tokens
  LEFT_PAREN: Symbol('LEFT_PAREN'),
  RIGHT_PAREN: Symbol('RIGHT_PAREN'),
  LEFT_BRACE: Symbol('LEFT_BRACE'),
  RIGHT_BRACE: Symbol('RIGHT_BRACE'),
  COMMA: Symbol('COMMA'),
  DOT: Symbol('DOT'),
  MINUS: Symbol('MINUS'),
  PLUS: Symbol('PLUS'),
  SEMICOLON: Symbol('SEMICOLON'),
  SLASH: Symbol('SLASH'),
  STAR: Symbol('STAR'),
  // One of two char tokens
  BANG: Symbol('BANG'),
  BANG_EQUAL: Symbol('BANG_EQUAL'),
  EQUAL: Symbol('EQUAL'),
  EQUAL_EQUAL: Symbol('EQUAL_EQUAL'),
  GREATER: Symbol('GREATER'),
  GREATER_EQUAL: Symbol('GREATER_EQUAL'),
  LESS: Symbol('LESS'),
  LESS_EQUAL: Symbol('LESS_EQUAL'),
  // Literals
  IDENTIFIER: Symbol('IDENTIFIER'),
  STRING: Symbol('STRING'),
  NUMBER: Symbol('NUMBER'),
  // Keywords
  ...symbolfy(
    'AND',
    'CLASS',
    'ELSE',
    'FALSE',
    'FUN',
    'FOR',
    'IF',
    'NIL',
    'OR',
    'PRINT',
    'RETURN',
    'SUPER',
    'THIS',
    'TRUE',
    'VAR',
    'WHILE'
  ),
  ...symbolfy('EOF')
});

function symbolfy(...tokens) {
  return tokens.reduce((obj, field) => {
    obj[field] = Symbol(field);
    return obj;
  }, {});
}
