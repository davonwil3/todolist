//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const app = express();
const lo = require("lodash");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true})


const Item = mongoose.model('Item', {
  name: String


});

const item1 = new Item({

  name: "Welcome to your todolist!"




});


const item2 = new Item({

  name: "Hit the plus button to add a new item"




});

const item3 = new Item({

  name: "hit this to delete an item"




});

const defaultItems = [item1, item2, item3];

const ItemsSchema = {

name: String


}





const listSchema = {

  name: String,
  items: [ItemsSchema]


};

const List =  mongoose.model('List', listSchema);


const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function(req, res) {


  Item.find({},  function(err, foundItems){

    console.log(foundItems);

    if (foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){

        if (err){
          console.log(err);
        }else{

          console.log("succesfully updated document");
        }


        res.redirect("/");
      });
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }




  })



});


app.get("/:customListName", function(req, res){

  const customListName =  req.params.customListName;

List.findOne({name: customListName}, function(err, foundList){

if (!err){

  if(!foundList){
    const list = new List({

      name: customListName,
      items: defaultItems


    });

    list.save();
    res.redirect("/" + customListName)
  }
  else {

    console.log(err);
    res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
  }


}






});


});





app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list

  const item = new Item({

    name: itemName



  });

  if (listName === "Today"){

  item.save();

  res.redirect("/");
}
else {
  List.findOne({name: listName}, function(err, foundList){

    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+ listName)


  })
}

});


app.post("/delete", function(req, res){

  const checkedItemId = req.body.checkbox
  const listName = req.body.listName
  if (listName === "Today"){
  Item.findByIdAndRemove(checkedItemId, function(err){

    if(!err){

      console.log("succesfully deleted item");

      res.redirect("/");
    }
    })
  }
else {
  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){

    if(!err){

      res.redirect("/"+ listName)
    }


  });
}





});



app.get("/about", function(req, res){
  res.render("about");
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
