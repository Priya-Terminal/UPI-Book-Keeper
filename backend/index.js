const express = require('express');
const app = express();
const cors = require('cors');
const User = require('./models/user')
const Transaction = require('./models/transaction');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const transactionsRouter = require('./routes/transactions');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfghjklp42rfghjnmdk678jnhbz';

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect("mongodb+srv://priya:HDDVDmgaHFO3Td3Q@cluster0.r5q5r1w.mongodb.net/UPIbookkeeper?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB server is connected');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use('/transactions', transactionsRouter);

console.log('Transactions router is set up');


app.post('/signup', async (req, res) => {
  const { username, password, mobileNumber, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({ username, password: hashedPassword, mobileNumber, role });
    await newUser.save();

    res.json({ message: 'Signup successful' });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed' });
  }
});

app.post('/login', async (req, res) => {
  const { mobileNumber, password } = req.body;

  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ mobileNumber: user.mobileNumber }, secret);

    res.cookie('token', token).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});



// app.get('/transactions', async (req, res) => {
//   try {
    
//     const transactions = await Transaction.find();

//     res.status(200).json(transactions);
//   } catch (error) {
//     console.error('Error fetching transactions:', error);
//     res.status(500).json({ error: 'Error fetching transactions' });
//   }
// });


app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

//CpLJQuyGMXFaComM
//mongodb+srv://priyaaa0112:<password>@cluster0.63rfz8y.mongodb.net/?retryWrites=true&w=majority


//HDDVDmgaHFO3Td3Q