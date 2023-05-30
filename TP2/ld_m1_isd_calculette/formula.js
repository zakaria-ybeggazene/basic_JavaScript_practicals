/* Représentation des formules */

/** Class commune aux autres types de formules */
class Formula {
  constructor() {
    this.priority = 0;  // Priorité du nœud courant
    this.arity = 0;     // Arité du nœud courant
  };
}

//////////////////////////////////
/** Class Const */
class Const extends Formula {
  constructor(n) {
    super();
    this.priority = 10;
    this.value = n || 0;
  }

  eval() {
    return this.value;
  }
}

///////////////////////////////////
/** Class Binop */
class Binop extends Formula {
  constructor(left, right) {
    super();
    this.left = left || null;
    this.right = right || null;
    this.arity = 2
  }
}

//////////////////////////////////
/** Classe Add (addition) */
class Add extends Binop {
  constructor(left, right) {
    super(left, right);
    this.priority = 3;
  }

  eval() {
    return this.left.eval() + this.right.eval();
  }
}

//////////////////////////////////
/** Classe Sub */
class Sub extends Binop {
  constructor(left, right) {
    super(left, right);
    this.priority = 3;
  }
  eval() {
    return this.left.eval() - this.right.eval();
  }
}

//////////////////////////////////
/** Classe Mul */
class Mul extends Binop {
  constructor(left, right) {
    super(left, right);
    this.priority = 5;
  }
  eval() {
    return this.left.eval() * this.right.eval();
  }
}

//////////////////////////////////
/** Classe Div */
class Div extends Binop {
  constructor(left, right) {
    super(left, right);
    this.priority = 5;
  }
  eval() {
    return this.left.eval() / this.right.eval();
  }
}

//////////////////////////////////
/** Classe Mod */
class Mod extends Binop {
  constructor(left, right) {
    super(left, right);
    this.priority = 5;
  }
  eval() {
    return this.left.eval() % this.right.eval();
  }
}

//Méthode « statique », directement attachée à l'objet Formula, pas
//individuellement à chaque formule.

Formula.parse = function (input) {

  //tableau d'action pour le lexer
  let actions = [

    { re : / EXPRESSION POUR UN '+' /, action : function (s, i, j) { return new Add(); }},
    { re : / EXPRESSION POUR UN '-' /, action : function (s, i, j) { return new Sub(); }},
    { re : / EXPRESSION POUR UN '*' /, action : function (s, i, j) { return new Mul(); }},
    { re : / EXPRESSION POUR UN '%' /, action : function (s, i, j) { return new Mod(); }},
    { re : / EXPRESSION POUR UN '\/' /, action : function (s, i, j) { return new Div(); }},
    { re : / EXPRESSION POUR '(' OU ')' /, action : function (s, i, j) { return s; } },
    { re : / EXPRESSION POUR UN NOMBRE FLOTTANT /,
                                                //Si s est bien une chaîne contenant un flottant
                                                //Alors +(s) convertir automatiquement s en Number
                                                //Sinon, +(s) vaudra NaN
      action : function (s, i, j) { return new Const(+(s)); }
    }
  ];

  //Création d'un nouveau lexer
  let lexer = new Lexer(actions);
  //Obtention d'un tableau de jetons.
  //Un jeton est soit un objet dont le type est une sous-classe de Formula
  //soit la chaîne "(", soit la chaîne ")"

  let tokens = lexer.scan(input);


  //La sortie et la pile, comme dans l'algorithme de Dijkstra
  let output_stack = [];
  let op_stack = [];

  //Monkey patching : on ajoute une méthode peek sur l'objet stack qui permet
  //de récupérer le sommet sans le dépiler
  op_stack.peek = function () {
    return this[this.length - 1];
  };

  //Monkey patching : on ajoute une méthode reduce sur l'objet
  //output. Lorsque L'on ajoute un Binop dans la
  //sortie, alors la méthode reduce dépile automatiquement les 2
  //formules en sommet de pile et les place comme fils du nœud
  //ajouté.  Lève une exception si la pile ne dispose pas d'assez de
  //valeurs.
  // Par exemple: une pile contenant [ Const(3), Const(2) ] sur laquelle
  // On fait reduce(Add()) devient  [ Add(Const(3), Const(2))]

  output_stack.reduce = function (op) {
    if (op instanceof Binop) {
      if (this.length < 2) {
        throw "Not enough arguments";
      }
      let right = this.pop();
      let left = this.pop();
      op.left = left;
      op.right = right;
      this.push(op);
    } else {
      this.push(op);
    }
  };


  //Implémenter le pseudo-code se trouvant ici :
  /*
   https://en.wikipedia.org/wiki/Shunting-yard_algorithm#The_algorithm_in_detail

   Simplifications : - tous les opérateurs sont associatifs à gauche
                     - il n'y a pas d'appels de fonction
  */

  //while there are tokens to be read:
  for (let i = 0; i < tokens.length; i++) {

    //read a token
    let token = tokens[i];

    //if the token is a number
    if (token instanceof Const) {
      //push it to the output queue
      output_stack.push(token);

          //if the token is an operator
    } else if (token instanceof Binop) {

      let op;
      // while the stack is not empty and :
      //  the top of the stack is an operator with greater or equal precedence
      while (op_stack.length > 0 && (op = op_stack.peek()) instanceof Binop &&
             op.priority >= token.priority) {
        //pop the operator from the stack and reduce it to the output
          output_stack.reduce(op_stack.pop());
      }
      //push the token on the operator stack
      op_stack.push(token);

      //if the token is a left bracket
    } else if (token === "(") {
      //push it on the operator stack
      op_stack.push(token);

      //if the token is a right bracket
    } else if (token === ")") {

      //while the top of the operator stack is not a left bracket
      while(op_stack.length > 0 && op_stack.peek() !== "(") {
        //pop the top of the operator stack and reduce it to the output
        output_stack.reduce(op_stack.pop());
      };
      // if we found a left bracket, pop it
      if (op_stack.peek() === "(")
        op_stack.pop();
      else //otherwise throw an error
       throw "Mismatched parenthesis";
    }
  }

  // while there are still operator token on the stack
  while(op_stack.length > 0) {
    // if the top of the stack is an operator, pop it and reduce it to output
    if (op_stack.peek() instanceof Binop)
      output_stack.reduce(op_stack.pop());
    else //otherwise its a left bracket, report an error
      throw "Mismatched parenthesis";
  };

  // if the stack does not have size 1 at the end, there is an error
  if (output_stack.length !== 1) {
    throw "Syntax error, missing operator";
  } else {
    return output_stack[0];
  }
};
