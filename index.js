const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// base route 
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

// edditing the file name
app.get('/edit/:filename', (req, res)=> {
    res.render('edit', {previous: req.params.filename})
})

app.post('/edit', (req, res)=> {
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, (err)=> {
        res.redirect('/')
    })
})

// upading the file content 
app.get('/updateFile/:filename', (req, res)=> {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, fileData)=>{
        if(err) return res.status(404).send("File not found")
        res.render('update', {filename: req.params.filename, fileData})
    })
})

app.post('/updateFile/:filename', (req, res) => {
    fs.writeFile(`./files/${req.params.filename}`, req.body.newContent, (err) => {
        if (err) return res.status(500).send("Error updating file")
        res.redirect(`/files/${req.params.filename}`)
    })
})

// deleting file 
app.get('/delete/:filename', (req, res)=> {
    res.render('delete', {filename: req.params.filename})
})
app.post('/deleteFile/:filename', (req, res)=> {
    fs.unlink(`./files/${req.params.filename}`, (err)=> {
        if (err) return res.status(500).send("There is an Error ocured while deleting the file")
        res.redirect('/')
    })
})

// creating new file
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