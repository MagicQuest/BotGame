const express = require('express');
const app = express();
const serv = require('http').Server(app);
const fs = require("fs");
//time so you can only do certain things at certain times
//music queue thinggy
//banks and faciolity you can buy a building for 500,000 to 20 million and you can buy associats bassically make you money over time and the amount of money you get corrisponds to the higher up the facility  (he 500000 can make 50 dollars assecond and the 20 million could get you 213 thousand dollars and you can upagrade the accsoitats    and shit)
//bababooeys
//subscripber determaines how many vews and you get more subscriber by getting viewsa and posting alot
//where my sperm bankm ($70 ($50 then 20))

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

app.get("/stuff/img/",function(req,res) {
    //console.log("bruh");
    //console.log(picthurs);
    let picthurs = fs.readFileSync(__dirname + "/stuff/img/picthurs.html").toString();

    //let picthurs2 = picthurs.split("//PUTTHESHITHERE")[1];
    let shit = "let pictures = [";
    //picthurs2 = "let pictures = [" + picthurs2;
    fs.readdir(__dirname + "/stuff/img/", { withFileTypes: true }, (err, files) => {
        //console.log("\nCurrent directory files:");
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                shit += "\""+file.name+"\",";
                //picthurs2 += "\n"
                //console.log(file.name);
            });
            shit = shit.slice(0,shit.length-1);
            shit += "];";
            //picthurs2 += "\n"
            picthurs = picthurs.replace("//PUTTHESHITHERE",shit);
            //picthurs2 = shit + picthurs2;
            //let picthur = picthurs.split("//PUTTHESHITHERE")[0]+picthurs2;
            //console.log(picthur);
            res.send(picthurs);
        }
    }); 
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
        if(plr.name != sender.name) {
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
    //if(!saveData[sender.name].jail && !saveData[sender.name].work) {
        let views = random(1,55000);
        let text;
        let money;
        if(random(1,saveData[sender.name].luck) == 1) {
            views = random(55000,105000);
            money = Math.floor(views*.18)//*userData[person.name].mul;
            text = "you got a crazy amount of views: " + views + " and got "+money+" dollars "+sender.name+(saveData[sender.name].mul != 1 ? "&+"+(money*saveData[sender.name].mul-money)+" from your multiplier" : "");
            money = money*saveData[sender.name].mul;
        }else {
            money = Math.floor(views*.18)//*userData[person.name].mul;
            text = "you got " + views + " views and "+money+" dollars "+sender.name+(saveData[sender.name].mul != 1 ? "&+"+(money*saveData[sender.name].mul-money)+" from your multiplier" : "");
            money = money*saveData[sender.name].mul;
        }
        
        //channel.send(embedGreen(text,"epic👌"));
        //setMoney(person,getMoney(person)+money);
        //waitToWork(person,time,channel);
        saveData[sender.name].money += money;

        io.emit("chat",`${sender.name} made a youtube video and made <money>$${money}</money> with ${views} views`);
        sender.socket.emit("do",`Work|As a youtuber ${text}|[Success]|${money} dollars`);

        saveData[sender.name].work = {time: (Date.now()/1000)+(4*60), duration: 4*60};
        sender.socket.emit("timer",{t: wait,n: "work",st: Math.trunc(new Date().getTime()/1000)});
    //}
});
addJob("mcdonalds","$120 - $1080 (with luck $720 - $2160)","3 minutes",(sender) => {
    
    //setTimeout(function() {
    let hours = random(1,9);
    let money = hours*120;//*saveData[sender.name].mul;
    let text = "you made <money>"+ money +"</money> dollars";
    if(random(0,saveData[sender.name].luck)==1) {
        hours = random(3,9);
        money = hours*240;//*saveData[sender.name].mul;
        text = "lots of customers came to mcdonalds today so you made an extra <money>"+ money +"</money> dollars"
    }
    let mulMoney = money * saveData[sender.name].mul;
    saveData[sender.name].money += mulMoney;

    io.emit("chat",`${sender.name} worked at mcdonalds and made <money>${mulMoney}</money> for working ${hours} hours`);
    sender.socket.emit("do",`Work|At mcdonalds ${text}${saveData[sender.name].mul != 1 ? "&+"+(mulMoney-money)+" from your multiplier" : ""}|[Success]|${mulMoney} dollars`);
    //waitToWork(person,5*60,channel);
    saveData[sender.name].work = {time: (Date.now()/1000)+(3*60), duration: 3*60};
    sender.socket.emit("timer",{t: wait,n: "work",st: Math.trunc(new Date().getTime()/1000)});

    //},time*1000)
});
addJob("prostitute", "$120312 - 21301 (with luck $3409 - 3432)","3 miunt", (sender) => {
    let money = random(1,10)*500;//*userData[person.id].mul;
    //let rich = false;
    let text = "you made <money>" + money + "</money> dollars";
    let wait = 5*60;
    let trolled = false;
    
    if(random(0,saveData[sender.name].luck)==1) {
        money = random(1,10)*1200;//*userData[person.id].mul;
        //rich = true;
        text = "you were fortunate enough to find a rich guy by the name of bernard and made <money>"+ money +"</money> dollars";
    }
    
    let mulMoney = money*saveData[sender.name].mul;
    
    //if(rich) {
    //    text = "you were fortunate enough to find a rich guy by the name of bernard and made <money>"+ money +"</money> dollars";
    //}else {
    //    text = "you made <money>"+ money +"</money> dollars";
    //}
    
    saveData[sender.name].money += mulMoney;
    
    if(random(1,4) < 3) {
        trolled = true;

        text+=`<br><b>but you just found out that you contracted an <u>STD</u></b> you must stop working for a while and pay <moneyRed>1000</moneyRed> dollars for your medical bill`;
        
        money -= 1000;
        mulMoney -= 1000;//*saveData[sender.name].mul;

        /*if(saveData[sender.name].money >= 1000) {
            saveData[sender.name].money -= 1000;
        }else if(saveData[sender.name].bankMoney >= 1000){
            saveData[sender.name].bankMoney -= 1000;
        }else {
            saveData[sender.name].money -= 1000;
        }*/

        wait = 6*60
    }

    io.emit("chat",`${sender.name} worked as a prostitute and made <money>${mulMoney}</money> dollars${trolled ? " but got an STD lol" : ""}`);
    sender.socket.emit("do",`Work|As a prostitute ${text}${saveData[sender.name].mul != 1 ? "&+"+(mulMoney-money)+" from your multiplier" : ""}|[Success]|${mulMoney} dollars`);

    saveData[sender.name].work = {time: (Date.now()/1000)+(wait), duration: wait};
    sender.socket.emit("timer",{t: wait,n: "work",st: Math.trunc(new Date().getTime()/1000)});
    //waitToWork(person,wait,channel);
});

addItem("reverse card|🃏Reverse card🃏",10000,"use this card when you have gotten robbed to steal money from the stealer (Ex: !Q buy reverse card)",false,(sender)=>{
    //let sender = players[socket.id];
    //console.log(sender);
    //return;
    if(saveData[sender.name].stealer) {
        let stealer = saveData[sender.name].stealer;
       // console.log(stealer);
        saveData[stealer.name].stealer = stealer;
        //saveData[stealer.name].stealer.person = sender;
        saveData[sender.name].money += stealer.money;

        if(saveData[stealer.name].money != 0) {
            saveData[stealer.name].money -= stealer.money;
            //            setMoney(saveData[sender.name].stealer.person,getMoney(saveData[sender.name].stealer.person)-saveData[sender.name].stealer.money)
        }else {
            saveData[stealer.name].bankMoney -= stealer.money;
            //setBankMoney(stealer.person,getBankMoney(stealer.person)-stealer.money);
        }
        
        delete saveData[sender.name].stealer;
        saveData[sender.name].inventory.reversecard -= 1;
        //removeReverseCard(sender);
        //message.channel.send("you have successfully used the reverse card");
        sender.socket.emit("do",`Use Item|Successfully used the reverse card on ${stealer.name}|[Success]|${stealer.money} dollars`);
        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> is using a reverse card on ${stealer.name}!`);
        //setMoney(saveData[saveData[sender.name].stealer.player.name].,getMoney(sender)+saveData[sender.name].stealer.money);
    }else {
        /*if(saveData[sender.name].nukedMoney) {
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
    saveData[sender.name].inventory.ghoststeal -= 1;
    saveData[sender.name].ghostSteal = {time: (Date.now()/1000)+15, duration: 15};
    //sender.socket.emit("time",`${}`);
    //saveData[sender.name].ghostSteal = true;
    //message.channel.send("you have successfully used the ghost steal");
    sender.socket.emit("timer",{info: "Use Item|You activated your ghost steal|[Success]|",n: "ghostSteal",t: 15,st: Math.trunc(new Date().getTime()/1000)});
    //sender.socket.emit("do",`Use Item|You activated your ghost steal|[Success]|`);
    io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> is using a ghost steal!`);
},false);
addItem("bank breaker|🔨BankBreaker🔨",250000,"for 15 seconds you can break open somebody's bank and everybody can steal from them (Ex: !Q buy bank breaker)",true,(sender,person)=>{
    //let sender = players[data.socket.id];
    //let person = data.person;
    saveData[sender.name].inventory.bankbreaker -= 1;
    saveData[person.name].bankBreaker = {time: (Date.now()/1000)+15, duration: 15};
    //saveData[person.name].bankbreaker = true;
    //message.channel.send(`you have successfully used the bank breaker on ${person.username}`);
    sender.socket.emit("timer",{info: `Use Item|You used the bank breaker on ${person.name}&Trollin', just trollin'|[Success]|`,n: "bankBreaker",t: 15,st: Math.trunc(new Date().getTime()/1000)});
    //sender.socket.emit("do",`Use Item|You used the bank breaker on ${person.name}&Trollin', just trollin'|[Success]|`);
    io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> is using a bank breaker on ${person.name}!`);
},false);
addItem("money back|💵MoneyBack💵",35000,"you can use this one to get your money back when you lost a gamble (Ex: !Q buy money back)",false,(sender)=>{
    //let sender = players[socket.id];
    if(saveData[sender.name].gambledMoney) {
        saveData[sender.name].money += saveData[sender.name].gambledMoney;
        //removeMoneyBack(sender);
        saveData[sender.name].inventory.moneyback -= 1;
        sender.socket.emit("do",`Use Item|You used the money back|[Success]|${saveData[sender.name].gambledMoney} dollars`);
        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> used a money back and got <money>$${saveData[sender.name].gambledMoney}</money> back!`);
        delete saveData[sender.name].gambledMoney;
        //message.channel.send("you have successfully used the money back");
    }//else {
        //socket.emit("usedFail","you haven't gambled any money yet");
    //}
    /*else if(saveData[sender.name].nukedMoney) {
        setMoney(sender,saveData[sender.name].nukedMoney.money);
        setBankMoney(sender,saveData[sender.name].nukedMoney.bankMoney);
        removeMoneyBack(sender);
        message.channel.send("you have successfully used the money back");
    }*/
},false);
addItem("money multiply|💸MoneyMultiply💸",50000,"this multiplies your money for 5 minutes including money from gambling and money from jobs (Ex: !Q buy money multiply)",false,(sender,amount)=>{
    //let loop = data.amount;
    let used = false;
    if(amount) {
        if(amount == "max") {
            amount = saveData[sender.name].inventory.moneymultiply;
        }else {
            amount = Number(amount);
        }
    }else {
        amount = 1;
    }
    //console.log(loop);
   // console.log(item);
    for(let i = 0;i < amount;i++) {
        //if(!saveData[sender.name].inventory.moneymultiply) saveData[sender.name].inventory.moneymultiply = {};
        //if(!saveData[sender.name].inventory.moneymultiply.amount) {
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
        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> used ${amount > 1 ? amount + " multipliers" : amount + " multiply"} and they now have a multplier of ${saveData[sender.name].mul}`);
        sender.socket.emit("do",`Use Item|You have used ${amount > 1 ? amount + " multipliers" : amount + " multiply"}&You now have a multiplier of ${saveData[sender.name].mul} and ${saveData[sender.name].inventory.moneymultiply > 1 ? saveData[sender.name].inventory.moneymultiply + " money multiplies" : saveData[sender.name].inventory.moneymultiply + " money multiply"}|[Success]|`);
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
   // saveData[sender.name].nukeUser = true;
    saveData.nuke = sender.name;
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
addItem("lottery ticket|🎰LotteryTicket🎰",100,"you can enter the lottery but you have a very low chance of winning unless you have lots of tickets (Ex: !Q buy lottery ticket)",false,(sender)=>{
    //let sender = message.author;
    //saveData[sender.name].inventory.lotteryticket.amount -= 1;
    socket.emit("usedFail","bruh you can't use this");
    //message.channel.send("bruh you can't use this");
},false);

function setStats(player) {
    //console.log(saveData[player.name].money);
    if(!saveData[player.name]) saveData[player.name] = {};

    if(saveData[player.name].money == undefined) saveData[player.name].money = 100;
        saveData[player.name].money = Math.floor(saveData[player.name].money);
    if(!saveData[player.name].bankMoney) saveData[player.name].bankMoney = 0;
    if(!saveData[player.name].inventory) saveData[player.name].inventory = {};
        for (let item of items.keys()) {
            let jsonName = item.split(" ").join("");
            if(!saveData[player.name].inventory[jsonName]) saveData[player.name].inventory[jsonName] = 0;
        }
    if(!saveData[player.name].mul) saveData[player.name].mul = 1;
    if(!saveData[player.name].luck) saveData[player.name].luck = 25;
    if(!saveData[player.name].auto) saveData[player.name].auto = false;
}

function did(msg,socket,person,callback) {

    let moneyChanged;
    let sender = players[socket.id];
    //console.log(msg);
    //try {
   //     console.log(sender.name);
    //}catch {

   //}
    //console.log(person);
    if(!sender) {
        return;
    }
    //let lastMoneys = {money: saveData[sender.name].money,bankMoney: saveData[sender.name].bankMoney};
    //let lastPersonMoneys;
    //console.log(sender);
    //console.log(person);
    person = getPlayerObj(person);
    if(person && !person.name) {
        person = undefined;
    }else if(person && person.name) {
        lastMoneys[person.name] = saveData[person.name].money+"|"+saveData[person.name].bankMoney;
        //lastPersonMoneys = {money: saveData[person.name].money,bankMoney: saveData[person.name].bankMoney};
    }
    lastMoneys[sender.name] = saveData[sender.name].money+"|"+saveData[sender.name].bankMoney;
    //console.log(person);

    setStats(sender);

    if(msg.includes("eval")) {
        return eval(msg.slice(5));
    }

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
        message.channel.send(`${person ? person.username : sender.username }'s multiplier is **${saveData[person ? person.name : sender.name].mul}**`)
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

    if(msg.includes("inventory")) {
        //let embed = new Discord.MessageEmbed();
        
        if(person) {
            /*if(person.bot) {
                return;
            }*/
            //embed.setTitle("Their Inventory")
            if(callback) {
                callback(saveData[person.name].inventory);
            }
            /*for (let key of items.keys()) {
                let jsonName = key.split(" ").join("");

                embed.addField(key+"s",saveData[person.name].inventory[jsonName]);
            }*/
            /*embed.addField("reverse cards",getReverseCards(person));
                embed.addField("ghost steals",getGhostSteals(person));
                embed.addField("money back",getMoneyBack(person));
                embed.addField("money multiply",getMoneyMultiply(person));
                embed.addField("nukes",getNukes(person));
                embed.addField("bank breakers",getBankBreakers(person));*/
                
        }else {
            //embed.setTitle("Your Inventory")
            if(callback) {
                //let bruh = saveData[sender.name].inventory;
                /*for (let key of items.keys()) {
                    let jsonName = key.split(" ").join("");
                    //embed.addField(key+"s",saveData[sender.name].inventory[jsonName] ? saveData[sender.name].inventory[jsonName].amount : 0);
                    bruh += `${jsonName}: ${saveData[sender.name].inventory[jsonName]}\n`;
                }*/
                callback(saveData[sender.name].inventory);
            }//else {
            //    socket.emit('do','Inventory|Where yo call back &  ass|[Fail]|-NaN dollars');
            //}
            
        }
        //message.channel.send(embed);
    }

    /*if(msg.includes("setStat")) {
        //if(sender.name == 306199884699009035) {
            stat = msg.split(" ")[1];
            value = msg.split(" ")[2];
            if(value.charAt(value.length) != 'L') {
                saveData[person.name][stat] = Number(value);
            }else {
                saveData[person.name][stat] = value.slice(0,value.length);
            }
            //message.channel.send(`set ${person.username}'s ${stat} to ${value}`);
        //}else {
        //    message.channel.send(choice(people)+" says to fuck off and stop using forbidden commands");
        //}
    }*/

    if(msg.includes("use ")) {
        let item = msg.slice(4);
        let amount;
        if(item.split(" ")[2]) {
            amount = item.split(" ")[2];
            item = item.split(" ")[0] + " " + item.split(" ")[1];
        }
        let jsonName;
        //if(!items.get(item)) {
        //    message.channel.send("ok bruh this ain't an item");
        //    return;
        //}
        //console.log(item);
        jsonName = item.split(" ").join("");
        if(items.get(item).ping) {
            if(person) {
                if(items.get(item).custom) {
                    items.get(item).useCallback(sender,person);
                    return;
                }
                //if(!saveData[sender.name].inventory[jsonName]) saveData[sender.name].inventory[jsonName] = {};
                //if(saveData[sender.name].inventory[jsonName].amount) {
                    if(saveData[sender.name].inventory[jsonName] != 0) {
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
            //if(!saveData[sender.name].inventory[jsonName]) saveData[sender.name].inventory[jsonName] = {};
            //if(saveData[sender.name].inventory[jsonName]) {
                if(saveData[sender.name].inventory[jsonName] != 0) {
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
            if(saveData[sender.name].money != 0 && saveData[sender.name].money >= price) {
                saveData[sender.name].money -= price;
                worked = true;
            }else {
                if(saveData[sender.name].bankMoney != 0) {
                    if(saveData[sender.name].bankMoney >= price) {
                        saveData[sender.name].bankMoney -= price;
                        worked = true;
                    }
                }
            }
            if(worked) {
                saveData[sender.name].inventory[jsonName] += 1;
            }else {
                failed = true;
                //message.channel.send("you probably don't have enough money for this");
                break;
            }
        }
        socket.emit(`do`,`Shop|You ${failed ? "could only buy" : "bought"} ${i} ${i > 1 ? item+"s" : item}&Time for a little trolling|[Fail]|-${price*i} dollars`);
        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> bought ${i} ${i > 1 ? item+"s" : item} for <moneyRed>$${price*i}</moneyRed>`);
    }
    if(msg.includes("sell")) {
        let item = msg.slice(5);
        console.log(item);
        if(items.get(item)) {
            let jsonName = item.split(" ").join("");
            if(saveData[sender.name].inventory[jsonName] > 0) {
                let price = items.get(item).price;
                //console.log(item);
                //console.log(items.get(item));
                //saveData[sender.name].inventory[]
                //addMoney(sender,items.get(item));
                //message.channel.send(`succesfully sold 1 ${item}`);
                saveData[sender.name].inventory[jsonName] -= 1;
                saveData[sender.name].money += price;
            }
        }
    }
    if(msg.includes("withdraw ")) {
        let amount = msg.split(" ")[1];//msg.split(" ")[3] || msg.split(" ")[2];
        if(amount == "all") {
            let mony = saveData[sender.name].bankMoney;
            saveData[sender.name].money += saveData[sender.name].bankMoney;
            saveData[sender.name].bankMoney = 0;
            //setBankMoney(sender,getBankMoney(sender)+getMoney(sender));
            //setMoney(sender,0);
            //message.channel.send(embedGreen("💰Bank💰","your balance is now "+saveData[sender.name].bankMoney));
            socket.emit('do',`Bank|You withdrew all of your money and your money is now ${saveData[sender.name].money}&Don't spend too much|[Success]|${mony} dollars`);
        }else {
            amount = Number(amount);
            if(amount && amount > 0) {
                if(amount < saveData[sender.name].bankMoney) {
                    saveData[sender.name].money += amount;
                    //setBankMoney(sender,getBankMoney(sender)+amount);
                    saveData[sender.name].bankMoney -= amount;
                    //setMoney(sender,getMoney(sender)-amount);
                    //message.channel.send(embedGreen("💰Bank💰","your balance is now "+saveData[sender.name].bankMoney));
                    socket.emit('do',`Bank|You withdrew ${amount} and your money is now ${saveData[sender.name].money}&Don't spend too much|[Success]|${amount} dollars`);
                }else if(amount == saveData[sender.name].bankMoney) {
                    saveData[sender.name].money += amount;
                    saveData[sender.name].bankMoney = 0;
                    socket.emit('do',`Bank|You withdrew all of your money and your money is now ${saveData[sender.name].money}&Don't spend too much|[Success]|${amount} dollars`);
                }
            }
        }
    }
    if(msg.includes("deposit ")) {
        let amount = msg.split(" ")[1];//msg.split(" ")[3] || msg.split(" ")[2];
        if(amount == "all") {
            let mony = saveData[sender.name].money;
            saveData[sender.name].bankMoney += saveData[sender.name].money;
            saveData[sender.name].money = 0;
            //setBankMoney(sender,getBankMoney(sender)+getMoney(sender));
            //setMoney(sender,0);
            //message.channel.send(embedGreen("💰Bank💰","your balance is now "+saveData[sender.name].bankMoney));
            socket.emit('do',`Bank|You deposited all of your money and your balance is now ${saveData[sender.name].bankMoney}&Saving up for college eh? Good thinkin'|[Success]|${mony} dollars`);
        }else {
            amount = Number(amount);
            if(amount && amount > 0) {
                if(amount < saveData[sender.name].money) {
                    saveData[sender.name].bankMoney += amount;
                    //setBankMoney(sender,getBankMoney(sender)+amount);
                    saveData[sender.name].money -= amount;
                    //setMoney(sender,getMoney(sender)-amount);
                    //message.channel.send(embedGreen("💰Bank💰","your balance is now "+saveData[sender.name].bankMoney));
                    socket.emit('do',`Bank|You deposited ${amount} and your balance is now ${saveData[sender.name].bankMoney}&Saving up for college eh? Good thinkin'|[Success]|${amount} dollars`);
                }else if(amount == saveData[sender.name].money) {
                    saveData[sender.name].bankMoney += amount;
                    saveData[sender.name].money = 0;
                    socket.emit('do',`Bank|You deposited all of your money and your balance is now ${saveData[sender.name].bankMoney}&Saving up for college eh? Good thinkin'|[Success]|${amount} dollars`);
                }
            }
        }
    }
    if(msg.includes("gamble ")) {
        let moneyGambled = msg.split(" ")[1];//msg.slice(.length+7);
        if(saveData[sender.name].money != 0) {
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
                        let moneyGambled = saveData[sender.name].money*3;
                        let finalWinnings = moneyGambled*saveData[sender.name].mul;
                        saveData[sender.name].money = finalWinnings;
                        //setMoney(sender,saveData[sender.name].money*3*saveData[sender.name].mul)
                        socket.emit('do',`Gamble|You gambled $${moneyGambled/3} and won $${moneyGambled} (and with a random chance it was tripled)${saveData[sender.name].mul != 1 ? `&(+$${finalWinnings - moneyGambled} because of your multiplier)` : "&Lucky lucky lucky!"}|[Success]|${finalWinnings} dollars`);
                        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled all of their money (<money>$${moneyGambled/3}</money>) and won <money>$${moneyGambled}</money> (randomly tripled)${saveData[sender.name].mul != 1 ? ` (<money>+$${finalWinnings - moneyGambled}</money> because of their multiplier)` : ""}`);
                        //message.channel.send(embedGreen(`${sender.username} won (and with a random chance it was tripled)`,"you now have "+ saveData[sender.name].money + " coins"));
                    }else {
                        let moneyGambled = saveData[sender.name].money*2;
                        let finalWinnings = moneyGambled*saveData[sender.name].mul;
                        saveData[sender.name].money = finalWinnings;
                        //setMoney(sender,saveData[sender.name].money*3*saveData[sender.name].mul)
                        socket.emit('do',`Gamble|You gambled $${moneyGambled/2} and won $${moneyGambled}${saveData[sender.name].mul != 1 ? `&(+$${finalWinnings - moneyGambled} because of your multiplier)` : ""}|[Success]|${finalWinnings} dollars`);
                        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled all of their money and won <money>$${moneyGambled}</money>${saveData[sender.name].mul != 1 ? ` (<money>+$${finalWinnings - moneyGambled}</money> because of their multiplier)` : ""}`);

                        //saveData[sender.name].money *= 2*saveData[sender.name].mul;
                        //setMoney(sender,saveData[sender.name].money*2*saveData[sender.name].mul)
                        //message.channel.send(embedGreen(`${sender.username} won`,"you now have "+ saveData[sender.name].money + " coins"));
                    }
                    
                }else {
                    saveData[sender.name].gambledMoney = saveData[sender.name].money;
                    saveData[sender.name].money = 0;
                    //setMoney(sender,0);
                    io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> just gambled all their money (<moneyRed>-$${saveData[sender.name].gambledMoney}</moneyRed>) and lost`);
                    socket.emit('do',`Gamble|you just gambled all of your money and lost&Sometimes we don't get what we want|[Fail]|-${saveData[sender.name].gambledMoney} dollars`);
                    //message.channel.send(embedRed(`${sender.username} lost...`,"welp it seems as though you phucking lose all yo money"));
                    if(saveData[sender.name].auto && saveData[sender.name].inventory.moneyback != 0) {
                        saveData[sender.name].money += saveData[sender.name].gambledMoney;
                        //setMoney(sender,getMoney(sender)+saveData[sender.name].gambledMoney);
                        delete saveData[sender.name].gambledMoney;
                        saveData[sender.name].inventory.moneyback -= 1;
                        if(saveData[sender.name].inventory.moneyback == 1) {
                            socket.emit("embed",`Gambling|warning this is your last money back|Ok&Modal`);
                        }
                        socket.emit('do','Auto|automatically used money back|[Success]|');
                    }
                }
            }else if(moneyGambled == "random") {
                let percent = random(5,100);
                let win = random(1,2);
                let moneyToGamble = random(1,saveData[sender.name].money);
                if(win == 1) {
                    if(random(0,100) > 95) {
                        let moneyToWin = (moneyToGamble*percent/50)*3;
                        let finalWinnings = moneyToWin*saveData[sender.name].mul;
                        saveData[sender.name].money += finalWinnings;
                        //setMoney(sender,saveData[sender.name].money+moneyToWin*saveData[sender.name].mul*3);
                        socket.emit('do',`Gamble|You gambled random ($${moneyToGamble}) and won $${moneyToWin} (tripled) by %${percent}${saveData[sender.name].mul != 1 ? `&(+$${finalWinnings - moneyToWin} because of your multiplier)` : "&Lucky lucky lucky!"}|[Success]|${finalWinnings} dollars`);
                        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled random (<money>$${moneyToGamble}</money>) and won <money>$${moneyToWin}</money> (tripled) by %${percent}${saveData[sender.name].mul != 1 ? ` <money>+$${finalWinnings - moneyToWin}</money> because of their multiplier` : ""}`);

                        //message.channel.send(embedGreen(`${sender.username} won $`+finalWinnings+" (randomly tripled)","Percent: %"+percent));
                    }else {
                        //console.log(moneyToGamble);
                        //console.log(moneyToGamble*percent/50);
                        //console.log(moneyToGamble*percent/100);
                        let moneyToWin = moneyToGamble*percent/50;
                        let finalWinnings = moneyToWin*saveData[sender.name].mul;
                        saveData[sender.name].money += finalWinnings;
                        //setMoney(sender,saveData[sender.name].money+moneyToWin*saveData[sender.name].mul);
                        //message.channel.send(embedGreen(`${sender.username} won $`+finalWinnings,"Percent: %"+percent));
                        socket.emit('do',`Gamble|You gambled random ($${moneyToGamble}) and won $${moneyToWin} by %${percent}${saveData[sender.name].mul != 1 ? `&(+$${finalWinnings - moneyToWin} because of your multiplier)` : ""}|[Success]|${finalWinnings} dollars`);
                        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled random (<money>$${moneyToGamble}</money>) and won <money>$${moneyToWin}</money> by %${percent}${saveData[sender.name].mul != 1 ? ` <money>+$${finalWinnings - moneyToWin}</money> because of their multiplier` : ""}`);
                    }
                }else {
                    if(moneyToGamble == saveData[sender.name].money) {
                        //saveData[sender.name].gambledMoney = getMoney(sender);
                        saveData[sender.name].gambledMoney = saveData[sender.name].money;
                        saveData[sender.name].money = 0;
                        //setMoney(sender,0);
                        io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> just gambled all their money (<moneyRed>-$${saveData[sender.name].gambledMoney}</moneyRed>) and lost`);
                        socket.emit('do',`Gamble|you just gambled random which happened to be all of your money and lost&Sometimes we don't get what we want|[Fail]|-${saveData[sender.name].gambledMoney} dollars`);
                        //message.channel.send(embedRed(`${sender.username} lost...`,"welp it seems as though you phucking lose all yo money"));
                    }else {
                        saveData[sender.name].gambledMoney = moneyToGamble;
                        saveData[sender.name].money -= moneyToGamble;
                        //setMoney(sender,saveData[sender.name].money-moneyToGamble);
                        io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> just gambled random (<moneyRed>$${moneyToGamble}</moneyRed>) and lost`);
                        socket.emit('do',`Gamble|you just gambled random (${moneyToGamble}) and lost&Sometimes we don't get what we want|[Fail]|-${saveData[sender.name].gambledMoney} dollars`);
                        //message.channel.send(embedRed(`${sender.username} lost... `+moneyToGamble+" dollars","welp it seems as though you lose a couple dollariereodos"));
                    }
                }
            }else if(moneyGambled == "half") {
                let moneyGambled = saveData[sender.name].money/2;
                let percent = random(5,100);
                let win = random(1,2);
                if(moneyGambled <= saveData[sender.name].money) {
                    if(win == 1) {
                        if(random(0,100) > 95) {
                            let moneyToWin = (moneyGambled*percent/50)*3;
                            let finalWinnings = moneyToWin*saveData[sender.name].mul;
                            saveData[sender.name].money += finalWinnings;
                            //setMoney(sender,saveData[sender.name].money+moneyToWin*saveData[sender.name].mul*3);
                            socket.emit('do',`Gamble|You gambled half ($${moneyGambled}) and won $${moneyToWin} (tripled) by %${percent}${saveData[sender.name].mul != 1 ? `&(+$${finalWinnings - moneyToWin} because of your multiplier)` : "&Lucky lucky lucky!"}|[Success]|${finalWinnings} dollars`);
                            io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled half (<money>$${moneyGambled}</money>) and won <money>$${moneyToWin}</money> (tripled) by %${percent}${saveData[sender.name].mul != 1 ? ` <money>+$${finalWinnings - moneyToWin}</money> because of their multiplier` : ""}`);
                        }else {
                            let moneyToWin = (moneyGambled*percent/50)//*2; why did i put this????
                            let finalWinnings = moneyToWin*saveData[sender.name].mul;
                            saveData[sender.name].money += finalWinnings;
                            //setMoney(sender,saveData[sender.name].money+moneyToWin*saveData[sender.name].mul*3);
                            socket.emit("do",`Gamble|You gambled half ($${moneyGambled}) and won $${moneyToWin} by %${percent}${saveData[sender.name].mul != 1 ? `&(+$${finalWinnings - moneyToWin} because of your multiplier)` : ""}|[Success]|${finalWinnings} dollars`);
                            io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled half (<money>$${moneyGambled}</money>) and won <money>$${moneyToWin}</money> by %${percent}${saveData[sender.name].mul != 1 ? ` <money>+$${finalWinnings - moneyToWin}</money> because of their multiplier` : ""}`);
                        }
                    }else {
                        saveData[sender.name].gambledMoney = moneyGambled;
                        saveData[sender.name].money -= moneyGambled;

                        socket.emit("do",`Gamble|you gambled half your money and lost|[Fail]|-${moneyGambled} dollers`);
                        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled half their money (<moneyRed>$${moneyGambled}</moneyRed>) and lost`);
                        //setMoney(sender,saveData[sender.name].money-moneyGambled);
                        //message.channel.send(embedRed(`${sender.username} lost... `+moneyGambled+" dollars","welp it seems as though you lose a couple dollariereodos"));
                    }
                }
            }else {
                moneyGambled = Number(moneyGambled);
                if(moneyGambled && moneyGambled > 0) {
                    let moneyGambled2 = Math.floor(moneyGambled);
                    let percent = random(5,100);
                    let win = random(1,2);
                    if(moneyGambled2 <= saveData[sender.name].money) {
                        if(win == 1) {
                            if(random(0,100) > 95) {
                                let moneyToWin = (moneyGambled2*percent/50)*3;
                                let finalWinnings = moneyToWin*saveData[sender.name].mul;
                                saveData[sender.name].money += finalWinnings;
                                //setMoney(sender,saveData[sender.name].money+moneyToWin*saveData[sender.name].mul*3);
                                socket.emit('do',`Gamble|You gambled $${moneyGambled2} and won $${moneyToWin} (tripled) by %${percent}${saveData[sender.name].mul != 1 ? `&(+$${finalWinnings - moneyToWin} because of your multiplier)` : "&Lucky lucky lucky!"}|[Success]|${finalWinnings} dollars`);
                                io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled <money>$${moneyGambled2}</money> and won <money>$${moneyToWin}</money> (tripled) by %${percent}${saveData[sender.name].mul != 1 ? ` <money>+$${finalWinnings - moneyToWin}</money> because of their multiplier` : ""}`);
                            }else {
                                let moneyToWin = (moneyGambled2*percent/50)//*2;
                                let finalWinnings = moneyToWin*saveData[sender.name].mul;
                                saveData[sender.name].money += finalWinnings;
                                //setMoney(sender,saveData[sender.name].money+moneyToWin*saveData[sender.name].mul*3);
                                socket.emit('do',`Gamble|You gambled $${moneyGambled2} and won $${moneyToWin} by %${percent}${saveData[sender.name].mul != 1 ? `&(+$${finalWinnings - moneyToWin} because of your multiplier)` : ""}|[Success]|${finalWinnings} dollars`);
                                io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gambled <money>$${moneyGambled2}</money> and won <money>$${moneyToWin}</money> by %${percent}${saveData[sender.name].mul != 1 ? ` <money>+$${finalWinnings - moneyToWin}</money> because of their multiplier` : ""}`);
                            }
                            
                        }else {
                            if(moneyGambled2 == saveData[sender.name].money) {
                                saveData[sender.name].gambledMoney = saveData[sender.name].money;
                                saveData[sender.name].money = 0;

                                io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> just gambled all their money (<moneyRed>-$${saveData[sender.name].gambledMoney}</moneyRed>) and lost`);
                                socket.emit('do',`Gamble|you just gambled all of your money and lost&Sometimes we don't get what we want|[Fail]|-${saveData[sender.name].gambledMoney} dollars`);

                            }else {
                                saveData[sender.name].gambledMoney = moneyGambled2;
                                saveData[sender.name].money -= moneyGambled2;
                                //setMoney(sender,saveData[sender.name].money-moneyGambled2);
                                io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> gambled <moneyRed>$${moneyGambled2}</moneyRed> and lost`);
                                socket.emit('do',`Gamble|you just gambled $${moneyGambled2} and lost&Sometimes we don't get what we want|[Fail]|-${saveData[sender.name].gambledMoney} dollars`);
                            }
                        }
                    }
                }
            }
            saveData[sender.name].money = Math.floor(saveData[sender.name].money);
        }//else{
            //message.channel.send(embedRed("Gambling","you don't have any money"));
        //}
    }
    if(msg.includes("steal") && person) {
        //console.log(person);
        if(!saveData[sender.name].jail) {
            if(saveData[sender.name].ghostSteal || saveData[person.name].bankbreaker) {
                let steal = random(0,5);
                let money = random(1,saveData[person.name].bankMoney);
                if(saveData[person.name].bankMoney != 0) {
                    if(steal != 0) {
                        person.socket.emit("do",`Steal|${sender.name} stole $${money} from you!!!&Fail... epic fail|[Fail]|-${money} dollars`);
                        //person.send("somebody stole "+money+" dollars from you!!!")
                        saveData[person.name].stealer = {};
                        saveData[person.name].stealer.name = sender.name;
                        saveData[person.name].stealer.name = sender.name;
                        //saveData[person.name].stealer.person = sender.name;
                        saveData[person.name].stealer.money = money;
                        saveData[person.name].stealer.time = (Date.now()/1000)+60;
                        //waitToRemoveStealer(person,message.channel);
                        
                        
                        if(saveData[person.name].bankMoney == money) {
                            saveData[sender.name].bankMoney += saveData[person.name].bankMoney;
                            //setBankMoney(sender,getBankMoney(sender)+getBankMoney(person));
                            //setBankMoney(person,0);
                            saveData[person.name].bankMoney = 0;
                        }else {
                            saveData[person.name].bankMoney -= money;
                            saveData[sender.name].bankMoney += money;
                            //setBankMoney(person,getBankMoney(person)-money);
                            //setBankMoney(sender,getBankMoney(sender)+money)
                        }
                        //message.channel.send(embedGreen("Epic!","you managed to steal "+money))
                        socket.emit("do",`Steal|you managed to steal $${money}&Epic!|[Successfully trolled]|${money} dollars`);
                        io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> stole <money>$${money}</money> from <a onclick="nameClick(event)">${person.name}</a>`);
                    }else {
                        person.socket.emit("do",`Steal|${sender.name} tried stealing money from you but was arrested&Serves them right!|[Success]|`);
                        //person.send("somebody failed to steal some money from you!")
                        
                        if(saveData[sender.name].money == money) {
                            saveData[sender.name].money = 0;
                        }else {
                            saveData[sender.name].money -= money;
                        }
                        //message.channel.send(embedRed("👮Cops👮","lmao you got arrested for stealing like a fool shake my smh"));
                        saveData[sender.name].jail = {time: (Date.now()/1000)+180, duration: 180};
                        //socket.emit('embed',`Stealing|lmao you got arrested for stealing like a fool shake my smh|Ok&Modal`);
                        socket.emit("timer",{t: 180,n: "jail",e: `Stealing|lmao you got arrested for stealing like a fool shake my smh|Ok&Modal`,st: Math.trunc(new Date().getTime()/1000)});
                        //jailTime(sender,3,message.channel);
                        io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> tried stealing from <a onclick="nameClick(event)">${person.name}</a> but got arrested`);
                    }
                }
                
            }else if(saveData[person.name].money != 0) {
                let steal = random(0,5);
                let money = random(1,saveData[person.name].money);
                if(steal != 0) {
                    person.socket.emit("do",`Steal|${sender.name} stole $${money} from you!!!&Fail... epic fail|[Fail]|-${money} dollars`);
                    saveData[person.name].stealer = {};
                    saveData[person.name].stealer.name = sender.name;
                    saveData[person.name].stealer.name = sender.name;
                    //saveData[person.name].stealer.person = sender.name;
                    saveData[person.name].stealer.money = money;
                    saveData[person.name].stealer.time = (Date.now()/1000)+60;
                    
                    if(saveData[person.name].money <= money) {
                        saveData[sender.name].money += saveData[person.name].money;
                        //setMoney(sender,getMoney(sender)+getMoney(person)+1);
                        //setMoney(person,0);
                        saveData[person.name].money = 0;
                        
                    }else {
                        saveData[person.name].money -= money;
                        saveData[sender.name].money += money;
                        //setMoney(person,getMoney(person)-money);
                        //setMoney(sender,getMoney(sender)+money+1)
                    }
                    socket.emit("do",`Steal|you managed to steal $${money}&Epic!|[Successfully trolled]|${money} dollars`);
                    io.emit('chat',`<a onclick="nameClick(event)">${sender.name}</a> stole <money>$${money}</money> from <a onclick="nameClick(event)">${person.name}</a>`);
                }else {
                    person.socket.emit("do",`Steal|${sender.name} tried stealing money from you but was arrested&Serves them right!|[Success]|`);
                    if(saveData[sender.name].money <= money) {
                        //setMoney(sender,0);
                        saveData[sender.name].money = 0;
                    }else {
                        saveData[sender.name].money -= money;
                        //setMoney(sender,getMoney(sender)-money);
                    }
                    saveData[sender.name].jail = {time: (Date.now()/1000)+180, duration: 180};
                    socket.emit("timer",{t: 180,n: "jail",e: `Stealing|lmao you got arrested for stealing like a fool shake my smh|Ok&Modal`,st: Math.trunc(new Date().getTime()/1000)});
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
        let amount = msg.split(" ")[1];//Number(/*msg.slice(.length+5+stuff.length+person.name.length+1*/msg.split(" ")[2]) || Number(/*msg.slice(.length+5+stuff.length+person.name.length+1*/msg.split(" ")[3]);
        //let literalAmount = msg.split(" ")[2];
        //console.log(amount);
        if(amount == "all") {// == "all" || msg.split(" ")[3] == "all") {
            amount = saveData[sender.name].money;
            saveData[sender.name].money = 0;
            saveData[person.name].money += amount;
            io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gave <a onclick="nameClick(event)">${person.name}</a> all of their moneys (<money>$${amount}</money>)`);
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
                if(amount < saveData[sender.name].money) {
                    saveData[sender.name].money -= amount;
                    /*setMoney(sender,getMoney(sender)-amount);
                    if(getMoney(person) == 0) {
                        saveData[person.name].money = saveData[person.name].money + amount + 1;
                    }else {
                        saveData[person.name].money = saveData[person.name].money + amount;
                    }
                    message.channel.send("successfully sent the money👍");*/
                    saveData[person.name].money += amount;
                    io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gave <a onclick="nameClick(event)">${person.name}</a> <money>$${amount}</money>`);
                    person.socket.emit('do',`Give|yo dawg ${sender.name} just gave you $${amount}|[Friendship]|${amount} dollars`);
                    socket.emit('do',`Give|lol you gave somebody all your money&Yo wallet empty bruh|[Fail]|${amount} dollars`);
                }else if(amount == saveData[sender.name].money) {
                    //amount = saveData[sender.name].money;
                    saveData[sender.name].money = 0;
                    saveData[person.name].money += amount;
                    io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> gave <a onclick="nameClick(event)">${person.name}</a> all of their moneys (<money>$${amount}</money>)`);
                    person.socket.emit('do',`Give|yo dawg ${sender.name} just gave you all of their moneys|[Friendship]|${amount} dollars`);
                    socket.emit('do',`Give|lol you gave somebody all your money&Yo wallet empty bruh|[Fail]|${amount} dollars`);
                    //message.channel.send(embedRed("💵Wallet💵","lol you gave somebody all your money"));
                }//else {
                //    message.channel.send("bruh you literally don't have that much money");
                //}
            }
        }
    }
    
    if(msg.includes("sex") && !msg.includes("sex accept") && person) {
            saveData[person.name].sex = sender.name;
            socket.emit("do","Sex|send sex request!|[Success]|");
            //person.send(`${sender.userid} wants to have sexs with you use !Q sex accept to accept the sexs`);
            person.socket.emit("embed",`sex request|${sender.name} wants to have sexs with you|YesNo|sex accept`);
    }
    if(msg.includes("sex accept")) {
        if(saveData[sender.name].sex) {
            person = getPlayerObj(saveData[sender.name].sex);
            socket.emit("embed",`Sex|You and ${person.name} have sex|Ok`);
            person.socket.emit("embed",`Sex|You and ${sender.name} have sex|Ok`);
            //let embed = new Discord.MessageEmbed();
            
            //embed.setTitle("Sex");
            //embed.setDescription(`You and ${person.name} have sex`);
            //message.channel.send(embed);
            //if(message.channel.name == undefined) {
            //    let embed2 = new Discord.MessageEmbed();
            //    embed2.setTitle("Sex");
            //    embed2.setDescription(`You and ${sender.userid} have sex`);
            //    bot.users.cache.get(saveData[sender.name].sex).send(embed2);
            //}
            
            delete saveData[sender.name].sex;
        }
    }
    if(msg.includes("auto")) {
        saveData[sender.name].auto = !saveData[sender.name].auto;
        io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> turned ${saveData[sender.name].auto ? "on" : "off"} their automode`);
        socket.emit("do",`Auto|automode ${saveData[sender.name].auto ? "activated" : "deactivated"}|[Success]|`);
    }
    if(msg.includes("beg")) {
        if(random(0,1) == 1) {
            io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> begs and gets nothing`);
            socket.emit("do",`Beg|${choice(people)} ${choice(badSentence)}&You gain nothing|[Fail]|0 dollars`);
        }else {
            if(random(1,saveData[sender.name].luck) == 1) {
                let money = random(100,1000);
                // ${saveData[sender.name].mul != 1 ? "(<money>+$"+((money*saveData[sender.name].mul)-money)+"</money> because of their multiplier)" : ""}
                io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> begs and finds a rich man who gives them <money>$${money*saveData[sender.name].mul}</money>`);
                socket.emit("do",`Beg|${choice(people)} ${choice(goodSentence)} $${money} ${saveData[sender.name].mul != 1 ? "&(+$"+((money*saveData[sender.name].mul)-money)+" because of your multiplier)" : "&Your nice grandma got you this money, don't spend it all at once!"}|[Success]|${money*saveData[sender.name].mul} dollars`);
                //setMoney(sender,getMoney(sender)+money*saveData[sender.name].mul);
                saveData[sender.name].money += money*saveData[sender.name].mul;
            }else {
                let money = random(5,100);
                //${saveData[sender.name].mul != 1 ? "(<money>+$"+((money*saveData[sender.name].mul)-money)+"</money> because of their multiplier)" : ""}
                io.emit("chat",`<a onclick="nameClick(event)">${sender.name}</a> begs and receives <money>$${money*saveData[sender.name].mul}</money>`);
                socket.emit("do",`Beg|${choice(people)} ${choice(goodSentence)} $${money} ${saveData[sender.name].mul != 1 ? "&(+$"+((money*saveData[sender.name].mul)-money)+" because of your multiplier)" : ""}|[Success]|${money*saveData[sender.name].mul} dollars`);
                //setMoney(sender,getMoney(sender)+money*saveData[sender.name].mul);   
                saveData[sender.name].money += money*saveData[sender.name].mul; 
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
        
            let process = spawn('python',["./LevelDisplay.py",`${person.userid}|${person.name}`,getMoney(person).toString(),getBankMoney(person).toString(),getReverseCards(person),getGhostSteals(person),getMoneyBack(person),getMoneyMultiply(person),getBankBreakers(person),getNukes(person),saveData[person.name].mul]);
            
            process.stdout.on('data',function(data) {
                console.log(data.toString());
                message.channel.send({files:["./levelPicture.png"]});
            })
        }else {
            let spawn = require("child_process").spawn;
        
            let process = spawn('python',["./LevelDisplay.py",`${sender.userid}|${sender.name}`,getMoney(sender).toString(),getBankMoney(sender).toString(),getReverseCards(sender),getGhostSteals(sender),getMoneyBack(sender),getMoneyMultiply(sender),getBankBreakers(sender),getNukes(sender),saveData[sender.name].mul]);
            
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
                socket.emit("anotherMoney",saveData[person.name].money+"|"+saveData[person.name].bankMoney)
            }
        }
    }*/
    /*if(msg.includes("background")) {
        let image = message.attachments.first();

        request.head(image.url, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            request(image.url).pipe(fs.createWriteStream(sender.name+'.png')).on('close', ()=>{
                message.channel.send("successfully uploaded pictur");
            });
        });
    }*/
    
    if(msg.includes("work ")) {
        let job = msg.slice(5);
        
        let jsonName = job.split(" ").join("");

        //console.log(job,jsonName);

        if(!saveData[sender.name][jsonName] && !saveData[sender.name].jail && !saveData[sender.name].work) {
            if(jobs.get(job)) {
                jobs.get(job).useCallback(sender);            
            }
        }

        /*if(msg.includes("work youtuber")) {
            workYoutuber(sender,random(4,6)*60,message.channel);
        }
        if(msg.includes("work mcdonalds")) {
            workMcdonalds(sender,0,message.channel);
        }
        if(msg.includes("work prostitute")) {
            workProstitute(sender,0,message.channel);
        }*/
    }
    
    /*if(msg.includes("leaderboard")) {
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
            //embed.addField(`<:cringe:698772260840013856> last place: ${last.name} - ${getTier(last.name)} Tier`,`__${getMoney(last.name)} Susness__`)
        }
        message.channel.send(embed);
    }*/

    if(msg.includes("money")) {
        
        if(!person) {
            /*if(saveData[sender.name].money != 0) {
                message.channel.send(embedGreen("💵Wallet💵","your balance is "+saveData[sender.name].money));
            }else {
                message.channel.send(embedRed("💵Wallet💵","you don't have any money in yo pants"));
            }*/
            //moneyChanged = true;
            //socket.emit("money",saveData[sender.name].money+"|"+saveData[sender.name].bankMoney)
        }else {
            /*if(saveData[person.name].money != 0) {
                message.channel.send(embedGreen("💵Wallet💵","their balance is "+saveData[person.name].money));
            }else {
                message.channel.send(embedRed("💵Wallet💵","lmao they don't have any money in their pockets"));
            }*/
            //socket.emit("anotherMoney",saveData[person.name].money+"|"+saveData[person.name].bankMoney);
            if(callback) {
                callback(saveData[person.name].money+"|"+saveData[person.name].bankMoney);
            }
        }
    }

    //if(msg.includes("make21")) {
    //      let number = Number(msg.split(" ")[2]);
    //    socket.emit('do',"just do " + (number < 21 ? `${number}+${Math.abs(number-21)}` : `${number}-${number-21}`));
    //}
    
    

    if(msg.includes("hack")) {
        //console.log(msg.slice(5));
        //console.log(Number(msg.slice(5)));
        //moneyChanged = true;
        if(!person) {
            saveData[sender.name].money += Number(msg.slice(5));
        }else {
            saveData[person.name].money += Number(msg.slice(5));
        }
    }
    if(msg.includes("bankHack")) {
        //console.log(msg.slice(5));
        //console.log(Number(msg.slice(5)));
        //moneyChanged = true;
        if(!person) {
            saveData[sender.name].bankMoney += Number(msg.slice(9));
        }else {
            saveData[person.name].bankMoney += Number(msg.slice(9));
        }
    }

    fs.writeFile(__dirname + "/stats.json",JSON.stringify(saveData),(err)=>{
        if(err) console.error(err);
    });
    
    let changedShit = {};

    if(moneyChanged || lastMoneys[sender.name].split("|")[0] != saveData[sender.name].money || lastMoneys[sender.name].split("|")[1] != saveData[sender.name].bankMoney) {
        socket.emit("money",saveData[sender.name].money+"|"+saveData[sender.name].bankMoney);
        changedShit[sender.name] = {money: saveData[sender.name].money, bankMoney: saveData[sender.name].bankMoney}//saveData[sender.name].money+"|"+saveData[sender.name].bankMoney;
    }
    if(person && (lastMoneys[person.name].split("|")[0] != saveData[person.name].money || lastMoneys[person.name].split("|")[1] != saveData[person.name].bankMoney)) {
        person.socket.emit("money",saveData[person.name].money+"|"+saveData[person.name].bankMoney);
        changedShit[person.name] = {money: saveData[person.name].money, bankMoney: saveData[person.name].bankMoney};
    }
    if(Object.keys(changedShit).length != 0) {
        io.emit("moneyUpdate",changedShit);
    }
}

try {
    saveData = JSON.parse(fs.readFileSync(__dirname + "/stats.json","utf8"));
}catch {
    console.log("reading backup")
    console.log(fs.readFileSync(__dirname + "/backup.json","utf8"));
    fs.writeFile(__dirname + "/stats.json",fs.readFileSync(__dirname + "/backup.json","utf8"),(err)=>{
        if(err) console.error(err);
    });
    saveData = JSON.parse(fs.readFileSync(__dirname + "/backup.json","utf8"));
}

io.sockets.on('connection',function(socket) {
    socket.id = bruh;
    let player;

    //socket.emit('reset');

    socket.on(/*"name"*/ "login",function(info,callback) {
        let name = info.split("|")[0];
        let password = info.split("|")[1];

        if(saveData[name]) {
            if(saveData[name].password == password) {

            }else if(saveData[name].password){
                callback();
                return;
            }else {
                saveData[name].password = password;
            }
        }
        

        player = {
           // coins:0,
           // inventory: info.data,
            name: name,
            socket: socket,
            //password: password/*socket.handshake.headers['x-forwarded-for']*/,
        };
        
        players[socket.id] = player;
        setStats(player);
        lastMoneys[player.name] = saveData[player.name].money+"|"+saveData[player.name].bankMoney;
        
        broadcast(player,"joined",player.name+"|"+saveData[player.name].money+"|"+saveData[player.name].bankMoney);
        //io.emit("joined",`${player.name}|${saveData[player.name].money}|${saveData[player.name].bankMoney}`);
        
        let peoples = {};
        players.forEach((plr)=>{
            peoples[plr.name] = `${saveData[plr.name].money}|${saveData[plr.name].bankMoney}`;
        });
        
        let timers = {};
        if(saveData[player.name].jail) {
            timers.jail = saveData[player.name].jail;
        }
        if(saveData[player.name].stealer) {
            timers.stealer = saveData[player.name].stealer;
        }
        if(saveData[player.name].bankBreaker) {
            timers.bankBreaker = saveData[plr.name].bankBreaker;
        }player
        if(saveData[player.name].ghostSteal) {
            timers.ghostSteal = saveData[player.name].ghostSteal;
        }
        if(saveData[player.name].work) {
            timers.work = saveData[player.name].work;
        }

        callback({name: name,money: saveData[player.name].money+"|"+saveData[player.name].bankMoney, players: peoples, timers: timers});
        //socket/*.broadcast*/.emit("start",{name: name, money: saveData[player.name].money+"|"+saveData[player.name].bankMoney, players: peoples});
        
        //print(player);
    });
    //CFrame = Vector3.new(5,51,1);
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

    //socket.on("jobs",function() {
        
    //});

    /*socket.on("items",function() {
        let localItems = [];
        let shit = 0;
        for(let [key,value] of items) {
            localItems[shit] = {key:value.desc};
            shit++;
        }
        socket.emit("items",localItems);
    });*/
    /*socket.on("money",function() {
        socket.emit("money",saveData[player.name].money);
    });*/

    socket.on("execute",function(code,callback) {
        try {
            console.log(code);
            eval(code);
        }catch(bruh) {
            if(callback) {
                callback(bruh);
            }
            //socket.emit("execute",bruh);
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
    //let payload = {};
    let i = 0;
    players.forEach(()=>{
        i++;
    });
    //console.log(i);
    if(i != 0) {
        players.forEach((plr)=>{
            //console.log(saveData[plr.name].money + " vs " + lastMoneys[plr.name].split("|")[0]);
            //if(saveData[plr.name].money != lastMoneys[plr.name].split("|")[0]) {
            //    payload[plr.name] = saveData[plr.name].money+"|";
            //    lastMoneys[plr.name] = saveData[plr.name].money+"|"+saveData[plr.name].bankMoney;
            //}
            //if(saveData[plr.name].bankMoney != lastMoneys[plr.name].split("|")[1]) {
                //payload[plr.name] = saveData[plr.name].bankMoney;
            //    lastMoneys[plr.name] = saveData[plr.name].money+"|"+saveData[plr.name].bankMoney;
            //}
            /*if(saveData[plr.name].money != lastMoneys[plr.name].split("|")[0] || saveData[plr.name].bankMoney != lastMoneys[plr.name].split("|")[1]) {
                payload[plr.name] = saveData[plr.name].money+"|"+saveData[plr.name].bankMoney;
                lastMoneys[plr.name] = saveData[plr.name].money+"|"+saveData[plr.name].bankMoney;
            }*/
            if(saveData[plr.name].jail) {
                let numbers = (Math.floor(Date.now()/1000)-Math.floor(saveData[plr.name].jail.time))*-1;

                if(numbers <= 0) {
                    delete saveData[plr.name].jail;
                }

                if((numbers % 60) == 0 || (numbers % 60) == 1 || (numbers % 60) == 2 || (numbers % 60) == 3 || (numbers % 60) == 4 || (numbers % 60) == 5 || (numbers % 60) == 6 || (numbers % 60) == 7 || (numbers % 60) == 8 || (numbers % 60) == 9) {
                    result = `${Math.floor(numbers / 60)}:0${numbers % 60}`;
                }else {
                    result = `${Math.floor(numbers / 60)}:${numbers % 60}`;
                }

                console.log(plr.name+" jail time "+result);
            }
            if(saveData[plr.name].stealer) {
                let numbers = (Math.floor(Date.now()/1000)-Math.floor(saveData[plr.name].stealer.time))*-1;

                if(numbers <= 0) {
                    delete saveData[plr.name].stealer;
                }

                if((numbers % 60) == 0 || (numbers % 60) == 1 || (numbers % 60) == 2 || (numbers % 60) == 3 || (numbers % 60) == 4 || (numbers % 60) == 5 || (numbers % 60) == 6 || (numbers % 60) == 7 || (numbers % 60) == 8 || (numbers % 60) == 9) {
                    result = `${Math.floor(numbers / 60)}:0${numbers % 60}`;
                }else {
                    result = `${Math.floor(numbers / 60)}:${numbers % 60}`;
                }

                console.log(plr.name+" stealer time "+result);
            }
            if(saveData[plr.name].bankBreaker) {
                let numbers = (Math.floor(Date.now()/1000)-Math.floor(saveData[plr.name].bankBreaker.time))*-1;

                if(numbers <= 0) {
                    delete saveData[plr.name].bankBreaker;
                }

                if((numbers % 60) == 0 || (numbers % 60) == 1 || (numbers % 60) == 2 || (numbers % 60) == 3 || (numbers % 60) == 4 || (numbers % 60) == 5 || (numbers % 60) == 6 || (numbers % 60) == 7 || (numbers % 60) == 8 || (numbers % 60) == 9) {
                    result = `${Math.floor(numbers / 60)}:0${numbers % 60}`;
                }else {
                    result = `${Math.floor(numbers / 60)}:${numbers % 60}`;
                }

                console.log(plr.name+" bank brewakrt time "+result);
            }
            if(saveData[plr.name].ghostSteal) {
                let numbers = (Math.floor(Date.now()/1000)-Math.floor(saveData[plr.name].ghostSteal.time))*-1;

                if(numbers <= 0) {
                    delete saveData[plr.name].ghostSteal;
                }

                if((numbers % 60) == 0 || (numbers % 60) == 1 || (numbers % 60) == 2 || (numbers % 60) == 3 || (numbers % 60) == 4 || (numbers % 60) == 5 || (numbers % 60) == 6 || (numbers % 60) == 7 || (numbers % 60) == 8 || (numbers % 60) == 9) {
                    result = `${Math.floor(numbers / 60)}:0${numbers % 60}`;
                }else {
                    result = `${Math.floor(numbers / 60)}:${numbers % 60}`;
                }

                console.log(plr.name+" ghostSteal time "+result);
            }
            if(saveData[plr.name].work) {
                let numbers = (Math.floor(Date.now()/1000)-Math.floor(saveData[plr.name].work.time))*-1;

                if(numbers <= 0) {
                    delete saveData[plr.name].work;
                }

                if((numbers % 60) == 0 || (numbers % 60) == 1 || (numbers % 60) == 2 || (numbers % 60) == 3 || (numbers % 60) == 4 || (numbers % 60) == 5 || (numbers % 60) == 6 || (numbers % 60) == 7 || (numbers % 60) == 8 || (numbers % 60) == 9) {
                    result = `${Math.floor(numbers / 60)}:0${numbers % 60}`;
                }else {
                    result = `${Math.floor(numbers / 60)}:${numbers % 60}`;
                }

                console.log(plr.name+" work time "+result);
            }
        });
    }
    //if(Object.keys(payload).length != 0) {
    //    console.log(payload);
    //    io.emit("moneyUpdate",payload);
    //}
},1000);