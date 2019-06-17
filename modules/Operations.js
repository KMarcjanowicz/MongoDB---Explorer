module.exports = function () {

    var opers = {

        //insert

        Insert: function (collection, data) {
            collection.insert(data, function (err, result) {
                console.log(result)
            });
        },

        //select all - zwraca tablicę pasujących dokumentów

        SelectAll: function (collection, callback) {
            collection.find({}).toArray(function (err, items) {
                console.log(items)
                if (err) console.log(err)
                //funkcja zwracająca dane na zewnątrz
                else callback(items)
            });
        },

        //select - zwraca tablicę pasujących dokumentów, z ograniczeniem

        SelectAndLimit: function (collection) {
            collection.find({ login: "test" }).toArray(function (err, items) {
                console.log(items)
            });
        },

        //delete - usunięcie poprzez id - uwaga na ObjectID

        DeleteById: function (ObjectID, collection, id) {
            collection.remove({ _id: ObjectID(id) }, function (err, data) {
                console.log(data)
            })
        },

        // update - aktualizacja poprzez id - uwaga na ObjectID
        // uwaga: bez $set usuwa poprzedni obiekt i wstawia nowy
        // z $set - dokunuje aktualizacji tylko wybranego pola

        UpdateById: function (ObjectID, collection, id, data) {
            collection.updateOne(
                { _id: ObjectID(id) },
                { $set: { passwd: data } },
                function (err, data) {
                    console.log("update: " + data)
                })
        },

        ListDBs: function (db, callback) {
            var adminDb = db.admin();
            adminDb.listDatabases(function (err, items) {
                if (err) console.log(err)
                //funkcja zwracająca dane na zewnątrz
                else callback(items)
            });
        },

        ListColls: function (db, callback) {
            db.listCollections().toArray(function (err, items) {
                if (err) console.log(err)
                //funkcja zwracająca dane na zewnątrz
                else callback(items)
            });
        },

        DeleteDB: function (db, callback) {
            db.dropDatabase(function (err, result) {
                console.log("Error : " + err);
                if (err) throw err;
                console.log("Operation Success ? " + result);
                // after all the operations with db, close it.
                db.close();
            });
        },

        DeleteColl: function (db, coll, callback) {
            db.collection(coll, function (err, collection) {
                collection.remove({}, function (err, removed) {
                });
            });
        }
    }

    return opers;

}