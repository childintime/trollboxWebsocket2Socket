/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

net = require('net');
// Keep track of the chat clients
var clients = [];

// Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      //if (client === sender) return;
      client.write(message);
      //client.writeln("\n");
    });
    // Log it to the server output too
   //process.stdout.write(message);
  }
  


// Start a TCP Server
net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 

  // Put this new client in the list
  clients.push(socket);

  // Send a nice welcome message and announce
  //socket.write("Welcome " + socket.name + "\n");
  //broadcast(socket.name + " joined the chat\n", socket);
  console.log(socket.name + " joined the chat.\n");

  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    //broadcast(socket.name + "> " + data, socket);
  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    //broadcast(socket.name + " left the chat.\n");
    console.log(socket.name + " left the chat.\n");
  });
  
  

}).listen(5000);

var autobahn = require('autobahn');
var wsuri = "wss://api.poloniex.com";


var connection = new autobahn.Connection({
  url: wsuri,
  realm: "realm1"
});
 
 //console.log("aa");
connection.onopen = function (session) {
        function marketEvent (args,kwargs) {
                //console.log(args);
        }
        function tickerEvent (args,kwargs) {
                //broadcast(args);
                //console.log(args);
                //console.log(clients.length);
                var msg = args;
                if (clients.length > 0 && msg[0] == "BTC_ETH") {
                    broadcast(JSON.stringify(msg));
                    //clients[0].write("\n");
                }
                //console.log(msg);
        }
        function trollboxEvent (args,kwargs) {
            var keys = ["label", "message_id", "username", "message", "karma"];
            var chatmessage = {};
            for (var i=0; i < args.length; i++){
                chatmessage[keys[i]] = args[i];
            }
            if (args.length == 4) {
                console.log("chybi karma");
                chatmessage[keys[4]] = 0;
            }
            
            var jsonString = JSON.stringify(chatmessage);
            //console.log(args);
            broadcast(jsonString);
        }
        //session.subscribe('BTC_XMR', marketEvent);
        //session.subscribe('ticker', tickerEvent);
        session.subscribe('trollbox', trollboxEvent);
}
 
connection.onclose = function () {
  console.log("Websocket connection closed");
}
                       
connection.open();


