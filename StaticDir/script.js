$(document).ready(function () {
    var ip = "";
    var selected_db;
    var selected_coll;
    var name = "";
    var db;
    var coll;

    function DrawColl(name) {
        var i = $("<img>");
        i.attr("src", "gfx/coll.png");
        i.css("width", "50px;");
        i.css("height", "50px;");
        var l = $("<label>")
        l.attr("value", name);
        l.attr("class", "l");
        var p = $("<p>");
        p.text(name);
        l.on("click", function () {
            coll = l.attr("value");
            $("#info").html("Database: " + db + ", Collection: " + coll);
            console.log(db, coll);
            $.ajax({
                url: "/docs",
                data: { db: db, coll: coll },
                type: "POST",
                success: function (data) {
                    $("#docs").html("");
                    var obj = JSON.parse(data);
                    console.log(obj);
                    console.log(obj.data.length)
                    for (var i = 0; i < obj.data.length; i++) {
                        var d = $("<div>");
                        $(d).attr("class", "d");
                        var t = $("<textarea>");
                        $(t).attr("class", "t");
                        $(t).append("{\n");
                        $(t).append("   login: " + obj.data[i].login + "\n");
                        $(t).append("   passwd: " + obj.data[i].passwd + "\n");
                        $(t).append("   _id: " + obj.data[i]._id + "\n");
                        $(t).append("}\n");
                        var b = $("<button>");
                        $(b).attr("class", "b");
                        $(b).attr("value", obj.data[i]._id);
                        $(b).text("Usuń rekord");
                        $(b).on("click", function () {
                            $.ajax({
                                url: "/delete_doc",
                                data: { db: db, coll: coll, id: b.attr("value") },
                                type: "POST",
                                success: function (data) {
                                    $("#show_colls").html("");
                                    var obj = JSON.parse(data);
                                    console.log(obj);
                                },
                                error: function (xhr, status, error) {
                                    console.log(xhr);
                                },
                            });
                        });
                        $(d).append(t);
                        $(d).append(b);
                        $("#docs").append(d);
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                },
            });
        });
        l.append(i);
        l.append(p);
        $("#show_colls").append(l);
    }

    function DrawDB(name) {
        var i = $("<img>");
        i.attr("src", "gfx/db.png");
        i.css("width", "50px;");
        i.css("height", "50px;");
        var l = $("<label>")
        l.attr("value", name);
        l.attr("class", "l");
        var p = $("<p>");
        p.text(name);

        l.append(i);
        l.append(p);
        l.on("click", function () {
            db = l.attr("value");
            console.log(db);
            $.ajax({
                url: "/colls",
                data: { name: l.attr("value") },
                type: "POST",
                success: function (data) {
                    $("#show_colls").html("");
                    var obj = JSON.parse(data);
                    console.log(obj);
                    console.log(obj.length);
                    console.log(obj[0].name);
                    for (var i = 0; i < obj.length; i++) {
                        DrawColl(obj[i].name);
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                },
            });
        });
        $("#show_dbs").append(l);
    }

    $("#b_connect").on("click", function () {
        $(this).css("border-style", "inset");
        $(this).css("background-color", "red");

        ip = prompt("Please enter server ip: ", "127.0.0.1");
        $.ajax({
            url: "/connect",
            data: { server: ip },
            type: "POST",
            success: function (data) {
                $("#show_dbs").html("");
                var obj = JSON.parse(data);
                console.log(obj);
                alert(obj.comm);
                for (var i = 0; i < obj.data.databases.length; i++) {
                    DrawDB(obj.data.databases[i].name);
                }
                $("#b_connect").css("border-style", "outset");
                $("#b_connect").css("background-color", "blue");
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    });

    $("#b_db_create").on("click", function () {
        name = prompt("Please enter database name: ", "default_db_name");
        $.ajax({
            url: "/db_create",
            data: { db: name },
            type: "POST",
            success: function (data) {
                $("#show_dbs").html("");
                var obj = JSON.parse(data);
                console.log(obj);
                alert(obj.comm);
                for (var i = 0; i < obj.data.databases.length; i++) {
                    DrawDB(obj.data.databases[i].name);
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    });
    $("#b_db_delete").on("click", function () {
        name = prompt("Please enter database name: ", "default_db_name");
        $.ajax({
            url: "/db_delete",
            data: { db: name },
            type: "POST",
            success: function (data) {
                $("#show_dbs").html("");
                var obj = JSON.parse(data);
                console.log(obj);
                alert(obj.comm);
                for (var i = 0; i < obj.data.databases.length; i++) {
                    $("#show_colls").html("");
                    var obj = JSON.parse(data);
                    console.log(obj);
                    console.log(obj.length);
                    console.log(obj[0].name);
                    for (var i = 0; i < obj.length; i++) {
                        DrawColl(obj[i].name);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    });
    $("#b_coll_create").on("click", function () {
        name = prompt("Please enter collection name: ", "default_coll_name");
        $.ajax({
            url: "/coll_create",
            data: { db: db, coll: name },
            type: "POST",
            success: function (data) {
                $("#show_dbs").html("");
                var obj = JSON.parse(data);
                console.log(obj);
                alert(obj.comm);
                for (var i = 0; i < obj.data.databases.length; i++) {
                    DrawDB(obj.data.databases[i].name);
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    });
    $("#b_coll_delete").on("click", function () {
        name = prompt("Please enter collection name: ", "default_coll_name");
        $.ajax({
            url: "/coll_delete",
            data: { db: db, coll: name },
            type: "POST",
            success: function (data) {
                $("#show_dbs").html("");
                var obj = JSON.parse(data);
                console.log(obj);
                alert(obj.comm);
                for (var i = 0; i < obj.data.databases.length; i++) {
                    DrawDB(obj.data.databases[i].name);
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    });

    $("#u_send").on("click", function () {
        $.ajax({
            url: "/create_user",
            data: { login: $("#u_login").val(), passwd: $("#u_passwd").val(), db: db, coll: coll },
            type: "POST",
            success: function (data) {
                $("#docs").html("");
                var obj = JSON.parse(data);
                console.log(obj);
                console.log(obj.data.length)
                for (var i = 0; i < obj.data.length; i++) {
                    var d = $("<div>");
                    $(d).attr("class", "d");
                    var t = $("<textarea>");
                    $(t).attr("class", "t");
                    $(t).append("{\n");
                    $(t).append("   login: " + obj.data[i].login + "\n");
                    $(t).append("   passwd: " + obj.data[i].passwd + "\n");
                    $(t).append("   _id: " + obj.data[i]._id + "\n");
                    $(t).append("}\n");
                    var b = $("<button>");
                    $(b).attr("class", "b");
                    $(b).attr("value", obj.data[i]._id);
                    $(b).text("Usuń rekord");
                    $(b).on("click", function () {
                        $.ajax({
                            url: "/delete_doc",
                            data: { db: db, coll: coll, id: b.attr("value") },
                            type: "POST",
                            success: function (data) {
                                $("#show_colls").html("");
                                var obj = JSON.parse(data);
                                console.log(obj);
                            },
                            error: function (xhr, status, error) {
                                console.log(xhr);
                            },
                        });
                    });
                    $(d).append(t);
                    $(d).append(b);
                    $("#docs").append(d);
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    });
})