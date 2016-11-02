
var tokenize = function(code)
{
        return code.replace(/\(/g,' ( ').replace(/\)/g,' ) ').trim().split(/\s+/);
}

var parse = function(code)
{
        var token_list = tokenize(code);
        return read_token_list(token_list);
}


var read_token_list = function(token_list,env)
{
        token = token_list.shift();
        if(token == "(") {
                var L= [];
                while(token_list[0] != ")"){
                        L.push(read_token_list(token_list))
                        }
                token_list.shift();
                return L;
        }
        else if(token == ")"){
                console.log("unexpected )");
        }
        else{
               return atom(token);
        }
   
}                

var atom = function(token)
{
         if (isNaN(token)){
                return token;
         }
         else{
                return parseFloat(token);
         }
}

var env_ = function()
{       
        env = {'+': function(a, b){ return a+b;},
               '-': function(a, b){return a-b;},
               '*': function(a, b){return a*b;},
               '/': function(a, b){return a/b;},
               '>': function(a, b){return a>b;},
               '<': function(a, b){return a<b;},
              '>=': function(a, b){return a>=b;},
              '==': function(a, b){return a==b;},
             'not': function(a){return !a;},
          'length': function(a){return a.length; },
             'abs': function(a){return Math.abs(a)},
               '%': function(a,b){return a%b;},
          'equal?': function(a,b){return a==b;},
             'eq?': function(a,b){return a==b;},
             'not': function(a){return !a;},
          'length': function(a) {return a.length;},
            'cons': function(a,b){return [a].concat(b);},
             'car': function(a){return(a.length !==0) ? a[0] : null;},
             'cdr': function(a){return(a.length>1) ? a.slice(1) : null;},
          'append': function(a,b){return a.concat(b);},
            'list': function(){return Array.prototype.slice.call(arguments);},
           'list?': function (a){return(a instanceof Array);},
           'null?': function (a){return(a.length == 0);},
         'symbol?': function(a){return(typeof a == 'string');},

               };
        return env;

}

var global_env = env_();

var eval = function(x, env)
{       
   //  console.log(x);      
        var env = env || global_env;
        if (typeof x === 'string') {
             //  console.log(env);
              //  console.log(env[x]);
                return env[x];
        }
        else if(typeof x == "number") {
                return x;
        }
        else if(x[0] == "define"){
                var var_ = x[1];
                var exp = x[2];
                env[var_] = eval(exp, env);
        }
        else if(x[0] == "if"){
                var test = x[1];
                var conseq = x[2];
                var altr = x[3];
                if(eval(test, env)){
                        return eval(conseq, env);
                }
                else {
                        return eval(altr, env);
                 }
        }
        else if (x[0]==="begin"){
                var val;
                for (var i=1;i<x.length;i+=1){
                        val=eval(x[i], env);
                }
                return val;       
        }
        else if (x[0] === 'quote'){
                return x[1];
        }
        else{  
            //   console.log(x); 
               var  process = eval(x[0], env);
             //   console.log(eval(x[1]));
            //    console.log(eval(x[2]));
                return process(eval(x[1],env), eval(x[2]), env);
            
        }
      console.log(env);   
}


        
var program = "(define r 10)"
l = parse(program);
console.log(l);
//eval(l);
console.log(eval(l));  















  



















