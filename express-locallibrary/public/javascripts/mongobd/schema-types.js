var schema  = new Schema({
    name    : String,
    binary  : Buffer,
    living  : Boolean,
    updated : {
        type: Date,
        default: Date.bind.now
    },
    age     : {
        type    : Number,
        min     : 18,
        max     : 65,
        required: true
    },
    mixed   : Schema.Types.Mixed,
    _someId : Scheme.Types.ObjectId,
    array   : [],
    ofString: [String], // you can aslo have an array of each of the other types too.
    nested  : {
        stuff: {
            type        :       String,
            lowercase   :       true,
            trim        :       true
        }
    }
})