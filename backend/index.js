const express = require('express');
const app = express();
const cors = require('cors');
const User = require('./models/user')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Transaction = require('./models/transaction');
const Shop = require('./models/shop');

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
  const { username, password, mobileNumber, role, shop } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({ username, password: hashedPassword, mobileNumber, role, shop });
    await newUser.save();

    res.json({ message: 'Signup successful' });
  } catch (error) {
    console.log(error);
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

    delete user.password;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/shop', async (req, res) => {
  const { name } = req.body;
  
  try {
    const newShop = new Shop({ name });
    await newShop.save();

    res.json(newShop);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create shop' });
  }
});

app.post('/transaction', async (req, res) => {
  const { id, amount, date, image, provider, status } = req.body;

  try {
    const newTransaction = new Transaction({ id, amount, date, image, provider, status });
    await newTransaction.save();
    
    res.json({ message: 'Transaction saved successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to save transaction' });
  }
});

app.get('/transaction', async (req, res) => {
  try {
    const { from, to } = req.query;
    const transactions = await Transaction.find(from && to ? { date: { $gte: from, $lte: to } } : {});

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

//CpLJQuyGMXFaComM
//mongodb+srv://priyaaa0112:<password>@cluster0.63rfz8y.mongodb.net/?retryWrites=true&w=majority


//HDDVDmgaHFO3Td3Q