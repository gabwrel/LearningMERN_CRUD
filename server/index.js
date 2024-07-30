const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Users');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Check kung may are 'uploads' nga directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// I-set up ang storage engine para sa Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Ibutang ang mga file sa 'uploads' nga directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // I-set ang filename nga may timestamp
  }
});

// I-initialize ang Multer
const upload = multer({ storage });

// Connect sa MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/crud')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


// I-serve ang static files halin sa 'uploads' nga direktoriyo
app.use('/uploads', express.static(uploadDir));

// Pag kag kwa ka mga user
app.get('/', (req, res) => {
  UserModel.find({})
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Pag pangita ka mga user
app.get('/getUser/:id', (req, res) => {
  const id = req.params.id;
  UserModel.findById(id)
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ error: err.message }));
});


// pag update ka user
app.put('/updateUser/:id', upload.single('profileImage'), (req, res) => {
  const id = req.params.id;

  UserModel.findById(id)
    .then(user => {
      const updateData = {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
      };

      if (req.file) {
        // Pag-handle sang file upload
        updateData.profileImage = `http://localhost:3001/uploads/${req.file.filename}`;
        
        // Optional nga pag-delete sang daan nga image file
        if (user.profileImage) {
          const oldImagePath = path.join(__dirname, 'uploads', path.basename(user.profileImage));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // I-delete ang daan nga file
          }
        }
      } else if (req.body.removeImage === 'true') {
        // Pag-handle sang image removal
        updateData.profileImage = null;
        
        // Optional nga pag-delete sang daan nga image file
        if (user.profileImage) {
          const oldImagePath = path.join(__dirname, 'uploads', path.basename(user.profileImage));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // I-delete ang daan nga file
          }
        }
      }

      return UserModel.findByIdAndUpdate(id, updateData, { new: true });
    })
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/deleteUser/:id', (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndDelete(id)
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/createUser', upload.single('profileImage'), (req, res) => {
  const newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      profileImage: req.file ? `http://localhost:3001/uploads/${req.file.filename}` : null
  });

  newUser.save()
      .then(user => res.json(user))
      .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
