import mongoose from 'mongoose';
import 'dotenv/config';

const EXERCISE_DB_NAME = 'exercise_db';
const EXERCISE_COLLECTION = 'exercises';
const EXERCISE_CLASS = "Exercise";
let Exercise = undefined
let connection = undefined;

/**
*
* @param {string} date
* Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
*/
function isDateValid(date) {
    // Test using a regular expression. 
    // To learn about regular expressions see Chapter 6 of the text book
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}



/**
 * This function does the following:
 *  1. Connects to the MongoDB server.
 *  2. Creates a Exercise class for the exercise schema.
 */
async function connect(){
    //check if connected if not then connect
    if (!connection){
        try{
            connection = await createConnection();
            console.log("Successfully connected to MongoDB using Mongoose!");
            
        } catch(err){
            console.log(err);
            throw Error(`Could not connect to MongoDB ${err.message}`);
        }
        try{
            //check if Exercise class has been created
            Exercise = mongoose.model('Exercise');
           } catch (error) {
            //if it hasnt been created, create the Exercise class
            Exercise = createModel();
            }
    }
}
/**
 * Connect to the MongoDB server using the connection string in .env file
 * @returns A connection to the server
 */
async function createConnection(){
    await mongoose.connect(process.env.MONGODB_CONNECT_STRING, 
                {dbName: EXERCISE_DB_NAME});
    return mongoose.connection;
}

/**
 * Define a schema for the exercises collection, compile a model, and return the model.
 * @returns A model object for the exercise
 * 
 */
// https://stackoverflow.com/questions/45031701/how-to-set-minimum-value-great-then-0-in-mongoose-schema
// secondary validation also found on mongoosejs

function createModel(){
    const exerciseSchema = new mongoose.Schema({
        name: { type: String,
                required: true },
        reps: { type: Number,
                min: [1, 'Must be at least 1, got {VALUE}'],
                required: true },
        // https://mongoosejs.com/docs/validation.html
        weight: { type: Number, 
                min: [1, 'Must be at least 1, got {VALUE}'],
                required: true },
        unit: { type: String, 
                enum:{
                    values: ['lbs','kgs'],
                    message: '{VALUE}  is not supported'
                },
                required: true },
        // can handle date validation on the userside format MM-DD-YY
        date: { type: String,
                 required: true }
    });
    return mongoose.model(EXERCISE_CLASS, exerciseSchema);
}

async function createExercise(name,reps, weight, unit, date){
    //connect if not connected already
    connection = await connect();
    const exercise = await new Exercise({name, reps, weight, unit, date});
    return exercise.save();
}

const findExercise = async(filter) => {
    connection = await connect();
    const query = Exercise.find(filter);
    return query.exec();
};

//https://mongoosejs.com/docs/api/model.html#Model.findById()

const findExerciseById = async(id) => {
    connection = await connect();
    const query = Exercise.findById(id);
    return query.exec();
};

async function updateExercise(id, jsonQuery) {
    connection = await connect();
    let exercise = await findExerciseById(id);
    if (jsonQuery.name && exercise){
        exercise.name = jsonQuery.name
    }
    if (jsonQuery.reps && exercise){
        exercise.reps = jsonQuery.reps
    }
    if (jsonQuery.weight && exercise){
        exercise.weight = jsonQuery.weight
    }
    if (jsonQuery.unit && exercise){
        exercise.unit = jsonQuery.unit
    }
    if (jsonQuery.date && exercise){
        exercise.date = jsonQuery.date
    }
    if (exercise){
        exercise.save();
        return exercise;
    }else{
        return null;
    }
}
async function replaceExercise(_id, reps, weight, unit,date) {
    const result = await Exercise.replaceOne({_id: _id},
        {reps: reps, weight: weight, unit: unit, date:date});
    return result.modifiedCount;


} 

const deleteById = async(id) => {
    connection = await connect();
    let result = await Exercise.deleteOne({_id: id});
    
    // value if 1 document tht matched that document or 0 if none found
}


function validateObject(object){
    // i realized i didnt need the local variables after writing this rip stack.
    console.log(object)
    let valid = true;
    let exerciseName = object.name
    if (exerciseName){
        let exerciseName = object.name
        console.log(exerciseName);
        if (exerciseName == '' || exerciseName == null){
        valid = false;
        }
    // if name is not declare invalid
    // }}else {
    //     valid = false;
    //  
    }
    let reps = object.reps;
    if (reps){
        // is nan does a type conversion
        if (isNaN(reps) ){
            console.log(reps);
            valid=false
        // check the type and than is 
        }else
            { if (Number.isNaN(reps) || reps <= 0){
            console.log(reps);
            valid=false
        }
        }
    }
    // if reps is not declare invalid
    // }else{
    //     valid = false;
    // }
    let weight = object.weight;
    if (weight){
        console.log(weight);
        if (Number.isNaN(weight)){
            valid = false;
        }if(weight < 0){
            valid=false
        }
    // if weight is not declared invalid
    // } else{
    //     valid = false;
    }
    let unit = object.unit;
    //conver to lowercase to cover edge cases
    if (unit){
        if(unit == 'lbs' || unit == 'kgs'){
            console.log(unit);
        }else{
            valid = false;
        }
        }
    // if unit is not declared invalid
    // } else{
    //     valid = false;
    
    let date = object.date;
    let isValidDate = isDateValid(date)
    if (isValidDate){
        //MM-DD-YY
        let dateMonth = date.slice(0,2);
        if (dateMonth > 12 || dateMonth < 1 ){
            console.log(dateMonth);
            valid = false;
        }
        let dateDay = date.slice(3,5);
        // there are 28 min days in a month or 31 max
        if (dateDay < 0 || dateDay > 31){
            console.log(dateDay);
            valid = false;
        }
        let dateYear = date.slice(6);
        if ( dateYear < 0 || dateYear > 99 ){
            console.log(dateYear);
            valid = false;
        }
    }else{
        valid = false;
    }
    let keys = Object.keys(object);
    if (!object.name || !object.reps || !object.weight || !object.date || !object.unit || keys.length != 5){
        valid= false;
    }
    return valid;
};

// Testing validate function //
// const test = {
//     "name": "Deadlift",
//     "reps": "not a number",
//     "weight": 1,
//     "unit": "kgs",
//     "date": "aa-18-24"
// }
// let testVal =  validateObject(test);



export { connect, createExercise,findExercise, deleteById,replaceExercise, findExerciseById,updateExercise, validateObject};