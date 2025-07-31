//bradsean
import express from 'express';
import * as model from './exercise_model.mjs';
import 'dotenv/config';
const app = express();
const PORT = 3000;


app.use(express.json())

// Don't change or add anything above this line
// Notes
// mongoDb doesnt include undefined keys in the response!

// this section is unnecessary since mongoDb already sends an json object
/*
function createJSON(user){
    if (user && user.phoneNumber){
        return ({"name":`${user.name}`, 
            "age": user.age,
            "email": `${user.email}`,
            "phoneNumber": user.phoneNumber,
            "_id": `${user._id}`})
    }if (user){
        return ({"name":`${user.name}`, 
            "age": user.age,
            "email": `${user.email}`,
            "_id": `${user._id}`})
       

    } 
}
*/


function createQuery(object){
    let query = {};
    if (object.name){
        query['name'] = object.name;
    }if (object.reps){
        query['reps'] = object.reps;
    }if (object.weight){
        query['weight'] = object.weight;
    }if (object.unit){
        query['unit'] = object.unit;
    }if (object.date){
        query['date'] = object.date;
    } return query;
};





 app.post('/exercises', async (req,res) =>{
    console.log(req.body,req.body.name,req.body.reps,req.body.weight, req.body.unit, req.body.date);
    let valid = model.validateObject(req.body);
    if (valid){
        let name = req.body.name;
        let reps = req.body.reps;
        let weight = req.body.weight;
        let unit = req.body.unit;
        let date = req.body.date;
        let exercise =  await model.createExercise(name,reps,weight,unit,date);
        res.status(201).send(exercise);
        return;
    }else{
        res.status(400).send({ Error: "Invalid request"});
    }


    
});

  


app.get('/exercises',async (req,res) =>{
    //https://stackoverflow.com/questions/45307491/mongoose-complex-queries-with-optional-parameters
    console.log(req.query)
    let searchQuery = createQuery(req.query);
    const allExercises = await model.findExercise(searchQuery);
    // let exArray = [];
    // for (let i=0; i< allUsers.length; i++){
    //     let currentUser = allUsers[i];
    //     userArray.push(createJSON(currentUser));
    // }
    res.send(allExercises).status(200);
});

// find an exercise by its ID
app.get('/exercises/:id',async (req,res) =>{
    console.log(req.params.id);
    let exercise = await model.findExerciseById(req.params.id);
    if (exercise){
        res.send(exercise)
    }else {
        res.status(404).send({"Error": "Not found"})

    }
    
})

//update an exercise based on its id and properties specified in the body.
app.put('/exercises/:id',async (req,res) =>{
    console.log(req.params);
    console.log(req.body.name,req.body.reps, req.body.weight, req.body.unit,req.body.date);
    let valid = model.validateObject(req.body);
    let id = req.params.id;
    console.log(valid,id);
    if (!valid || !id){
        res.status(400).send({ Error: "Invalid request"});
        // do not return multiple responses it will crash!
        return;
    }
    //You can assume that the body of a PUT request will always be valid.
    // if user not found
    let updateQuery = createQuery(req.body);
    const exercise = await model.updateExercise(id,updateQuery);
    console.log(exercise);
    if (exercise){
        res.send(exercise);
    // order found update the order
    }else{
        res.status(404).send({"Error": "Not Found"});
    }
});


// delete using DELETE /users
// we cannot use the browser to send requests for certain HTTP methods such as delete and put
// app.delete('/exercises',async (req,res) =>{
//     let query = createQuery(req.query);
//     let exercises = await model.findExercise(query);
//     let deleteCount = 0;
//     for (let i=0; i< exercises.length;i++){
//         let currentExercise = exercises[i];
//         await model.deleteById(currentExercise._id);
//         deleteCount++; 
//     }
//     res.status(200).send({deletedCount: `${deleteCount}`});

// })

app.delete('/exercises/:id',async (req,res) =>{
    let query = {_id : req.params.id};
    console.log(query);
    let exercise = await model.findExercise(query);
    if (exercise.length == 1){
        await model.deleteById(req.params.id);
        res.status(204).send({});

    }else{
        res.status(404).send({"Error": "Not found"});

    }

})

// Don't change or add anything below this line
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});