
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
    


var env_ = function(d)
{
        var  env = {};
        var  outer = d.outer || {};
        if(d.parms.length != 0){
                for(var i = 0; i < d.parms.length; i += 1){
                        env[d.parms[i]] = d.args[i];
                }
        }
        env.find = function (var_){
                if(env.hasOwnProperty(var_)){
                        return env;
                }            
                else{
                        return outer.find(var_)
                }
        }
        return env
}

var adding_to_global_dict = function(env)
{
        env['+'] = function(a,b) {return a + b};
        env['-'] = function (a, b) {return a - b};
        env['*'] = function (a, b) {return a * b};
        env['/'] = function (a, b) {return a / b};
        env['>'] = function (a, b) {return a > b};
        env['<'] = function (a, b) {return a < b};
        env['>='] = function (a, b) {return a >= b};
        env['<='] = function (a, b) {return a <= b};
        env['=='] = function (a, b) {return a == b};
        env['not'] = function(a){return !a;};
        env['pi'] = 3.14159;
        env['length'] = function(a){return a.length; };
        env['abs'] = function(a){return Math.abs(a)};
        env['%'] = function(a,b){return a%b;};
        env['equal?'] = function(a,b){return a==b;};
        env['eq?'] = function(a,b){return a==b;};
        env['not'] = function(a){return !a;};
        env['length'] = function(a) {return a.length;};
        env['cons'] = function(a,b){return [a].concat(b);};
        env['car'] = function(a){return(a.length !==0) ? a[0] : null;};
        env['cdr'] = function(a){return(a.length>1) ? a.slice(1) : null;};
        env['append'] = function(a,b){return a.concat(b);};
        env['list'] = function()
                        {
                                var res = [];
                                for(var i = 0; i< arguments.length;i++){
                                        res.push(arguments[i])
                                }
                                return res
                        }
        env['list?'] = function (a){return(a instanceof Array);};
        env['null?'] = function (a){return(a.length == 0);};
        env['symbol?'] = function(a){return(typeof a == 'string');};

             return env;
}

var global_env = adding_to_global_dict(env_({parms: [], args: []}));

var eval = function(x, env) 
{
        env = env || global_env;
        if(typeof x == 'string'){
                return env.find(x)[x];
        }
        else if(typeof x == 'number'){
                return x;
        }
        else if(x[0] == 'quote'){
                return x[1];
        }
        else if(x[0] == 'if'){
                var test = x[1];
                var conseq = x[2];
                var alt = x[3];
                if(eval(test, env)){
                        return eval(conseq, env);
                }
                else{
                        return eval(alt, env);
                }
        }
        else if(x[0] == 'set!'){
                env.find(x[1])[x[1]] = eval(x[2], env);
        } 
        else if(x[0] == 'define'){
                var var_ = x[1];
                var exp = x[2];
                env[var_] = eval(exp, env);
                return
        }
        else if(x[0] == 'lambda'){
                var vars = x[1];
                var exp = x[2];
               // console.log(vars);
               // console.log(exp);
                return function(){
                        return eval(exp, env_({parms: vars, args: arguments, outer: env }));
                }
        } 
        else if (x[0] == 'begin'){
                var val;
                var i;
                for(i=1; i < x.length; i += 1){
                        val = eval(x[i], env);
                }
                return val;
        } 
        else{
                var exps = [];
                var j;
                for (j = 0; j < x.length; j += 1) {
                        exps[j] = eval(x[j], env);
                }
                var proc = exps.shift();
                return proc.apply(env, exps);
        }
}

var repl = function(){
        console.log("LISP REPL in Nodejs");
        var stdin = process.stdin;
        var stdout = process.stdout;
        stdin.resume();
        stdout.write(">>>");
        stdin.on('data',function(data){
                data = data.toString().trim();
                if(data == undefined){
                        stdin.write('>>>');
                }
                var result = eval(parse(data))
                if (result != undefined) {
                        stdout.write(result+'\n>>>');
                }
                else {
                        stdout.write('>>>');
                }
        })
}

repl();


