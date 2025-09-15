const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    fs.readdir(`./files`, (err, files)=> {
        res.render('index', {files: files});
    })
    
}),
app.get('/files/:filename', (req, res)=> {
    fs.readFile(`./files/${req.params.filename}`, `utf-8`, (err, fileData)=> {
        res.render("showFile", {filename: req.params.filename, fileData: fileData} )
    })
})

app.post('/create',(req, res)=> {
    const title = req.body.title.split(' ').map((word, index)=> 
        index === 0 ? word.toLowerCase()
        :word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ) .join('')
    fs.writeFile(`./files/${title}.txt`, req.body.details, (err)=> {
        res.redirect('/')
    })
})

app.listen(3000)