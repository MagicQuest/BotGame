const express = require('express');
const app = express();
const serv = require('http').Server(app);
const fs = require("fs");

//time so you can only do certain things at certain times

function print(string) {
    console.log(string);
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function choice(bruh) {
	return bruh[random(0,bruh.length-1)];
}

app.get("/",function(req,res) {
    //print(res);
    //print(req);
    res.sendFile(__dirname + "/stuff/index.html");
});

app.get("/favicon.ico",function(req,res) {
    res.sendFile(__dirname + "/stuff/img/monybag.ico");
});

app.use("/stuff",express.static(__dirname + "/stuff"));

serv.listen(process.env.PORT || 2000);

print("doin' ur mom doin' doin' ur mom");

var io = require("socket.io")(serv,{});
var players = [];
var bruh = 0;
var saveData;
var lastMoneys = {};

const people = ["Jesus","Josuke","Jotaro","Jayden","Dash","Noah","Angel","Bruce","Jacob","Christian","Javario","Giorno","Dio","Joe mama",":trol:","Shroom","Liam"];
const badSentence = ["didn't want to give you a single cent","told you to fuck off","didn't want to give you a single hair (cake)","suggested that you talk to deez nuts","told you to jump off a building at max height","thinks you are pretty sus :sus:","thinks you should go poke a hole in yourself and die :trol:"];
const goodSentence = ["said alright fine","told you to have a bite out of their hair cake","suggested that you shut up and took his money","says you should get a keycard","yelled way-yuh"];

let items = new Map();// = new Map([["bank breaker",bankBreakerCost],["reverse card",10000],["nuke",1000000],["ghost steal",100000],["money back",35000],["money multiply",50000]]);
let pets = new Map();
let jobs = new Map();

function broadcast(sender,name,info) {
    players.forEach((plr)=>{
        if(plr.id != sender.id) {
            plr.socket.emit(name,info);
        }
    });
}

function addItem(name,price,desc,ping,use,custom) {
    items.set(name.split("|")[0],{
        price: price,
        desc: desc,
        displayName: name.split("|")[1] + " - $" + price,
        ping: ping,
        useCallback: use,
        custom: custom,
    });
}
function addPet(name,rarity,baseMutiplier,baseLuck) {
    //ups multipler
    pets.set(name,{
        rarity: rarity,
        multiplier: baseMutiplier,
        luck: baseLuck,
    });
}

function addJob(name,earnings,delay,use) {
    jobs.set(name,{
        earnings: earnings,
        time:delay,
        useCallback: use,
    });
}

function getPlayerObj(name) {
    players.forEach((plr)=>{
        if(plr.name == name) {
            name = plr;
        }
    });
    return name;
}

addJob("youtuber","$1 - $55000 (with luck $55000 - $75000)","4 - 6 minutes",(sender)=>{
    //let sender = players[socket.id];
    if(!saveData[sender.id].jail && !saveData[sender.id].work) {
        let views = random(1,55000);
        let text;
        let money;
        if(random(1,saveData[sender.id].luck) == 1) {
            views = random(55000,75000);
            money = Math.floor(views*.18)//*userData[person.id].mul;
            text = "You got a crazy amount of views: " + views + " and got "+money+" dollars "+sender.name+(saveData[sender.id].mul != 1 ? "&+"+(money*saveData[sender.id].mul-money)+"from your multiplier" : "");
            money = money*saveData[sender.id].mul;
        }else {
            money = Math.floor(views*.18)//*userData[person.id].mul;
            text = "You got " + views + " views and "+money+" dollars "+sender.name+(saveData[sender.id].mul != 1 ? "&+"+(money*saveData[sender.id].mul-money)+"from your multiplier" : "");
            money = money*saveData[sender.id].mul;
        }
        
        //channel.send(embedGreen(text,"epic👌"));
        //setMoney(person,getMoney(person)+money);
        //waitToWork(person,time,channel);
        saveData[sender.id].money += money;
        saveData[sender.id].work = Date.now()/1000+(random(4,6)*60);

        io.emit("chat",`${sender.name} made a youtube video and made $${money} with ${views} views`);
        sender.socket.emit("do",`Work|As a youtuber ${text}|[Success]|${money} dollars`);
    }
});

addItem("reverse card|🃏Reverse card🃏",10000,"use this card when you have gotten robbed to steal money from the stealer (Ex: !Q buy reverse card)",false,(sender)=>{
    //let sender = players[socket.id];
    //console.log(sender);
    //return;
    if(saveData[sender.id].stealer) {
        let stealer = saveData[sender.id].stealer;
        console.log(stealer);
        saveData[stealer.id].stealer = stealer;
        //saveData[stealer.name].stealer.person = sender;
        saveData[sender.id].money += stealer.money;

        if(saveData[stealer.id].money != 0) {
            saveData[stealer.id].money -= stealer.money;
            //            setMoney(saveData[sender.name].stealer.person,getMoney(saveData[sender.name].stealer.person)-saveData[sender.name].stealer.money)
        }else {
            saveData[stealer.id].bankMoney -= stealer.money;
            //setBankMoney(stealer.person,getBankMoney(stealer.person)-stealer.money);
        }
        
        delete saveData[sender.id].stealer;
        saveData[sender.id].inventory.reversecard -= 1;
        //removeReverseCard(sender);
        //message.channel.send("you have successfully used the reverse card");
        sender.socket.emit("do",`Use Item|Successfully used the reverse card on ${stealer.name}|[Success]|${stealer.money} dollars`);
        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> is using a reverse card on ${stealer.name}!`);
        //setMoney(saveData[saveData[sender.id].stealer.player.id].,getMoney(sender)+saveData[sender.id].stealer.money);
    }else {
        /*if(saveData[sender.id].nukedMoney) {
            for(var player in saveData) {
                if(!saveData[player].name) {
                    return;
                }
                if(player != saveData.nuke) {
                    saveData[player].money += saveData[player].nukedMoney.money;
                    saveData[player].bankMoney += saveData[player].nukedMoney.bankMoney;
                    saveData[player].inventory = saveData[player].nukedMoney.inventory;
                    delete saveData[player].nukedMoney;
                }else {
                    saveData[player].money = 0;
                    saveData[player].bankMoney = 0;
                    saveData[player].inventory = {};
                }
                //console.log(saveData[player].name);
            }
            message.channel.send("you have successfully used the reverse card");
        }else {*/
            //message.channel.send("nobody has stolen from you or your time to use the card has run out");
            //socket.broadcast.emit("deez");
            //socket.emit("usedFail","nobody has stolen from you or your time to use the card has run out");
        //}
    }
},false);
addItem("ghost steal|🏃‍♂️GhostSteal🏃‍♂️",100000,"you can steal from anybody in 15 seconds (Ex: !Q buy ghost steal)",false,(sender)=>{
    //let sender = players[socket.id];
    saveData[sender.id].inventory.ghoststeal -= 1;
    saveData[sender.id].ghostSteal = (Date.now()/1000)+15000
    //saveData[sender.id].ghostSteal = true;
    //message.channel.send("you have successfully used the ghost steal");
    io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> is using a ghost steal!`);
},false);
addItem("bank breaker|🔨BankBreaker🔨",250000,"for 15 seconds you can break open somebody's bank and everybody can steal from them (Ex: !Q buy bank breaker)",true,(sender,person)=>{
    //let sender = players[data.socket.id];
    //let person = data.person;
    saveData[sender.id].inventory.bankbreaker -= 1;
    saveData[person.id].bankBreaker = (Date.now()/1000)+15000;
    //saveData[person.id].bankbreaker = true;
    //message.channel.send(`you have successfully used the bank breaker on ${person.username}`);
    io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> is using a bank breaker on ${person.name}!`);
},false);
addItem("money back|💵MoneyBack💵",35000,"you can use this one to get your money back when you lost a gamble (Ex: !Q buy money back)",false,(sender)=>{
    //let sender = players[socket.id];
    if(saveData[sender.id].gambledMoney) {
        saveData[sender.id].money += saveData[sender.id].gambledMoney;
        //removeMoneyBack(sender);
        saveData[sender.id].inventory.moneyback -= 1;
        sender.socket.emit("do",`Use Item|You used the money back|[Success]|${saveData[sender.id].gambledMoney} dollars`);
        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> used a money back and got $${saveData[sender.id].gambledMoney} back!`);
        delete saveData[sender.id].gambledMoney;
        //message.channel.send("you have successfully used the money back");
    }//else {
        //socket.emit("usedFail","you haven't gambled any money yet");
    //}
    /*else if(saveData[sender.id].nukedMoney) {
        setMoney(sender,saveData[sender.id].nukedMoney.money);
        setBankMoney(sender,saveData[sender.id].nukedMoney.bankMoney);
        removeMoneyBack(sender);
        message.channel.send("you have successfully used the money back");
    }*/
},false);
addItem("money multiply|💸MoneyMultiply💸",50000,"this multiplies your money for 5 minutes including money from gambling and money from jobs (Ex: !Q buy money multiply)",false,(data)=>{
    let loop = data.amount;
    let sender = players[data.socket.id];
    let used = false;
    if(loop) {
        if(loop == "max") {
            loop = saveData[sender.name].inventory.moneymultiply.amount;
        }else {
            loop = Number(loop);
        }
    }else {
        loop = 1;
    }
    //console.log(loop);
   // console.log(item);
    for(let i = 0;i < loop;i++) {
        //if(!saveData[sender.id].inventory.moneymultiply) saveData[sender.id].inventory.moneymultiply = {};
        //if(!saveData[sender.id].inventory.moneymultiply.amount) {
        //} else {
            if(saveData[sender.name].inventory.moneymultiply != 0) {
                used = true;
                saveData[sender.name].inventory.moneymultiply -= 1;
                //removeMoneyMultiplier(sender);
                //saveData[sender.name].multiplyTime 
                //waitToNotMultiply(sender,message.channel);
                saveData[sender.name].mul = .5 + saveData[sender.name].mul;
            }
        //} 
    }
    if(used) {
        socket.emit("used","you have used your money multiplys");
        //message.channel.send("you have successfully used your money multiplys");
    }

},true);
/*addItem("nuke|💣NUKE💣",1000000,"this will just completely destroy everthing and get rid of everything (Ex: !Q buy nuke)",false,(message)=>{
    let sender = message.author;
    if(!message.channel.name) {
        message.channel.send("bruh use this in a normal server");
        return;
    }
    removeNuke(sender);
    for(var player in saveData) {
        if(!saveData[player].name) {
            return;
        }
        //console.log(saveData[player].name);
        saveData[player].nukedMoney = {};
        saveData[player].nukedMoney.money = saveData[player].money;
        saveData[player].nukedMoney.bankMoney = saveData[player].bankMoney;
        saveData[player].nukedMoney.inventory = saveData[player].inventory;
        saveData[player].money = 0;
        saveData[player].bankMoney = 0;
        saveData[player].inventory = {};
    }
   // saveData[sender.id].nukeUser = true;
    saveData.nuke = sender.id;
    setTimeout(()=>{
        if(saveData.nuke) {
            delete saveData.nuke;
            for(var player in saveData) {
                if(!saveData[player].name) {
                    return;
                }
                //console.log(saveData[player].name);
                delete saveData[player].nukedMoney;
            }
            message.channel.send("your time to use a reverse card is over");    
        }
    },(5*60)*1000)
    message.channel.send("you have successfully used the nuke and now total destruction has begun");
},false);*/
addItem("lottery ticket|🎰LotteryTicket🎰",100,"you can enter the lottery but you have a very low chance of winning unless you have lots of tickets (Ex: !Q buy lottery ticket)",false,(socket)=>{
    //let sender = message.author;
    //saveData[sender.id].inventory.lotteryticket.amount -= 1;
    socket.emit("usedFail","bruh you can't use this");
    //message.channel.send("bruh you can't use this");
},false);

function setStats(player) {
    //console.log(saveData[player.id].money);
    if(!saveData[player.id]) saveData[player.id] = {};

    if(saveData[player.id].money == undefined) saveData[player.id].money = 100;
        saveData[player.id].money = Math.floor(saveData[player.id].money);
    if(!saveData[player.id].bankMoney) saveData[player.id].bankMoney = 0;
    if(!saveData[player.id].inventory) saveData[player.id].inventory = {};
        for (let item of items.keys()) {
            let jsonName = item.split(" ").join("");
            if(!saveData[player.id].inventory[jsonName]) saveData[player.id].inventory[jsonName] = 0;
        }
    if(!saveData[player.id].mul) saveData[player.id].mul = 1;
    if(!saveData[player.id].luck) saveData[player.id].luck = 25;
    if(!saveData[player.id].auto) saveData[player.id].auto = false;
}

function did(msg,socket,person,callback) {

    let moneyChanged;
    let sender = players[socket.id];
    console.log(msg);
    //try {
   //     console.log(sender.name);
    //}catch {

   //}
    //console.log(person);
    if(!sender) {
        return;
    }
    //let lastMoneys = {money: saveData[sender.id].money,bankMoney: saveData[sender.id].bankMoney};
    //let lastPersonMoneys;
    //console.log(sender);
    //console.log(person);
    person = getPlayerObj(person);
    if(person && !person.id) {
        person = undefined;
    }else if(person && person.id) {
        lastMoneys[person.id] = saveData[person.id].money+"|"+saveData[person.id].bankMoney;
        //lastPersonMoneys = {money: saveData[person.id].money,bankMoney: saveData[person.id].bankMoney};
    }
    lastMoneys[sender.id] = saveData[sender.id].money+"|"+saveData[sender.id].bankMoney;
    //console.log(person);

    setStats(sender);

    /*if(msg.includes("help")) {// || msg.includes("cmds") || msg.includes("commands")) {
        let page = msg.split(" ")[2];
        //let embed = new Discord.MessageEmbed();
        //embed.setColor("RANDOM");
        //embed.setTitle("Help");
        //embed.setDescription("Commands:");
        page = !page ? 1 : page;
        //    page = 1;
        //}
        if(page == 1) {
            embed.addField("say command","says what you want it too (Ex: !Q say bruh)");
            embed.addField("gamble command","lets you gamble sweet sweet cash (Ex: !Q gamble 100) or you can gamble it all with !Q gamble all");
            embed.addField("coins/wallet command","shows you how many coins you or the person you ping has (Ex: !Q coins)");
            embed.addField("give command",`gives the person specified the amount of coins you specify (Ex: !Q give 100 ${sender.username})`);
            embed.addField("work command","you can work for money! (Ex: !Q work mcdonalds) look at the !Q jobs command to find out more");
            embed.addField("stats command","displays a cool picture that has your stats on it and you can change the background with !Q background and attaching a picture");
            embed.addField("leaderboard command","you can see who has the most money in the chat (Ex: !Q leaderboard)");
            embed.addField("bank leaderboard command","you can see who has the most money in their bank (Ex: !Q bank leaderboard)");
            embed.addField("steal command",`you can steal money from people but you can get caught too! (Ex: !Q steal @${sender.username})`);
        }else if(page == 2) {
            embed.addField("bank command","lets you see the money you have stored inside of your bank (Ex: !Q bank)");
            embed.addField("shop/store command","shows all of the the things you can buy (Ex: !Q shop)");
            embed.addField("buy command","you can buy stuff from the shop (Ex: !Q buy reverse card)");
            embed.addField("use command","uses the item you specify (Ex: !Q use reverse card)");
            embed.addField("poll command",`you can create polls with this command (Ex: !Q poll is ${sender.username} fat)`);
            embed.addField("beg command",`you can beg for money if you are really that poor (Ex: !Q beg)`);
            embed.addField("jobs command",`you can see a list of jobs (Ex: !Q jobs)`);
            embed.addField("sell command",`you can sell the items you bought for full price (Ex: !Q sell nuke)`);
            embed.addField(`auto command`,`this command automatically uses items for you (Ex: !Q auto)`);
            embed.addField(`sex command`,`this command will let you have sex with whoever you ping but they have to accept (Ex: !Q sex @${sender.username}/!Q sex accept)`);
        }else if(page == 3) {
            embed.addField(`make21 command`,`this command will tell you how to get 21 from any number (Ex: !Q make21 42)`);
            embed.addField(`lottery command`,`tells you info about the lottery (Ex: !Q lottery)`);
            embed.addField(`multiplier command`,`tells you your current money multiplier`);
        }
        embed.setFooter(`Page ${page} of 3 (use !Q help/cmds/commands ${Number(page)+1} to get to the next page)`);
        message.channel.send(embed);
    }*/

    /*if(msg.includes("multiplier")) {
        message.channel.send(`${person ? person.username : sender.username }'s multiplier is **${saveData[person ? person.id : sender.id].mul}**`)
    }*/

    /*if(msg.includes( + "say ")) {
        let textToSay = msg.slice(.length+4);
        message.channel.send(textToSay);
        message.delete();
    }*/

    if(msg.includes("poll ")) {
        //let text = msg.slice(.length+5);
        let embed = new Discord.MessageEmbed();
        embed.setTitle(sender.username+"'s Poll");
        embed.setDescription(text);
        embed.setColor("RANDOM");
        message.delete();
        message.channel.send(embed).then(sentMessage=>{
            sentMessage.react("👍");
            sentMessage.react("👎");
        });
    }

    if(msg.includes("shop") || msg.includes("store")) {
        let embed = new Discord.MessageEmbed();
        embed.setColor("GREEN");
        embed.setTitle("Shop");
        embed.setDescription("Items:");
        for (let value of items.values()) {
            embed.addField(value.displayName,value.desc);
        }
        //embed.addField("🃏Reverse card🃏 - $10000","use this card when you have gotten robbed to steal money from the stealer (Ex: !Q buy reverse card)");
        //embed.addField("🏃‍♂️GhostSteal🏃‍♂️ - $100000","you can steal from anybody in 15 seconds (Ex: !Q buy ghost steal)");
        //embed.addField(`🔨BankBreaker🔨 - $${bankBreakerCost}`,"for 15 seconds you can break open somebody's bank and everybody can steal from them (Ex: !Q buy bank breaker)");
        //embed.addField("💵MoneyBack💵 - $35000","you can use this one to get your money back when you lost a gamble (Ex: !Q buy money back)");
        //embed.addField("💸MoneyMultiply💸 - $50000","this multiplies your money for 5 minutes including money from gambling and money from jobs (Ex: !Q buy money multiply)");
        //embed.addField("💣NUKE💣 - $1000000","this will just completely destroy everthing and get rid of everything (Ex: !Q buy nuke)");
        
        //embed.addField("nigmode ok so everybody can steal ferom bank from you :trol;","dawg");
        //embed.addField("🏥CarePackage🏥 - $5000","");
        //embed.addField("🏥SuperCarePackage🏥 - $50000","")
        message.channel.send(embed);
    }   

    if(msg.includes("inventory") || msg.includes("inv")) {
        let embed = new Discord.MessageEmbed();
        
        if(person) {
            if(person.bot) {
                return;
            }
            embed.setTitle("Their Inventory")
            for (let key of items.keys()) {
                let jsonName = key.split(" ").join("");
                embed.addField(key+"s",saveData[person.id].inventory[jsonName] ? saveData[person.id].inventory[jsonName].amount : 0);
            }
            /*embed.addField("reverse cards",getReverseCards(person));
                embed.addField("ghost steals",getGhostSteals(person));
                embed.addField("money back",getMoneyBack(person));
                embed.addField("money multiply",getMoneyMultiply(person));
                embed.addField("nukes",getNukes(person));
                embed.addField("bank breakers",getBankBreakers(person));*/
                
        }else {
            embed.setTitle("Your Inventory")
            for (let key of items.keys()) {
                let jsonName = key.split(" ").join("");
                embed.addField(key+"s",saveData[sender.id].inventory[jsonName] ? saveData[sender.id].inventory[jsonName].amount : 0);
            }
        }
        message.channel.send(embed);
    }

    if(msg.includes("setStat")) {
        //if(sender.id == 306199884699009035) {
            stat = msg.split(" ")[1];
            value = msg.split(" ")[2];
            if(value.charAt(value.length) != 'L') {
                saveData[person.id][stat] = Number(value);
            }else {
                saveData[person.id][stat] = value.slice(0,value.length);
            }
            //message.channel.send(`set ${person.username}'s ${stat} to ${value}`);
        //}else {
        //    message.channel.send(choice(people)+" says to fuck off and stop using forbidden commands");
        //}
    }

    if(msg.includes("use ")) {
        let item = msg.slice(4);
        let amount;
        if(item.split(" ")[3]) {
            amount = item.split(" ")[3];
            item = item.split(" ")[0] + " " + item.split(" ")[1];
        }
        let jsonName;
        //if(!items.get(item)) {
        //    message.channel.send("ok bruh this ain't an item");
        //    return;
        //}
        jsonName = item.split(" ").join("");
        if(items.get(item).ping) {
            if(person) {
                if(items.get(item).custom) {
                    items.get(item).useCallback(sender,person);
                    return;
                }
                //if(!saveData[sender.id].inventory[jsonName]) saveData[sender.id].inventory[jsonName] = {};
                //if(saveData[sender.id].inventory[jsonName].amount) {
                    if(saveData[sender.id].inventory[jsonName] != 0) {
                        items.get(item).useCallback(sender,person);
                    }
                //}//else {
                    //message.channel.send("bruh you have none");
                //}
            }//else {
            //    message.channel.send("for this item to work you need to ping somebody");
            //    return;
            //}
        }else {
            if(items.get(item).custom) {
                items.get(item).useCallback(sender);
                return;
            }
            //if(!saveData[sender.id].inventory[jsonName]) saveData[sender.id].inventory[jsonName] = {};
            //if(saveData[sender.id].inventory[jsonName]) {
                if(saveData[sender.id].inventory[jsonName] != 0) {
                    items.get(item).useCallback(sender);
                }
            //}//else {
            //    message.channel.send("bruh you have none");
            //}
        }
    }
    if(msg.includes("buy ")) {
        let item = msg.slice(4);//msg.split(" ")[2];
        let number = Number(item.split(" ")[2]) || Number(item.split(" ")[1]) || 1;
        if(Number(item.split(" ")[1])) {
            item = item.split(" ")[0];
        }else if(Number(item.split(" ")[2])) {
            item = item.split(" ")[0]+" "+item.split(" ")[1];
        }
        //if(number > 1000000) {
            //message.channel.send("fuck off put a smaller number retard");
        //    return;
        //}
        //console.log(item);
        //console.log(number);
        //if(!items.get(item)) {
        //    message.channel.send("ok bruh this ain't an item");
        //    return;
        //}
        let price = items.get(item).price;
        let jsonName = item.split(" ").join("");
        let failed;
        let i;
        for(i = 0;i < number;i++) {
            let worked = false;
            if(saveData[sender.id].money != 0 && saveData[sender.id].money >= price) {
                saveData[sender.id].money -= price;
                worked = true;
            }else {
                if(saveData[sender.id].bankMoney != 0) {
                    if(saveData[sender.id].bankMoney >= price) {
                        saveData[sender.id].bankMoney -= price;
                        worked = true;
                    }
                }
            }
            if(worked) {
                saveData[sender.id].inventory[jsonName] += 1;
            }else {
                failed = true;
                //message.channel.send("you probably don't have enough money for this");
                break;
            }
        }
        socket.emit(`do`,`Shop|You ${failed ? "could only buy" : "bought"} ${i} ${item}s&Time for a little trolling|[Fail]|-${price*(i)} dollars`);
        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> bought ${i} ${item}s`);
    }
    if(msg.includes("withdraw ")) {
        let amount = msg.split(" ")[1];//msg.split(" ")[3] || msg.split(" ")[2];
        if(amount == "all") {
            let mony = saveData[sender.id].bankMoney;
            saveData[sender.id].money += saveData[sender.id].bankMoney;
            saveData[sender.id].bankMoney = 0;
            //setBankMoney(sender,getBankMoney(sender)+getMoney(sender));
            //setMoney(sender,0);
            //message.channel.send(embedGreen("💰Bank💰","your balance is now "+saveData[sender.id].bankMoney));
            socket.emit('do',`Bank|You withdrew all of your money and your money is now ${saveData[sender.id].money}&Don't spend too much|[Success]|${mony} dollars`);
        }else {
            amount = Number(amount);
            if(amount && amount > 0) {
                if(amount < saveData[sender.id].bankMoney) {
                    saveData[sender.id].money += amount;
                    //setBankMoney(sender,getBankMoney(sender)+amount);
                    saveData[sender.id].bankMoney -= amount;
                    //setMoney(sender,getMoney(sender)-amount);
                    //message.channel.send(embedGreen("💰Bank💰","your balance is now "+saveData[sender.id].bankMoney));
                    socket.emit('do',`Bank|You withdrew ${amount} and your money is now ${saveData[sender.id].money}&Don't spend too much|[Success]|${amount} dollars`);
                }else if(amount == saveData[sender.id].bankMoney) {
                    saveData[sender.id].money += amount;
                    saveData[sender.id].bankMoney = 0;
                    socket.emit('do',`Bank|You withdrew all of your money and your money is now ${saveData[sender.id].money}&Don't spend too much|[Success]|${amount} dollars`);
                }
            }
        }
    }
    if(msg.includes("deposit ")) {
        let amount = msg.split(" ")[1];//msg.split(" ")[3] || msg.split(" ")[2];
        if(amount == "all") {
            let mony = saveData[sender.id].money;
            saveData[sender.id].bankMoney += saveData[sender.id].money;
            saveData[sender.id].money = 0;
            //setBankMoney(sender,getBankMoney(sender)+getMoney(sender));
            //setMoney(sender,0);
            //message.channel.send(embedGreen("💰Bank💰","your balance is now "+saveData[sender.id].bankMoney));
            socket.emit('do',`Bank|You deposited all of your money and your balance is now ${saveData[sender.id].bankMoney}&Saving up for college eh? Good thinkin'|[Success]|${mony} dollars`);
        }else {
            amount = Number(amount);
            if(amount && amount > 0) {
                if(amount < saveData[sender.id].money) {
                    saveData[sender.id].bankMoney += amount;
                    //setBankMoney(sender,getBankMoney(sender)+amount);
                    saveData[sender.id].money -= amount;
                    //setMoney(sender,getMoney(sender)-amount);
                    //message.channel.send(embedGreen("💰Bank💰","your balance is now "+saveData[sender.id].bankMoney));
                    socket.emit('do',`Bank|You deposited ${amount} and your balance is now ${saveData[sender.id].bankMoney}&Saving up for college eh? Good thinkin'|[Success]|${amount} dollars`);
                }else if(amount == saveData[sender.id].money) {
                    saveData[sender.id].bankMoney += amount;
                    saveData[sender.id].money = 0;
                    socket.emit('do',`Bank|You deposited all of your money and your balance is now ${saveData[sender.id].bankMoney}&Saving up for college eh? Good thinkin'|[Success]|${amount} dollars`);
                }
            }
        }
    }
    if(msg.includes("gamble ")) {
        let moneyGambled = msg.split(" ")[1];//msg.slice(.length+7);
        if(saveData[sender.id].money != 0) {
            /*let percent = random(5,100);
            let win = random(1,2);
            //let moneyToGamble = random(1,getMoney(sender));
            if(win == 1) {
                if(random(0,100) > 95) {
                    
                }else {

                }
            }else {

            }*/
            if(moneyGambled == "all") {
                let win = random(1,2);
                if(win == 1) {
                    if(random(0,100) > 95) {
                        let moneyGambled = saveData[sender.id].money*3;
                        let finalWinnings = moneyGambled*saveData[sender.id].mul;
                        saveData[sender.id].money = finalWinnings;
                        //setMoney(sender,saveData[sender.id].money*3*saveData[sender.id].mul)
                        socket.emit('do',`Gamble|You won $${moneyGambled} (and with a random chance it was tripled)${saveData[sender.id].mul != 1 ? `&(+$${finalWinnings - moneyGambled} because of your multiplier)` : "&Lucky lucky lucky!"}|[Success]|${finalWinnings} dollars`);
                        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled all of their money and won $${moneyGambled} (randomly tripled)${saveData[sender.id].mul != 1 ? ` (+$${finalWinnings - moneyGambled} because of their multiplier)` : ""}`);
                        //message.channel.send(embedGreen(`${sender.username} won (and with a random chance it was tripled)`,"you now have "+ saveData[sender.id].money + " coins"));
                    }else {
                        let moneyGambled = saveData[sender.id].money*2;
                        let finalWinnings = moneyGambled*saveData[sender.id].mul;
                        saveData[sender.id].money = finalWinnings;
                        //setMoney(sender,saveData[sender.id].money*3*saveData[sender.id].mul)
                        socket.emit('do',`Gamble|You won $${moneyGambled}${saveData[sender.id].mul != 1 ? `&(+$${finalWinnings - moneyGambled} because of your multiplier)` : ""}|[Success]|${finalWinnings} dollars`);
                        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled all of their money and won $${moneyGambled}${saveData[sender.id].mul != 1 ? ` (+$${finalWinnings - moneyGambled} because of their multiplier)` : ""}`);

                        //saveData[sender.id].money *= 2*saveData[sender.id].mul;
                        //setMoney(sender,saveData[sender.id].money*2*saveData[sender.id].mul)
                        //message.channel.send(embedGreen(`${sender.username} won`,"you now have "+ saveData[sender.id].money + " coins"));
                    }
                    
                }else {
                    saveData[sender.id].gambledMoney = saveData[sender.id].money;
                    saveData[sender.id].money = 0;
                    //setMoney(sender,0);
                    io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> just gambled all their money and lost`);
                    socket.emit('do',`Gamble|you just gambled all of your money and lost&Sometimes we don't get what we want|[Fail]|-${saveData[sender.id].gambledMoney} dollars`);
                    //message.channel.send(embedRed(`${sender.username} lost...`,"welp it seems as though you phucking lose all yo money"));
                    if(saveData[sender.id].auto && saveData[sender.id].inventory.moneyback != 0) {
                        saveData[sender.id].money += saveData[sender.id].gambledMoney;
                        //setMoney(sender,getMoney(sender)+saveData[sender.id].gambledMoney);
                        delete saveData[sender.id].gambledMoney;
                        saveData[sender.id].inventory.moneyback -= 1;
                        if(saveData[sender.id].inventory.moneyback == 1) {
                            socket.emit("embed",`Gambling|warning this is your last money back|Ok`);
                        }
                        socket.emit('do','Auto|automatically used money back|[Success]|');
                    }
                }
            }else if(moneyGambled == "random") {
                let percent = random(5,100);
                let win = random(1,2);
                let moneyToGamble = random(1,saveData[sender.id].money);
                if(win == 1) {
                    if(random(0,100) > 95) {
                        let moneyToWin = (moneyToGamble*percent/50)*3;
                        let finalWinnings = moneyToWin*saveData[sender.id].mul;
                        saveData[sender.id].money += finalWinnings;
                        //setMoney(sender,saveData[sender.id].money+moneyToWin*saveData[sender.id].mul*3);
                        socket.emit('do',`Gamble|You gambled random ($${moneyToGamble}) and won $${moneyToWin} (tripled) by %${percent}${saveData[sender.id].mul != 1 ? `&(+$${finalWinnings - moneyToWin} because of your multiplier)` : "&Lucky lucky lucky!"}|[Success]|${finalWinnings} dollars`);
                        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled random ($${moneyToGamble}) and won $${moneyToWin} (tripled) by %${percent}${saveData[sender.id].mul != 1 ? ` +$${finalWinnings - moneyToWin} because of their multiplier` : ""}`);

                        //message.channel.send(embedGreen(`${sender.username} won $`+finalWinnings+" (randomly tripled)","Percent: %"+percent));
                    }else {
                        let moneyToWin = moneyToGamble*percent/50;
                        let finalWinnings = moneyToWin*saveData[sender.id].mul;
                        saveData[sender.id].money += finalWinnings;
                        //setMoney(sender,saveData[sender.id].money+moneyToWin*saveData[sender.id].mul);
                        //message.channel.send(embedGreen(`${sender.username} won $`+finalWinnings,"Percent: %"+percent));
                        socket.emit('do',`Gamble|You gambled random ($${moneyToGamble}) and won $${moneyToWin} by %${percent}${saveData[sender.id].mul != 1 ? `&(+$${finalWinnings - moneyToWin} because of your multiplier)` : ""}|[Success]|${finalWinnings} dollars`);
                        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled random ($${moneyToGamble}) and won $${moneyToWin} by %${percent}${saveData[sender.id].mul != 1 ? ` +$${finalWinnings - moneyToWin} because of their multiplier` : ""}`);
                    }
                }else {
                    if(moneyToGamble == saveData[sender.id].money) {
                        //saveData[sender.id].gambledMoney = getMoney(sender);
                        saveData[sender.id].gambledMoney = saveData[sender.id].money;
                        saveData[sender.id].money = 0;
                        //setMoney(sender,0);
                        io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> just gambled all their money and lost`);
                        socket.emit('do',`Gamble|you just gambled random which happened to be all of your money and lost&Sometimes we don't get what we want|[Fail]|-${saveData[sender.id].gambledMoney} dollars`);
                        //message.channel.send(embedRed(`${sender.username} lost...`,"welp it seems as though you phucking lose all yo money"));
                    }else {
                        saveData[sender.id].gambledMoney = moneyToGamble;
                        saveData[sender.id].money -= moneyToGamble;
                        //setMoney(sender,saveData[sender.id].money-moneyToGamble);
                        io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> just gambled random (${moneyToGamble}) and lost`);
                        socket.emit('do',`Gamble|you just gambled random (${moneyToGamble}) and lost&Sometimes we don't get what we want|[Fail]|-${saveData[sender.id].gambledMoney} dollars`);
                        //message.channel.send(embedRed(`${sender.username} lost... `+moneyToGamble+" dollars","welp it seems as though you lose a couple dollariereodos"));
                    }
                }
            }else if(moneyGambled == "half") {
                let moneyGambled = saveData[sender.id].money/2;
                let percent = random(5,100);
                let win = random(1,2);
                if(moneyGambled <= saveData[sender.id].money) {
                    if(win == 1) {
                        if(random(0,100) > 95) {
                            let moneyToWin = (moneyGambled*percent/50)*3;
                            let finalWinnings = moneyToWin*saveData[sender.id].mul;
                            saveData[sender.id].money += finalWinnings;
                            //setMoney(sender,saveData[sender.id].money+moneyToWin*saveData[sender.id].mul*3);
                            socket.emit('do',`Gamble|You gambled half ($${moneyGambled}) and won $${moneyToWin} (tripled) by %${percent}${saveData[sender.id].mul != 1 ? `&(+$${finalWinnings - moneyToWin} because of your multiplier)` : "&Lucky lucky lucky!"}|[Success]|${finalWinnings} dollars`);
                            io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled half ($${moneyGambled}) and won $${moneyToWin} (tripled) by %${percent}${saveData[sender.id].mul != 1 ? ` +$${finalWinnings - moneyToWin} because of their multiplier` : ""}`);
                        }else {
                            let moneyToWin = (moneyGambled*percent/50)*2;
                            let finalWinnings = moneyToWin*saveData[sender.id].mul;
                            saveData[sender.id].money += finalWinnings;
                            //setMoney(sender,saveData[sender.id].money+moneyToWin*saveData[sender.id].mul*3);
                            socket.emit("do",`Gamble|You gambled half ($${moneyGambled}) and won $${moneyToWin} by %${percent}${saveData[sender.id].mul != 1 ? `&(+$${finalWinnings - moneyToWin} because of your multiplier)` : ""}|[Success]|${finalWinnings} dollars`);
                            io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled half ($${moneyGambled}) and won $${moneyToWin} by %${percent}${saveData[sender.id].mul != 1 ? ` +$${finalWinnings - moneyToWin} because of their multiplier` : ""}`);
                        }
                    }else {
                        saveData[sender.id].gambledMoney = moneyGambled;
                        saveData[sender.id].money -= moneyGambled;

                        socket.emit("do",`Gamble|you gambled half your money and lost|[Fail]|-${moneyGambled} dollers`);
                        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled half their money ($${moneyGambled}) and lost`);
                        //setMoney(sender,saveData[sender.id].money-moneyGambled);
                        //message.channel.send(embedRed(`${sender.username} lost... `+moneyGambled+" dollars","welp it seems as though you lose a couple dollariereodos"));
                    }
                }
            }else {
                moneyGambled = Number(moneyGambled);
                if(moneyGambled && moneyGambled > 0) {
                    let moneyGambled2 = Math.floor(moneyGambled);
                    let percent = random(5,100);
                    let win = random(1,2);
                    if(moneyGambled2 <= saveData[sender.id].money) {
                        if(win == 1) {
                            if(random(0,100) > 95) {
                                let moneyToWin = (moneyGambled2*percent/50)*3;
                                let finalWinnings = moneyToWin*saveData[sender.id].mul;
                                saveData[sender.id].money += finalWinnings;
                                //setMoney(sender,saveData[sender.id].money+moneyToWin*saveData[sender.id].mul*3);
                                socket.emit('do',`Gamble|You gambled $${moneyGambled2} and won $${moneyToWin} (tripled) by %${percent}${saveData[sender.id].mul != 1 ? `&(+$${finalWinnings - moneyToWin} because of your multiplier)` : "&Lucky lucky lucky!"}|[Success]|${finalWinnings} dollars`);
                                io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled $${moneyGambled2} and won $${moneyToWin} (tripled) by %${percent}${saveData[sender.id].mul != 1 ? ` +$${finalWinnings - moneyToWin} because of their multiplier` : ""}`);
                            }else {
                                let moneyToWin = (moneyGambled2*percent/50)*2;
                                let finalWinnings = moneyToWin*saveData[sender.id].mul;
                                saveData[sender.id].money += finalWinnings;
                                //setMoney(sender,saveData[sender.id].money+moneyToWin*saveData[sender.id].mul*3);
                                socket.emit('do',`Gamble|You gambled $${moneyGambled2} and won $${moneyToWin} by %${percent}${saveData[sender.id].mul != 1 ? `&(+$${finalWinnings - moneyToWin} because of your multiplier)` : ""}|[Success]|${finalWinnings} dollars`);
                                io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled $${moneyGambled2} and won $${moneyToWin} by %${percent}${saveData[sender.id].mul != 1 ? ` +$${finalWinnings - moneyToWin} because of their multiplier` : ""}`);
                            }
                            
                        }else {
                            if(moneyGambled2 == saveData[sender.id].money) {
                                saveData[sender.id].gambledMoney = saveData[sender.id].money;
                                saveData[sender.id].money = 0;

                                io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> just gambled all their money and lost`);
                                socket.emit('do',`Gamble|you just gambled all of your money and lost&Sometimes we don't get what we want|[Fail]|-${saveData[sender.id].gambledMoney} dollars`);

                            }else {
                                saveData[sender.id].gambledMoney = moneyGambled2;
                                saveData[sender.id].money -= moneyGambled2;
                                //setMoney(sender,saveData[sender.id].money-moneyGambled2);
                                io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> gambled $${moneyGambled2} and lost`);
                                socket.emit('do',`Gamble|you just gambled $${moneyGambled2} and lost&Sometimes we don't get what we want|[Fail]|-${saveData[sender.id].gambledMoney} dollars`);
                            }
                        }
                    }
                }
            }
            saveData[sender.id].money = Math.floor(saveData[sender.id].money);
        }//else{
            //message.channel.send(embedRed("Gambling","you don't have any money"));
        //}
    }
    if(msg.includes("steal") && person) {
        //console.log(person);
        if(!saveData[sender.id].jail) {
            if(saveData[sender.id].ghostSteal || saveData[person.id].bankbreaker) {
                let steal = random(0,5);
                let money = random(1,saveData[person.id].bankMoney);
                if(steal != 0) {
                    person.socket.emit("do",`Steal|${sender.name} stole $${money} from you!!!&Fail... epic fail|[Fail]|-${money} dollars`);
                    //person.send("somebody stole "+money+" dollars from you!!!")
                    saveData[person.id].stealer = {};
                    saveData[person.id].stealer.name = sender.name;
                    saveData[person.id].stealer.id = sender.id;
                    //saveData[person.id].stealer.person = sender.id;
                    saveData[person.id].stealer.money = money;
                    saveData[person.id].stealer.time = (Date.now()/1000)+60;
                    //waitToRemoveStealer(person,message.channel);
                    
                    
                    if(saveData[person.id].bankMoney == money) {
                        saveData[sender.id].bankMoney += saveData[person.id];
                        //setBankMoney(sender,getBankMoney(sender)+getBankMoney(person));
                        //setBankMoney(person,0);
                        saveData[person.id].bankMoney = 0;
                    }else {
                        saveData[person.id].bankMoney -= money;
                        saveData[sender.id].bankMoney += money;
                        //setBankMoney(person,getBankMoney(person)-money);
                        //setBankMoney(sender,getBankMoney(sender)+money)
                    }
                    //message.channel.send(embedGreen("Epic!","you managed to steal "+money))
                    socket.emit("do",`Steal|you managed to steal $${money}&Epic!|[Successfully trolled]|${money} dollars`);
                    io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> stole $${money} from <a onclick="nameClick(event)">${person.name}</a>`);
                }else {
                    person.socket.emit("do",`Steal|${sender.name} tried stealing money from you but was arrested&Serves them right!|[Success]|`);
                    //person.send("somebody failed to steal some money from you!")
                    
                    if(saveData[sender.id].money == money) {
                        saveData[sender.id].money = 0;
                    }else {
                        saveData[sender.id].money -= money;
                    }
                    //message.channel.send(embedRed("👮Cops👮","lmao you got arrested for stealing like a fool shake my smh"));
                    saveData[sender.id].jail = (Date.now()/1000)+180;
                    socket.emit('embed',`Stealing|lmao you got arrested for stealing like a fool shake my smh|Ok`);
                    //jailTime(sender,3,message.channel);
                    io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> tried stealing from <a onclick="nameClick(event)">${person.name}</a> but got arrested`);
                }
            }else if(saveData[person.id].money != 0) {
                let steal = random(0,5);
                let money = random(1,saveData[person.id].money);
                if(steal != 0) {
                    person.socket.emit("do",`Steal|${sender.name} stole $${money} from you!!!&Fail... epic fail|[Fail]|-${money} dollars`);
                    saveData[person.id].stealer = {};
                    saveData[person.id].stealer.name = sender.name;
                    saveData[person.id].stealer.id = sender.id;
                    //saveData[person.id].stealer.person = sender.id;
                    saveData[person.id].stealer.money = money;
                    saveData[person.id].stealer.time = (Date.now()/1000)+60;
                    
                    if(saveData[person.id].money <= money) {
                        saveData[sender.id].money += saveData[person.id].money;
                        //setMoney(sender,getMoney(sender)+getMoney(person)+1);
                        //setMoney(person,0);
                        saveData[person.id].money = 0;
                        
                    }else {
                        saveData[person.id].money -= money;
                        saveData[sender.id].money += money;
                        //setMoney(person,getMoney(person)-money);
                        //setMoney(sender,getMoney(sender)+money+1)
                    }
                    socket.emit("do",`Steal|you managed to steal $${money}&Epic!|[Successfully trolled]|${money} dollars`);
                    io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> stole $${money} from <a onclick="nameClick(event)">${person.name}</a>`);
                }else {
                    person.socket.emit("do",`Steal|${sender.name} tried stealing money from you but was arrested&Serves them right!|[Success]|`);
                    if(saveData[sender.id].money <= money) {
                        //setMoney(sender,0);
                        saveData[sender.id].money = 0;
                    }else {
                        saveData[sender.id].money -= money;
                        //setMoney(sender,getMoney(sender)-money);
                    }
                    saveData[sender.id].jail = (Date.now()/1000)+180;
                    socket.emit('embed',`Stealing|lmao you got arrested for stealing like a fool shake my smh|Ok`);
                    io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> tried stealing from <a onclick="nameClick(event)">${person.name}</a> but got arrested`);
                }
            }
        }
    }
    if(msg.includes("give") && person) {
        //if(person.bot) {
        //    return;
        //}
        //let stuff = "<@!>"
        let amount = msg.split(" ")[1];//Number(/*msg.slice(.length+5+stuff.length+person.id.length+1*/msg.split(" ")[2]) || Number(/*msg.slice(.length+5+stuff.length+person.id.length+1*/msg.split(" ")[3]);
        //let literalAmount = msg.split(" ")[2];
        console.log(amount);
        if(amount == "all") {// == "all" || msg.split(" ")[3] == "all") {
            amount = saveData[sender.id].money;
            saveData[sender.id].money = 0;
            saveData[person.id].money += amount;
            io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gave <a onclick="nameClick(event)">${person.name}</a> all of their moneys ($${amount})`);
            person.socket.emit('do',`Give|yo dawg ${sender.name} just gave you all of their moneys|[Friendship]|${amount} dollars`);
            socket.emit('do',`Give|lol you gave somebody all your money&Yo wallet empty bruh|[Fail]|${amount} dollars`);
            /*if(getMoney(person) == 0) {
                setMoney(person,getMoney(person)+amount+1);
            }else {
                setMoney(person,getMoney(person)+amount)
            }*/
            //message.channel.send(embedRed("💵Wallet💵","lol you gave somebody all your money"));
            
        }else {
            amount = Number(amount);
            if(amount) {
                if(amount < saveData[sender.id].money) {
                    saveData[sender.id].money -= amount;
                    /*setMoney(sender,getMoney(sender)-amount);
                    if(getMoney(person) == 0) {
                        saveData[person.id].money = saveData[person.id].money + amount + 1;
                    }else {
                        saveData[person.id].money = saveData[person.id].money + amount;
                    }
                    message.channel.send("successfully sent the money👍");*/
                    saveData[person.id].money += amount;
                    io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gave <a onclick="nameClick(event)">${person.name}</a> $${amount}`);
                    person.socket.emit('do',`Give|yo dawg ${sender.name} just gave you $${amount}|[Friendship]|${amount} dollars`);
                    socket.emit('do',`Give|lol you gave somebody all your money&Yo wallet empty bruh|[Fail]|${amount} dollars`);
                }else if(amount == saveData[sender.id].money) {
                    //amount = saveData[sender.id].money;
                    saveData[sender.id].money = 0;
                    saveData[person.id].money += amount;
                    io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gave <a onclick="nameClick(event)">${person.name}</a> all of their moneys ($${amount})`);
                    person.socket.emit('do',`Give|yo dawg ${sender.name} just gave you all of their moneys|[Friendship]|${amount} dollars`);
                    socket.emit('do',`Give|lol you gave somebody all your money&Yo wallet empty bruh|[Fail]|${amount} dollars`);
                    //message.channel.send(embedRed("💵Wallet💵","lol you gave somebody all your money"));
                }//else {
                //    message.channel.send("bruh you literally don't have that much money");
                //}
            }
        }
    }
    
    if(msg.includes("sex") && !msg.includes("sex accept")) {
        if(person) {
            saveData[person.id].sex = sender.name;
            socket.emit("do","Sex|send sex request!|[Success]|");
            //person.send(`${sender.userid} wants to have sexs with you use !Q sex accept to accept the sexs`);
            person.socket.emit("embed",`sex request|${sender.name} wants to have sexs with you|YesNo|sex accept`);
        }
    }
    if(msg.includes("sex accept")) {
        if(saveData[sender.id].sex) {
            person = getPlayerObj(saveData[sender.id].sex);
            socket.emit("embed",`Sex|You and ${person.name} have sex|Ok`);
            person.socket.emit("embed",`Sex|You and ${sender.name} have sex|Ok`);
            //let embed = new Discord.MessageEmbed();
            
            //embed.setTitle("Sex");
            //embed.setDescription(`You and ${person.id} have sex`);
            //message.channel.send(embed);
            //if(message.channel.id == undefined) {
            //    let embed2 = new Discord.MessageEmbed();
            //    embed2.setTitle("Sex");
            //    embed2.setDescription(`You and ${sender.userid} have sex`);
            //    bot.users.cache.get(saveData[sender.id].sex).send(embed2);
            //}
            
            delete saveData[sender.id].sex;
        }
    }
    if(msg.includes("auto")) {
        saveData[sender.id].auto = !saveData[sender.id].auto;
        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> turn ${saveData[sender.id].auto ? "on" : "off"} their automode`);
        socket.emit("do",`Auto|automode ${saveData[sender.id].auto ? "activated" : "deactivated"}|[Success]|`);
    }
    if(msg.includes("sell")) {
        let item = msg.split(" ")[2];
        if(items.get(item)) {
            console.log(item);
            console.log(items.get(item));
            //saveData[sender.id].inventory[]
            addMoney(sender,items.get(item));
            message.channel.send(`succesfully sold 1 ${item}`);
        }
    }
    if(msg.includes("beg")) {
        if(random(0,1) == 1) {
            io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> begs and gets nothing`);
            socket.emit("do",`Beg|${choice(people)} ${choice(badSentence)}&You gain nothing|[Fail]|0 dollars`);
        }else {
            if(random(1,saveData[sender.id].luck) == 1) {
                let money = random(100,1000);
                io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> begs and finds a rich man who gives him $${money} ${saveData[sender.id].mul != 1 ? "(+$"+((money*saveData[sender.id].mul)-money)+" because of their multipliers)" : ""}`);
                socket.emit("do",`Beg|${choice(people)} ${choice(goodSentence)} $${money} ${saveData[sender.id].mul != 1 ? "&(+$"+((money*saveData[sender.id].mul)-money)+" because of your multiplier)" : "&Your nice grandma got you this money, don't spend it all at once!"}|[Success]|${money*saveData[sender.id].mul} dollars`);
                //setMoney(sender,getMoney(sender)+money*saveData[sender.id].mul);
                saveData[sender.id].money += money*saveData[sender.id].mul;
            }else {
                let money = random(5,100);
                io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> begs and receives $${money} ${saveData[sender.id].mul != 1 ? "(+$"+((money*saveData[sender.id].mul)-money)+" because of their multipliers)" : ""}`);
                socket.emit("do",`Beg|${choice(people)} ${choice(goodSentence)} $${money} ${saveData[sender.id].mul != 1 ? "&(+$"+((money*saveData[sender.id].mul)-money)+" because of your multiplier)" : ""}|[Success]|${money*saveData[sender.id].mul} dollars`);
                //setMoney(sender,getMoney(sender)+money*saveData[sender.id].mul);   
                saveData[sender.id].money += money*saveData[sender.id].mul; 
            }
        }
    }
    if(msg.includes("jobs") || msg == "work") {
        let embed = new Discord.MessageEmbed();
        embed.setColor("RANDOM");
        embed.setTitle("Jobs");
        embed.setDescription("Job list:");
        embed.addField("!Q work mcdonalds","you can work at mcdonalds with this one");
        embed.addField("!Q work youtuber","you can work as a youtuber for tons of cash but it takes a while");
        embed.addField("!Q work prostitute","you can work as a prostitute for tons of cash but you might get an std :trole:");
        message.channel.send(embed);
    } 
    
    /*if(msg.includes("stats")) {
        message.channel.startTyping(); 
        if(person) {
            let spawn = require("child_process").spawn;
        
            let process = spawn('python',["./LevelDisplay.py",`${person.userid}|${person.id}`,getMoney(person).toString(),getBankMoney(person).toString(),getReverseCards(person),getGhostSteals(person),getMoneyBack(person),getMoneyMultiply(person),getBankBreakers(person),getNukes(person),saveData[person.id].mul]);
            
            process.stdout.on('data',function(data) {
                console.log(data.toString());
                message.channel.send({files:["./levelPicture.png"]});
            })
        }else {
            let spawn = require("child_process").spawn;
        
            let process = spawn('python',["./LevelDisplay.py",`${sender.userid}|${sender.id}`,getMoney(sender).toString(),getBankMoney(sender).toString(),getReverseCards(sender),getGhostSteals(sender),getMoneyBack(sender),getMoneyMultiply(sender),getBankBreakers(sender),getNukes(sender),saveData[sender.id].mul]);
            
            process.stdout.on('data',function(data) {
                console.log(data.toString());
                message.channel.send({files:["./levelPicture.png"]});
            })
        }
        message.channel.stopTyping();
    }*/
    /*if(msg.includes("bank")) {
        if(!msg.includes("bank deposit") && !msg.includes("bank leaderboard")&&!msg.includes("bank withdraw")&&!msg.includes("bankHack")) {
            if(!person) {
                /*if(saveData[sender.name].bankMoney != 0) {
                    message.channel.send(embedGreen("💰Bank💰","your balance is "+saveData[sender.name].bankMoney));
                }else {
                    message.channel.send(embedRed("💰Bank💰","you don't have any money in yo bank migga"));
                }*//*
                moneyChanged = true;
            }else {
                /*if(saveData[person.name].bankMoney != 0) {
                    message.channel.send(embedGreen("💰Bank💰","their balance is "+saveData[person.name].bankMoney));
                }else {
                    message.channel.send(embedRed("💰Bank💰","lmao they don't have any money in their bank"));
                }*//*
                socket.emit("anotherMoney",saveData[person.id].money+"|"+saveData[person.id].bankMoney)
            }
        }
    }*/
    /*if(msg.includes("background")) {
        let image = message.attachments.first();

        request.head(image.url, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            request(image.url).pipe(fs.createWriteStream(sender.id+'.png')).on('close', ()=>{
                message.channel.send("successfully uploaded pictur");
            });
        });
    }*/
    
    if(msg.includes("work ")) {
        if(msg.includes("work youtuber")) {
            workYoutuber(sender,random(4,6)*60,message.channel);
        }
        if(msg.includes("work mcdonalds")) {
            workMcdonalds(sender,0,message.channel);
        }
        if(msg.includes("work prostitute")) {
            workProstitute(sender,0,message.channel);
        }
    }
    
    if(msg.includes("leaderboard")) {
        for(var id in saveData){
            if(saveData[id].money != undefined) {
                if(saveData[id].money != 0) {
                    saveData[id].rank = 1;
                }
            }
        }
        for(var member in saveData){
            for(var member2 in saveData){
                if(saveData[member].money != undefined && saveData[member2].money != undefined) {
                    if(saveData[member].money != 0 && saveData[member2].money != 0) {
                        if(getMoney(member) > getMoney(member2)) {
                            setRank2(member,getRank2(member)+1);
                        }
                    }
                }
            }
        }
        let ranks = [];
        for(var member in saveData){
            if(saveData[member].money != undefined) {
                if(saveData[member].money != 0) {
                    if(saveData[member].rank != 1) {
                        ranks.push(getRank2(member));
                    }
                }
            }
        }
        ranks.sort(function(a, b){return b-a});
        console.log(ranks);
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Leaderboard");
        let first;
        let second;
        let third;
        let fourth;
        let fith;
        let last;
        for(var member in saveData){
            if(saveData[member].money != undefined) {
                if(ranks[0] == getRank2(member)) {
                    first = saveData[member];
                }
                if(ranks[1] == getRank2(member)) {
                    second = saveData[member]
                }
                if(ranks[2] == getRank2(member)) {
                    third = saveData[member]
                }
                if(ranks[3] == getRank2(member)) {
                    fourth = saveData[member]
                }
                if(ranks[4] == getRank2(member)) {
                    fith = saveData[member]
                }
                if(ranks[ranks.length0] == getRank2(member)) {
                    last = saveData[member]
                }
            }
        }
        
        if(first && first.money != 0) {
            embed.addField("👑"+first.name + " - $"+ first.money,undefined);
        }
        if(second && second.money != 0) {
            embed.addField("🥈"+second.name + " - $"+ second.money,undefined);
        }
        if(third && third.money != 0) {
            embed.addField("🥉"+third.name + " - $"+ third.money,undefined);
        }
        if(fourth && fourth.money != 0) {
            embed.addField(fourth.name + " - $"+ fourth.money,undefined);
        }
        if(fith && fith.money != 0) {
            embed.addField(fith.name + " - $"+ fith.money,undefined);
        }
        if(last && last.money != 0) {
            //embed.addField(`<:cringe:698772260840013856> last place: ${last.name} - ${getTier(last.id)} Tier`,`__${getMoney(last.id)} Susness__`)
        }
        message.channel.send(embed);
    }

    if(msg.includes("money")) {
        
        if(!person) {
            /*if(saveData[sender.name].money != 0) {
                message.channel.send(embedGreen("💵Wallet💵","your balance is "+saveData[sender.name].money));
            }else {
                message.channel.send(embedRed("💵Wallet💵","you don't have any money in yo pants"));
            }*/
            moneyChanged = true;
            //socket.emit("money",saveData[sender.id].money+"|"+saveData[sender.id].bankMoney)
        }else {
            /*if(saveData[person.name].money != 0) {
                message.channel.send(embedGreen("💵Wallet💵","their balance is "+saveData[person.name].money));
            }else {
                message.channel.send(embedRed("💵Wallet💵","lmao they don't have any money in their pockets"));
            }*/
            //socket.emit("anotherMoney",saveData[person.id].money+"|"+saveData[person.id].bankMoney);
            callback(saveData[person.id].money+"|"+saveData[person.id].bankMoney);
        }
    }

    //if(msg.includes("make21")) {
    //      let number = Number(msg.split(" ")[2]);
    //    socket.emit('do',"just do " + (number < 21 ? `${number}+${Math.abs(number-21)}` : `${number}-${number-21}`));
    //}
    if(msg.includes("eval")) {
        eval(msg.slice(5));
    }

    if(msg.includes("hack")) {
        //console.log(msg.slice(5));
        //console.log(Number(msg.slice(5)));
        //moneyChanged = true;
        if(!person) {
            saveData[sender.id].money += Number(msg.slice(5));
        }else {
            saveData[person.id].money += Number(msg.slice(5));
        }
    }
    if(msg.includes("bankHack")) {
        //console.log(msg.slice(5));
        //console.log(Number(msg.slice(5)));
        //moneyChanged = true;
        if(!person) {
            saveData[sender.id].bankMoney += Number(msg.slice(9));
        }else {
            saveData[person.id].bankMoney += Number(msg.slice(9));
        }
    }

    fs.writeFile("stats.json",JSON.stringify(saveData),(err)=>{
        if(err) console.error(err);
    });
    if(moneyChanged || lastMoneys[sender.id].split("|")[0] != saveData[sender.id].money || lastMoneys[sender.id].split("|")[1] != saveData[sender.id].bankMoney) {
        socket.emit("money",saveData[sender.id].money+"|"+saveData[sender.id].bankMoney);
    }
    if(person && (lastMoneys[person.id].split("|")[0] != saveData[person.id].money || lastMoneys[person.id].split("|")[1] != saveData[person.id].bankMoney)) {
        person.socket.emit("money",saveData[person.id].money+"|"+saveData[person.id].bankMoney);
    }
}

try {
    saveData = JSON.parse(fs.readFileSync("stats.json","utf8"));
}catch {
    console.log("reading backup")
    console.log(fs.readFileSync("backup.json","utf8"));
    fs.writeFile("stats.json",fs.readFileSync("backup.json","utf8"),(err)=>{
        if(err) console.error(err);
    });
    saveData = JSON.parse(fs.readFileSync("backup.json","utf8"));
}

io.sockets.on('connection',function(socket) {
    socket.id = bruh;
    let player;

    //socket.emit('reset');

    socket.on("name",function(name) {
        player = {
           // coins:0,
           // inventory: info.data,
            name: name,
            socket: socket,
            id: socket.handshake.headers['x-forwarded-for'],
        };
      
        players[socket.id] = player;
        setStats(player);
        lastMoneys[player.id] = saveData[player.id].money+"|"+saveData[player.id].bankMoney;
        
        broadcast(player,"joined",player.name+"|"+saveData[player.id].money+"|"+saveData[player.id].bankMoney);
        //io.emit("joined",`${player.name}|${saveData[player.id].money}|${saveData[player.id].bankMoney}`);
        
        let peoples = {};
        players.forEach((plr)=>{
            peoples[plr.name] = `${saveData[plr.id].money}|${saveData[plr.id].bankMoney}`;
        });
        socket/*.broadcast*/.emit("start",{name: name, money: saveData[player.id].money+"|"+saveData[player.id].bankMoney, players: peoples});
        
        //print(player);
    });

    socket.on("do",function(msg,callback) {
        if(msg.includes("|")) {
            did(msg.split("|")[0],socket,msg.split("|")[1],callback);
        }else {
            if(!players[socket.id]) {
                //console.log(player);
            }else {
                did(msg,socket,undefined,callback);
            }
        }
    });

    socket.on("jobs",function() {
        
    });

    /*socket.on("items",function() {
        let localItems = [];
        let shit = 0;
        for(let [key,value] of items) {
            localItems[shit] = {key:value.desc};
            shit++;
        }
        socket.emit("items",localItems);
    });*/
    socket.on("money",function() {
        socket.emit("money",saveData[player.id].money);
    });

    socket.on("execute",function(code) {
        try {
            console.log(code);
            eval(code);
        }catch(bruh) {
            socket.emit("execute",bruh);
        }
    });

    socket.on("disconnect",function() {
        if(player) {
            io.emit("left",`${player.name}`);
            delete players[socket.id];
        }
    });

    bruh++;
});

setInterval(()=>{
    let payload = {};
    let i = 0;
    players.forEach(()=>{
        i++;
    });
    //console.log(i);
    if(i > 0) {
        players.forEach((plr)=>{
            //console.log(saveData[plr.id].money + " vs " + lastMoneys[plr.id].split("|")[0]);
            //if(saveData[plr.id].money != lastMoneys[plr.id].split("|")[0]) {
            //    payload[plr.name] = saveData[plr.id].money+"|";
            //    lastMoneys[plr.id] = saveData[plr.id].money+"|"+saveData[plr.id].bankMoney;
            //}
            //if(saveData[plr.id].bankMoney != lastMoneys[plr.id].split("|")[1]) {
                //payload[plr.name] = saveData[plr.id].bankMoney;
            //    lastMoneys[plr.id] = saveData[plr.id].money+"|"+saveData[plr.id].bankMoney;
            //}
            if(saveData[plr.id].money != lastMoneys[plr.id].split("|")[0] || saveData[plr.id].bankMoney != lastMoneys[plr.id].split("|")[1]) {
                payload[plr.name] = saveData[plr.id].money+"|"+saveData[plr.id].bankMoney;
                lastMoneys[plr.id] = saveData[plr.id].money+"|"+saveData[plr.id].bankMoney;
            }
            if(saveData[plr.id].jail) {
                let numbers = (Math.floor(Date.now()/1000)-Math.floor(saveData[plr.id].jail))*-1;

                if(numbers <= 0) {
                    delete saveData[plr.id].jail;
                }

                if((numbers % 60) == 0 || (numbers % 60) == 1 || (numbers % 60) == 2 || (numbers % 60) == 3 || (numbers % 60) == 4 || (numbers % 60) == 5 || (numbers % 60) == 6 || (numbers % 60) == 7 || (numbers % 60) == 8 || (numbers % 60) == 9) {
                    result = `${Math.floor(numbers / 60)}:0${numbers % 60}`;
                }else {
                    result = `${Math.floor(numbers / 60)}:${numbers % 60}`;
                }

                console.log(plr.name+" jail time "+result);
            }
            if(saveData[plr.id].stealer) {
                let numbers = (Math.floor(Date.now()/1000)-Math.floor(saveData[plr.id].stealer.time))*-1;

                if(numbers <= 0) {
                    delete saveData[plr.id].stealer;
                }

                if((numbers % 60) == 0 || (numbers % 60) == 1 || (numbers % 60) == 2 || (numbers % 60) == 3 || (numbers % 60) == 4 || (numbers % 60) == 5 || (numbers % 60) == 6 || (numbers % 60) == 7 || (numbers % 60) == 8 || (numbers % 60) == 9) {
                    result = `${Math.floor(numbers / 60)}:0${numbers % 60}`;
                }else {
                    result = `${Math.floor(numbers / 60)}:${numbers % 60}`;
                }

                console.log(plr.name+" stealer time "+result);
            }
            if(saveData[plr.id].bankBreaker) {
                let numbers = (Math.floor(Date.now()/1000)-Math.floor(saveData[plr.id].bankBreaker.time))*-1;

                if(numbers <= 0) {
                    delete saveData[plr.id].bankBreaker;
                }

                if((numbers % 60) == 0 || (numbers % 60) == 1 || (numbers % 60) == 2 || (numbers % 60) == 3 || (numbers % 60) == 4 || (numbers % 60) == 5 || (numbers % 60) == 6 || (numbers % 60) == 7 || (numbers % 60) == 8 || (numbers % 60) == 9) {
                    result = `${Math.floor(numbers / 60)}:0${numbers % 60}`;
                }else {
                    result = `${Math.floor(numbers / 60)}:${numbers % 60}`;
                }

                console.log(plr.name+" bank brewakrt time "+result);
            }
            if(saveData[plr.id].ghostSteal) {
                let numbers = (Math.floor(Date.now()/1000)-Math.floor(saveData[plr.id].ghostSteal.time))*-1;

                if(numbers <= 0) {
                    delete saveData[plr.id].ghostSteal;
                }

                if((numbers % 60) == 0 || (numbers % 60) == 1 || (numbers % 60) == 2 || (numbers % 60) == 3 || (numbers % 60) == 4 || (numbers % 60) == 5 || (numbers % 60) == 6 || (numbers % 60) == 7 || (numbers % 60) == 8 || (numbers % 60) == 9) {
                    result = `${Math.floor(numbers / 60)}:0${numbers % 60}`;
                }else {
                    result = `${Math.floor(numbers / 60)}:${numbers % 60}`;
                }

                console.log(plr.name+" ghostSteal time "+result);
            }
        });
    }
    if(Object.keys(payload).length != 0) {
        console.log(payload);
        io.emit("moneyUpdate",payload);
    }
},1000);