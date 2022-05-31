// const { Pool, Client } = require('pg')
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'all-india',
//   password: '123abc',
//   port: 5432,
// })
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })
// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'login-system',
//   password: '123abc',
//   port: 5432,
// })
// client.connect()

// var registerUser = (req,resp) => {
//     console.log(req.body);
//     const { name, email,status,gender } = req.body;
//     var querySql = client.query("Insert INTO users (name,email,status,gender) VALUES ($1,$2,$3,$4)",[name,email,status,gender],function(error,results,field){
//             if(error) throw error;
//             resp.status(201).send(`User added with ID: ${results.insertId}`)
//         });    
// }

// var userList = (req,resp) => {
//     let query = 'select * from users';
//     client.query(query,function(error,results,fields){
//         if(error) throw error;
//         console.log(fields);
//         console.log(results);
//         resp.status(200).json(results);
//     });
// }
// module.exports = {
//     addUser,
//     userList
// }
