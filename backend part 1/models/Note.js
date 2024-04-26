const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
            ref: 'User'// refers to a table called user to get a user, basically user id 
        },
        title:{type: String, required: true},
        text:{type: String, required: true},
        completed:{type:Boolean, default:false} 
    },
    {
        timestamps: true //mongodb will give ys both created and updated at time stamp
    }
)

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

module.exports = mongoose.model('Note', noteSchema);