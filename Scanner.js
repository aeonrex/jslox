const Lox = require('./Lox');
const Token = require('./Token');
const TokenType = require('./TokenType');

class Scanner {
  static #keywords;
  static {
    this.#keywords = new Map();
    this.#keywords.set('and', TokenType.AND);
    this.#keywords.set('class', TokenType.CLASS);
    this.#keywords.set('else', TokenType.ELSE);
    this.#keywords.set('false', TokenType.FALSE);
    this.#keywords.set('fun', TokenType.FUN);
    this.#keywords.set('for', TokenType.FOR);
    this.#keywords.set('if', TokenType.IF);
    this.#keywords.set('nil', TokenType.NIL);
    this.#keywords.set('or', TokenType.OR);
    this.#keywords.set('print', TokenType.PRINT);
    this.#keywords.set('return', TokenType.RETURN);
    this.#keywords.set('super', TokenType.SUPER);
    this.#keywords.set('this', TokenType.THIS);
    this.#keywords.set('true', TokenType.TRUE);
    this.#keywords.set('var', TokenType.VAR);
    this.#keywords.set('while', TokenType.WHILE);
  }

  #source;
  #tokens = [];

  #start = 0;
  #current = 0;
  #line = 1;

  constructor(source) {
    this.#source = source;
  }

  scanTokens() {
    while (!this.#isAtEnd()) {
      this.#start = this.#current;
      this.#scanTokens();
    }
    return this.#tokens;
  }

  #scanTokens() {
    let c = this.#advance();
    switch (c) {
      case '(':
        this.#addToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        this.#addToken(TokenType.RIGHT_PAREN);
        break;
      case '{':
        this.#addToken(TokenType.LEFT_BRACE);
        break;
      case '}':
        this.#addToken(TokenType.RIGHT_BRACE);
        break;
      case ',':
        this.#addToken(TokenType.COMMA);
        break;
      case '.':
        this.#addToken(TokenType.DOT);
        break;
      case '-':
        this.#addToken(TokenType.MINUS);
        break;
      case '+':
        this.#addToken(TokenType.PLUS);
        break;
      case ';':
        this.#addToken(TokenType.SEMICOLON);
        break;

      case '*':
        this.#addToken(TokenType.STAR);
        break;

      case '!':
        this.#addToken(
          this.#match('=') ? TokenType.BANG_EQUAL : TokenType.BANG
        );
        break;
      case '=':
        this.#addToken(
          this.#match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );
        break;
      case '<':
        this.#addToken(
          this.#match('=') ? TokenType.LESS_EQUAL : TokenType.LESS
        );
        break;
      case '>':
        this.#addToken(
          this.#match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;

      case '/':
        if (this.#match('/')) {
          while (this.#peek() !== '\n' && !this.#isAtEnd()) this.#advance();
        } else {
          this.#addToken(TokenType.SLASH);
        }
        break;

      case ' ':
      case '\r':
      case '\t':
        break;
      case '\n':
        this.#line++;
        break;

      case '"':
        this.#string();
        break;

      default:
        if (this.#isDigit(c)) {
          this.#number();
        } else if (this.#isAlpha(c)) {
          this.#identifier();
        } else {
          Lox.error(this.#line, 'Unexpected character.');
        }
        break;
    }
  }

  #identifier() {
    while (this.#isAlphaNumeric(this.#peek())) this.#advance();

    let text = this.#source.substring(this.#start, this.#current);
    let type = Scanner.#keywords.get(text);
    type = type || TokenType.IDENTIFIER;
    this.#addToken(type);
  }

  #number() {
    while (this.#isDigit(this.#peek())) this.#advance();

    if (this.#peek() === '.' && this.#isDigit(this.#peekNext())) {
      // consume '.'
      this.#advance();

      while (this.#isDigit(this.#peek())) this.#advance();
    }

    this.#addToken(
      TokenType.NUMBER,
      parseFloat(this.#source.substring(this.#start, this.#current))
    );
  }

  #string() {
    while (this.#peek() !== '"' && !this.#isAtEnd()) {
      if (this.#peek() === '\n') this.#line++;
      this.#advance();
    }

    if (this.#isAtEnd()) {
      Lox.error(this.#line, 'Unterminated string.');
      return;
    }

    this.#advance();
    let value = this.#source.substring(this.#start + 1, this.#current - 1);
    this.#addToken(TokenType.STRING, value);
  }

  #isAtEnd() {
    return this.#current >= this.#source.length;
  }

  #advance() {
    return this.#source.charAt(this.#current++);
  }

  #addToken(type, literal) {
    let text = this.#source.substring(this.#start, this.#current);
    this.#tokens.push(new Token(type, text, literal, this.#line));
  }

  #match(expected) {
    if (this.#isAtEnd()) return false;
    if (this.#source.charAt(this.#current) !== expected) return false;

    this.#current++;
    return true;
  }

  #peek() {
    if (this.#isAtEnd()) return '\0';
    return this.#source.charAt(this.#current);
  }

  #peekNext() {
    if (this.#current + 1 >= this.#source.length) return '\0';
    return this.#source.charAt(this.#current + 1);
  }

  #isAlpha(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
  }

  #isDigit(char) {
    return char >= '0' && char <= '9';
  }

  #isAlphaNumeric(c) {
    return this.#isAlpha(c) || this.#isDigit(c);
  }
}

module.exports = Scanner;
