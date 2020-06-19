const mongoose = require('mongoose');

module.exports =async () => {
    try {
        await mongoose.connect('mongodb+srv://sahan:sahan@cluster0-vhpvy.mongodb.net/<dbname>?retryWrites=true&w=majority',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Database connected !');
    } catch (err) {
        console.log(err.message);
    }
}