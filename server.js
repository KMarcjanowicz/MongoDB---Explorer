var http = require("http");
var mongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID;
var Operations = require("./modules/Operations.js")
var _db;
var opers = new Operations();
var fs = require("fs");
var qs = require("querystring")
var coll;
var ip = "";

var server = http.createServer(function (req, res) {
    console.log(req.url)
    if (req.url == "/") {
        fs.readFile("StaticDir/index.html", function (error, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    }
    else if (req.url == "/script.js") {
        fs.readFile("StaticDir/script.js", function (error, data) {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.write(data);
            res.end();
        });
    }
    else if (req.url == "/themes/theme.css") {
        fs.readFile("themes/theme.css", function (error, data) {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
        });
    }
    else if (req.url == "/gfx/db.png") {
        fs.readFile("StaticDir/gfx/db.png", function (error, data) {
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.write(data);
            res.end();
        });
    }
    else if (req.url == "/gfx/coll.png") {
        fs.readFile("StaticDir/gfx/coll.png", function (error, data) {
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.write(data);
            res.end();
        });
    }
    else if (req.url == "/connect") {
        var allData = "";
        req.on("data", function (data) {
            console.log("data: " + data)
            allData += data;
        })
        req.on("end", function (data) {
            var finish = qs.parse(allData)
            ip = finish.server;
            var msg = "";
            console.log(ip);
            mongoClient.connect("mongodb://" + finish.server, function (err, db) {
                if (err) {
                    console.log(err);
                    msg = "Nie udało się połączyć z serwerem!";
                }
                else {
                    console.log("mongo podłączone")
                    msg = "Udało się połączyć z serwerem!";
                }
                opers.ListDBs(db, function (data) {
                    res.end(JSON.stringify({ comm: msg, data }));
                });
                _db = db;
            })
        })
    }
    else if (req.url == "/colls") {
        var allData = "";
        req.on("data", function (data) {
            console.log("data: " + data)
            allData += data;
        })
        req.on("end", function (data) {
            var finish = qs.parse(allData)
            console.log(finish);
            mongoClient.connect("mongodb://" + ip + "/" + finish.name, function (err, db) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("mongo podłączone")
                }
                opers.ListColls(db, function (data) {
                    res.end(JSON.stringify(data));
                });
            })
        })
    }
    else if (req.url == "/db_create") {
        var allData = "";
        req.on("data", function (data) {
            console.log("data: " + data)
            allData += data;
        })
        req.on("end", function (data) {
            var finish = qs.parse(allData)
            var msg = "";
            console.log(finish.db);
            mongoClient.connect("mongodb://" + ip + "/" + finish.db, function (err, db) {
                if (err) {
                    console.log(err);
                    msg = "Nie udało się stworzyć bazy danych!";
                }
                else {
                    console.log("mongo podłączone")
                    msg = "Udało się stworzyć bazę danych!!";
                }
                db.createCollection("default", function (err, coll) {
                    console.log(coll)
                    opers.ListDBs(db, function (data) {
                        res.end(JSON.stringify({ comm: msg, data }));
                    });
                })
            })
        })
    }
    else if (req.url == "/db_delete") {
        var allData = "";
        req.on("data", function (data) {
            console.log("data: " + data)
            allData += data;
        })
        req.on("end", function (data) {
            var finish = qs.parse(allData)
            var msg = "";
            console.log(finish.db);
            mongoClient.connect("mongodb://" + ip + "/" + finish.db, function (err, db) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("mongo podłączone")
                }
                opers.DeleteDB(db, function (data) {
                    msg = "baza zostałą usunięta!";
                })
                setTimeout(function () {
                    opers.ListDBs(db, function (data) {
                        res.end(JSON.stringify({ comm: msg, data }));
                    });
                }, 1000);
            })
        })
    }
    else if (req.url == "/coll_create") {
        var allData = "";
        req.on("data", function (data) {
            console.log("data: " + data)
            allData += data;
        })
        req.on("end", function (data) {
            var finish = qs.parse(allData)
            var msg = "";
            console.log(finish);
            mongoClient.connect("mongodb://" + ip + "/" + finish.db, function (err, db) {
                if (err) {
                    console.log(err);
                    msg = "Nie udało się stworzyć bazy danych!";
                }
                else {
                    console.log("mongo podłączone")
                    msg = "Udało się stworzyć bazę danych!!";
                }
                db.createCollection(finish.coll, function (err, coll) {
                    console.log(coll)
                    opers.ListDBs(db, function (data) {
                        res.end(JSON.stringify({ comm: msg, data }));
                    });
                })
            })
        })
    }
    else if (req.url == "/coll_delete") {
        var allData = "";
        req.on("data", function (data) {
            console.log("data: " + data)
            allData += data;
        })
        req.on("end", function (data) {
            var finish = qs.parse(allData)
            var msg = "";
            console.log(finish);
            mongoClient.connect("mongodb://" + ip + "/" + finish.db, function (err, db) {
                if (err) {
                    console.log(err);
                    msg = "Nie udało się usunąć kolekcji!";
                }
                else {
                    console.log("mongo podłączone")
                    msg = "Udało się usunąć kolekcję!";
                }
                db.collection(finish.coll).drop(function (err, res) {
                });
                setTimeout(function () {
                    opers.ListDBs(db, function (data) {
                        res.end(JSON.stringify({ comm: msg, data }));
                    });
                }, 1000);
            })
        })
    }
    else if (req.url == "/docs") {
        var allData = "";
        req.on("data", function (data) {
            console.log("data: " + data)
            allData += data;
        })
        req.on("end", function (data) {
            var finish = qs.parse(allData)
            var msg = "";
            console.log(finish);
            mongoClient.connect("mongodb://" + ip + "/" + finish.db, function (err, db) {
                if (err) {
                    console.log(err);
                    msg = "Nie udało się uzyskać dokumentów!";
                }
                else {
                    console.log("mongo podłączone")
                    msg = "Udało się uzyskać dokumenty!";
                }
                db.createCollection(finish.coll, function (err, coll) {
                    opers.SelectAll(coll, function (data) {
                        console.log("----------------- Pobane: --------------------------------------------")
                        console.log(data)
                        console.log("----------------- Koniec Pobane: -------------------------------------")
                        res.end(JSON.stringify({ comm: msg, data }));
                    });
                })
            })
        })
    } else if (req.url == "/delete_doc") {
        var allData = "";
        req.on("data", function (data) {
            console.log("data: " + data)
            allData += data;
        })
        req.on("end", function (data) {
            var finish = qs.parse(allData)
            var msg = "";
            console.log(finish);
            mongoClient.connect("mongodb://" + ip + "/" + finish.db, function (err, db) {
                db.collection(finish.coll, {}, function (err, coll) {
                    coll.remove({ _id: ObjectID(finish.id) }, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(result);
                        db.close();
                    });
                });
            });
        })
    }
    else if (req.url == "/create_user") {
        var allData = "";
        req.on("data", function (data) {
            console.log("data: " + data)
            allData += data;
        })

        req.on("end", function (data) {
            var finish = qs.parse(allData)
            var msg = "";
            console.log(finish);
            mongoClient.connect("mongodb://" + ip + "/" + finish.db, function (err, db) {
                if (err) {
                    console.log(err);
                    msg = "Nie udało się uzyskać dokumentów!";
                }
                else {
                    console.log("mongo podłączone")
                    msg = "Udało się uzyskać dokumenty!";
                }
                var rec = { login: finish.login, passwd: finish.passwd };
                db.createCollection(finish.coll, function (err, coll) {
                    opers.Insert(coll, rec);
                    opers.SelectAll(coll, function (data) {
                        console.log("----------------- Pobane: --------------------------------------------")
                        console.log(data)
                        console.log("----------------- Koniec Pobane: -------------------------------------")
                        res.end(JSON.stringify({ comm: msg, data }));
                    });
                })
            })
        })
    }
})

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});
